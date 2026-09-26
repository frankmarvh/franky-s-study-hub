import {
  Moon,
  Settings,
  Sun,
} from "lucide-react";

import AppHeader
  from "@/components/AppHeader";

import {
  useTheme,
} from "@/context/ThemeContext";

export default function SettingsPage() {
  const {
    theme,
    setTheme,
  } =
    useTheme();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <AppHeader />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600 p-4 text-white">
            <Settings
              size={26}
            />
          </div>

          <div>
            <p className="font-semibold text-blue-500">
              Preferences
            </p>

            <h1 className="text-3xl font-black">
              Settings
            </h1>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">
            Appearance
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Choose how Franky's
            Study Hub looks on
            this device.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setTheme(
                  "light",
                )
              }
              className={`rounded-2xl border p-5 text-left ${
                theme ===
                "light"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <Sun className="text-amber-500" />

              <strong className="mt-4 block">
                Light
              </strong>

              <span className="mt-1 block text-sm text-slate-500">
                Bright interface
                for daytime use.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTheme(
                  "dark",
                )
              }
              className={`rounded-2xl border p-5 text-left ${
                theme ===
                "dark"
                  ? "border-blue-500 bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <Moon className="text-blue-500" />

              <strong className="mt-4 block">
                Dark
              </strong>

              <span className="mt-1 block text-sm text-slate-500">
                Reduced brightness
                for dark
                environments.
              </span>
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
