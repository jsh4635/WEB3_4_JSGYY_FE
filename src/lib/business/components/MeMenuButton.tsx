"use client";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FallbackImage } from "@/components/ui/image";
import { Text } from "@/components/ui/typography";

import { LogOut, User } from "lucide-react";

export default function MeMenuButton() {
  const { loginMember, logoutAndHome } = useGlobalLoginMember();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link">
          <FallbackImage
            className="w-[32px] h-[32px] object-cover rounded-full "
            src={""}
            alt={loginMember.nickname}
            width={32}
            height={32}
            quality={100}
            fallbackSrc="/user.svg"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Button variant="link" className="w-full justify-start" asChild>
            <Link
              href="/member/me"
              className="flex items-center gap-2 no-underline hover:no-underline"
            >
              <User className="h-4 w-4" />
              <Text>마이 페이지</Text>
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant="link" className="w-full justify-start" asChild>
            <Link
              href="/chat"
              className="flex items-center gap-2 no-underline hover:no-underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <Text>채팅</Text>
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={logoutAndHome}
            className="flex items-center gap-2 no-underline hover:no-underline"
          >
            <LogOut className="h-4 w-4" />
            <Text>로그아웃</Text>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
