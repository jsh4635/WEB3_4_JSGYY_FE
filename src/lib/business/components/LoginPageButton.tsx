"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

export default function LoginPageButton({
  variant,
  className,
  text,
  ...props
}: {
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
  text?: string | boolean;
  providerTypeCode?: string;
}) {
  if (!variant) variant = "link";
  if (typeof text === "boolean") text = "로그인";

  return (
    <Button {...props} variant={variant} className={className} asChild>
      <Link href="/member/login">{text && <Text>{text}</Text>}</Link>
    </Button>
  );
}
