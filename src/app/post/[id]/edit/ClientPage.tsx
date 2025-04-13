"use client";

import { api } from "@/api";
import { CATEGORIES } from "@/constants/categories";
import { PostDetail } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ImagePlus, X } from "lucide-react";

import { CreatePostFormData, createPostSchema } from "../../create/schema";

export default function ClientPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [images, setImages] = useState<
    { url: string; file?: File; id?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auctionInfo, setAuctionInfo] = useState<{
    isAuction: boolean;
    auctionStartedAt?: string;
    auctionClosedAt?: string;
  }>({ isAuction: false });

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      category: undefined,
      price: 0,
      content: "",
      place: "",
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      const response = (await api.getPost({
        postId: parseInt(postId),
      })) as unknown as {
        data: PostDetail;
      };
      setIsLoading(false);

      if (response.data) {
        // 폼에 기존 게시글 데이터 설정
        form.reset({
          title: response.data.title || "",
          category: response.data.category || undefined,
          price: response.data.price || 0,
          content: response.data.content || "",
          place: response.data.place || "",
        });
        console.log(response.data.category);

        // 경매 정보 설정
        setAuctionInfo({
          isAuction: response.data.auctionStatus || false,
          auctionStartedAt: response.data.auctionStartedAt,
          auctionClosedAt: response.data.auctionClosedAt,
        });

        // // 이미지 데이터가 있으면 설정
        // if (response.data.imageUrls && response.data.imageUrls.length > 0) {
        //   const postImages = response.data.imageUrls.map((url, index) => ({
        //     url,
        //     id: index,
        //   }));
        //   setImages(postImages);
        // }
      }
    };
    fetchPost();
  }, [postId, form]);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      api.modifyPost({
        postId: parseInt(postId),
        dTO: {
          title: data.title,
          content: data.content,
          price: data.price,
          category: data.category,
          place: data.place,
          saleStatus: true,
          auctionStatus: auctionInfo.isAuction,
          // auctionRequest: undefined,
        },
      });

      // 수정 성공 후 상세 페이지로 이동
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; // 입력 초기화
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, index) => index !== indexToRemove);
      return newImages;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">데이터를 불러오는 중...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[800px]">
      <h1 className="text-2xl font-bold mb-6">상품 수정</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 이미지 업로드 */}
          <div className="space-y-4">
            <Label htmlFor="images">상품 이미지 (최대 10장)</Label>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-32 h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                onClick={() => document.getElementById("images")?.click()}
                disabled={images.length >= 10}
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">이미지 추가</span>
              </Button>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={images.length >= 10}
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`상품 이미지 ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white 
                        opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 제목 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input placeholder="상품 제목을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 카테고리 */}
          <FormField
            control={form.control}
            name="category"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 가격 */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>가격</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="가격을 입력하세요"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 거래 장소 */}
          <FormField
            control={form.control}
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>거래 장소</FormLabel>
                <FormControl>
                  <Input placeholder="거래 희망 장소를 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 상품 설명 */}
          <FormField
            control={form.control}
            name="content"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품 설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="상품에 대한 자세한 설명을 입력하세요"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 버튼 */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit">수정하기</Button>
          </div>
        </form>
      </Form>

      {/* 경매 정보 (읽기 전용) */}
      {auctionInfo.isAuction && (
        <div className="mt-8 space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-medium">경매 정보 (수정 불가)</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>경매 여부</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                {auctionInfo.isAuction ? "경매 진행중" : "일반 판매"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>경매 시작 시간</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                {auctionInfo.auctionStartedAt
                  ? new Date(auctionInfo.auctionStartedAt).toLocaleString(
                      "ko-KR",
                    )
                  : "정보 없음"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>경매 종료 시간</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                {auctionInfo.auctionClosedAt
                  ? new Date(auctionInfo.auctionClosedAt).toLocaleString(
                      "ko-KR",
                    )
                  : "정보 없음"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
