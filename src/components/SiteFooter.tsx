import {
  BookOpen,
  Github,
  Mail,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function SiteFooter() {
  const year =
    new Date()
      .getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen
                size={20}
              />
            </div>

            <span className="text-lg font-black">
              Franky's
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            AI-powered study
            assistance and access
            to free open
            educational
            resources.
          </p>
        </div>

        <FooterSection
          title="Platform"
        >
          <Link to="/library">
            Library
          </Link>

          <Link to="/franky-ai">
            Franky's AI
          </Link>

          <Link to="/saved">
            Saved Materials
          </Link>
        </FooterSection>

        <FooterSection
          title="Company"
        >
          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </FooterSection>

        <FooterSection
          title="Legal"
        >
          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms of Use
          </Link>
        </FooterSection>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {2026} Franky's
            Study Hub. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="mailto:howardfrankmev@gmail.com"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>

            <a
              href="https://github.com/frankmarvin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 [&>a:hover]:text-blue-500">
        {children}
      </div>
    </div>
  );
}
