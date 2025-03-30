export const CATEGORIES = [
  { value: "digital", label: "디지털/가전" },
  { value: "furniture", label: "가구/인테리어" },
  { value: "fashion", label: "패션/잡화" },
  { value: "beauty", label: "뷰티/미용" },
  { value: "books", label: "도서/음반" },
  { value: "sports", label: "스포츠/레저" },
  { value: "hobby", label: "취미/게임" },
  { value: "kids", label: "유아동/출산" },
  { value: "pets", label: "반려동물용품" },
  { value: "food", label: "식품" },
  { value: "plants", label: "식물" },
  { value: "etc", label: "기타" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
