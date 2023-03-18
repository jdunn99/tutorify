import { WithSession } from "@/utils/auth";
import {
  MdBook,
  MdDashboard,
  MdHelp,
  MdMessage,
  MdMoney,
  MdPeople,
} from "react-icons/md";
import { Sidebar, type SidebarItems, type SidebarProps } from "./sidebar";

interface ProfileLayoutProps extends Pick<SidebarProps, "active" | "onClick"> {
  children?: React.ReactNode;
}

// Static reference to all links and their corresponding icons in the Sidebar
const SidebarLinks: SidebarItems = {
  user: [
    {
      heading: "Dashboard",
      icon: <MdDashboard />,
      children: [
        { href: "Profile" },
        { href: "Overview" },
        { href: "Appointments" },
        { href: "Account" },
      ],
    },
    {
      heading: "Tutoring",
      icon: <MdPeople />,
      children: [
        { href: "Browse Tutors" },
        { href: "View Tutors" },
        { href: "Appointments" },
      ],
    },
    {
      icon: <MdMessage />,
      heading: "Messaging",
      children: [{ href: "Inbox" }, { href: "Notifications" }],
    },
    {
      icon: <MdMoney />,
      heading: "Payment",
      children: [
        { href: "Payment History" },
        { href: "Payment Methods" },
        { href: "Refunds" },
      ],
    },
    {
      icon: <MdHelp />,
      heading: "Help",
      children: [
        { href: "FAQs" },
        { href: "Contact Support" },
        { href: "Report an Issue" },
        { href: "Give Feedback" },
      ],
    },
    {
      icon: <MdBook />,
      heading: "Resources",
      children: [
        { href: "Learning Materials" },
        { href: "Tutoring Tips" },
        { href: "Tutoring Policies" },
      ],
    },
  ],
};

export function ProfileLayout({ children, ...rest }: ProfileLayoutProps) {
  return (
    <div className="flex">
      <Sidebar {...rest} items={SidebarLinks} />
      <div className="h-screen overflow-auto p-24 bg-white flex-1">
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto p-24 bg-white overflow-x-hidden sm:px-6 md:px-8 max-w-screen-lg">{children}</div>;
}
