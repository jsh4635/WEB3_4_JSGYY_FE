"use client";

import { api, reinitializeApi } from "@/api";
import { setToken } from "@/api/auth";
import { LoginDto } from "@/api/generated/models";
import { getMyDetails } from "@/api/wrappers/getMyDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalLoginMember } from "@/stores/auth/loginMember";

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

import { Eye, EyeOff, User } from "lucide-react";

const formSchema = z.object({
  id: z.string().min(1, "아이디를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export default function LoginPage() {
  const router = useRouter();
  const { setLoginMember } = useGlobalLoginMember();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const loginDto: LoginDto = {
        username: values.id,
        password: values.password,
      };

      const response = await api.login({ loginDto });

      if (response.status === 200) {
        const accessToken = response.headers.access;
        if (accessToken) {
          setToken(accessToken);
          reinitializeApi();
        }

        try {
          const userInfo = await getMyDetails();
          setLoginMember(userInfo);
        } catch (error) {
          console.error("회원정보 조회 오류:", error);
        }

        toast({
          title: "로그인 성공",
          description: "로그인이 완료되었습니다.",
        });

        router.push("/");
      } else {
        toast({
          title: "로그인 실패",
          description: "로그인에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      toast({
        title: "로그인 실패",
        description: "아이디 또는 비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 select-none">
            Bid & Buy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="select-none">아이디</FormLabel>
                    <FormControl>
                      <div className="relative select-none">
                        <Input
                          placeholder="아이디를 입력하세요"
                          className="pr-10"
                          {...field}
                        />
                        <User className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="select-none">비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative select-none">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호를 입력하세요"
                          className="pr-10"
                          {...field}
                        />
                        {showPassword ? (
                          <EyeOff
                            className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black text-white rounded-full select-none"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/member/signup"
                className="text-blue-600 hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
