import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createClient,
  type User,
} from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !serviceRoleKey
) {
  throw new Error(
    "Missing server Supabase environment variables.",
  );
}

const supabaseAdmin =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

export interface AuthenticatedRequest
  extends Request {
  user?: User;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization?.startsWith(
        "Bearer ",
      )
    ) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const token =
      authorization.substring(7);

    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.getUser(
        token,
      );

    if (
      error ||
      !data.user
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid or expired session.",
      });

      return;
    }

    req.user =
      data.user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Authentication check failed.",
    });
  }
}
