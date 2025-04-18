import { api } from "@/api";
import axios from "axios";

import { APIApiGetExchangeAccountRequest } from "../generated";

export interface ExchangeItem {
  [x: string]: any;
  exchangeType: number;
  payDate: string;
  price: number;
  account: number;
  otherName: string;
}

export interface ExchangeResponse {
  exchanges: ExchangeItem[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 사용자 계좌의 거래 내역을 조회합니다.
 * @param type 거래 타입 (sender: 출금, receiver: 입금, all: 전체)
 * @returns 거래 내역 정보 배열, 페이지 정보 등
 */
export const getExchangeAccount = async (
  type: "all" | "sender" | "receiver" = "all",
): Promise<ExchangeResponse> => {
  try {
    const response = await api.getExchangeAccount({
      id: 0,
      type,
    } as unknown as APIApiGetExchangeAccountRequest);

    // API 응답 구조에 맞게 데이터 가공
    if (response?.data) {
      const data = response.data as {
        exchanges?: ExchangeItem[];
        totalPages?: number;
        totalElements?: number;
        hasNext?: boolean;
        hasPrevious?: boolean;
      };
      return {
        exchanges: data.exchanges || [],
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || 0,
        hasNext: data.hasNext || false,
        hasPrevious: data.hasPrevious || false,
      };
    }

    // 데이터가 없는 경우 빈 결과 반환
    return {
      exchanges: [],
      totalPages: 1,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    };
  } catch (error) {
    // 404 에러인 경우 계좌가 없거나 거래 내역이 없는 것으로 처리
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        exchanges: [],
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false,
      };
    }

    // 그 외 에러는 그대로 던짐
    console.error("거래 내역 조회 중 오류 발생:", error);
    throw error;
  }
};
