import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { Button } from "./button";

interface DropdownProps {
  heading: string | React.ReactNode;
  children?: React.ReactNode;
}

export const DROPDOWN_VARIANTS = {
  base: "px-4 relative rounded hover:bg-green-100 select-none text-gray-600 text-sm outline-none",
};
export const DROPDOWN_CONTENT_VARIANTS = {
  base: "DropdownMenuContent relative min-w-[220px] z-10 bg-white rounded-lg p-2 shadow-lg border border-green-600",
};

export const DROPDOWN_LABEL_VARIANTS = {
  base: "px-4 leading-loose text-gray-600 font-semibold text-sm outline-none",
};

type DropdownItemProps = {
  variant?: keyof typeof DROPDOWN_VARIANTS;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>;

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  DropdownItemProps
>(({ children, variant = "base", className = "", ...rest }) => {
  return (
    <DropdownMenu.Item
      className={`${DROPDOWN_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      <div className="flex gap-2 items-center">{children}</div>
    </DropdownMenu.Item>
  );
});
DropdownItem.displayName = DropdownMenu.Item.displayName;

type DropdownContentProps = {
  variant?: keyof typeof DROPDOWN_CONTENT_VARIANTS;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>;

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  DropdownContentProps
>(({ children, variant = "base", className = "", ...rest }) => {
  return (
    <DropdownMenu.Content
      className={`${DROPDOWN_CONTENT_VARIANTS[variant]} ${className}`}
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
>(({ children, variant = "base", className = "", ...rest }) => {
  return (
    <DropdownMenu.Label
      className={`${DROPDOWN_LABEL_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </DropdownMenu.Label>
  );
});
DropdownLabel.displayName = DropdownMenu.Label.displayName;

export function Dropdown({ heading, children }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="DropdownMenuTrigger z-0">
        <Button variant="ghost" size="icon" className="outline-none">
          {heading}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>{children}</DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
