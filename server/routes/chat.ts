import {
  Router,
} from "express";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js";

import {
  openai,
  OPENAI_MODEL,
} from "../services/openai.js";

import {
  oerCatalog,
} from "../data/oerCatalog.js";

const router =
  Router();

const supabaseUrl =
  process.env.SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceRoleKey
) {
  throw new Error(
    "Missing Supabase server environment variables.",
  );
}

const supabase =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession:
          false,

        autoRefreshToken:
          false,
      },
    },
  );

/**
 * POST /api/chat
 *
 * Send a message to Franky's AI.
 */
router.post(
  "/",

  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      const user =
        req.user;

      if (!user) {
        res.status(401).json({
          success: false,

          message:
            "Authentication required.",
        });

        return;
      }

      const rawMessage =
        req.body?.message;

      const rawConversationId =
        req.body?.conversationId;

      if (
        typeof rawMessage !==
        "string"
      ) {
        res.status(400).json({
          success: false,

          message:
            "A message is required.",
        });

        return;
      }

      const message =
        rawMessage.trim();

      if (
        message.length < 1
      ) {
        res.status(400).json({
          success: false,

          message:
            "Message cannot be empty.",
        });

        return;
      }

      if (
        message.length >
        8000
      ) {
        res.status(400).json({
          success: false,

          message:
            "Message is too long.",
        });

        return;
      }

      let conversationId:
        string;

      let conversation:
        any;

      // ======================================================
      // EXISTING CONVERSATION
      // ======================================================

      if (
        typeof rawConversationId ===
          "string" &&
        rawConversationId
      ) {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              "chat_conversations",
            )
            .select("*")
            .eq(
              "id",
              rawConversationId,
            )
            .eq(
              "user_id",
              user.id,
            )
            .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          res.status(404).json({
            success: false,

            message:
              "Conversation not found.",
          });

          return;
        }

        conversation =
          data;

        conversationId =
          data.id;
      }

      // ======================================================
      // NEW CONVERSATION
      // ======================================================

      else {
        const title =
          createConversationTitle(
            message,
          );

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "chat_conversations",
            )
            .insert({
              user_id:
                user.id,

              title,
            })
            .select()
            .single();

        if (
          error ||
          !data
        ) {
          throw (
            error ||
            new Error(
              "Unable to create conversation.",
            )
          );
        }

        conversation =
          data;

        conversationId =
          data.id;
      }

      // ======================================================
      // LOAD HISTORY BEFORE SAVING CURRENT MESSAGE
      // ======================================================

      const {
        data:
          previousMessages,

        error:
          historyError,
      } =
        await supabase
          .from(
            "chat_messages",
          )
          .select(
            "role, content, created_at",
          )
          .eq(
            "conversation_id",
            conversationId,
          )
          .eq(
            "user_id",
            user.id,
          )
          .order(
            "created_at",
            {
              ascending:
                true,
            },
          )
          .limit(20);

      if (
        historyError
      ) {
        throw historyError;
      }

      // ======================================================
      // SAVE USER MESSAGE
      // ======================================================

      const {
        data:
          savedUserMessage,

        error:
          userMessageError,
      } =
        await supabase
          .from(
            "chat_messages",
          )
          .insert({
            conversation_id:
              conversationId,

            user_id:
              user.id,

            role:
              "user",

            content:
              message,
          })
          .select()
          .single();

      if (
        userMessageError ||
        !savedUserMessage
      ) {
        throw (
          userMessageError ||
          new Error(
            "Unable to save message.",
          )
        );
      }

      // ======================================================
      // RELEVANT LIBRARY RESOURCES
      // ======================================================

      const resources =
        findRelevantResources(
          message,
        );

      const resourceContext =
        resources.length >
        0
          ? resources
              .map(
                (
                  resource,
                  index,
                ) =>
                  [
                    `${index + 1}. ${resource.title}`,
                    `Source: ${resource.source}`,
                    `Subject: ${resource.subject}`,
                    `URL: ${resource.url}`,
                  ].join(
                    "\n",
                  ),
              )
              .join(
                "\n\n",
              )
          : "No matching resources were found in the current Franky's OER catalog.";

      // ======================================================
      // CONVERSATION HISTORY
      // ======================================================

      const historyText =
        (
          previousMessages ??
          []
        )
          .map(
            (
              previous,
            ) => {
              const speaker =
                previous.role ===
                "assistant"
                  ? "Franky's AI"
                  : "Student";

              return `${speaker}: ${previous.content}`;
            },
          )
          .join(
            "\n\n",
          );

      const input =
        [
          historyText
            ? `Previous conversation:\n${historyText}`
            : "",

          `Student's new message:\n${message}`,

          `Relevant free educational resources currently available in Franky's library:\n${resourceContext}`,
        ]
          .filter(
            Boolean,
          )
          .join(
            "\n\n---\n\n",
          );

      // ======================================================
      // OPENAI
      // ======================================================

      const response =
        await openai.responses.create(
          {
            model:
              OPENAI_MODEL,

            instructions:
              `
You are Franky's AI, the academic tutor inside Franky's Study Hub.

Your role is to help university students understand academic subjects.

Rules:

1. Teach clearly and accurately according to the sent request.
2. Break difficult ideas into understandable steps.
3. Use examples when useful.
4. For mathematics, show all the important working steps clearly.
5. For programming questions, provide clear codes.
6. Never pretend a learning resource exists if it is not provided in the resource context.
7. When recommending a resource from the provided Franky's resource context, identify its real source.
8. Do not claim that Franky's owns external educational resources.
9. Do not invent URLs.
10. If no matching resource exists in the supplied catalog, say that the current library does not contain a matching resource.
11. Encourage learning and understanding rather than simply completing graded work dishonestly.
12. Format answers clearly using short sections, lists, and code blocks when appropriate.

You are called Franky's AI.
              `.trim(),

            input,
          },
          {
            timeout:
              60_000,
          },
        );

      const answer =
        response.output_text
          ?.trim();

      if (!answer) {
        throw new Error(
          "The AI returned an empty response.",
        );
      }

      // ======================================================
      // SAVE ASSISTANT MESSAGE
      // ======================================================

      const {
        data:
          savedAssistantMessage,

        error:
          assistantError,
      } =
        await supabase
          .from(
            "chat_messages",
          )
          .insert({
            conversation_id:
              conversationId,

            user_id:
              user.id,

            role:
              "assistant",

            content:
              answer,
          })
          .select()
          .single();

      if (
        assistantError ||
        !savedAssistantMessage
      ) {
        throw (
          assistantError ||
          new Error(
            "Unable to save AI response.",
          )
        );
      }

      // ======================================================
      // UPDATE CONVERSATION
      // ======================================================

      const {
        data:
          updatedConversation,
      } =
        await supabase
          .from(
            "chat_conversations",
          )
          .update({
            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            conversationId,
          )
          .eq(
            "user_id",
            user.id,
          )
          .select()
          .single();

      res.json({
        success: true,

        conversation:
          updatedConversation ||
          conversation,

        userMessage:
          savedUserMessage,

        assistantMessage:
          savedAssistantMessage,
      });
    } catch (error) {
      console.error(
        "Franky's AI error:",
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Franky's AI could not answer right now. Please try again.",
      });
    }
  },
);

