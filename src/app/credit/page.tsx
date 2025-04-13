"use client";

import { depositAccount } from "@/api/wrappers/depositAccount";
import { getAccountInfo } from "@/api/wrappers/getAccountInfo";
import {
  ExchangeItem,
  getExchangeAccount,
} from "@/api/wrappers/getExchangeAccount";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { toast } from "@/hooks/use-toast";

import PaymentModal from "./PaymentModal";

export default function CreditPage() {
  // 상태 정의
  const [balance, setBalance] = useState(0);
  const [hasAccount, setHasAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState<ExchangeItem[]>(
    [],
  );
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "sender" | "receiver"
  >("all");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // 계좌 정보 및 거래내역 로드
  useEffect(() => {
    loadAccountInfo();
  }, []);

  // 필터나 페이지 변경 시 거래내역 다시 로드
  useEffect(() => {
    if (hasAccount) {
      loadTransactionHistory();
    }
  }, [selectedFilter, currentPage, hasAccount]);

  // 계좌 정보 로드
  const loadAccountInfo = async () => {
    try {
      setIsLoading(true);
      const accountInfo = await getAccountInfo();
      setBalance(accountInfo.money);
      setHasAccount(accountInfo.hasAccount);

      if (accountInfo.hasAccount) {
        await loadTransactionHistory();
      }
    } catch (error) {
      console.error("계좌 정보 로드 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "계좌 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 거래 내역 로드
  const loadTransactionHistory = async () => {
    try {
      const exchangeData = await getExchangeAccount(selectedFilter);
      setTransactionHistory(exchangeData.exchanges);
      setTotalPages(exchangeData.totalPages || 1);
    } catch (error) {
      console.error("거래 내역 로드 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "거래 내역을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 충전 처리 함수
  const handleCharge = async (
    amount: number,
    paymentInfo: { name: string; bank: string; impUid: string },
  ) => {
    try {
      setIsPaymentModalOpen(false);

      await depositAccount(
        amount,
        paymentInfo.name,
        paymentInfo.bank,
        paymentInfo.impUid,
      );

      // 충전 성공 후 잔액과 거래내역 다시 로드
      await loadAccountInfo();

      toast({
        title: "충전 성공",
        description: `${amount.toLocaleString()}원이 성공적으로 충전되었습니다.`,
      });
    } catch (error) {
      console.error("충전 중 오류 발생:", error);
      toast({
        title: "충전 실패",
        description: "충전 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 필터 변경 처리
  const handleFilterChange = (filter: "all" | "sender" | "receiver") => {
    setSelectedFilter(filter);
    setCurrentPage(1); // 필터 변경 시 페이지 초기화
  };

  // 계좌가 없는 경우
  if (!hasAccount && !isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">내 보유금</h1>
        <Card className="p-6 mb-8 text-center">
          <h2 className="text-lg text-gray-600 mb-6">등록된 계좌가 없습니다</h2>
          <p className="text-gray-500 mb-8">
            보유금을 이용하려면 마이페이지에서 계좌를 등록해주세요.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => (window.location.href = "/member/me")}
          >
            마이페이지로 이동
          </Button>
        </Card>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">내 보유금</h1>
        <Card className="p-6 mb-8 text-center">
          <div className="flex justify-center items-center p-8">
            <p className="text-gray-500">정보를 불러오는 중...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">내 보유금</h1>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg text-gray-600 mb-1">현재 보유금 잔액</h2>
            <p className="text-3xl font-bold text-primary">
              {balance.toLocaleString()}원
            </p>
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full sm:w-auto"
          >
            보유금 충전하기
          </Button>
        </div>
      </Card>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">거래 내역</h2>
          <div className="mt-2 sm:mt-0">
            <select
              value={selectedFilter}
              onChange={(e) =>
                handleFilterChange(
                  e.target.value as "all" | "sender" | "receiver",
                )
              }
              className="daangn-input bg-white px-3 py-2 border rounded-md"
            >
              <option value="all">전체 내역</option>
              <option value="receiver">입금 내역</option>
              <option value="sender">출금 내역</option>
            </select>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    거래 일자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    내용
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    계좌번호
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionHistory.length > 0 ? (
                  transactionHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.payDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.otherName ||
                          (item.exchangeType === "입금" ? "충전" : "결제")}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                          item.exchangeType === "입금"
                            ? "text-primary"
                            : "text-red-500"
                        }`}
                      >
                        {item.exchangeType === "입금" ? "+" : "-"}
                        {item.price.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        {item.account || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {transactionHistory.length > 0 && (
            <div className="flex justify-center py-4 border-t">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  이전
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // 현재 페이지 중심으로 최대 5개 페이지 버튼 표시
                  const start = Math.max(1, currentPage - 2);
                  const pageNum = start + i;

                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleCharge}
      />
    </div>
  );
}
