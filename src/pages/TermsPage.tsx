import SiteFooter
  from "@/components/SiteFooter";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <article className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-bold text-blue-500">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Terms of Use
        </h1>

        <p className="mt-4 text-slate-500">
          Last updated:
          September 2026
        </p>

        <Section
          title="Educational purpose"
        >
          Franky's Study Hub is
          intended to support
          learning and academic
          study.
        </Section>

        <Section
          title="AI responses"
        >
          AI-generated answers
          may contain mistakes.
          Users should verify
          important academic,
          technical or factual
          information using
          appropriate sources.
        </Section>

        <Section
          title="External materials"
        >
          Educational resources
          linked through Franky's
          may belong to their
          respective authors,
          institutions or
          publishers. Access and
          reuse remain subject to
          the original provider's
          terms and license.
        </Section>

        <Section
          title="Acceptable use"
        >
          Users must not abuse
          the service, attempt
          unauthorized access,
          interfere with the
          platform, or use it for
          unlawful activities.
        </Section>

        <Section
          title="Accounts"
        >
          Users are responsible
          for maintaining the
          security of their
          accounts and for
          activity performed
          through those accounts.
        </Section>

        <Section
          title="Changes"
        >
          These terms may be
          updated as Franky's
          Study Hub develops.
        </Section>
      </article>

      <SiteFooter />
    </main>
  );
}

function Section({
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
