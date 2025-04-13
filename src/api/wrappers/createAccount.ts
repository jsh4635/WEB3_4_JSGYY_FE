import { api } from "@/api";
import { AccountDTO } from "@/api/generated/models";

/**
 * 계좌를 등록하는 함수
 * @param accountNumber 계좌번호
 * @param bankName 은행이름
 */
export const createAccount = async (
  accountNumber: string,
  bankName: string,
): Promise<boolean> => {
  try {
    const accountDTO: AccountDTO = {
      accountNumber,
      bankName,
    };

    await api.createAccount({ accountDTO });
    return true;
  } catch (error) {
    console.error("계좌 등록 중 오류 발생:", error);
    throw error;
  }
};
