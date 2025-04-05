"use client";

import Link from "next/link";

import { H3 } from "@/components/ui/typography";

export default function Logo({ text, ...props }: { text?: boolean }) {
  return (
    <Link href="/" {...props}>
      {text && <H3 className="text-xl">Bid & Buy</H3>}
    </Link>
  );
}
