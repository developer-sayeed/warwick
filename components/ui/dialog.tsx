"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define variant types
type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "fullscreen";
type DialogVariant = "default" | "compact" | "large";

interface DialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean;
  size?: DialogSize;
  variant?: DialogVariant;
}

// Size mappings
const sizeClasses: Record<DialogSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg md:max-w-xl",
  lg: "sm:max-w-lg md:max-w-2xl lg:max-w-3xl",
  xl: "sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl",
  "2xl": "sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl",
  fullscreen: "w-[98vw] h-[98vh] max-w-none sm:max-w-none",
};

// Variant-specific styles
const variantStyles: Record<DialogVariant, string> = {
  default: "p-4 sm:p-6",
  compact: "p-3 sm:p-4",
  large: "p-6 sm:p-8",
};

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "md",
  variant = "default",
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          `
          fixed left-1/2 top-1/2 z-50
          w-[95vw]
          max-h-[85vh]
          overflow-y-auto
          -translate-x-1/2 -translate-y-1/2

          rounded-xl border
          bg-background
          shadow-xl

          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95
          `,
          sizeClasses[size],
          variantStyles[variant],
          size === "fullscreen" && "rounded-none",
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border bg-background/80 text-foreground opacity-80 backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
              variant === "compact" && "right-2 top-2 h-7 w-7",
              variant === "large" && "right-6 top-6 h-10 w-10",
            )}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: DialogVariant }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left",
        variant === "compact" && "gap-1",
        variant === "large" && "gap-3",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: DialogVariant }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        variant === "compact" && "gap-1",
        variant === "large" && "gap-3",
        className,
      )}
      {...props}
    />
  );
}

// Make DialogTitle accept variant prop
function DialogTitle({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
  variant?: DialogVariant;
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none",
        variant === "default" && "bg-[#2E304C] text-white p-4 rounded-sm",
        variant === "compact" &&
          "bg-[#2E304C] text-white p-3 rounded-sm text-base",
        variant === "large" && "bg-[#2E304C] text-white p-5 rounded-sm text-xl",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
