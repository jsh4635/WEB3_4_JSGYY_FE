export interface ApiMessage {
  id: number;
  member_id: number;
  chatroom_id: number;
  content: string;
  create_at: string;
}

const messages: Record<string, ApiMessage[]> = {
  "1": [
    {
      id: 1,
      member_id: 2,
      chatroom_id: 1,
      content: "안녕하세요",
      create_at: "2025-03-24T10:15:00",
    },
    {
      id: 2,
      member_id: 1,
      chatroom_id: 1,
      content: "안녕하세요",
      create_at: "2025-03-24T10:16:00",
    },
    {
      id: 3,
      member_id: 2,
      chatroom_id: 1,
      content: "무슨일이세요?",
      create_at: "2025-03-24T10:17:00",
    },
    {
      id: 4,
      member_id: 1,
      chatroom_id: 1,
      content:
        "개인정보 이용내역 안내에 대해 궁금한 점이 있어서 연락드렸습니다.",
      create_at: "2025-03-24T10:18:00",
    },
    {
      id: 5,
      member_id: 2,
      chatroom_id: 1,
      content:
        "개인정보 이용내역 안내\n\n안녕하세요.\n\n번개장터를 사용해주시는 회원님께 깊은 감사를 드립니다.",
      create_at: "2025-03-24T10:20:00",
    },
  ],
  "2": [
    {
      id: 21,
      member_id: 1,
      chatroom_id: 2,
      content: "안녕하세요, 구매했던 상품 잘 받았습니다!",
      create_at: "2024-04-28T13:05:00",
    },
    {
      id: 22,
      member_id: 2,
      chatroom_id: 2,
      content: "안녕하세요! 물건은 마음에 드셨나요?",
      create_at: "2024-04-28T13:15:00",
    },
    {
      id: 23,
      member_id: 1,
      chatroom_id: 2,
      content: "네, 정말 좋아요. 다음에도 좋은 거래 부탁드립니다!",
      create_at: "2024-04-28T13:45:00",
    },
    {
      id: 24,
      member_id: 2,
      chatroom_id: 2,
      content: "감사합니다!! 좋은하루되세요!!",
      create_at: "2024-04-28T14:20:00",
    },
    {
      id: 25,
      member_id: 1,
      chatroom_id: 2,
      content: "또 다른 상품도 나오면 알려주세요~",
      create_at: "2024-04-28T14:30:00",
    },
  ],
  "3": [
    {
      id: 3,
      member_id: 2,
      chatroom_id: 3,
      content: "물건 잘 받았습니다",
      create_at: "2024-04-25T11:15:00",
    },
  ],
  "4": [
    {
      id: 41,
      member_id: 2,
      chatroom_id: 4,
      content: "상품 포장해서 오늘 보내드렸습니다.",
      create_at: "2024-04-19T10:30:00",
    },
    {
      id: 42,
      member_id: 1,
      chatroom_id: 4,
      content: "감사합니다! 운송장 번호 알 수 있을까요?",
      create_at: "2024-04-19T11:05:00",
    },
    {
      id: 43,
      member_id: 2,
      chatroom_id: 4,
      content: "123456789 입니다. 내일 도착 예정이에요.",
      create_at: "2024-04-19T11:15:00",
    },
    {
      id: 44,
      member_id: 1,
      chatroom_id: 4,
      content: "상품 잘 받았습니다! 설명대로 좋네요.",
      create_at: "2024-04-20T15:30:00",
    },
    {
      id: 45,
      member_id: 2,
      chatroom_id: 4,
      content: "거래 완료되었습니다",
      create_at: "2024-04-20T16:45:00",
    },
  ],
  "5": [
    {
      id: 5,
      member_id: 2,
      chatroom_id: 5,
      content: "상품 상태 확인 부탁드립니다",
      create_at: "2024-04-18T13:10:00",
    },
  ],
  "6": [
    {
      id: 6,
      member_id: 2,
      chatroom_id: 6,
      content: "배송 완료되었습니다",
      create_at: "2024-04-15T09:25:00",
    },
  ],
  "7": [
    {
      id: 71,
      member_id: 2,
      chatroom_id: 7,
      content: "가격 협의 가능하신가요?",
      create_at: "2024-04-10T18:30:00",
    },
    {
      id: 72,
      member_id: 1,
      chatroom_id: 7,
      content: "네, 얼마 정도 생각하고 계신가요?",
      create_at: "2024-04-10T18:45:00",
    },
    {
      id: 73,
      member_id: 2,
      chatroom_id: 7,
      content: "15만원에 가능할까요?",
      create_at: "2024-04-10T18:50:00",
    },
    {
      id: 74,
      member_id: 1,
      chatroom_id: 7,
      content: "음... 18만원까지는 가능할 것 같습니다.",
      create_at: "2024-04-10T19:05:00",
    },
    {
      id: 75,
      member_id: 2,
      chatroom_id: 7,
      content: "17만원은 어떠신가요?",
      create_at: "2024-04-10T19:15:00",
    },
    {
      id: 76,
      member_id: 1,
      chatroom_id: 7,
      content: "좋습니다! 그 가격에 판매하겠습니다.",
      create_at: "2024-04-10T19:30:00",
    },
  ],
  "8": [
    {
      id: 8,
      member_id: 2,
      chatroom_id: 8,
      content: "거래 감사합니다",
      create_at: "2024-04-05T15:40:00",
    },
  ],
  "9": [
    {
      id: 91,
      member_id: 2,
      chatroom_id: 9,
      content: "상품 사진 더 보내주실 수 있나요? 상태가 궁금합니다.",
      create_at: "2024-03-30T10:05:00",
    },
    {
      id: 92,
      member_id: 1,
      chatroom_id: 9,
      content: "네, 물론이죠! 어떤 부분이 궁금하신가요?",
      create_at: "2024-03-30T10:15:00",
    },
    {
      id: 93,
      member_id: 2,
      chatroom_id: 9,
      content: "뒷면하고 사용감이 있는지 궁금합니다.",
      create_at: "2024-03-30T10:20:00",
    },
    {
      id: 94,
      member_id: 1,
      chatroom_id: 9,
      content: "지금 사진 찍어서 보내드리겠습니다. 조금만 기다려주세요.",
      create_at: "2024-03-30T10:25:00",
    },
    {
      id: 95,
      member_id: 1,
      chatroom_id: 9,
      content:
        "[사진] 뒷면 상태입니다. 사용감은 거의 없고 새 제품에 가깝습니다.",
      create_at: "2024-03-30T10:30:00",
    },
    {
      id: 96,
      member_id: 2,
      chatroom_id: 9,
      content: "감사합니다! 상태가 좋네요. 구매하겠습니다.",
      create_at: "2024-03-30T10:40:00",
    },
  ],
  "10": [
    {
      id: 10,
      member_id: 2,
      chatroom_id: 10,
      content: "택배 발송 부탁드립니다. 주소는 보내드린 대로 맞습니다.",
      create_at: "2024-03-25T11:20:00",
    },
  ],
  "11": [
    {
      id: 11,
      member_id: 2,
      chatroom_id: 11,
      content: "오늘 거래 가능하신가요? 저녁 7시에 가능할까요?",
      create_at: "2024-03-20T14:15:00",
    },
  ],
  "12": [
    {
      id: 12,
      member_id: 2,
      chatroom_id: 12,
      content: "할인 가능하신가요? 2만원에 구매하고 싶습니다.",
      create_at: "2024-03-15T17:30:00",
    },
  ],
  "13": [
    {
      id: 131,
      member_id: 2,
      chatroom_id: 13,
      content: "상품 구매 원합니다. 직거래 가능하신가요?",
      create_at: "2024-03-10T09:45:00",
    },
    {
      id: 132,
      member_id: 1,
      chatroom_id: 13,
      content: "네, 직거래 가능합니다. 어느 지역이신가요?",
      create_at: "2024-03-10T10:00:00",
    },
    {
      id: 133,
      member_id: 2,
      chatroom_id: 13,
      content: "강남역 근처입니다. 혹시 가능하신가요?",
      create_at: "2024-03-10T10:10:00",
    },
    {
      id: 134,
      member_id: 1,
      chatroom_id: 13,
      content: "네, 강남역 근처 괜찮습니다. 언제 시간 되세요?",
      create_at: "2024-03-10T10:20:00",
    },
    {
      id: 135,
      member_id: 2,
      chatroom_id: 13,
      content: "내일 오후 6시는 어떠세요?",
      create_at: "2024-03-10T10:30:00",
    },
    {
      id: 136,
      member_id: 1,
      chatroom_id: 13,
      content: "내일 오후 6시 좋습니다. 강남역 2번 출구 앞에서 만날까요?",
      create_at: "2024-03-10T10:40:00",
    },
    {
      id: 137,
      member_id: 2,
      chatroom_id: 13,
      content: "네, 좋습니다! 내일 뵙겠습니다.",
      create_at: "2024-03-10T10:45:00",
    },
  ],
};

export const getChatMessages = (roomId: string): ApiMessage[] => {
  return messages[roomId] || [];
};
