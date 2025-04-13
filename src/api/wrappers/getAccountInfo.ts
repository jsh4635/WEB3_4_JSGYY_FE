import { api } from "@/api";
import axios from "axios";

interface AccountInfo {
  money: number;
  hasAccount: boolean;
}

/**
 * 사용자의 계좌 정보 및 보유금액을 조회합니다.
 * 계좌가 없는 경우 hasAccount: false를 반환합니다.
 */
export const getAccountInfo = async (): Promise<AccountInfo> => {
  try {
    const response = await api.getAccount({ id: 0 });

    // API 응답이 있으면 계좌 있음으로 처리
    const data = response?.data as { money: number } | undefined;
    console.log("data", data);

    if (data) {
      return {
        money: data.money || 0,
        hasAccount: true,
      };
    }

    return {
      money: 0,
      hasAccount: true,
    };
  } catch (error) {
    // 404 에러인 경우 계좌가 없는 것으로 처리
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        money: 0,
        hasAccount: false,
      };
    }

    // 그 외 에러는 그대로 던짐
    throw error;
  }
};
