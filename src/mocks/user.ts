import { User, UserDetail } from "@/types/user";

export const mockUser: User = {
  id: 1,
  name: "홍길동",
  nickname: "길동이",
  email: "hong@example.com",
  blocked: false,
  createdAt: "2024-03-21T12:00:00",
  address: "서울특별시 강남구",
  phoneNumber: "010-1234-5678",
  profileImage:
    "https://cdn.pixabay.com/photo/2025/03/16/23/28/bat-eared-fox-9474647_1280.jpg",
};

export const mockUserDetail: UserDetail = {
  ...mockUser,
  isAdmin: false,
};
