import Link from "next/link";
export default function Footer() {
  return (
    <footer className="hidden md:block py-4 text-center text-gray-600 h-[10vh]">
      <div className="flex items-center justify-center space-x-4">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <p className="mt-2">&copy; {new Date().getFullYear()} Habitara</p>
    </footer>
  );
}
