import _app from "@/pages/_app";
import { api } from "@/utils/api";
import { WithSession } from "@/utils/auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MdCalendarMonth,
  MdDashboard,
  MdHistory,
  MdLogout,
  MdMessage,
  MdNotifications,
  MdPayment,
  MdSettings,
} from "react-icons/md";
import { ButtonLink } from "./button";
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

const AVATAR_MENU_ITEMS = [
  {
    text: "Dashboard",
    icon: <MdDashboard />,
    href: "/profile/dashboard",
  },
  {
    text: "Appointments",
    icon: <MdCalendarMonth />,
    href: "/profile/appointments",
  },
  {
    text: "Messages",
    icon: <MdMessage />,
    href: "/profile/messages",
  },
  {
    text: "Payment Information",
    icon: <MdPayment />,
    href: "/profile/payment",
  },
  {
    text: "Transactions",
    icon: <MdHistory />,
    href: "/profile/transactions",
  },
  {
    text: "Settings",
    icon: <MdSettings />,
    href: "/profile/settings",
  },
];

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
      <DropdownContent align="start" sideOffset={4}>
        <DropdownLabel>{session.user.name}</DropdownLabel>
        {AVATAR_MENU_ITEMS.map(({ text, icon, href }, index) => (
          <DropdownItem className="cursor-pointer hover:underline" key={index}>
            <Link href={href} className="flex items-center gap-2">
              <span className="inline-block text-green-600 text-lg">
                {icon}
              </span>{" "}
              {text}
            </Link>
          </DropdownItem>
        ))}

        <DropdownItem
          className="cursor-pointer hover:underline"
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          <span className="inline-block text-green-600 text-lg">
            <MdLogout />
          </span>
          Logout
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
  let shouldRender: boolean = false;
  switch (session.user.role) {
    case "USER":
      shouldRender = true;
      break;
    case "VERIFIED_TUTOR":
      shouldRender = true;
      break;
    case "ADMIN":
      shouldRender = true;
    case "SUPERUSER":
      shouldRender = true;
    default:
      shouldRender = false;
      break;
  }

  return shouldRender ? (
    <div className="flex items-center gap-2">
      <NotificationsMenu />
      <AvatarMenu session={session} />
    </div>
  ) : null;
}

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center md:gap-8">
            <Link href="/" className="font-bold">
              tutorify.
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex md:gap-4">
              <Link
                href="/#subjects"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                Subjects
              </Link>
              <Link
                href="/#features"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="inline-block rounded-lg py-1 px-2 text-sm text-slate-600 font-semibold hover:text-green-600"
              >
                About Us
              </Link>
            </div>
            {typeof session !== "undefined" && session !== null ? (
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
