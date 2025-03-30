export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

export interface PaginationParams {
  pageNum: number;
  size: number;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PostSearchParams extends PaginationParams {
  keyword?: string;
  place?: string;
  sortBy: string;
  order: "asc" | "desc";
  category?: string;
}

export interface AuctionRequest {
  startedAt: string;
  closedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  price: number;
  place: string;
  auctionStatus: boolean;
  auctionRequest?: AuctionRequest;
}

export interface UpdatePostRequest extends CreatePostRequest {
  saleStatus: boolean;
}

export interface ReportRequest {
  memberId: number;
  postId: number;
  title: string;
  content: string;
  type: "사기" | "욕설";
}

export interface ChatRoom {
  id: number;
  nickname: string;
}

export interface ChatMessage {
  id: number;
  memberId: number;
  chatroomId: number;
  content: string;
  createdAt: string;
}
