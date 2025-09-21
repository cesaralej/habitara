import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-32">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 dark:text-zinc-600" />
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Build Better Habits.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Habitara is a minimalist habit tracker designed to help you stay
          consistent, track your progress, and build routines that last.
        </p>
        <div className="flex flex-col items-center gap-3 pt-6 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
          >
            Learn more about Habitara
          </Link>
        </div>
      </div>
    </div>
  );
}
