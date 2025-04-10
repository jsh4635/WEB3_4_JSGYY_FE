import axios from "axios";

import { Configuration } from "./generated";
import { APIApi } from "./generated/api/apiapi";

// 커스텀 axios 인스턴스 생성
const axiosInstance = axios.create({
  // 쿠키가 자동으로 포함되도록 설정
  withCredentials: true,
});

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJST0xFX0FETUlOIiwibWVtYmVySWQiOjYsImlhdCI6MTc0NDI5OTI1MCwiZXhwIjoxNzQ0MzAyODUwfQ.9asKZgWby41MT9soKR5xy8FbImJnJWOx1jtNqBXoZ6s";
const apiConfig = new Configuration({
  basePath:
    process.env.NEXT_PUBLIC_API_URL || "https://api.app1.springservice.shop",
  baseOptions: {
    // withCredentials 설정을 base options에도 추가
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Access: `${token}`,
    },
  },
});

// 토큰 설정 후 인스턴스 생성하기
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `${token}`;
  return config;
});

// API 인스턴스 생성 - 커스텀 axios 인스턴스 사용
export const api = new APIApi(apiConfig, undefined, axiosInstance);

// 재사용 가능한 API 설정을 내보냅니다
export { apiConfig, Configuration };

// 모델 타입 내보내기
export * from "./generated/models";
