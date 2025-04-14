// import { PortOne } from "@portone/browser-sdk";
import { userInfo } from "os";
import { useEffect, useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, paymentInfo: { impUid: string }) => void;
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

  useEffect(() => {
    // 포트원 라이브러리 추가
    let script = document.querySelector(
      `script[src="https://cdn.iamport.kr/v1/iamport.js"]`,
    );

    // 만약 스크립트가 존재하지 않으면
    if (!script) {
      // 새로운 스크립트 요소를 생성
      script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      document.body.appendChild(script); // 스크립트를 문서의 body에 추가
    }

    // 컴포넌트가 언마운트될 때 실행되는 함수 반환
    return () => {
      // 스크립트 요소가 존재하는지 확인 후 제거
      if (script && script.parentNode === document.body) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 결제 처리 함수
  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const { IMP } = window;

      IMP.init("imp45386610");
      var today = new Date();
      var hours = today.getHours(); // 시
      var minutes = today.getMinutes(); // 분
      var seconds = today.getSeconds(); // 초
      var milliseconds = today.getMilliseconds();
      var makeMerchantUid =
        `${hours}` + `${minutes}` + `${seconds}` + `${milliseconds}`;

      IMP.request_pay(
        {
          pg: "kakaopay.TC0ONETIME", // PG사 코드표에서 선택
          pay_method: "card", // 결제 방식
          merchant_uid: "IMP" + makeMerchantUid, // 결제 고유 번호
          name: "충전", // 제품명
          amount: amount, // 가격
        },
        async function (rsp) {
          console.log(rsp);
          // callback
          if (rsp.success) {
            const mockPaymentInfo = {
              price: amount,
              impUid: rsp.imp_uid, // 가상의 결제 ID
            };
            //결제 성공시
            console.log(rsp);

            setTimeout(() => {
              setIsProcessing(false);
              onConfirm(amount, mockPaymentInfo);
            }, 1000);
          } else if (rsp.success == false) {
            // 결제 실패시
            alert(rsp.error_msg);
            setIsProcessing(false);
            return;
          }
        },
      );

      // 실제 결제 연동 대신 가상의 결제 정보 생성
      // 실제 구현 시에는 PortOne 등의 결제 모듈을 연동해야 합니다

      // 결제 완료까지 약간의 지연 시간 적용 (실제 결제 흐름 모방)
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
            <span>카카오페이</span>
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
