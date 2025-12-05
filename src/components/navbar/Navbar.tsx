"use client";
import Brand from "./Brand";
import NavbarLinks from "./NavbarLinks";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="p-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Brand />
        {/* Navbar Links for Desktop */}
         <div className="hidden md:block">
          <NavbarLinks />
         </div>
         {/* User Menu / Sign In Button */}
        <UserMenu isLoggedIn={false} />
      </div>
    </header>
  );
}
