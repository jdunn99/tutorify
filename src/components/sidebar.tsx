import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  MdBook,
  MdDashboard,
  MdHelp,
  MdMessage,
  MdMoney,
  MdPeople,
} from "react-icons/md";
import { RxChevronDown } from "react-icons/rx";
import Link from "next/link";

type SidebarCategory = {
  heading: string;
  icon?: JSX.Element;
  children: SidebarLink[];
};
export type SidebarItems = { user: SidebarCategory[] };

type SidebarLink = {
  href: string;
  icon?: JSX.Element;
};

export interface SidebarProps {
  active: string;
  onClick(target: string): void;
  items: SidebarItems;
}

function SidebarContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col w-14 hover:w-72 md:w-72 bg-zinc-100 h-screen transition-all duration-300 border-none z-10">
      <div className="overflow-y-auto overflow-x-hidden py-8 px-8 flex flex-col gap-4 justify-between flex-grow">
        {children}
      </div>
    </div>
  );
}

function SidebarContent({ active, items, onClick }: SidebarProps) {
  return (
    <React.Fragment>
      <Accordion.Root type="multiple" className="space-y-2">
        {items.user.map((link, index) => (
          <Accordion.Item
            value={index.toString()}
            key={index}
            className="w-full "
          >
            <Accordion.AccordionTrigger className="SidebarAccordion relative text-gray-600 w-full flex font-medium hover:text-black flex-row gap-4 justify-between items-center h-11 focus:outline-none text-sm rounded-lg">
              <div className="flex items-center gap-4">
                <span className="SidebarTriggerIcon text-lg">{link.icon}</span>
                <span>{link.heading}</span>
              </div>
              <RxChevronDown className="AccordionChevron" />
            </Accordion.AccordionTrigger>
            <Accordion.AccordionContent className="SidebarAccordionContent overflow-hidden space-y-1 mt-2 border-l-2 ">
              {link.children.map(({ href, icon }, index) => (
                <div
                  key={index}
                  onClick={() => onClick(href)}
                  className={`cursor-pointer relative ${
                    active === href ? "bg-white text-sky-600" : "text-gray-600"
                  } flex hover:drop-shadow-sm flex-row items-center h-9 focus:outline-none hover:text-sky-600 font-medium hover:bg-white rounded-lg ml-2 px-2 gap-4`}
                >
                  <span>{icon}</span>
                  <span className="text-sm tracking-wide truncate">{href}</span>
                </div>
              ))}
            </Accordion.AccordionContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </React.Fragment>
  );
}

export function Sidebar({ ...props }: SidebarProps) {
  return (
    <SidebarContainer>
      <div>
        <Link href="/">
          <h1 className="font-bold mb-8 text-xl">tutorify</h1>
        </Link>
        <SidebarContent {...props} />
      </div>
      <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs"></p>
    </SidebarContainer>
  );
}
