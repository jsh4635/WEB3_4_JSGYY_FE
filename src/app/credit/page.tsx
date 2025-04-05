"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import PaymentModal from "./PaymentModal";

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [chargeAmount] = useState(10000);
  const [currentPage, setCurrentPage] = useState(1);

  const dummyData = [
    {
      date: "2023-05-15",
      withdrawal: -30000,
      deposit: null,
      balance: 10000,
      description: "상품 구매",
    },
    {
      date: "2023-05-10",
      withdrawal: null,
      deposit: 10000,
      balance: 40000,
      description: "충전",
    },
    {
      date: "2023-05-03",
      withdrawal: -10000,
      deposit: null,
      balance: 50000,
      description: "상품 구매",
    },
    {
      date: "2023-04-28",
      withdrawal: -10000,
      deposit: null,
      balance: 60000,
      description: "상품 구매",
    },
    {
      date: "2023-04-20",
      withdrawal: -10000,
      deposit: null,
      balance: 70000,
      description: "상품 구매",
    },
    {
      date: "2023-04-15",
      withdrawal: -10000,
      deposit: null,
      balance: 80000,
      description: "상품 구매",
    },
    {
      date: "2023-04-10",
      withdrawal: null,
      deposit: 10000,
      balance: 70000,
      description: "충전",
    },
  ];

  // 필터링된 데이터
  const filteredData = dummyData.filter((item) => {
    if (selectedFilter === "전체") return true;
    if (selectedFilter === "입금 내역") return item.deposit !== null;
    if (selectedFilter === "출금 내역") return item.withdrawal !== null;
    return true;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">내 보유금</h1>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg text-gray-600 mb-1">현재 보유금 잔액</h2>
            <p className="text-3xl font-bold text-primary">10,000원</p>
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
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="daangn-input bg-white"
            >
              <option value="전체">전체 내역</option>
              <option value="입금 내역">입금 내역</option>
              <option value="출금 내역">출금 내역</option>
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
                    출금
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    입금
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    잔액
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-500">
                        {item.withdrawal && item.withdrawal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-primary">
                        {item.deposit && `+${item.deposit.toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        {item.balance.toLocaleString()}원
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredData.length > 0 && (
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
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 3}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
        amount={chargeAmount}
      />
    </div>
  );
}
