"use client";

import KaKaoLoginButton from "@/lib/business/components/KaKaoLoginButton";
import NaverLoginButton from "@/lib/business/components/NaverLoginButton";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";
import MainPage from "./MainPage";

export default function ClientPage() {
  const { isLogin } = useGlobalLoginMember();

  return (
    <div className="flex-1 flex justify-center items-center">
      {!isLogin && (
        <div className="flex flex-col gap-2">
          <KaKaoLoginButton text />
          <NaverLoginButton text />
        </div>
      )}
      {isLogin && <MainPage />}
    </div>
  );
}
