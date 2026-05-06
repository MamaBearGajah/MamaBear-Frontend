import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BaseCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function MamaCard({
  className,
  hoverable = false,
  ...props
}: BaseCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-mama-border bg-white shadow-sm",
        hoverable && "transition-all duration-200 hover:-translate-y-1 hover:shadow-mama",
        className
      )}
      {...props}
    />
  );
}

export function MamaCardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...props} />;
}

export function MamaCardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-extrabold text-mama-brown", className)}
      {...props}
    />
  );
}

export function MamaCardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-6 text-mama-muted", className)}
      {...props}
    />
  );
}

export function MamaCardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function MamaCardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 px-5 pb-5 pt-2", className)}
      {...props}
    />
  );
}