import React from "react";

const theme = {
  base: "text-white border-sky-700 bg-sky-600 hover:bg-sky-700 hover:border-sky-800 shadow-sm text-sm px-4 py-2 rounded",
  open: "text-sky-600 border-sky-400 border bg-white hover:bg-sky-50 shadow-sm text-sm px-4 py-2 rounded hover:border-sky-600",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof theme;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "base", className = "", ...rest }, ref) => {
    return (
      <button className={`${theme[variant]} ${className}`} ref={ref} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
