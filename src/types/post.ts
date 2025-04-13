export interface Post {
  id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  createdAt: string;
  modifiedAt: string;
  images: string[];
  content: string;
  authorId: number;
  place: string;
  likes: number;
  reports?: number;
  chatCount?: number;
  liked?: boolean;
  auctionStatus?: boolean;
  category?: string;
}

export interface PostDetail extends Post {
  auctionStartedAt?: string;
  auctionClosedAt?: string;
  author?: boolean;
}

// 모의 데이터를 위한 Post 생성 함수
export function createMockPost(override?: Partial<Post>): Post {
  return {
    id: Math.floor(Math.random() * 1000),
    title: "모의 상품",
    price: 10000,
    saleStatus: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    images: ["/placeholder.jpg"],
    content: "이것은 모의 상품 설명입니다.",
    authorId: 1,
    place: "서울시 강남구",
    likes: Math.floor(Math.random() * 50),
    reports: 0,
    chatCount: Math.floor(Math.random() * 10),
    liked: false,
    auctionStatus: false,
    category: "기타",
    ...override,
  };
}

// 모의 데이터 생성 함수
export function createMockPosts(count: number = 10): Post[] {
  return Array(count)
    .fill(0)
    .map((_, index) =>
      createMockPost({
        id: index + 1,
        title: `모의 상품 ${index + 1}`,
        price: Math.floor(Math.random() * 100000) + 5000,
        images: [`/placeholder-${(index % 5) + 1}.jpg`],
      }),
    );
}
