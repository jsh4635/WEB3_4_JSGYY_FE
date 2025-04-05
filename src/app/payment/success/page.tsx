"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 결제 성공 처리
    const handlePaymentSuccess = async () => {
      try {
        // TODO: 서버에 결제 성공 정보 전송
        // await fetch('/api/payment/success', { ... });

        alert("결제가 성공적으로 완료되었습니다.");
        router.push("/credit"); // 보유금 페이지로 이동
      } catch (error) {
        console.error("결제 성공 처리 중 오류 발생:", error);
      }
    };

    handlePaymentSuccess();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">결제 성공</h1>
        <p className="mb-4">결제가 성공적으로 완료되었습니다.</p>
        <p>잠시 후 보유금 페이지로 이동합니다...</p>
      </div>
    </div>
  );
}
