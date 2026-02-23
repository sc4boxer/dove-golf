import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver Slice Debugger",
  description:
    "Use DoveClinic™ Driver Slice Debugger to isolate likely causes and run structured range tests that reduce right-curving drives.",
  alternates: {
    canonical: "/clinic/driver-slice",
  },
  openGraph: {
    title: "Driver Slice Debugger",
    description:
      "Use DoveClinic™ Driver Slice Debugger to isolate likely causes and run structured range tests that reduce right-curving drives.",
    url: "https://dovegolf.fit/clinic/driver-slice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Driver Slice Debugger",
    description:
      "Use DoveClinic™ Driver Slice Debugger to isolate likely causes and run structured range tests that reduce right-curving drives.",
  },
};

export default function DriverSliceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
