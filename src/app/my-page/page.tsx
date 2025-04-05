"use client";

import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InfoItem } from "@/components/ui/info-section";
import { Separator } from "@/components/ui/separator";

export default function MyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">내 프로필</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 섹션 - 사용자 정보 카드 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center pb-2">
              <Avatar size="lg" className="mx-auto h-24 w-24 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">홍길동</h2>
              <p className="text-gray-500 mb-4">@user123</p>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center space-x-2 mb-6">
                <Button variant="default">프로필 수정</Button>
                <Button variant="outline">내 판매글</Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    보유금 잔액
                  </h3>
                  <p className="text-2xl font-bold text-primary">10,000원</p>
                  <Link
                    href="/credit"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    충전하기 →
                  </Link>
                </div>

                <div className="rounded-lg p-4 border">
                  <h3 className="font-medium text-gray-800 mb-2">활동 정보</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-800">23</p>
                      <p className="text-xs text-gray-500">판매중</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">105</p>
                      <p className="text-xs text-gray-500">판매완료</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">45</p>
                      <p className="text-xs text-gray-500">찜</p>
                    </div>
                  </div>
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
              <InfoItem label="아이디" value="user123" />
              <InfoItem label="닉네임" value="멋진닉네임" />
              <InfoItem label="이메일" value="user@example.com" />
              <InfoItem label="가입일" value="2023-01-01" />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">개인 정보</h2>
            </CardHeader>
            <CardContent className="grid gap-6">
              <InfoItem label="이름" value="홍길동" />
              <InfoItem label="전화번호" value="010-1234-5678" />
              <InfoItem label="지역" value="서울특별시" />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">배송지 정보</h2>
            </CardHeader>
            <CardContent className="grid gap-6">
              <InfoItem label="우편번호" value="12345" />
              <InfoItem label="기본주소" value="서울특별시 강남구 테헤란로" />
              <InfoItem label="상세주소" value="OO빌딩 123호" />
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  주소 변경
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
