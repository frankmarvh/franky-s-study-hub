import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  BookOpen,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";

type AuthMode =
  | "login"
  | "register";

interface LocationState {
  from?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    signIn,
    signUp,
    signInWithGoogle,
    isAuthenticated,
  } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const state =
    location.state as LocationState | null;

  const destination =
    state?.from || "/library";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
    destination,
  ]);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const changeMode = (
    newMode: AuthMode,
  ) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Enter your email address.",
      );
      return;
    }

    if (!password) {
      toast.error(
        "Enter your password.",
      );
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        toast.error(
          "Enter your full name.",
        );
        return;
      }

      if (password.length < 8) {
        toast.error(
          "Password must contain at least 8 characters.",
        );
        return;
      }

      if (
        password !== confirmPassword
      ) {
        toast.error(
          "Passwords do not match.",
        );
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "login") {
        await signIn(
          email,
          password,
        );

        toast.success(
          "Welcome back to Franky's!",
        );

        navigate(destination, {
          replace: true,
        });

        return;
      }

      const result =
        await signUp({
          fullName,
          email,
          password,
        });

      if (
        result.requiresEmailConfirmation
      ) {
        toast.success(
          "Account created. Check your email to confirm your account.",
          {
            duration: 6000,
          },
        );

        setMode("login");
        setPassword("");
        setConfirmPassword("");

        return;
      }

      toast.success(
        "Welcome to Franky's!",
      );

      navigate("/library", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Authentication failed.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin =
    async () => {
      try {
        setLoading(true);

        await signInWithGoogle();
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Google sign in failed.",
        );

        setLoading(false);
      }
    };

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-12">
        <Link
          to="/"
          className="mb-10 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <BookOpen size={24} />
          </div>

          <span className="text-2xl font-black">
            Franky's
          </span>
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
          <div className="mb-7">
            <h1 className="text-3xl font-black">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-2 text-slate-400">
              {mode === "login"
                ? "Sign in to continue learning."
                : "Join Franky's Study Hub."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-950 p-1">
            <button
              type="button"
              onClick={() =>
                changeMode("login")
              }
              className={`rounded-lg px-4 py-2.5 font-semibold transition ${
                mode === "login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                changeMode("register")
              }
              className={`rounded-lg px-4 py-2.5 font-semibold transition ${
                mode === "register"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {mode === "register" && (
              <Field
                label="Full name"
                type="text"
                value={fullName}
                onChange={setFullName}
                placeholder="Frank Marvin"
                autoComplete="name"
              />
            )}

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="student@example.com"
              autoComplete="email"
            />

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <Field
                label="Confirm password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={
                  setConfirmPassword
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <LoaderCircle
                  size={19}
                  className="animate-spin"
                />
              )}

              {mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />

            <span className="text-xs uppercase text-slate-500">
              or
            </span>

            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={
              handleGoogleLogin
            }
            className="w-full rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-800 disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          By continuing, you agree to
          Franky's Terms of Service and
          Privacy Policy.
        </p>
      </section>
    </main>
  );
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  autoComplete?: string;

  onChange: (
    value: string,
  ) => void;
}

function Field({
  label,
  type,
  value,
  placeholder,
  autoComplete,
  onChange,
}: FieldProps) {
  const id =
    label
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
      />
    </div>
  );
}
