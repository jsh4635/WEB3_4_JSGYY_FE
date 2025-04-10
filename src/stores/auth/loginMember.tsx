"use client";

import { createContext, use, useState } from "react";

import { useRouter } from "next/navigation";

import client from "@/lib/backend/client";

import { components } from "@/lib/backend/apiV1/schema";

type Member = components["schemas"]["MemberDto"];

export const LoginMemberContext = createContext<{
  loginMember: Member;
  setLoginMember: (member: Member) => void;
  isLoginMemberPending: boolean;
  isLogin: boolean;
  logout: (callback: () => void) => void;
  logoutAndHome: () => void;
  isUserPage: boolean;
}>({
  loginMember: createEmptyMember(),
  setLoginMember: () => {},
  isLoginMemberPending: true,
  isLogin: false,
  logout: () => {},
  logoutAndHome: () => {},
  isUserPage: true,
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

  const isLogin = loginMember.id !== 0;

  const logout = (callback: () => void) => {
    client.get("/api/auth/logout").then(() => {
      removeLoginMember();
      callback();
    });
  };

  const logoutAndHome = () => {
    logout(() => router.replace("/"));
  };

  const isUserPage = true;

  return {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
    isUserPage,
  };
}

export function useGlobalLoginMember() {
  return use(LoginMemberContext);
}
