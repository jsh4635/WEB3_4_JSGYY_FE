"use client";

import { api, reinitializeApi } from "@/api";
import { getToken, removeToken } from "@/api/auth";
import { createContext, use, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { components } from "@/lib/backend/apiV1/schema";

type Member = components["schemas"]["MemberDto"];

// 로컬 스토리지에서 멤버 정보 가져오기
export const getStoredMember = (): Member | null => {
  if (typeof window !== "undefined") {
    const storedMember = localStorage.getItem("loginMember");
    return storedMember ? JSON.parse(storedMember) : null;
  }
  return null;
};

// 로컬 스토리지에 멤버 정보 저장
export const storeMember = (member: Member) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("loginMember", JSON.stringify(member));
  }
};

// 로컬 스토리지에서 멤버 정보 제거
export const clearStoredMember = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("loginMember");
  }
};

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
    name: "",
    username: "",
    password: "",
    password2: "",
    nickname: "",
    email: "",
    phoneNum: "",
    role: "",
    address: "",
  };
}

export function useLoginMember() {
  const router = useRouter();

  const [isLoginMemberPending, setLoginMemberPending] = useState(true);
  const [loginMember, _setLoginMember] = useState<Member>(createEmptyMember());

  // 페이지 로드 시 로컬 스토리지에서 로그인 정보 복원
  useEffect(() => {
    // 토큰이 있는지 확인
    const token = getToken();
    if (token) {
      // 토큰이 있으면 API 클라이언트 재초기화
      reinitializeApi();

      // 저장된 멤버 정보 가져오기
      const storedMember = getStoredMember();
      if (storedMember && storedMember.id !== 0) {
        // 저장된 멤버 정보가 있으면 설정
        _setLoginMember(storedMember);
      }
    }

    // 로딩 상태 해제
    setLoginMemberPending(false);
  }, []);

  const removeLoginMember = () => {
    _setLoginMember(createEmptyMember());
    // 로컬 스토리지에서 멤버 정보 제거
    clearStoredMember();
    // 토큰 제거
    removeToken();
    setLoginMemberPending(false);
  };

  const setLoginMember = (member: Member) => {
    _setLoginMember(member);
    // 로컬 스토리지에 멤버 정보 저장
    storeMember(member);
    setLoginMemberPending(false);
  };

  const setNoLoginMember = () => {
    setLoginMemberPending(false);
  };

  const isLogin = loginMember.id !== 0;

  const logout = (callback: () => void) => {
    // API 인스턴스를 사용하여 로그아웃 호출
    api
      .logout()
      .then(() => {
        removeLoginMember();
        callback();
      })
      .catch((error) => {
        console.error("로그아웃 중 오류 발생:", error);
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
