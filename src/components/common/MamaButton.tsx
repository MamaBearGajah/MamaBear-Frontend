"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MamaButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type MamaButtonSize = "sm" | "md" | "lg" | "icon";

interface MamaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: MamaButtonVariant;
  size?: MamaButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<MamaButtonVariant, string> = {
  primary:
    "bg-mama-primary text-white hover:bg-mama-primary-dark shadow-sm",
  secondary:
    "bg-mama-soft text-mama-brown hover:bg-pink-100 border border-mama-border",
  outline:
    "bg-white text-mama-brown border border-mama-border hover:bg-mama-soft",
  ghost:
    "bg-transparent text-mama-brown hover:bg-mama-soft",
  danger:
    "bg-mama-danger text-white hover:opacity-90",
};

const sizeClasses: Record<MamaButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export const MamaButton = forwardRef<HTMLButtonElement, MamaButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
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
          "inline-flex items-center justify-center gap-2 rounded-pill font-bold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mama-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}

        {size !== "icon" && children}

        {!isLoading && rightIcon}
      </button>
    );
  }
);

MamaButton.displayName = "MamaButton";