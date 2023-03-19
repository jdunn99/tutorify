import React from "react";

const style =
  "g-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block p-2.5";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <input className={`${style} ${className}`} ref={ref} {...rest}>
        {children}
      </input>
    );
  }
);

Input.displayName = "Input";
