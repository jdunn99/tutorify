import Link from "next/link";
import {
  MdOutlineCalendarMonth,
  MdOutlineDashboard,
  MdOutlineLogout,
  MdOutlineMessage,
  MdOutlineSettings,
} from "react-icons/md";

const SIDEBAR_ITEMS = {
  top: [
    {
      href: "/profile/dashboard",
      name: "Dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      href: "/profile/appointments",
      name: "Appointments",
      icon: <MdOutlineCalendarMonth />,
    },
    {
      href: "/profile/messages",
      name: "Messages",
      icon: <MdOutlineMessage />,
    },
  ],
  bottom: [
    {
      href: "/profile/settings",
      name: "Settings",
      icon: <MdOutlineSettings />,
    },

    {
      href: "/auth/logout",
      name: "Log Out",
      icon: <MdOutlineLogout />,
    },
  ],
};

interface SidebarItemProps {
  href: string;
  name: string;
  icon: JSX.Element;
  pathname: string;
}

function SidebarItem({ href, name, icon, pathname }: SidebarItemProps) {
  return (
    <Link href={href} shallow className="block">
      <li
        className={`flex rounded-md p-2 cursor-pointer hover:shadow-lg hover:bg-green-600 hover:text-white ${
          pathname === href
            ? "text-white bg-green-600 shadow-lg"
            : "text-slate-600 bg-transparent"
        } font-medium text-sm items-center gap-x-4`}
      >
        <span className="text-lg duration-100">{icon}</span>
        <span className="origin-left duration-100">{name}</span>
      </li>
    </Link>
  );
}

export function Sidebar({ pathname }: { pathname: string }) {
  return (
    <div className="hidden lg:relative lg:flex lg:flex-none">
      <div className="w-72 bg-white border-r border-slate-200 relative">
        <div className="flex flex-col justify-between h-full">
          <div>
            <Link href="/">
              <h1 className="font-bold text-center pt-6 pb-8 text-xl duration-200">
                tutorify.
              </h1>
            </Link>
            <ul className="space-y-8 pt-16 px-16">
              {SIDEBAR_ITEMS.top.map(({ href, ...rest }) => (
                <SidebarItem
                  key={href}
                  href={href}
                  pathname={pathname}
                  {...rest}
                />
              ))}
            </ul>
          </div>
          <ul className="space-y-8 border-t border-slate-200 py-16 px-16">
            {SIDEBAR_ITEMS.bottom.map(({ href, ...rest }) => (
              <SidebarItem
                key={href}
                href={href}
                pathname={pathname}
                {...rest}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
