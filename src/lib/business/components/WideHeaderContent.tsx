"use client";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

import { MonitorCog, Search, UserRoundSearch } from "lucide-react";

import LoginPageButton from "./LoginPageButton";
import Logo from "./Logo";
import MeMenuButton from "./MeMenuButton";

export default function WideHeaderContent({
  className,
}: {
  className?: string;
}) {
  const { isLogin, isUserPage, isAdminPage } = useGlobalLoginMember();

  if (isUserPage) {
    return (
      <div className={`${className} container mx-auto py-1 flex items-center`}>
        <Button variant="link" asChild className="mr-2">
          <Logo text />
        </Button>
        <div className="relative w-full max-w-2xl mx-auto flex-1">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-[0.5px] focus:ring-primary"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {!isLogin && <LoginPageButton text />}
        {isLogin && <MeMenuButton />}
      </div>
    );
  }
  if (isAdminPage) {
    return (
      <div className={`${className} container mx-auto py-1 flex items-center`}>
        {isAdminPage && (
          <>
            <Button variant="link" asChild>
              <Link href="/adm" className="flex items-center gap-2">
                <MonitorCog className="h-4 w-4" />
                <Text>관리자 홈</Text>
              </Link>
            </Button>

            <Button variant="link" asChild>
              <Link href="/adm/member/list" className="flex items-center gap-2">
                <UserRoundSearch className="h-4 w-4" />
                <Text>회원관리</Text>
              </Link>
            </Button>

            <Button variant="link" asChild>
              <Logo text />
            </Button>
          </>
        )}

        {!isLogin && <LoginPageButton text />}
        {isLogin && <MeMenuButton />}
      </div>
    );
  }

  return (
    <div className={`${className} container mx-auto py-1 flex items-center`}>
      <Logo text />
    </div>
  );
}
