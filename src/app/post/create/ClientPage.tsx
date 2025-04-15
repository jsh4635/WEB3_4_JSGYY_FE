"use client";

import { api } from "@/api";
import { APIApiUpdateImagesRequest } from "@/api/generated";
import { PostRequest } from "@/api/generated/models/post-request";
import { uploadImages } from "@/api/posts";
import { CATEGORIES } from "@/constants/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import { CreatePostFormData, createPostSchema } from "./schema";

export default function ClientPage() {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 한국 현지 시간으로 설정 (UTC+9)
  const formatToKST = (date: Date): string => {
    const offset = 9 * 60; // 한국 시간은 UTC+9
    const kstTime = new Date(date.getTime() + offset * 60000);
    return kstTime.toISOString();
  };

  const currentDate = new Date();
  const oneDayLater = new Date(currentDate);
  oneDayLater.setDate(currentDate.getDate() + 1);

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      category: undefined,
      price: 0,
      content: "",
      place: "",
      auctionStatus: false,
      auctionStartedAt: formatToKST(currentDate),
      auctionClosedAt: formatToKST(oneDayLater),
    },
  });

  const onSubmit = async (data: CreatePostFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // 게시글 생성을 위한 요청 데이터 준비
      const postData: PostRequest = {
        title: data.title,
        content: data.content,
        price: data.price,
        place: data.place,
        category: data.category,
        saleStatus: true,
        auctionStatus: data.auctionStatus,
        auctionRequest: data.auctionStatus
          ? {
              startedAt: data.auctionStartedAt || "",
              closedAt: data.auctionClosedAt || "",
            }
          : {
              startedAt: "2025-03-27T10:00:00",
              closedAt: "2025-04-10T10:00:00",
            },
      };

      // 1. OpenAPI Generator로 생성된 API 클라이언트로 게시글 생성 API 호출
      const response = await api.createPost({
        dTO: postData,
      });
      // FormData 객체 생성
      const formData = new FormData();

      // 이미지 파일들을 FormData에 추가
      images.forEach((img) => {
        formData.append(`images`, img.file);
      });

      const imageResponse = await api.updateImages(
        {
          postId: (response.data as any).postId,
          images: formData,
        } as unknown as APIApiUpdateImagesRequest,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // API 응답에서 메시지 추출
      let responseMessage = "게시글이 성공적으로 등록되었습니다.";
      try {
        // axios 응답에서 데이터 추출 시도
        const responseJson = response.request
          ? JSON.parse(response.request.responseText || "{}")
          : {};
        if (responseJson && responseJson.message) {
          responseMessage = responseJson.message;
        }
      } catch (err) {
        console.error("메시지 추출 중 오류:", err);
      }

      // 응답 메시지에서 게시글 ID 추출 (예: "1번 게시글이 작성되었습니다.")
      const postId = extractPostId(responseMessage);
      // const postId = 1;

      // if (!postId) {
      //   setErrorMessage(
      //     "게시글 ID를 추출할 수 없습니다. 이미지 업로드를 건너뜁니다.",
      //   );
      //   return;
      // } else if (images.length > 0) {
      //   try {
      //     // 이미지 파일을 File 형태로 전달
      //     const response = await api.updateImages({
      //       postId,
      //       images: images.map((img) => img.file),
      //     });

      //     if (!response) {
      //       throw new Error("이미지 업로드 응답이 없습니다.");
      //     }

      //     console.log("이미지 업로드 성공");
      //   } catch (uploadError) {
      //     console.error("이미지 업로드 중 오류:", uploadError);
      //     setErrorMessage(
      //       "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
      //     );
      //     return;
      //   }
      // }

      // 성공 메시지 표시
      // alert(responseMessage);

      // 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      setErrorMessage("게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 게시글 ID 추출 함수 (예: "1번 게시글이 작성되었습니다." -> 1)
  const extractPostId = (message: string): number | null => {
    const match = message.match(/(\d+)번 게시글/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-[800px]">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

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
                disabled={images.length >= 10 || isSubmitting}
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
                disabled={images.length >= 10 || isSubmitting}
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
                      disabled={isSubmitting}
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
                  <Input
                    placeholder="상품 제목을 입력하세요"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 카테고리 */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
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
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>가격</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="금액을 입력하세요"
                    value={value === 0 ? "" : value}
                    onChange={(e) => {
                      // 빈 문자열이면 0으로, 그렇지 않으면 입력된 숫자로 변환
                      const inputValue = e.target.value;
                      if (inputValue === "") {
                        onChange(0);
                      } else {
                        const numValue = Number(inputValue);
                        // 음수 입력 방지
                        onChange(numValue < 0 ? 0 : numValue);
                      }
                    }}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    onKeyDown={(e) => {
                      // 숫자, 화살표, 백스페이스, 탭, Delete 키만 허용
                      const allowedKeys = [
                        "0",
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Delete",
                        "Home",
                        "End",
                      ];

                      if (!allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={isSubmitting}
                    {...fieldProps}
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
                  <Input
                    placeholder="거래 희망 장소를 입력하세요"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 상품 설명 */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상품 설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="상품에 대한 자세한 설명을 입력하세요"
                    className="h-32"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 경매 여부 */}
          <FormField
            control={form.control}
            name="auctionStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>경매 여부</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    경매로 판매하시려면 체크해주세요
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* 경매 시간 설정 (경매 상태가 true일 때만 표시) */}
          {form.watch("auctionStatus") && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-medium">경매 시간 설정</h3>

              <FormField
                control={form.control}
                name="auctionStartedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경매 시작 시간</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        onChange={(e) => {
                          const inputDate = e.target.value; // 형식: "2025-04-15T10:00"
                          field.onChange(inputDate);
                        }}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auctionClosedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>경매 종료 시간</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        onChange={(e) => {
                          const inputDate = e.target.value; // 형식: "2025-04-15T10:00"
                          field.onChange(inputDate);
                        }}
                        value={field.value ?? ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
