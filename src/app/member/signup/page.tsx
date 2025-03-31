"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useRouter } from "next/navigation";

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

import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    id: z.string().min(1, "ID를 입력해주세요."),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    confirmPassword: z.string().min(6, "비밀번호를 확인해주세요."),
    email: z.string().email("유효한 이메일을 입력해주세요."),
    location: z.string().min(1, "지역을 입력해주세요."),
    phoneNumber: z.string().min(1, "전화번호를 입력해주세요."),
    nickname: z.string().min(1, "닉네임을 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
      confirmPassword: "",
      email: "",
      location: "",
      phoneNumber: "",
      nickname: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        "https://43.203.93.186.sslip.io/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            username: values.id,
            password: values.password,
            password2: values.confirmPassword,
            nickname: values.nickname,
            email: values.email,
            phone_num: values.phoneNumber,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "회원가입 실패",
          description: data.message || "회원가입 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다.",
      });

      router.push("/member/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast({
        title: "회원가입 실패",
        description: "서버 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const renderFloatingField = (
    name: keyof z.infer<typeof formSchema>,
    label: string,
    type: string = "text",
    showToggle?: [boolean, () => void],
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="select-none">{label}</FormLabel>
          <FormControl>
            <div className="relative select-none">
              <Input
                type={showToggle ? (showToggle[0] ? "text" : "password") : type}
                placeholder={`${label}를 입력하세요`}
                className="pr-10"
                {...field}
              />
              {showToggle &&
                (showToggle[0] ? (
                  <EyeOff
                    className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={showToggle[1]}
                  />
                ) : (
                  <Eye
                    className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={showToggle[1]}
                  />
                ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="flex items-center justify-center py-10 bg-white">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 select-none">
            Bid & Buy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {renderFloatingField("id", "아이디")}
                {renderFloatingField("password", "비밀번호", "password", [
                  showPassword,
                  () => setShowPassword(!showPassword),
                ])}
                {renderFloatingField(
                  "confirmPassword",
                  "비밀번호 확인",
                  "password",
                  [showConfirm, () => setShowConfirm(!showConfirm)],
                )}
                {renderFloatingField("email", "이메일")}
                {renderFloatingField("location", "지역")}
                {renderFloatingField("phoneNumber", "전화번호")}
                {renderFloatingField("nickname", "닉네임")}
                {renderFloatingField("name", "이름")}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white rounded-full select-none"
              >
                회원가입
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
