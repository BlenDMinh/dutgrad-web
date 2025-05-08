"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableTable({ children, className }: ScrollableTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>{children}</div>
  );
}
