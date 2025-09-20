import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-32">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <Sparkles className="mx-auto h-16 w-16 text-green-600 dark:text-zinc-600" />
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Build Better Habits.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Habitara is a minimalist habit tracker designed to help you stay
          consistent, track your progress, and build routines that last.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-8 py-3 text-base font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            <span>Get Started</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
