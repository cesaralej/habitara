import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900 md:p-10">
        <div className="flex flex-col items-center">
          <Mail className="h-10 w-10 text-green-600 dark:text-zinc-400" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            We'd love to hear from you! Send us a message and we'll get back to
            you as soon as we can.
          </p>
        </div>

        <form className="space-y-4">
          <Input type="email" placeholder="Your Email" className="h-12" />
          <Textarea
            placeholder="Your Message"
            rows={6}
            className="h-32 resize-none"
          />
          <Button
            type="submit"
            className="w-full h-12 bg-green-900 text-white shadow hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
