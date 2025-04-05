// import { PortOne } from "@portone/browser-sdk";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">(
    "card",
  );

  const handlePayment = async () => {
    return;
    try {
      const portone = await PortOne.initialize({
        // 실제 연동시에는 발급받은 키로 변경해야 합니다
        storeId: "store-4ff4af41-85e3-4559-8eb8-0d08a2c6ceec", // 테스트용 storeId
        channelKey: "channel-key-9c1c121f-1c43-4c87-8e4f-91c9afe7d1fd", // 테스트용 channelKey
      });

      const paymentResponse = await portone.payment.requestPayment({
        orderId: `order-${Date.now()}`,
        orderName: "보유금 충전",
        amount,
        currency: "KRW",
        paymentMethod: paymentMethod === "card" ? "CARD" : "BANK_TRANSFER",
        customer: {
          id: "CUSTOMER_ID", // 고객 ID
          name: "고객명",
        },
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      console.log("결제 성공:", paymentResponse);
      onClose();
    } catch (error) {
      console.error("결제 에러:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">결제 수단 선택</h2>

        <div className="space-y-4 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="form-radio"
            />
            <span>체크카드</span>
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
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
