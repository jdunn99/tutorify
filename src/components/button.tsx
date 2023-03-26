import React from "react";

export const BUTTON_VARIANTS = {
  base: "text-white border border-green-200 bg-green-500 hover:bg-green-700 shadow-sm disabled:bg-green-200",
  open: "text-green-600 border-green-400 border bg-white hover:bg-green-50 shadow-sm ",
  ghost: "text-gray-600 hover:text-green-600 bg-transparent",
};

export const BUTTON_SIZES = {
  xs: "text-xs px-2.5 py-1.5 rounded",
  sm: "text-sm px-3 py-2 leading-4 rounded",
  base: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-4 py-2 rounded-lg",
  xl: "text-lg px-6 py-3 rounded-xl",
  "2xl": "text-xl px-8 py-3 md:py-4 md:text-2xl md:px-8 rounded-2xl",
  icon: "p-2 text-lg",
};

interface BaseProps {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  children: React.ReactNode;
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "base", size = "base", className = "", ...rest },
    ref
  ) => {
    return (
      <button
        className={`${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
        ref={ref}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const ButtonLink = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    { children, variant = "base", size = "base", className = "", ...rest },
    ref
  ) => {
    return (
      <a
        className={`${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className} no-underline`}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
