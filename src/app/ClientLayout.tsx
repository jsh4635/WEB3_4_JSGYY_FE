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
      <LoginMemberContext value={loginMemberContextValue}>
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
      </LoginMemberContext>
    </NextThemesProvider>
  );
}
