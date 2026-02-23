"use client";

import Link from "next/link";
import { track } from "@/lib/analytics/ga";
import { ComponentProps, ReactNode } from "react";

type TrackLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  eventName?: string;
  eventParams?: Record<string, unknown>;
};

export function TrackLink({ children, eventName = "dov_cta_clicked", eventParams, onClick, ...props }: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        track(eventName, eventParams);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
