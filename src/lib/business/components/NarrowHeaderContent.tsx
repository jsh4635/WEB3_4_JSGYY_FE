"use client";

import Link from "next/link";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/typography";

import {
  LogOut,
  Menu,
  MonitorCog,
  NotebookTabs,
  User,
  UserRoundSearch,
} from "lucide-react";

import LoginPageButton from "./LoginPageButton";
import Logo from "./Logo";
import MeMenuButton from "./MeMenuButton";
import PostWriteButton from "./PostWriteButton";

export default function NarrowHeaderContent({
  className,
}: {
  className?: string;
}) {
  const {
    isLogin,
    isAdmin,
    loginMember,
    logoutAndHome,
    isAdminPage,
    isUserPage,
  } = useGlobalLoginMember();

  return (
    <div className={`${className} py-1`}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="link">
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>전체 메뉴</DrawerTitle>
            <DrawerDescription>전체 메뉴</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[calc(100dvh-150px)] px-2 pb-2 overflow-y-auto">
            <ul>
              {isUserPage && (
                <>
                  {isLogin && (
                    <li>
                      <DrawerClose asChild>
                        <PostWriteButton
                          className="w-full justify-start"
                          text
                        />
                      </DrawerClose>
                    </li>
                  )}
                  {isLogin && (
                    <li>
                      <DrawerClose asChild>
                        <Button
                          variant="link"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link
                            href="/post/mine"
                            className="flex items-center gap-2"
                          >
                            <NotebookTabs className="h-4 w-4" />
                            <Text>내글</Text>
                          </Link>
                        </Button>
                      </DrawerClose>
                    </li>
                  )}
                </>
              )}

              {isAdminPage && (
                <>
                  <li>
                    <DrawerClose asChild>
                      <Button
                        variant="link"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/adm" className="flex items-center gap-2">
                          <MonitorCog className="h-4 w-4" />
                          <Text>관리자 홈</Text>
                        </Link>
                      </Button>
                    </DrawerClose>
                  </li>

                  <li>
                    <DrawerClose asChild>
                      <Button
                        variant="link"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          href="/adm/member/list"
                          className="flex items-center gap-2"
                        >
                          <UserRoundSearch className="h-4 w-4" />
                          <Text>회원관리</Text>
                        </Link>
                      </Button>
                    </DrawerClose>
                  </li>
                </>
              )}
              <li className="py-2">
                <Separator />
              </li>
              <li>
                <DrawerClose asChild>
                  <Button
                    variant="link"
                    className="w-full justify-start"
                    asChild
                  >
                    <Logo text />
                  </Button>
                </DrawerClose>
              </li>
              {!isLogin && (
                <li>
                  <DrawerClose asChild>
                    <Button
                      variant="link"
                      className="w-full justify-start"
                      asChild
                    >
                      <LoginPageButton text />
                    </Button>
                  </DrawerClose>
                </li>
              )}
              {isLogin && (
                <li>
                  <DrawerClose asChild>
                    <Button
                      variant="link"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href="/member/me"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        <Text>{loginMember.nickname}</Text>
                      </Link>
                    </Button>
                  </DrawerClose>
                </li>
              )}
              {isAdmin && (
                <li>
                  <DrawerClose asChild>
                    <Button
                      variant="link"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/adm" className="flex items-center gap-2">
                        <MonitorCog className="h-4 w-4" />
                        <Text>관리자 홈</Text>
                      </Link>
                    </Button>
                  </DrawerClose>
                </li>
              )}
              {isLogin && (
                <li>
                  <DrawerClose asChild>
                    <Button
                      variant="link"
                      onClick={logoutAndHome}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <Text>로그아웃</Text>
                    </Button>
                  </DrawerClose>
                </li>
              )}
            </ul>
          </div>
        </DrawerContent>
      </Drawer>

      {isUserPage && (
        <Button variant="link" asChild>
          <Logo />
        </Button>
      )}
      {isAdminPage && (
        <Button variant="link" asChild>
          <Link href="/adm">
            <MonitorCog />
          </Link>
        </Button>
      )}
      <div className="flex-grow"></div>
      {isLogin && <MeMenuButton />}
    </div>
  );
}
