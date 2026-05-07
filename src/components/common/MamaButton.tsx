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
    "bg-[#D85B88] text-white shadow-sm hover:bg-[#C54F7A]",
  secondary:
    "border border-[#F3D9E3] bg-[#FFF1F5] text-[#6B4637] hover:bg-[#FFE3EC]",
  outline:
    "border border-[#D85B88] bg-white text-[#D85B88] hover:bg-[#FFF1F5]",
  ghost:
    "bg-transparent text-[#6B4637] hover:bg-[#FFF1F5]",
  danger:
    "bg-red-500 text-white hover:bg-red-600",
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
          "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200",
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