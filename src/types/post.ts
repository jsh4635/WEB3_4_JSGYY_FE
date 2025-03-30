export interface Post {
  id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  createdAt: string;
  modifiedAt: string;
  thumbnail: string;
  content: string;
  authorId: number;
  likes: number;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  images: string[];
  price: number;
  saleStatus: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  modifiedAt: string;
  userId: number;
}
