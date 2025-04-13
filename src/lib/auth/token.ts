import { MyDetailsResponse } from "@/api/custom-models/MyDetailsResponse";

export function parseAccessToken(accessToken: string | undefined) {
  let isAccessTokenExpired = true;
  let accessTokenPayload = null;

  if (accessToken) {
    try {
      const tokenParts = accessToken.split(".");
      accessTokenPayload = JSON.parse(
        Buffer.from(tokenParts[1], "base64").toString(),
      );
      const expTimestamp = accessTokenPayload.exp * 1000;
      isAccessTokenExpired = Date.now() > expTimestamp;
    } catch (e) {
      console.error("토큰 파싱 중 오류 발생:", e);
    }
  }

  const isLogin =
    typeof accessTokenPayload === "object" && accessTokenPayload !== null;

  const me: MyDetailsResponse | null = isLogin
    ? {
        id: accessTokenPayload.id,
        name: accessTokenPayload.name,
        username: accessTokenPayload.username,
        password: accessTokenPayload.password,
        password2: accessTokenPayload.password2,
        nickname: accessTokenPayload.nickname,
        email: accessTokenPayload.email,
        phoneNum: accessTokenPayload.phoneNum,
        role: accessTokenPayload.role,
        address: accessTokenPayload.address,
      }
    : {
        id: 0,
        name: "",
        username: "",
        password: "",
        password2: "",
        nickname: "",
        email: "",
        phoneNum: "",
        role: "",
        address: "",
      };

  return { isLogin, isAccessTokenExpired, accessTokenPayload, me };
}
