"use client";

import { api } from "@/api";
import { CATEGORIES } from "@/constants/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import type { components } from "@/lib/backend/apiV1/schema";

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

type PostWithContentDto = components["schemas"]["PostWithContentDto"];
type PostGenFileDto = components["schemas"]["PostGenFileDto"];

interface ClientPageProps {
  post?: PostWithContentDto;
}

export default function ClientPage({ post }: ClientPageProps) {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [images, setImages] = useState<
    { url: string; file?: File; id?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        // 서버에서 받은 post 데이터 사용
        if (post) {
          // 폼 데이터 설정 (API에는 일부 정보가 없으므로 임의로 추가)
          const category = "digital"; // 임의 데이터
          const price = 850000; // 임의 데이터
          const place = "서울시 강남구"; // 임의 데이터

          form.reset({
            title: post.title,
            category: category,
            price: price,
            content: post.content,
            place: place,
          });

          // 여기에서 이미지 데이터도 서버에서 가져와야 함
          // TODO: 실제 API 연동 시 이미지 데이터 가져오기
          // 임시 이미지 데이터
          const mockGenFiles: PostGenFileDto[] = [
            {
              id: 1,
              createDate: new Date().toISOString(),
              modifyDate: new Date().toISOString(),
              postId: post.id,
              fileName: "image1.jpg",
              typeCode: "thumbnail",
              fileExtTypeCode: "jpg",
              fileExtType2Code: "image",
              fileSize: 12345,
              fileNo: 1,
              fileExt: "jpg",
              fileDateDir: "20231101",
              originalFileName: "original_image1.jpg",
              downloadUrl: "https://via.placeholder.com/800x800?text=이미지1",
              publicUrl: "https://via.placeholder.com/800x800?text=이미지1",
            },
          ];

          // 이미지 설정
          setImages(
            mockGenFiles.map((file) => ({
              id: file.id,
              url: file.publicUrl,
            })),
          );
        } else {
          // 서버에서 데이터를 전달받지 못한 경우 (비정상적인 상황)
          console.error("서버에서 전달받은 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("게시물 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId, form, post]);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      api.modifyPost({
        postId: parseInt(postId),
        postRequest: {
          title: data.title,
          content: data.content,
          price: data.price,
          category: data.category,
          place: data.place,
          saleStatus: true,
          auctionStatus: false,
          auctionRequest: undefined,
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
    </div>
  );
}
