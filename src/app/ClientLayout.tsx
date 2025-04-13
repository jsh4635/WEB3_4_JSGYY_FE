"use client";

import * as React from "react";
import { useEffect } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import Link from "next/link";

// import client from "@/lib/backend/client";

import NarrowHeaderContent from "@/lib/business/components/NarrowHeaderContent";
import WideHeaderContent from "@/lib/business/components/WideHeaderContent";

import {
  LoginMemberContext,
  createEmptyMember,
  useLoginMember,
} from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";

import { Copyright } from "lucide-react";

export function ClientLayout({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
    isUserPage,
  } = useLoginMember();

  const loginMemberContextValue = {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
    isUserPage,
  };

  useEffect(() => {
    const fetchMember = () => {
      // 로컬 스토리지에서 토큰과 멤버 정보 확인
      if (typeof window !== "undefined") {
        // 로컬 스토리지에서 저장된 멤버 정보 확인
        const storedMember = localStorage.getItem("loginMember");
        if (storedMember) {
          try {
            // 저장된 멤버 정보가 있으면 파싱하여 사용
            const memberData = JSON.parse(storedMember);
            if (memberData && memberData.id !== 0) {
              setLoginMember(memberData);
              return;
            }
          } catch (error) {
            console.error("Failed to parse stored member data:", error);
          }
        }
      }

      // 저장된 정보가 없거나 유효하지 않으면 빈 멤버로 초기화
      setLoginMember(createEmptyMember());
    };

    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoginMemberPending) {
    return (
      <div className="flex-1 flex justify-center items-center text-muted-foreground">
        <Text>인증 정보 로딩중...</Text>
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      <LoginMemberContext.Provider value={loginMemberContextValue}>
        <header className="py-4">
          <NarrowHeaderContent className="flex sm:hidden" />
          <WideHeaderContent className="hidden sm:flex" />
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="p-2 flex justify-center">
          <Button variant="link" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Copyright className="h-4 w-4" />
              <Text>Bid & Buy</Text>
            </Link>
          </Button>
        </footer>
      </LoginMemberContext.Provider>
    </NextThemesProvider>
  );
}
