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

import { LogOut, MonitorCog, User } from "lucide-react";

export default function MeMenuButton() {
  const { isAdmin, loginMember, logoutAndHome } = useGlobalLoginMember();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link">
          <FallbackImage
            className="w-[32px] h-[32px] object-cover rounded-full "
            src={loginMember.profileImgUrl}
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
            <Link href="/member/me" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <Text>{loginMember.nickname}</Text>
            </Link>
          </Button>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem>
            <Button variant="link" className="w-full justify-start" asChild>
              <Link href="/adm" className="flex items-center gap-2">
                <MonitorCog className="h-4 w-4" />
                <Text>관리자 홈</Text>
              </Link>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={logoutAndHome}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <Text>로그아웃</Text>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
