import {
  BookMarked,
  BookOpen,
  BrainCircuit,
  Library,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/hooks/useAuth";

export default function AppHeader() {
  const {
    isAdmin,
    signOut,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout =
    async () => {
      try {
        await signOut();

        toast.success(
          "Signed out successfully.",
        );

        navigate("/");
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to sign out.",
        );
      }
    };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <BookOpen
              size={21}
            />
          </div>

          <span className="hidden text-xl font-black sm:block">
            Franky's
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavigationLink
            to="/library"
            icon={
              <Library
                size={16}
              />
            }
          >
            Library
          </NavigationLink>

          <NavigationLink
            to="/saved"
            icon={
              <BookMarked
                size={16}
              />
            }
          >
            Saved
          </NavigationLink>

          <NavigationLink
            to="/franky-ai"
            icon={
              <BrainCircuit
                size={16}
              />
            }
          >
            AI
          </NavigationLink>

          {isAdmin && (
            <NavigationLink
              to="/admin"
              icon={
                <ShieldCheck
                  size={16}
                />
              }
            >
              Admin
            </NavigationLink>
          )}

          <button
            type="button"
            onClick={
              handleLogout
            }
            title="Sign out"
            aria-label="Sign out"
            className="ml-1 rounded-lg border border-slate-700 p-2.5 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut
              size={17}
            />
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavigationLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({
        isActive,
      }) =>
        [
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",

          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:bg-slate-900 hover:text-white",
        ].join(" ")
      }
    >
      {icon}

      <span className="hidden sm:inline">
        {children}
      </span>
    </NavLink>
  );
}
