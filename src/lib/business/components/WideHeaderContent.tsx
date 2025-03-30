"use client";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";

import { MonitorCog, TableOfContents, UserRoundSearch } from "lucide-react";

import LoginPageButton from "./LoginPageButton";
import Logo from "./Logo";
import MeMenuButton from "./MeMenuButton";

export default function WideHeaderContent({
  className,
}: {
  className?: string;
}) {
  const { isLogin, isUserPage, isAdminPage } = useGlobalLoginMember();

  return (
    <div className={`${className} container mx-auto py-1`}>
      {isUserPage && (
        <>
          <Button variant="link" asChild>
            <Logo text />
          </Button>
          <div className="relative w-full max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <TableOfContents className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {isAdminPage && (
        <>
          <Button variant="link" asChild>
            <Link href="/adm">
              <MonitorCog /> 관리자 홈
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Link href="/adm/member/list">
              <UserRoundSearch /> 회원관리
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Logo text />
          </Button>
        </>
      )}

      <div className="flex-grow"></div>

      {!isLogin && <LoginPageButton text />}
      {isLogin && <MeMenuButton />}
    </div>
  );
}
