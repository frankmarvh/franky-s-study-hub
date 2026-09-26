import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import SiteFooter
  from "@/components/SiteFooter";

import ThemeToggle
  from "@/components/ThemeToggle";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function HomePage() {
  const {
    user,
  } = useAuth();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <BookOpen
                size={22}
              />
            </div>

            <div>
              <span className="block text-xl font-black leading-none">
                Franky's
              </span>

              <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:block">
                Study Hub
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a
              href="#features"
              className="transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#resources"
              className="transition hover:text-blue-600"
            >
              Resources
            </a>

            <Link
              to="/about"
              className="transition hover:text-blue-600"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-blue-600"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <Link
                to="/library"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Library
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 sm:block"
                >
                  Sign In
                </Link>

                <Link
                  to="/auth"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>


      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">

          <div className="franky-fade-in">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles
                size={16}
              />

              AI-powered university learning
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Learn smarter with{" "}

              <span className="text-blue-600">
                Franky's
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
              Discover free educational
              resources, organize your
              study materials and get
              explanations from Franky's
              AI tutor — all from one
              learning platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to={
                  user
                    ? "/library"
                    : "/auth"
                }
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                {user
                  ? "Open Library"
                  : "Start Learning"}

                <ArrowRight
                  size={19}
                />
              </Link>

              <Link
                to={
                  user
                    ? "/franky-ai"
                    : "/about"
                }
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {user
                  ? "Ask Franky's AI"
                  : "Explore Platform"}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

              <TrustItem>
                Free resources
              </TrustItem>

              <TrustItem>
                Secure accounts
              </TrustItem>

              <TrustItem>
                AI study support
              </TrustItem>

            </div>
          </div>


          {/* HERO PREVIEW */}

          <div className="relative">

            <div className="absolute -inset-10 -z-10 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">

              <div className="rounded-[1.5rem] bg-slate-50 p-6 dark:bg-slate-950 sm:p-8">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      Franky's Study Hub
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      What are you learning?
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <GraduationCap
                      size={24}
                    />
                  </div>
                </div>


                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-400 dark:border-slate-800 dark:bg-slate-900">

                  <Search
                    size={20}
                  />

                  <span className="text-sm">
                    Search calculus,
                    programming,
                    databases...
                  </span>

                </div>


                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <PreviewCard
                    icon={
                      <BookOpenCheck />
                    }
                    title="Open Textbooks"
                    description="Access legitimate free learning resources."
                  />

                  <PreviewCard
                    icon={
                      <BrainCircuit />
                    }
                    title="Franky's AI"
                    description="Ask questions and understand difficult topics."
                  />

                  <PreviewCard
                    icon={
                      <Library />
                    }
                    title="Study Library"
                    description="Discover resources by subject and topic."
                  />

                  <PreviewCard
                    icon={
                      <ShieldCheck />
                    }
                    title="Private Account"
                    description="Your profile and conversations stay separated."
                  />

                </div>


                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <BrainCircuit
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="font-bold">
                        Franky's AI
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Ask me to explain
                        database normalization,
                        integration, algorithms,
                        physics, programming and
                        other university topics.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          FEATURES
          ===================================================== */}

      <section
        id="features"
        className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30"
      >

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="mx-auto max-w-3xl text-center">

            <p className="font-bold text-blue-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Built for university
              learning
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Franky's combines resource
              discovery, personal study
              tools and AI assistance
              without requiring students
              to hunt across dozens of
              websites.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={
                <Search />
              }
              title="Smart Resource Search"
              description="Search for useful academic resources across Franky's curated open educational resource catalog."
            />

            <FeatureCard
              icon={
                <BookOpen />
              }
              title="Free Learning Materials"
              description="Open legitimate learning materials from universities, open textbook projects and educational organizations."
            />

            <FeatureCard
              icon={
                <BrainCircuit />
              }
              title="Franky's AI Tutor"
              description="Ask questions, request examples and get step-by-step explanations when a topic becomes difficult."
            />

            <FeatureCard
              icon={
                <Library />
              }
              title="Personal Library"
              description="Save useful learning resources so you can quickly return to them during revision."
            />

            <FeatureCard
              icon={
                <GraduationCap />
              }
              title="University Focused"
              description="Designed around academic subjects, courses and study workflows used by university students."
            />

            <FeatureCard
              icon={
                <ShieldCheck />
              }
              title="Secure Accounts"
              description="Authentication and database access controls keep each student's account information separated."
            />

          </div>
        </div>
      </section>


      {/* =====================================================
          RESOURCES
          ===================================================== */}

      <section
        id="resources"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>

            <p className="font-bold text-blue-600">
              Open education
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Materials from real
              educational sources
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500">
              Franky's does not require
              administrators to upload
              copies of learning
              materials. The platform can
              direct students to
              legitimate resources that
              are already available
              online.
            </p>

            <div className="mt-8 space-y-4">

              <ResourcePoint>
                Open textbooks
              </ResourcePoint>

              <ResourcePoint>
                University course resources
              </ResourcePoint>

              <ResourcePoint>
                Programming documentation
              </ResourcePoint>

              <ResourcePoint>
                Mathematics and science resources
              </ResourcePoint>

              <ResourcePoint>
                Open educational repositories
              </ResourcePoint>

            </div>

            <Link
              to={
                user
                  ? "/library"
                  : "/auth"
              }
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              Explore Library

              <ArrowRight
                size={18}
              />
            </Link>

          </div>


          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">

            <ResourceExample
              category="Computer Science"
              title="Introduction to Computer Science"
              source="Open educational resource"
            />

            <ResourceExample
              category="Mathematics"
              title="Calculus and Mathematical Foundations"
              source="Open educational resource"
            />

            <ResourceExample
              category="Physics"
              title="University Physics"
              source="Open educational resource"
            />

            <ResourceExample
              category="Programming"
              title="Programming Documentation"
              source="Official documentation"
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          AI SECTION
          ===================================================== */}

      <section className="bg-slate-950 text-white">

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">

          <div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
              <BrainCircuit
                size={27}
              />
            </div>

            <p className="mt-7 font-bold text-blue-400">
              Franky's AI
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              When reading isn't
              enough, ask.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Franky's AI helps break
              complicated academic
              concepts into clearer
              explanations, examples
              and learning steps.
            </p>

            <Link
              to={
                user
                  ? "/franky-ai"
                  : "/auth"
              }
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              Ask Franky's AI

              <ArrowRight
                size={18}
              />
            </Link>

          </div>


          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 sm:p-8">

            <div className="flex justify-end">

              <div className="max-w-[85%] rounded-2xl bg-blue-600 px-5 py-4 text-sm leading-6">
                Explain database
                normalization using a
                simple example.
              </div>

            </div>


            <div className="mt-6 flex gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <BrainCircuit
                  size={18}
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">

                <strong>
                  Franky's AI
                </strong>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Database normalization
                  is the process of
                  organizing data so
                  information is stored
                  efficiently and
                  unnecessary duplication
                  is reduced.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  For example, instead of
                  repeating a student's
                  name in every course
                  record, we can store the
                  student once and connect
                  courses using the
                  student's ID.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CALL TO ACTION
          ===================================================== */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-blue-600 px-7 py-14 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-12 sm:py-20">

          <GraduationCap
            className="mx-auto"
            size={42}
          />

          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black sm:text-5xl">
            Make your study time
            more productive.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Find useful resources,
            save what matters and
            get academic help from
            Franky's AI.
          </p>

          <Link
            to={
              user
                ? "/library"
                : "/auth"
            }
            className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            {user
              ? "Continue Learning"
              : "Create Your Account"}

            <ArrowRight
              size={19}
            />
          </Link>

        </div>
      </section>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <SiteFooter />

    </main>
  );
}


/* =========================================================
   COMPONENT HELPERS
   ========================================================= */

function TrustItem({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={17}
        className="text-green-500"
      />

      <span>
        {children}
      </span>

    </div>
  );
}


function PreviewCard({
  icon,
  title,
  description,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

      <div className="text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  description,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  description:
    string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

    </article>
  );
}


function ResourcePoint({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2
        size={20}
        className="shrink-0 text-green-500"
      />

      <span className="font-medium">
        {children}
      </span>

    </div>
  );
}


function ResourceExample({
  category,
  title,
  source,
}: {
  category:
    string;

  title:
    string;

  source:
    string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 last:mb-0 dark:border-slate-800 dark:bg-slate-950">

      <div className="min-w-0">

        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {category}
        </p>

        <h3 className="mt-2 font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {source}
        </p>

      </div>

      <ExternalLink
        size={18}
        className="shrink-0 text-slate-400"
      />

    </div>
  );
}
