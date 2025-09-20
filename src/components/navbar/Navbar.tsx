import Brand from "./Brand";
import NavbarLinks from "./NavbarLinks";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="p-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Brand />

        {/* Navbar Links for Desktop */}
        <NavbarLinks />
        {/* User Menu / Sign In Button */}
        <div className="flex items-center space-x-4">
          <Link href="/auth" className="text-blue-500 hover:text-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
