import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  MdBook,
  MdDashboard,
  MdHelp,
  MdManageAccounts,
  MdMessage,
  MdMoney,
  MdPeople,
  MdSchedule,
  MdWork,
} from "react-icons/md";

type SidebarCategory = {
  heading: string;
  icon?: JSX.Element;
  children: SidebarLink[];
};
type SidebarItems = { user: SidebarCategory[] };

type SidebarLink = {
  href: string;
  icon?: JSX.Element;
};

// Static reference to all links and their corresponding icons in the Sidebar
const SidebarLinks: SidebarItems = {
  user: [
    {
      heading: "Dashboard",
      icon: <MdDashboard />,
      children: [
        { href: "Overview", icon: <MdWork /> },
        { href: "Appointments", icon: <MdSchedule /> },
        { href: "Account", icon: <MdManageAccounts /> },
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

function SidebarContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col w-14 hover:w-64 md:w-64 bg-zinc-100 h-screen transition-all duration-300 border-none z-10">
      <div className="overflow-y-auto overflow-x-hidden py-8 pr-4 px-8 flex flex-col gap-4 justify-between flex-grow">
        {children}
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <Accordion.Root type="multiple" className="space-y-2">
      {SidebarLinks.user.map((link, index) => (
        <Accordion.Item
          value={index.toString()}
          key={index}
          className="w-full "
        >
          <Accordion.AccordionTrigger className="SidebarAccordion relative text-gray-600 w-full flex font-medium hover:text-black flex-row gap-4 items-center h-11 focus:outline-none text-sm rounded-lg">
            <span className="SidebarTriggerIcon text-lg">{link.icon}</span>
            <span>{link.heading}</span>
          </Accordion.AccordionTrigger>
          <Accordion.AccordionContent className="SidebarAccordionContent overflow-hidden space-y-1 mt-2 border-l-2 ">
            {link.children.map(({ href, icon }, index) => (
              <a
                href="#"
                key={index}
                className="relative text-gray-600 flex hover:drop-shadow-sm flex-row items-center h-9 focus:outline-none  hover:text-sky-600 font-medium hover:bg-white rounded-lg ml-2 px-2 gap-4"
              >
                <span>{icon}</span>
                <span className="text-sm tracking-wide truncate">
                  {href}
                </span>
              </a>
            ))}
          </Accordion.AccordionContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export function Sidebar() {
  return (
    <SidebarContainer>
      <div>
        <h1 className="font-bold mb-8">tutorify</h1>
        <SidebarContent />
      </div>
      <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs"></p>
    </SidebarContainer>
  );
}
