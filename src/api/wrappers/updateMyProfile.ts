import { api } from "@/api";
import { OneData } from "@/api/generated/models";

interface UserProfileData {
  nickname?: string;
  phoneNum?: string;
  address?: string;
}

/**
 * 사용자 프로필 업데이트 함수
 * 닉네임, 전화번호, 주소를 모두 업데이트합니다.
 * 각 필드는 별도의 API 호출로 수행됩니다.
 */
export const updateMyProfile = async (data: UserProfileData): Promise<void> => {
  try {
    const updatePromises = [];

    if (data.nickname !== undefined) {
      const nicknameData: OneData = { data: data.nickname };
      updatePromises.push(
        api.modifyMyDetails({
          category: "nickname",
          oneData: nicknameData,
        }),
      );
    }

    if (data.phoneNum !== undefined) {
      const phoneNumData: OneData = { data: data.phoneNum };
      updatePromises.push(
        api.modifyMyDetails({
          category: "phoneNum",
          oneData: phoneNumData,
        }),
      );
    }

    if (data.address !== undefined) {
      const addressData: OneData = { data: data.address };
      updatePromises.push(
        api.modifyMyDetails({
          category: "address",
          oneData: addressData,
        }),
      );
    }

    // 모든 업데이트 요청 실행
    await Promise.all(updatePromises);
    console.log("프로필 업데이트 완료");
  } catch (error) {
    console.error("프로필 업데이트 중 오류 발생:", error);
    throw error;
  }
};
