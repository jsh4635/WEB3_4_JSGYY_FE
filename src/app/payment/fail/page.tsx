"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/credit"); // 3초 후 보유금 페이지로 이동
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">결제 실패</h1>
        <p className="mb-4">결제 처리 중 문제가 발생했습니다.</p>
        <p>잠시 후 보유금 페이지로 이동합니다...</p>
      </div>
    </div>
  );
}
