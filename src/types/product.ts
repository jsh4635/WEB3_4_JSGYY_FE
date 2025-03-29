export interface Product {
  id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  thumbnail: string;
  createdAt: string;

  likes: number;
  content: string;
} 

export interface ProductDetail {
  id: number;
  authorId: number;
  title: string;
  content: string;
  category: string;
  place: string;
  price: number;
  saleStatus: boolean;
  auctionStatus: boolean;
  auctionStartedAt: string;
  auctionClosedAt: string;
  likes: number;
  reports: number;
  createdAt: string;
  modifiedAt: string;
  isAuthor: boolean;
  images: {
      attachmentId: number;
      fileName: string;
      filePath: string;
      fileSize: number;
  }[];
}