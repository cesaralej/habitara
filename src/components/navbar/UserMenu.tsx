import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { LogIn, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isLoggedIn: boolean;
}

export default function UserMenu({ isLoggedIn }: UserMenuProps) {
  const { user, signOutUser } = useAuth();
  const [imageLoadError, setImageLoadError] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      // Redirect to the homepage after successful sign-out
      router.push("/");
    } catch (error) {
      // You could add an alert or a toast here if sign out fails
      console.error("Logout failed:", error);
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        {user.photoURL && !imageLoadError ? (
          <img
            src={user.photoURL}
            alt="User Profile"
            className="h-9 w-9 rounded-full cursor-pointer"
            onError={() => setImageLoadError(true)}
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 cursor-pointer">
            <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <div className="flex items-center space-x-4">
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white shadow"
        >
          <Link href="/auth" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </Button>
      </div>
    );
  }
}
