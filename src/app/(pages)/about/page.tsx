import { Button } from "@/components/ui/button";
import { Rocket, Target, User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8 dark:bg-zinc-950">
      <div className="w-full max-w-lg space-y-12 rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900 md:p-10">
        {/* Mission */}
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <Target className="h-10 w-10 text-green-600 dark:text-green-400" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our Mission
            </h1>
          </div>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            We believe growth happens one small win at a time. By giving you a
            clear, tangible way to record each habit you complete, we help you
            build momentum and stay motivated. Every checkmark is more than a
            task — it’s proof that you’re becoming the person you want to be.
          </p>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 my-8"></div>

        {/* Founder */}
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <User className="h-10 w-10 text-green-600 dark:text-zinc-400" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Meet the Founder
            </h2>
          </div>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            Hi, I’m Cesar. I built this app after realizing that when I write
            down a habit every day and watch the list grow, it sparks a kind of
            excitement — a streak I don’t want to break. I couldn’t find a tool
            that felt simple, motivating, and distraction-free, so I decided to
            create one myself.
          </p>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 my-8"></div>

        {/* Story */}
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <Rocket className="h-10 w-10 text-green-600 dark:text-zinc-400" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our Story
            </h2>
          </div>
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            Habitara was born from a simple idea: streaks create momentum, and
            momentum creates growth. Just like a rocket gathering speed, every
            day you complete a habit pushes you further on your journey. This
            app is designed to make that progress visible and rewarding, without
            the clutter of unnecessary features. Think of it as your personal
            mission control for building a better life.
          </p>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 my-8"></div>
        <div className="pt-6">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <a href="/dashboard">Get Started</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
