import { ProductDetail } from "@/types/product";
import { IMAGES } from "./images";
import { PRODUCT_LIST } from "./product_list";

export const mockProductDetail: ProductDetail[] = PRODUCT_LIST.map((product) => {
  const images = IMAGES[product.id];
  return {
    id: product.id,
    authorId: Math.floor(Math.random() * 5) + 1,
    title: product.title,
    content: `${product.title}입니다. 상태 좋습니다.`,
    category: ["의류", "신발", "가방", "액세서리"][Math.floor(Math.random() * 4)],
    place: ["서울특별시_관악구_신림동", "서울특별시_강남구_역삼동", "서울특별시_송파구_잠실동"][Math.floor(Math.random() * 3)],
    price: product.price,
    saleStatus: product.saleStatus,
    auctionStatus: Math.random() > 0.5,
    auctionStartedAt: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : "",
    auctionClosedAt: Math.random() > 0.5 ? new Date(Date.now() + (7 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString() : "",
    likes: Math.floor(Math.random() * 300) + 50,
    reports: Math.floor(Math.random() * 3),
    createdAt: product.createdAt,
    modifiedAt: product.createdAt,
    isAuthor: Math.random() > 0.7,
    images: images
  };
}); 