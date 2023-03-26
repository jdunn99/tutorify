import { api } from "@/utils/api";
import { WithSession } from "@/utils/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  MdCalendarMonth,
  MdHelpCenter,
  MdMessage,
  MdNotifications,
  MdPerson,
} from "react-icons/md";
import { Button, ButtonLink } from "./button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
} from "./dropdown";

type NavbarProps = Partial<WithSession>;

function NotificationsMenu() {
  return (
    <Dropdown heading={<MdNotifications />}>
      <DropdownContent align="start" alignOffset={5}>
        <DropdownItem>No new notifications</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

function AvatarMenu({ session }: WithSession) {
  return (
    <Dropdown
      heading={
        <Image
          alt="Profile Image"
          className="rounded-full"
          src="https://randomuser.me/api/portraits/men/6.jpg"
          height={40}
          width={40}
        />
      }
    >
      <DropdownContent align="start" alignOffset={5}>
        <DropdownLabel>{session.user.name}</DropdownLabel>
        <DropdownItem className="py-2 cursor-pointer hover:underline">
          <MdPerson className="text-green-600 text-lg" /> My Account
        </DropdownItem>
        <DropdownItem className="py-2 cursor-pointer hover:underline">
          <MdCalendarMonth className="text-green-600 text-lg" /> Sessions
        </DropdownItem>
        <DropdownItem className="py-2 cursor-pointer hover:underline">
          <MdHelpCenter className="text-green-600 text-lg" /> Help
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

function Unauthenticated() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/signin"
        className="md:inline-block rounded-lg hidden py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
      >
        Sign In
      </Link>
      <ButtonLink href="/auth/register" className="hidden md:inline-block">
        Get started today
      </ButtonLink>
    </div>
  );
}

function Authenticated({ session }: WithSession) {
  const { data: profile } = api.profile.getFromSession.useQuery(undefined, {
    enabled: typeof session !== "undefined",
  });

  if (!profile) return null;

  return (
    <div className="flex items-center gap-2">
      {(session.user.role !== "USER" ||
        typeof profile.tutorProfile !== "undefined") && (
        <Link
          href={`/profile/${profile.id}/messages`}
          className="md:inline-block rounded-lg cursor-pointer hidden py-1 px-2 text-lg text-slate-600 font-semibold hover:text-green-600"
        >
          <MdMessage />
        </Link>
      )}

      <NotificationsMenu />
      <AvatarMenu session={session} />
    </div>
  );
}

export function Navbar({ session }: NavbarProps) {
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
            {typeof session !== "undefined" ? (
              <Authenticated session={session} />
            ) : (
              <Unauthenticated />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
