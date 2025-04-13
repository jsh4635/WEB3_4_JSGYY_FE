export const CATEGORIES = [
  { value: "남성의류", label: "남성의류" },
  { value: "여성의류", label: "여성의류" },
  { value: "디지털/가전", label: "디지털/가전" },
  { value: "가구/인테리어", label: "가구/인테리어" },
  { value: "패션/잡화", label: "패션/잡화" },
  { value: "뷰티/미용", label: "뷰티/미용" },
  { value: "도서/음반", label: "도서/음반" },
  { value: "스포츠/레저", label: "스포츠/레저" },
  { value: "취미/게임", label: "취미/게임" },
  { value: "유아동/출산", label: "유아동/출산" },
  { value: "반려동물용품", label: "반려동물용품" },
  { value: "식품", label: "식품" },
  { value: "식물", label: "식물" },
  { value: "기타", label: "기타" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
