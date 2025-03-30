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

export interface PostDetail extends Post {
  images: string[];
  place: string;
  modifiedAt: string;
  likeCount: number;
}
