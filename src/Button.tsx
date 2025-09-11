import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children = "Click me",
  ariaLabel = "Click me",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} aria-label={ariaLabel} tabIndex={0} {...props}>
      {children}
    </button>
  );
}
export { Button };