/**
 * GET /api/chat/conversations
 */
router.get(
  "/conversations",

  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,

          message:
            "Authentication required.",
        });

        return;
      }

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "chat_conversations",
          )
          .select("*")
          .eq(
            "user_id",
            req.user.id,
          )
          .order(
            "updated_at",
            {
              ascending:
                false,
            },
          );

      if (error) {
        throw error;
      }

      res.json({
        success: true,

        conversations:
          data ?? [],
      });
    } catch (error) {
      console.error(
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to load conversations.",
      });
    }
  },
);

/**
 * GET /api/chat/conversations/:id/messages
 */
router.get(
  "/conversations/:id/messages",

  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,

          message:
            "Authentication required.",
        });

        return;
      }

      const conversationId =
        req.params.id;

      const {
        data:
          conversation,
      } =
        await supabase
          .from(
            "chat_conversations",
          )
          .select("id")
          .eq(
            "id",
            conversationId,
          )
          .eq(
            "user_id",
            req.user.id,
          )
          .maybeSingle();

      if (
        !conversation
      ) {
        res.status(404).json({
          success: false,

          message:
            "Conversation not found.",
        });

        return;
      }

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "chat_messages",
          )
          .select("*")
          .eq(
            "conversation_id",
            conversationId,
          )
          .eq(
            "user_id",
            req.user.id,
          )
          .order(
            "created_at",
            {
              ascending:
                true,
            },
          );

      if (error) {
        throw error;
      }

      res.json({
        success: true,

        messages:
          data ?? [],
      });
    } catch (error) {
      console.error(
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to load messages.",
      });
    }
  },
);

/**
 * DELETE /api/chat/conversations/:id
 */
router.delete(
  "/conversations/:id",

  requireAuth,

  async (
    req: AuthenticatedRequest,
    res,
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,

          message:
            "Authentication required.",
        });

        return;
      }

      const {
        error,
      } =
        await supabase
          .from(
            "chat_conversations",
          )
          .delete()
          .eq(
            "id",
            req.params.id,
          )
          .eq(
            "user_id",
            req.user.id,
          );

      if (error) {
        throw error;
      }

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        error,
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to delete conversation.",
      });
    }
  },
);

function createConversationTitle(
  message: string,
) {
  const cleaned =
    message
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (
    cleaned.length <= 45
  ) {
    return cleaned;
  }

  return (
    cleaned.slice(
      0,
      45,
    ) + "..."
  );
}

function findRelevantResources(
  query: string,
) {
  const words =
    query
      .toLowerCase()
      .split(
        /[^a-z0-9]+/,
      )
      .filter(
        (word) =>
          word.length > 2,
      );

  return oerCatalog
    .map(
      (resource) => {
        const searchable =
          [
            resource.title,
            resource.description,
            resource.subject,
            ...resource.topics,
          ]
            .join(" ")
            .toLowerCase();

        const score =
          words.reduce(
            (
              total,
              word,
            ) =>
              searchable.includes(
                word,
              )
                ? total + 1
                : total,
            0,
          );

        return {
          resource,
          score,
        };
      },
    )
    .filter(
      (item) =>
        item.score > 0,
    )
    .sort(
      (a, b) =>
        b.score -
        a.score,
    )
    .slice(
      0,
      5,
    )
    .map(
      (item) =>
        item.resource,
    );
}

export default router;
