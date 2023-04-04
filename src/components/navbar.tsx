import _app from "@/pages/_app";
import { api } from "@/utils/api";
import { WithSession } from "@/utils/auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
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
import { Badge, IconBadge } from "./badge";
import { Button, ButtonLink } from "./button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
} from "./dropdown";
import { NavLink } from "./links";

function NotificationsMenu() {
  return (
    <Dropdown
      heading={
        <IconBadge
          variant="danger"
          size="icon_dot"
          icon={<MdNotifications />}
        />
      }
      variant="ghostColored"
    >
      <DropdownContent align="start" alignOffset={5} className="max-w-xs">
        <div className="flex justify-between items-center pl-4 pr-2 pb-2">
          <p className="text-slate-800 text-sm font-semibold">Notifications</p>
          <Button variant="ghostColored" size="xs">
            Mark all as read
          </Button>
        </div>
        <DropdownItem>
          <div className="flex justify-between items-center p-0 gap-2">
            <p className="text-xs text-slate-800">
              No payment method added for your account. Add one now.
            </p>
            <Button variant="ghost" size="xs">
              x
            </Button>
          </div>
        </DropdownItem>
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

interface ProfileNavLinkProps {
  route: string;
  href: string;
  children: React.ReactNode;
}

export function ProfileNavbar({
  session,
  route,
}: WithSession & { route: string }) {
  return (
    <header className="w-full bg-white border-b border-slate-200  py-2">
      <nav className="flex items-center justify-between mx-auto max-w-7xl px-6">
        <h3 className="text-lg font-bold text-slate-800">{route}</h3>
        <div className="flex items-center gap-8">
          <NotificationsMenu />
          <AvatarMenu session={session} />
        </div>
      </nav>
    </header>
  );
}

export function AvatarMenu({ session }: WithSession) {
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
          <DropdownItem
            className="cursor-pointer hover:underline"
            key={index}
            icon={icon}
          >
            <Link href={href}>{text}</Link>
          </DropdownItem>
        ))}

        <DropdownItem
          className="cursor-pointer hover:underline"
          icon={<MdLogout />}
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

function Unauthenticated() {
  return (
    <div className="flex items-center gap-2">
      <ButtonLink href="/auth/signin" variant="ghost">
        Sign In
      </ButtonLink>
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
    <div className="flex items-center gap-4">
      <NavLink href={`/tutor/${session.user.id}`}>Profile</NavLink>
      <NavLink href="/profile/dashboard">Dashboard</NavLink>
      <NavLink href="/profile/appointments">Appointments</NavLink>
      <NavLink href="/profile/messages">
        <MdMessage className="text-lg" />
      </NavLink>
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
            {typeof session !== "undefined" && session !== null ? (
              <Authenticated session={session} />
            ) : (
              <React.Fragment>
                <Unauthenticated />
                <div className="hidden md:flex md:gap-4">
                  <NavLink href="/#subjects">Subjects</NavLink>
                  <NavLink href="/#services">Services</NavLink>
                  <NavLink href="/about_us">About Us</NavLink>
                </div>
              </React.Fragment>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
