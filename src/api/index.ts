import axios from "axios";

import { getToken } from "./auth";
import { Configuration } from "./generated";
import { APIApi } from "./generated/api/apiapi";

// 커스텀 axios 인스턴스 생성
const axiosInstance = axios.create({
  // 쿠키가 자동으로 포함되도록 설정
  withCredentials: true,
});

// API 구성 객체 생성
export const createApiConfig = () => {
  return new Configuration({
    basePath:
      process.env.NEXT_PUBLIC_API_URL || "https://api.app1.springservice.shop",
      // process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    baseOptions: {
      // withCredentials 설정을 base options에도 추가
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Access: getToken(),
      },
    },
  });
};

// 최초 API 구성
let apiConfig = createApiConfig();

// 토큰 설정 후 인스턴스 생성하기
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// API 인스턴스 생성 - 커스텀 axios 인스턴스 사용
export let api = new APIApi(apiConfig, undefined, axiosInstance);

// API 재초기화 함수 - 토큰 변경 후 호출
export const reinitializeApi = () => {
  apiConfig = createApiConfig();
  api = new APIApi(apiConfig, undefined, axiosInstance);
};

// 재사용 가능한 API 설정을 내보냅니다
export { apiConfig, Configuration };

// 모델 타입 내보내기
export * from "./generated/models";
