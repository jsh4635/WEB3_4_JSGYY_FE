"use client";

import { updateMyProfile } from "@/api/wrappers/updateMyProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";

// 폼 유효성 검증 스키마 (회원가입과 유사하게 간소화)
const formSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
  phoneNum: z.string().min(1, "전화번호를 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL 파라미터에서 사용자 정보 가져오기
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      phoneNum: "",
      address: "",
    },
  });

  useEffect(() => {
    // URL 파라미터에서 사용자 정보 가져오기
    const nickname = searchParams.get("nickname") || "";
    const phoneNum = searchParams.get("phoneNum") || "";
    const address = searchParams.get("address") || "";

    // 폼 초기값 설정
    form.reset({
      nickname,
      phoneNum,
      address,
    });
  }, [searchParams, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // 프로필 업데이트 API 호출
      await updateMyProfile({
        nickname: values.nickname,
        phoneNum: values.phoneNum,
        address: values.address,
      });

      toast({
        title: "프로필 수정 완료",
        description: "프로필 정보가 성공적으로 수정되었습니다.",
      });

      // 마이페이지로 이동
      router.push("/member/me");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      toast({
        title: "프로필 수정 실패",
        description: "서버 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">프로필 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="닉네임을 입력하세요"
                        {...field}
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="전화번호를 입력하세요"
                        {...field}
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주소</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="주소를 입력하세요"
                        {...field}
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="min-w-[100px] h-11"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[100px] h-11"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
