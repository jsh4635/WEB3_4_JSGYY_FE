import { CATEGORIES } from "@/constants/categories";
import { z } from "zod";

const categoryValues = CATEGORIES.map((cat) => cat.value);

export const createPostSchema = z.object({
  title: z
    .string()
    .min(2, "제목은 최소 2자 이상이어야 합니다")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  category: z.enum(categoryValues as [string, ...string[]], {
    required_error: "카테고리를 선택해주세요",
  }),
  price: z
    .number()
    .min(0, "가격은 0원 이상이어야 합니다")
    .max(100000000, "가격은 1억원을 초과할 수 없습니다"),
  content: z
    .string()
    .min(10, "상품 설명은 최소 10자 이상이어야 합니다")
    .max(1000, "상품 설명은 1000자를 초과할 수 없습니다"),
  place: z
    .string()
    .min(2, "거래 장소는 최소 2자 이상이어야 합니다")
    .max(100, "거래 장소는 100자를 초과할 수 없습니다"),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
