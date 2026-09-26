import SiteFooter
  from "@/components/SiteFooter";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <article className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-bold text-blue-500">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Privacy Policy
        </h1>

        <p className="mt-4 text-slate-500">
          Last updated:
          September 2026
        </p>

        <LegalSection
          title="Information we store"
        >
          Franky's Study Hub may
          store account
          information, profile
          information, saved
          educational resources,
          search history and AI
          conversation history
          needed to provide the
          platform.
        </LegalSection>

        <LegalSection
          title="Authentication"
        >
          Authentication and
          application data may be
          processed using
          Supabase. Passwords
          should never be stored
          directly by Franky's
          application database.
        </LegalSection>

        <LegalSection
          title="AI conversations"
        >
          Messages submitted to
          Franky's AI are sent to
          the application's
          server and may be
          processed by the
          configured AI provider
          to generate responses.
        </LegalSection>

        <LegalSection
          title="External resources"
        >
          Franky's may link to
          third-party educational
          websites. Those websites
          operate under their own
          privacy policies and
          terms.
        </LegalSection>

        <LegalSection
          title="Security"
        >
          Access controls and
          database security rules
          are used to separate
          user information.
          However, no internet
          service can guarantee
          absolute security.
        </LegalSection>

        <LegalSection
          title="Contact"
        >
          Privacy questions can
          be sent to
          marvinfrank2680@gmail.com.
        </LegalSection>
      </article>

      <SiteFooter />
    </main>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-3 leading-8 text-slate-500">
        {children}
      </p>
    </section>
  );
}
