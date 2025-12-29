"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Material3TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Material3Textarea = React.forwardRef<HTMLTextAreaElement, Material3TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="relative group pt-2">
        <textarea
          className={cn(
            "block w-full px-4 py-3 text-white bg-[#1e1e1e] border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-[#ca1f3d] peer transition-all placeholder-transparent resize-none min-h-[120px]",
            className
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <label
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-[#ca1f3d] peer-focus:dark:text-[#ca1f3d] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 bg-[#1e1e1e] px-1 pointer-events-none"
        >
          {label}
        </label>
      </div>
    );
  }
);
Material3Textarea.displayName = "Material3Textarea";

export { Material3Textarea };
