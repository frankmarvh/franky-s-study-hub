import {
  BookMarked,
  BookOpen,
  BrainCircuit,
  Library,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  useState,
  type ReactNode,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  useAuth,
} from "@/hooks/useAuth";

import ThemeToggle
  from "@/components/ThemeToggle";

export default function AppHeader() {
  const {
    isAdmin,
    signOut,
  } =
    useAuth();

  const navigate =
    useNavigate();

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const logout =
    async () => {
      try {
        await signOut();

        navigate("/");

        toast.success(
          "Signed out.",
        );
      } catch {
        toast.error(
          "Unable to sign out.",
        );
      }
    };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          to="/library"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BookOpen
              size={21}
            />
          </div>

          <div>
            <span className="block text-lg font-black leading-none">
              Franky's
            </span>

            <span className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Study Hub
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavItem
            to="/library"
            icon={
              <Library size={16} />
            }
          >
            Library
          </NavItem>

          <NavItem
            to="/saved"
            icon={
              <BookMarked size={16} />
            }
          >
            Saved
          </NavItem>

          <NavItem
            to="/franky-ai"
            icon={
              <BrainCircuit size={16} />
            }
          >
            Franky's AI
          </NavItem>

          <NavItem
            to="/profile"
            icon={
              <UserRound size={16} />
            }
          >
            Profile
          </NavItem>

          <NavItem
            to="/settings"
            icon={
              <Settings size={16} />
            }
          >
            Settings
          </NavItem>

          {isAdmin && (
            <NavItem
              to="/admin"
              icon={
                <ShieldCheck size={16} />
              }
            >
              Admin
            </NavItem>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={
              logout
            }
            title="Sign out"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:text-red-500 dark:border-slate-700 dark:text-slate-400 sm:flex"
          >
            <LogOut size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                !menuOpen,
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 lg:hidden"
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 px-5 py-4 dark:border-slate-800 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <MobileLink
              to="/library"
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
            >
              Library
            </MobileLink>

            <MobileLink
              to="/saved"
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
            >
              Saved Materials
            </MobileLink>

            <MobileLink
              to="/franky-ai"
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
            >
              Franky's AI
            </MobileLink>

            <MobileLink
              to="/profile"
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
            >
              Profile
            </MobileLink>

            <MobileLink
              to="/settings"
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
            >
              Settings
            </MobileLink>

            {isAdmin && (
              <MobileLink
                to="/admin"
                onClick={() =>
                  setMenuOpen(
                    false,
                  )
                }
              >
                Admin
              </MobileLink>
            )}

            <button
              type="button"
              onClick={
                logout
              }
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={18} />

              Sign Out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({
        isActive,
      }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
        }`
      }
    >
      {icon}

      {children}
    </NavLink>
  );
}

function MobileLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={
        onClick
      }
      className={({
        isActive,
      }) =>
        `rounded-xl px-4 py-3 font-medium ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-100 dark:hover:bg-slate-900"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
