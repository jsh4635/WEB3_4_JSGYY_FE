"use client";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";

import { Search } from "lucide-react";

import LoginPageButton from "./LoginPageButton";
import Logo from "./Logo";
import MeMenuButton from "./MeMenuButton";

export default function WideHeaderContent({
  className,
}: {
  className?: string;
}) {
  const { isLogin } = useGlobalLoginMember();

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
