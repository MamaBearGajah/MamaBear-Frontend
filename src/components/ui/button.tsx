import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[var(--mb-pink)] text-white shadow-sm hover:bg-[var(--mb-pink-dark)] focus-visible:ring-[var(--mb-pink)]",
  outline:
    "border border-[var(--mb-border)] bg-white text-[var(--mb-brown)] hover:bg-[var(--mb-bg-soft)] focus-visible:ring-[var(--mb-pink)]",
  ghost:
    "bg-transparent text-[var(--mb-brown)] hover:bg-[var(--mb-bg-soft)] focus-visible:ring-[var(--mb-pink)]",
  destructive:
    "bg-[var(--mb-error)] text-white hover:brightness-95 focus-visible:ring-[var(--mb-error)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}

        {size !== "icon" && children}

        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";