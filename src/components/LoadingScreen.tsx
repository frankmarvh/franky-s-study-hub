import { LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-blue-500" />

        <h2 className="mt-4 text-xl font-bold text-white">
          Franky's
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Loading your study hub...
        </p>
      </div>
    </div>
  );
}
