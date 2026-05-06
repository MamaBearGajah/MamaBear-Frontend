"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MamaInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  withPasswordToggle?: boolean;
}

export const MamaInput = forwardRef<HTMLInputElement, MamaInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      withPasswordToggle = false,
      className,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password" && withPasswordToggle;
    const currentType = isPasswordField
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-bold text-mama-brown"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mama-muted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={currentType}
            className={cn(
              "h-12 w-full rounded-pill border bg-white px-4 text-sm text-mama-brown outline-none transition-all",
              "placeholder:text-mama-muted focus:ring-2 focus:ring-mama-primary/20",
              leftIcon && "pl-11",
              (rightIcon || isPasswordField) && "pr-11",
              error
                ? "border-mama-danger focus:border-mama-danger"
                : "border-mama-border focus:border-mama-primary",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />

          {isPasswordField ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mama-muted"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mama-muted">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="text-xs text-mama-danger">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-mama-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

MamaInput.displayName = "MamaInput";