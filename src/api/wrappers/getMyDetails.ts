import { ApiResponse } from "../custom-models/ApiResponse";
import { MyDetailsResponse } from "../custom-models/MyDetailsResponse";
import { api } from "../index";

export const getMyDetails = async (): Promise<MyDetailsResponse> => {
  const response = await api.myDetails();
  const result = (
    response as unknown as { data: ApiResponse<MyDetailsResponse> }
  ).data;
  return result.data;
};
