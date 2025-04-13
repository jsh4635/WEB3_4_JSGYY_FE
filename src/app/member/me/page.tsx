"use client";

import { MyDetailsResponse } from "@/api/custom-models/MyDetailsResponse";
import { getMyDetails } from "@/api/wrappers/getMyDetails";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { storeMember } from "@/stores/auth/loginMember";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InfoItem } from "@/components/ui/info-section";
import { Separator } from "@/components/ui/separator";

// API 응답 형식: { "data": { id, name, username, password, password2, nickname, email, phoneNum, role, address }, "message": string }

export default function MyPage() {
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<MyDetailsResponse | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // 래퍼 함수 사용하여 데이터 가져오기
        const myDetails = await getMyDetails();

        // 로컬 스토리지 업데이트
        if (myDetails.id !== 0) {
          storeMember(myDetails);
        }

        setUserData(myDetails);
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", err);
        setError(err instanceof Error ? err : new Error("알 수 없는 오류"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (error || !userData) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Card className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">오류 발생</h2>
          <p className="text-gray-600">
            사용자 정보를 불러오는 중 문제가 발생했습니다.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }

  const user = userData;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">내 프로필</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 섹션 - 사용자 정보 카드 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center pb-2">
              <Avatar
                size="lg"
                className="mx-auto h-24 w-24 mb-4"
                src="/user.svg"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name || "사용자"}
              </h2>
              <p className="text-gray-500 mb-4">
                @{user.username || "username"}
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center space-x-2 mb-6">
                <Button variant="default" asChild>
                  <Link
                    href={`/member/me/edit-profile?nickname=${encodeURIComponent(user.nickname || "")}&phoneNum=${encodeURIComponent(user.phoneNum || "")}&address=${encodeURIComponent(user.address || "")}`}
                  >
                    프로필 수정
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/member/me/my-posts">내 판매글</Link>
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    보유금 잔액
                  </h3>
                  <p className="text-2xl font-bold text-primary">0원</p>
                  <Link
                    href="/credit"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    충전하기 →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 섹션 - 상세 정보 */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">계정 정보</h2>
            </CardHeader>
            <CardContent className="grid gap-6">
              <InfoItem label="아이디" value={user.username || "-"} />
              <InfoItem label="닉네임" value={user.nickname || "-"} />
              <InfoItem label="이메일" value={user.email || "-"} />
              <InfoItem label="역할" value={user.role || "-"} />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">개인 정보</h2>
            </CardHeader>
            <CardContent className="grid gap-6">
              <InfoItem label="이름" value={user.name || "-"} />
              <InfoItem label="전화번호" value={user.phoneNum || "-"} />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">배송지 정보</h2>
            </CardHeader>
            <CardContent className="grid gap-6">
              <InfoItem label="주소" value={user.address || "-"} />
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={async () => {
                try {
                  const api = await import("@/api").then(
                    (module) => module.api,
                  );
                  await api.withdrawal({ oneData: { data: "" } });
                  router.push("/");
                } catch (err) {
                  console.error("회원 탈퇴 중 오류 발생:", err);
                  alert("회원 탈퇴에 실패했습니다.");
                }
              }}
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
