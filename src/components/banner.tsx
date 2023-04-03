import React from "react";
import { Button, ButtonLink } from "./button";

export const BANNER_VARIANTS = {
  base: "border-green-400  bg-green-200",
  warning: "border-yellow-400 bg-yellow-200 ",
  danger: "border-red-500 text-white bg-red-600 ",
};

interface BannerProps {
  variant?: keyof typeof BANNER_VARIANTS;
  heading: string;
  text?: string;
  button?: string;
  href?: string;
  onClick?(): void;
  closable?: boolean;
}

export function Banner({
  heading,
  text,
  button,
  href,
  onClick,
  variant = "base",
  closable = false,
}: BannerProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  return isOpen ? (
    <div
      className={`relative py-4 px-8 border rounded-xl shadow-lg hover:shadow-xl ${BANNER_VARIANTS[variant]}`}
    >
      {closable ? (
        <div className="absolute right-0 top-0">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            x
          </Button>
        </div>
      ) : null}
      <div className="flex items-center sm:text-left text-center justify-center sm:justify-between sm:flex-row flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold">{heading}</h2>
          <p
            className={`text-sm ${
              variant === "danger" ? "text-red-100" : "text-slate-600"
            }`}
          >
            {text}
          </p>
        </div>
        {typeof button !== "undefined" ? (
          typeof href !== "undefined" ? (
            <ButtonLink href={href} variant={variant}>
              {button}
            </ButtonLink>
          ) : (
            <Button variant={variant} onClick={onClick}>
              {button}
            </Button>
          )
        ) : null}
      </div>
    </div>
  ) : null;
}
