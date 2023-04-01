import React from "react";
import Link from "next/link";

export const LINK_VARIANTS = {
  base: "inline-block text-slate-600 py-1 font-semibold hover:text-green-600",
  black: "inline-block text-slate-600 py-1 font-bold hover:text-black",
  green: "inline-block text-green-600 py-1 font-semibold hover:text-green-800",
};

export const LINK_SIZES = {
  xs: "text-xs",
  sm: "text-sm leading-4",
  base: "text-sm",
  lg: "text-base",
  xl: "text-lg",
  "2xl": "text-xl md:text-2xl",
};

interface LinkProps extends React.ComponentProps<typeof Link> {
  variant?: keyof typeof LINK_VARIANTS;
  size?: keyof typeof LINK_SIZES;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, variant = "base", size = "base", className, ...rest }, ref) => {
    return (
      <Link
        {...rest}
        ref={ref}
        className={`${className} ${LINK_VARIANTS[variant]} ${LINK_SIZES[size]} `}
      >
        {children}
      </Link>
    );
  }
);
NavLink.displayName = Link.displayName;
