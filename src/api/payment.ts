import { client } from "./client";
import { ApiResponse } from "./types";

interface DepositRequest {
  memberId: number;
  price: number;
  name: string;
  bank: string;
  impUid: string;
}

interface WithdrawRequest {
  memberId: number;
  price: number;
  impUid: string;
}

interface PaymentRequest {
  memberId: number;
  price: number;
  sellerId: number;
}

interface AccountExchange {
  exchangeType: "출금" | "입금";
  payDate: string;
  price: number;
  account: number;
  otherName: string;
}

export const requestDeposit = async (data: DepositRequest) => {
  const response = await client.post<ApiResponse<void>>("/pay/deposit", data);
  return response.data;
};

export const requestWithdraw = async (data: WithdrawRequest) => {
  const response = await client.post<ApiResponse<void>>("/pay/withdraw", data);
  return response.data;
};

export const processPayment = async (data: PaymentRequest) => {
  const response = await client.post<ApiResponse<void>>("/pay", data);
  return response.data;
};

export const getBalance = async (memberId: number) => {
  const response = await client.get<{ money: number }>(`/account/${memberId}`);
  return response.data;
};

export const getTransactionHistory = async (
  memberId: number,
  type: "all" | "sender" | "receiver",
) => {
  const response = await client.get<{ exchanges: AccountExchange[] }>(
    `/account/${memberId}/exchange`,
    {
      params: { type },
    },
  );
  return response.data;
};
