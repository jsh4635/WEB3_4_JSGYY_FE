import { api } from "@/api";
import { DepositDTO } from "@/api/generated/models";

/**
 * 보유금 충전 요청 함수
 * @param amount 충전할 금액
 * @param name 이름
 * @param bank 은행
 * @param impUid 결제 고유 ID
 * @returns 충전 요청 성공 여부
 */
export const depositAccount = async (
  amount: number,
  name: string,
  bank: string,
  impUid: string,
): Promise<boolean> => {
  try {
    // 충전 요청 DTO 생성
    const depositDTO: DepositDTO = {
      price: amount,
      name,
      bank,
      impUid,
    };

    // 충전 요청 API 호출
    await api.depositAccount({ depositDTO });
    return true;
  } catch (error) {
    console.error("보유금 충전 요청 중 오류 발생:", error);
    throw error;
  }
};
