import {
  Mail,
  MessageCircle,
} from "lucide-react";

import SiteFooter
  from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="font-bold text-blue-500">
          Contact
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          Get in touch
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
          Questions, suggestions
          or feedback about
          Franky's Study Hub are
          welcome.
        </p>

        <div className="mt-12 max-w-xl rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <MessageCircle className="text-blue-500" />

          <h2 className="mt-5 text-2xl font-bold">
            Email
          </h2>

          <a
            href="mailto:howardfrankmev@gmail.com"
            className="mt-4 flex items-center gap-3 text-blue-500 hover:underline"
          >
            <Mail size={18} />

            marvinfrank2680@gmail.com
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
