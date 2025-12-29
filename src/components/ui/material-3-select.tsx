"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Material3Select = SelectPrimitive.Root;

const Material3SelectGroup = SelectPrimitive.Group;

const Material3SelectValue = SelectPrimitive.Value;

const Material3SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { label?: string, hasValue?: boolean }
>(({ className, children, label, hasValue, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-[#ca1f3d] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 relative group pt-5 transition-all text-white",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
    {label && (
      <label className={cn(
        "absolute left-4 transition-all duration-200 pointer-events-none bg-[#1e1e1e] px-1",
        hasValue
          ? "text-xs text-[#ca1f3d] top-2"
          : "text-base text-gray-500 top-4 group-focus:top-2 group-focus:text-xs group-focus:text-[#ca1f3d]"
      )}>
        {label}
      </label>
    )}
  </SelectPrimitive.Trigger>
));
Material3SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const Material3SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] text-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
Material3SelectContent.displayName = SelectPrimitive.Content.displayName;

const Material3SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-3 px-2 pl-8 text-sm outline-none focus:bg-[#ca1f3d]/10 focus:text-[#ca1f3d] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors cursor-pointer",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-[#ca1f3d]" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
Material3SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Material3Select,
  Material3SelectGroup,
  Material3SelectValue,
  Material3SelectTrigger,
  Material3SelectContent,
  Material3SelectItem,
};
