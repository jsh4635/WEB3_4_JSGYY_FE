"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import * as z from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createLoginMember,
  useGlobalLoginMember,
} from "@/stores/auth/loginMember";

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
      const response = await fetch("http://43.203.93.186:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.id,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "로그인 실패",
          description: data.message || "로그인 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }
      setLoginMember(createLoginMember());

      toast({
        title: "로그인 성공",
        description: "로그인이 완료되었습니다.",
      });

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast({
        title: "로그인 실패",
        description: "서버 오류가 발생했습니다.",
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

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 opacity-50 cursor-not-allowed select-none"
              disabled
            >
              <FaGoogle className="h-5 w-5" />
              Google로 로그인
            </Button>

            <Button
              className="w-full bg-yellow-400 text-black flex items-center justify-center gap-2 opacity-50 cursor-not-allowed select-none"
              disabled
            >
              카카오 로그인
            </Button>

            <Button
              className="w-full bg-green-500 text-white flex items-center justify-center gap-2 opacity-50 cursor-not-allowed select-none"
              disabled
            >
              <SiNaver className="h-5 w-5" />
              네이버 로그인
            </Button>
          </div>
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
