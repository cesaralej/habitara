"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

/* const navLinkStyle =
  "text-gray-900 dark:text-white py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-600";

const activeLinkStyle =
  "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 py-2 px-3 rounded";
 */
const links = [
  {
    label: " Dashboard",
    path: "/dashboard",
  },
];

export default function NavbarLinks() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="md:flex space-x-8">
      <NavigationMenuList>
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <NavigationMenuItem key={link.path}>
              <Link href={link.path} legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  data-state={isActive ? "active" : undefined}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
