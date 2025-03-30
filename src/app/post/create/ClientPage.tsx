"use client";

import { CATEGORIES } from "@/constants/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

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

import { CreatePostFormData, createPostSchema } from "./schema";

export default function ClientPage() {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);

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

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      // TODO: API 연동
      console.log("Form submitted:", {
        ...data,
        images: images.map((img) => img.file),
      });

      // 임시로 목록 페이지로 이동
      router.push("/post/list");
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-[800px]">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>

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
            <Button type="submit">등록하기</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
