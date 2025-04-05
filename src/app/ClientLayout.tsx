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

import { Copyright, LogIn, MonitorCog } from "lucide-react";

export function ClientLayout({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    isAdmin,
    logout,
    logoutAndHome,
    isAdminPage,
    isUserPage,
  } = useLoginMember();

  const loginMemberContextValue = {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    isAdmin,
    logout,
    logoutAndHome,
    isAdminPage,
    isUserPage,
  };

  useEffect(() => {
    const fetchMember = () => {
      setLoginMember(createEmptyMember());
      // client.get("/api/v1/members/me").then((res) => {
      //   if (res.error) {
      //     setNoLoginMember();
      //   } else {
      //     setLoginMember(res.data);
      //   }
      // });
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
      <LoginMemberContext value={loginMemberContextValue}>
        <header className="py-4">
          <NarrowHeaderContent className="flex sm:hidden" />
          <WideHeaderContent className="hidden sm:flex" />
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="p-2 flex justify-center">
          {isUserPage && (
            <Button variant="link" asChild>
              <Link href="/" className="flex items-center gap-1">
                <Copyright className="h-4 w-4" />
                <Text>Bid & Buy</Text>
              </Link>
            </Button>
          )}

          {isAdminPage && (
            <Button variant="link" asChild>
              <Link href="/adm" className="flex items-center gap-1">
                <MonitorCog className="h-4 w-4" />
                <Text>Bid & Buy 관리자 페이지</Text>
              </Link>
            </Button>
          )}

          {!isLogin && (
            <Button variant="link" asChild>
              <Link
                href="/adm/member/login"
                className="flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                <Text>관리자 로그인</Text>
              </Link>
            </Button>
          )}
        </footer>
      </LoginMemberContext>
    </NextThemesProvider>
  );
}
