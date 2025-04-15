"use client";

import { MyDetailsResponse } from "@/api/custom-models/MyDetailsResponse";
import { createAccount } from "@/api/wrappers/createAccount";
import { getAccountInfo } from "@/api/wrappers/getAccountInfo";
import { getMyDetails } from "@/api/wrappers/getMyDetails";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { storeMember } from "@/stores/auth/loginMember";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoItem } from "@/components/ui/info-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { toast } from "@/hooks/use-toast";

// API 응답 형식: { "data": { id, name, username, password, password2, nickname, email, phoneNum, role, address }, "message": string }

export default function MyPage() {
  const router = useRouter();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<MyDetailsResponse | null>(null);
  const [accountData, setAccountData] = useState<{
    money: number;
    hasAccount: boolean;
  }>({
    money: 0,
    hasAccount: false,
  });
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // 래퍼 함수 사용하여 사용자 데이터 가져오기
        const myDetails = await getMyDetails();

        // 로컬 스토리지 업데이트
        if (myDetails.id !== 0) {
          storeMember(myDetails);
        }

        setUserData(myDetails);

        // 계좌 정보 가져오기
        try {
          const accountInfo = await getAccountInfo();
          console.log("accountInfo");
          console.log(accountInfo);
          setAccountData(accountInfo);
        } catch (accountErr) {
          console.error("계좌 정보를 불러오는 중 오류 발생:", accountErr);
          setAccountData({ money: 0, hasAccount: false });
        }
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", err);
        setError(err instanceof Error ? err : new Error("알 수 없는 오류"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateAccount = async () => {
    if (!accountNumber || !bankName) {
      toast({
        title: "입력 오류",
        description: "계좌번호와 은행명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createAccount(accountNumber, bankName);

      // 성공 후 다이얼로그 닫기 및 상태 업데이트
      setIsAccountDialogOpen(false);
      setAccountData({ ...accountData, hasAccount: true });

      toast({
        title: "계좌 등록 성공",
        description: "계좌가 성공적으로 등록되었습니다.",
      });
    } catch (err) {
      console.error("계좌 등록 중 오류 발생:", err);
      toast({
        title: "계좌 등록 실패",
        description: "계좌 등록 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="grid grid-cols-2 gap-2 mb-4">
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

              <Button variant="outline" className="w-full mb-4" asChild>
                <Link href="/member/me/following">팔로잉 목록</Link>
              </Button>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    보유금 잔액
                  </h3>
                  {accountData.hasAccount ? (
                    <>
                      <p className="text-2xl font-bold text-primary">
                        {accountData.money.toLocaleString()}원
                      </p>
                      <Link
                        href="/credit"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        충전하기 →
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        등록된 계좌가 없습니다.
                      </p>
                      <Button
                        onClick={() => setIsAccountDialogOpen(true)}
                        variant="default"
                        size="sm"
                        className="w-full"
                      >
                        계좌 등록하기
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 계좌 등록 다이얼로그 */}
        <Dialog
          open={isAccountDialogOpen}
          onOpenChange={setIsAccountDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>계좌 등록</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="bankName">은행명</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="은행명을 입력하세요"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accountNumber">계좌번호</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="- 없이 숫자만 입력하세요"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAccountDialogOpen(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button onClick={handleCreateAccount} disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "등록하기"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                  await api.withdrawal();
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
