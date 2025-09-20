import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function Brand() {
  return (
    <Link href="/">
      <div className="flex items-center space-x-3">
        <CheckCircle2 size={32} strokeWidth={2.5} className="text-green-600" />
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          Habitara
        </span>
      </div>
    </Link>
  );
}
