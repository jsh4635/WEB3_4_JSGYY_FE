import { Post } from "@/types/post";

import { IMAGES } from "./images";

export const POST_LIST: Post[] = [
  {
    id: 1,
    title: "맥북 프로 M1 13인치 판매합니다",
    price: 1200000,
    saleStatus: true,
    createdAt: "2024-03-15T12:00:00",
    modifiedAt: "2024-03-15T12:00:00",
    thumbnail: IMAGES[1][0].thumbnail || "",
    content: "맥북 프로 M1 13인치 판매합니다. 상태 좋습니다.",
    authorId: 1,
    likes: 10,
  },
  {
    id: 2,
    title: "아디다스 트레이닝 조거 팬츠",
    price: 59000,
    saleStatus: true,
    thumbnail: IMAGES[2][0].thumbnail || "",
    createdAt: "2025-03-26T15:30:00",
    likes: 15,
    content:
      "아디다스 트레이닝 조거 팬츠 판매합니다. 사이즈 M, 택 포함 새 제품입니다.",
  },
  {
    id: 3,
    title: "뉴발란스 993 그레이",
    price: 339000,
    saleStatus: false,
    thumbnail: IMAGES[3][0].thumbnail || "",
    createdAt: "2025-03-22T09:15:00",
    likes: 42,
    content:
      "뉴발란스 993 그레이 US9 사이즈 판매합니다. 정품 구매 영수증 첨부 가능합니다.",
  },
  {
    id: 4,
    title: "스톤아일랜드 패치 맨투맨",
    price: 450000,
    saleStatus: true,
    thumbnail: IMAGES[4][0].thumbnail || "",
    createdAt: "2025-03-18T14:20:00",
    likes: 31,
    content:
      "스톤아일랜드 패치 맨투맨 L 사이즈입니다. 작년 겨울 구매 후 몇 번 착용했습니다.",
  },
  {
    id: 5,
    title: "폴로 랄프로렌 옥스포드 셔츠",
    price: 159000,
    saleStatus: true,
    thumbnail: IMAGES[5][0].thumbnail || "",
    createdAt: "2025-03-15T11:45:00",
    likes: 18,
    content:
      "폴로 랄프로렌 옥스포드 셔츠 화이트 컬러 M 사이즈입니다. 새 제품과 동일한 상태입니다.",
  },
  {
    id: 6,
    title: "메종마르지엘라 독일군 스니커즈",
    price: 585000,
    saleStatus: false,
    thumbnail: IMAGES[6][0].thumbnail || "",
    createdAt: "2025-03-10T16:50:00",
    likes: 56,
    content:
      "메종마르지엘라 독일군 스니커즈 화이트 42 사이즈입니다. 풀박스 구성품 모두 있습니다.",
  },
  {
    id: 7,
    title: "구찌 GG 마몬트 카드 지갑",
    price: 490000,
    saleStatus: true,
    thumbnail: IMAGES[7][0].thumbnail || "",
    createdAt: "2025-03-05T13:20:00",
    likes: 27,
    content:
      "구찌 GG 마몬트 카드 지갑 블랙 컬러입니다. 정품 보증서 및 더스트백 포함입니다.",
  },
  {
    id: 8,
    title: "톰브라운 클래식 셔츠",
    price: 890000,
    saleStatus: true,
    thumbnail: IMAGES[8][0].thumbnail || "",
    createdAt: "2025-03-01T09:10:00",
    likes: 19,
    content:
      "톰브라운 클래식 셔츠 사이즈 2입니다. 한 번 착용 후 보관 중이었습니다.",
  },
  {
    id: 9,
    title: "아크테릭스 베타 AR 재킷",
    price: 780000,
    saleStatus: false,
    thumbnail: IMAGES[9][0].thumbnail || "",
    createdAt: "2025-02-25T17:40:00",
    likes: 38,
    content:
      "아크테릭스 베타 AR 재킷 블랙 컬러 M 사이즈입니다. 작년 구매 후 몇 번 착용했습니다.",
  },
  {
    id: 10,
    title: "몽클레어 마야 패딩",
    price: 1950000,
    saleStatus: true,
    thumbnail: IMAGES[10][0].thumbnail || "",
    createdAt: "2025-02-22T11:30:00",
    likes: 64,
    content:
      "몽클레어 마야 패딩 네이비 컬러 사이즈 3입니다. 정품 택 및 인증 카드 모두 있습니다.",
  },
  {
    id: 11,
    title: "버버리 트렌치 코트",
    price: 2450000,
    saleStatus: true,
    thumbnail: IMAGES[11][0].thumbnail || "",
    createdAt: "2025-02-18T16:20:00",
    likes: 47,
    content:
      "버버리 트렌치 코트 클래식 핏 UK 사이즈 38입니다. 정품 구매 영수증 첨부 가능합니다.",
  },
  {
    id: 12,
    title: "생로랑 모노그램 카드홀더",
    price: 390000,
    saleStatus: false,
    thumbnail: IMAGES[12][0].thumbnail || "",
    createdAt: "2025-02-15T12:40:00",
    likes: 22,
    content:
      "생로랑 모노그램 카드홀더 블랙 컬러입니다. 풀박스 구성품 모두 있습니다.",
  },
  {
    id: 13,
    title: "발렌시아가 트리플S 스니커즈",
    price: 1290000,
    saleStatus: true,
    thumbnail: IMAGES[13][0].thumbnail || "",
    createdAt: "2025-02-10T09:30:00",
    likes: 51,
    content:
      "발렌시아가 트리플S 스니커즈 화이트 컬러 270 사이즈입니다. 정품 보증서 포함입니다.",
  },
  {
    id: 14,
    title: "프라다 나일론 백팩",
    price: 2100000,
    saleStatus: true,
    thumbnail: IMAGES[14][0].thumbnail || "",
    createdAt: "2025-02-05T15:10:00",
    likes: 33,
    content:
      "프라다 나일론 백팩 블랙 컬러입니다. 정품 구매 영수증 및 더스트백 포함입니다.",
  },
  {
    id: 15,
    title: "보테가 베네타 카세트 백",
    price: 3900000,
    saleStatus: false,
    thumbnail: IMAGES[15][0].thumbnail || "",
    createdAt: "2025-02-01T10:20:00",
    likes: 72,
    content:
      "보테가 베네타 카세트 백 블랙 컬러입니다. 정품 보증서 및 더스트백 포함입니다.",
  },
];
