import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  GraduationCap,
  LoaderCircle,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import AppHeader
  from "@/components/AppHeader";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  supabase,
} from "@/integrations/supabase/client";

export default function ProfilePage() {
  const {
    user,
    profile,
  } =
    useAuth();

  const [
    fullName,
    setFullName,
  ] =
    useState("");

  const [
    university,
    setUniversity,
  ] =
    useState("");

  const [
    course,
    setCourse,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  useEffect(() => {
    setFullName(
      profile?.full_name ||
        "",
    );

    setUniversity(
      profile?.university ||
        "",
    );

    setCourse(
      profile?.course ||
        "",
    );
  }, [
    profile,
  ]);

  const saveProfile =
    async (
      event:
        FormEvent,
    ) => {
      event.preventDefault();

      if (!user) {
        return;
      }

      if (
        !fullName.trim()
      ) {
        toast.error(
          "Enter your name.",
        );

        return;
      }

      try {
        setSaving(true);

        const {
          error,
        } =
          await supabase
            .from(
              "profiles",
            )
            .update({
              full_name:
                fullName.trim(),

              university:
                university.trim() ||
                null,

              course:
                course.trim() ||
                null,

              updated_at:
                new Date()
                  .toISOString(),
            })
            .eq(
              "id",
              user.id,
            );

        if (error) {
          throw error;
        }

        toast.success(
          "Profile updated.",
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Unable to update profile.",
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <AppHeader />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white">
            <UserRound
              size={35}
            />
          </div>

          <div>
            <p className="font-semibold text-blue-500">
              Student Profile
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Your Account
            </h1>
          </div>
        </div>

        <form
          onSubmit={
            saveProfile
          }
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Full name"
            >
              <input
                value={
                  fullName
                }
                onChange={(
                  event,
                ) =>
                  setFullName(
                    event.target
                      .value,
                  )
                }
                className="input"
                placeholder="Frank Marvin"
              />
            </Field>

            <Field
              label="Email"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                <input
                  value={
                    user?.email ||
                    ""
                  }
                  disabled
                  className="input pl-10 opacity-60"
                />
              </div>
            </Field>

            <Field
              label="University"
            >
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />

                <input
                  value={
                    university
                  }
                  onChange={(
                    event,
                  ) =>
                    setUniversity(
                      event.target
                        .value,
                    )
                  }
                  className="input pl-10"
                  placeholder="Your university"
                />
              </div>
            </Field>

            <Field
              label="Course / Programme"
            >
              <input
                value={
                  course
                }
                onChange={(
                  event,
                ) =>
                  setCourse(
                    event.target
                      .value,
                  )
                }
                className="input"
                placeholder="BSc Computer Science"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={
              saving
            }
            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle
                className="animate-spin"
                size={18}
              />
            ) : (
              <Save size={18} />
            )}

            Save Profile
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
      </span>

      {children}
    </label>
  );
}
