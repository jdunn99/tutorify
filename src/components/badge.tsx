import React from "react";

export const BADGE_VARIANTS = {
  base: "font-bold leading-none rounded-lg text-slate-600 border border-slate-400 bg-slate-200",
  primary:
    "font-bold leading-none rounded-lg text-green-600 border border-green-400 bg-green-200",
  danger:
    "font-bold leading-none rounded-lg !text-white border border-red-600 bg-red-500",
};

export const BADGE_SIZES = {
  icon: "absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs leading-none transform translate-x-1/2 -translate-y-1/2",
  icon_dot:
    "absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2",
  dot: "inline-block w-2 h-2 rounded-full",
  base: "inline-flex items-center justify-center px-2.5 py-1 text-xs",
  md: "inline-flex items-center justify-center px-3 py-1.5 text-sm",
  lg: "inline-flex items-center justify-center px-3.5 py-2 text-md",
  xl: "inline-flex items-center justify-center px-4 py-2.5 text-md",
};

interface BadgeProps extends React.HtmlHTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof BADGE_VARIANTS;
  size?: keyof typeof BADGE_SIZES;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "base", size = "base", className = "", ...rest },
    ref
  ) => {
    return (
      <span
        className={` ${BADGE_VARIANTS[variant]} ${BADGE_SIZES[size]} ${className}`}
        ref={ref}
        {...rest}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export function IconBadge({
  children,
  icon,
  size = "icon",
  ...rest
}: BadgeProps & { icon: JSX.Element }) {
  return (
    <span className="relative ">
      {icon}
      <Badge size={size} {...rest}>
        {children}
      </Badge>
    </span>
  );
}
