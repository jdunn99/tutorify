import Link from "next/link";
import { Button, ButtonLink } from "./button";

export function Navbar() {
  return (
    <header className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center md:gap-8">
            <Link href="/" className="font-bold">
              tutorify.
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex md:gap-4">
              <Link
                href="/"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                Subjects
              </Link>
              <Link
                href="/"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                Services
              </Link>
              <Link
                href="/"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                About Us
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="md:inline-block rounded-lg hidden py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >Sign In</Link>
              <ButtonLink href="/" className="hidden md:inline-block">Get started today</ButtonLink>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
