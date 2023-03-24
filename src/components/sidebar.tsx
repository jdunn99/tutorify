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

type TextColor = {
  base: string;
  hover: string;
};
type SidebarTheme = {
  background: string;
  primaryColor: TextColor;
  secondaryColor: TextColor;
};

type SidebarCategory = {
  heading: string;
  icon?: JSX.Element;
  children?: SidebarLink[];
};
export type SidebarItems = { user: SidebarCategory[] };

type SidebarLink = {
  href: string;
  icon?: JSX.Element;
};

export interface SidebarProps {
  active: string;
  items: SidebarItems;
  handleClick(target: string): void;
  theme?: SidebarTheme;
}

interface SidebarContainerProps extends Pick<SidebarProps, "theme"> {
  children?: React.ReactNode;
}

const defaultTheme: SidebarTheme = {
  background: "transparent",
  primaryColor: { base: "gray-600", hover: "black" },
  secondaryColor: { base: "sky-500", hover: "sky-500" },
};

const SIDEBAR_CONTAINER =
  "flex flex-col items-end w-14 hover:w-72 md:w-72 h-screen transition-all duration-300 border-none z-10";
const SIDEBAR_INNER =
  "overflow-y-auto overflow-x-hidden py-8 px-8 flex flex-col gap-4 justify-between flex-grow";

function SidebarContainer({
  children,
  theme: { background } = defaultTheme,
}: SidebarContainerProps) {
  return (
    <div className={`${background} ${SIDEBAR_CONTAINER}`}>
      <div className={SIDEBAR_INNER}>{children}</div>
    </div>
  );
}

const SIDEBAR_ACCORDION_TRIGGER =
  "SidebarAccordion relative w-full flex font-medium hover:text-black flex-row gap-4 justify-between items-center h-11 focus:outline-none text-sm rounded-lg cursor-pointer";
const SIDEBAR_ACCORDION_CONTENT =
  "SidebarAccordionContent overflow-hidden space-y-1 mt-2 border-l-2 ";
const SIDEBAR_TRIGGER_ICON = "SidebarTriggerIcon text-lg";

function SidebarContent({
  active,
  items,
  handleClick,
  theme: { primaryColor, secondaryColor } = defaultTheme,
}: SidebarProps) {
  const { user } = items;

  function renderLinkWithChildren({
    icon,
    heading,
    children,
  }: (typeof user)[number]) {
    return (
      <React.Fragment>
        <Accordion.AccordionTrigger
          className={`${SIDEBAR_ACCORDION_TRIGGER}
      text-${primaryColor.base} hover:text-${primaryColor.hover}`}
        >
          <div className="flex items-center gap-4">
            <span className={SIDEBAR_TRIGGER_ICON}>{icon}</span>
            <span>{heading}</span>
          </div>
          <RxChevronDown className="AccordionChevron" />
        </Accordion.AccordionTrigger>
        <Accordion.AccordionContent className={SIDEBAR_ACCORDION_CONTENT}>
          {children!.map(({ href, icon }, index) => (
            <div
              key={index}
              onClick={() => handleClick(href)}
              className={`cursor-pointer relative ${
                active === href
                  ? `bg-white text-${secondaryColor.base}`
                  : `text-${primaryColor.base}`
              } flex  flex-row items-center h-9 focus:outline-none hover:text-${
                secondaryColor.hover
              } font-medium hover:bg-white rounded-lg ml-2 px-2 gap-4`}
            >
              <span className={SIDEBAR_TRIGGER_ICON}>{icon}</span>
              <span className="text-sm tracking-wide truncate">{href}</span>
            </div>
          ))}
        </Accordion.AccordionContent>
      </React.Fragment>
    );
  }

  function renderLinkWithoutChildren(heading: string, icon?: JSX.Element) {
    return (
      <div
        className={`${SIDEBAR_ACCORDION_TRIGGER} text-${primaryColor.base}  hover:text-${primaryColor.hover}`}
        onClick={() => handleClick(heading)}
      >
        <div className="flex items-center gap-4">
          <span
            className={`text-lg ${
              active === heading ? `text-${secondaryColor.base}` : ``
            }`}
          >
            {icon}
          </span>
          <span
            className={`${
              active === heading ? `text-${primaryColor.hover}` : ``
            }`}
          >
            {heading}
          </span>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Accordion.Root type="multiple" className="space-y-2">
        {user.map(({ children, icon, heading }, index) => (
          <Accordion.Item
            value={index.toString()}
            key={index}
            className="w-full "
          >
            {typeof children !== "undefined"
              ? renderLinkWithChildren({ children, icon, heading })
              : renderLinkWithoutChildren(heading, icon)}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </React.Fragment>
  );
}

export function Sidebar(props: SidebarProps) {
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
