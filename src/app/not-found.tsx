import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20">
      <div className="space-y-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600" />
        <h1 className="text-4xl font-medium text-zinc-700 dark:text-zinc-300">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          The page you are looking for has been moved or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center text-sm font-medium text-zinc-600 transition-colors hover:underline dark:text-zinc-400"
        >
          <Home className="mr-2 h-4 w-4" />
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
