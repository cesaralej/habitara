"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckCircle2, Settings, User, CalendarDays } from "lucide-react";

const links = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Habits",
    path: "/habits",
    icon: CheckCircle2,
  },
  {
    label: "History",
    path: "/history",
    icon: CalendarDays,
  },
  {
    label: "Account",
    path: "/account",
    icon: User,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
      <div className="flex justify-around">
        {links.map((link) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex flex-1 flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "text-green-600 dark:text-green-500"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              <Icon className={`mb-1 h-5 w-5 ${isActive ? "fill-current" : ""}`} />
              {link.label}
            </Link>
          );
        })}
      </div>
      {/* Safe area spacing for iOS home indicator if needed, usually handled by padding or viewport */}
      <div className="h-[env(safe-area-inset-bottom)] pb-1 bg-white dark:bg-zinc-950"></div>
    </div>
  );
}
