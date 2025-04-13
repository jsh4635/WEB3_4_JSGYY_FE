// import { PortOne } from "@portone/browser-sdk";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    amount: number,
    paymentInfo: { name: string; bank: string; impUid: string },
  ) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">(
    "card",
  );
  const [amount, setAmount] = useState(10000);
  const [isProcessing, setIsProcessing] = useState(false);

  // 결제 처리 함수
  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // 실제 결제 연동 대신 가상의 결제 정보 생성
      // 실제 구현 시에는 PortOne 등의 결제 모듈을 연동해야 합니다
      const mockPaymentInfo = {
        name: "사용자",
        bank: paymentMethod === "card" ? "신한카드" : "국민은행",
        impUid: `imp_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // 가상의 결제 ID
      };

      // 결제 완료까지 약간의 지연 시간 적용 (실제 결제 흐름 모방)
      setTimeout(() => {
        setIsProcessing(false);
        onConfirm(amount, mockPaymentInfo);
      }, 1000);
    } catch (error) {
      console.error("결제 에러:", error);
      setIsProcessing(false);
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">보유금 충전</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            충전 금액
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {[10000, 30000, 50000, 100000].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  amount === value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {value.toLocaleString()}원
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1000"
            step="1000"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-medium">결제 수단 선택</h3>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="form-radio"
            />
            <span>신용/체크카드</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="transfer"
              checked={paymentMethod === "transfer"}
              onChange={() => setPaymentMethod("transfer")}
              className="form-radio"
            />
            <span>계좌이체</span>
          </label>
        </div>

        <div className="text-right mb-6">
          <p className="text-lg">
            충전 금액:{" "}
            <span className="font-bold">{amount.toLocaleString()}원</span>
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || amount < 1000}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isProcessing ? "처리 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
