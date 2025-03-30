"use client";

import { createContext, use, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import client from "@/lib/backend/client";

import { components } from "@/lib/backend/apiV1/schema";

type Member = components["schemas"]["MemberDto"];

export const LoginMemberContext = createContext<{
  loginMember: Member;
  setLoginMember: (member: Member) => void;
  isLoginMemberPending: boolean;
  isLogin: boolean;
  isAdmin: boolean;
  logout: (callback: () => void) => void;
  logoutAndHome: () => void;
  isAdminPage: boolean;
  isUserPage: boolean;
}>({
  loginMember: createEmptyMember(),
  setLoginMember: () => {},
  isLoginMemberPending: true,
  isLogin: false,
  isAdmin: false,
  logout: () => {},
  logoutAndHome: () => {},
  isAdminPage: false,
  isUserPage: false,
});

export function createEmptyMember(): Member {
  // client.get("/api/admin/members").then((res) => {
  //   if (res.data?.data) {
  //     console.log(res.data.data);
  //   }
  // });
  return {
    id: 0,
    createDate: "",
    modifyDate: "",
    nickname: "",
    profileImgUrl: "",
  };
}

export function createLoginMember(): Member {
  return {
    id: 2,
    createDate: "2025-03-29T15:00:00.000Z",
    modifyDate: "2025-03-29T15:00:00.000Z",
    nickname: "테스트 회원",
    profileImgUrl: "https://example.com/test.jpg",
  };
}
export function useLoginMember() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoginMemberPending, setLoginMemberPending] = useState(true);
  const [loginMember, _setLoginMember] = useState<Member>(createEmptyMember());

  const removeLoginMember = () => {
    _setLoginMember(createEmptyMember());
    setLoginMemberPending(false);
  };

  const setLoginMember = (member: Member) => {
    _setLoginMember(member);
    setLoginMemberPending(false);
  };

  const setNoLoginMember = () => {
    setLoginMemberPending(false);
  };

  console.log("loginMember", loginMember);
  const isLogin = loginMember.id !== 0;
  const isAdmin = loginMember.id === 2;

  const logout = (callback: () => void) => {
    client.get("/api/auth/logout").then(() => {
      removeLoginMember();
      callback();
    });
  };

  const logoutAndHome = () => {
    logout(() => router.replace("/"));
  };

  const isAdminPage = pathname.startsWith("/adm");
  const isUserPage = !isAdminPage;

  return {
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
}

export function useGlobalLoginMember() {
  return use(LoginMemberContext);
}
