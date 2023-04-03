import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "./button";

interface DropdownProps {
  heading: string | React.ReactNode;
  children?: React.ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  className?: string;
}

export const DROPDOWN_VARIANTS = {
  base: "p-2 relative rounded hover:bg-green-100 select-none text-slate-600 hover:text-slate-800 hover:font-semibold  text-sm outline-none cursor-pointer duration-100",
};
export const DROPDOWN_CONTENT_VARIANTS = {
  base: "DropdownMenuContent relative min-w-[220px]  bg-white rounded-lg p-2 shadow-lg border border-green-600",
};

export const DROPDOWN_LABEL_VARIANTS = {
  base: "px-2 leading-loose text-gray-600 font-semibold text-sm outline-none",
};

type DropdownItemProps = {
  variant?: keyof typeof DROPDOWN_VARIANTS;
  children?: React.ReactNode;
  icon?: JSX.Element;
} & React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>;

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  DropdownItemProps
>(({ children, variant = "base", className = "", icon, ...rest }, ref) => {
  return (
    <DropdownMenu.Item
      className={`${DROPDOWN_VARIANTS[variant]} ${className}`}
      ref={ref}
      {...rest}
    >
      <div
        className={`flex gap-2 ${
          typeof icon !== "undefined" ? "items-center" : "flex-col"
        }`}
      >
        {typeof icon !== "undefined" ? (
          <span className="inline-block text-green-600 text-lg">{icon}</span>
        ) : null}
        {children}
      </div>
    </DropdownMenu.Item>
  );
});
DropdownItem.displayName = DropdownMenu.Item.displayName;

type DropdownContentProps = {
  variant?: keyof typeof DROPDOWN_CONTENT_VARIANTS;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>;

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  DropdownContentProps
>(({ children, variant = "base", className = "", ...rest }, ref) => {
  return (
    <DropdownMenu.Content
      className={`${DROPDOWN_CONTENT_VARIANTS[variant]} ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </DropdownMenu.Content>
  );
});
DropdownContent.displayName = DropdownMenu.Content.displayName;

type DropdownLabelProps = {
  variant?: keyof typeof DROPDOWN_LABEL_VARIANTS;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof DropdownMenu.Label>;

export const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Label>,
  DropdownLabelProps
>(({ children, variant = "base", className = "", ...rest }, ref) => {
  return (
    <DropdownMenu.Label
      className={`${DROPDOWN_LABEL_VARIANTS[variant]} ${className}`}
      ref={ref}
      {...rest}
    >
      {children}
    </DropdownMenu.Label>
  );
});
DropdownLabel.displayName = DropdownMenu.Label.displayName;

export function Dropdown({
  heading,
  children,
  variant = "ghost",
  size = "icon",
  className = "",
}: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="DropdownMenuTrigger z-0">
        <Button
          variant={variant}
          size={size}
          className={`outline-none ${className}`}
        >
          {heading}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>{children}</DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
