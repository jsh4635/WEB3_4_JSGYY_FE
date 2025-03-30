"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
        "http://43.203.93.186:8080/api/auth/register",
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
        <FormItem className="relative">
          <FormLabel className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-gray-500">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative select-none">
              <Input
                type={showToggle ? (showToggle[0] ? "text" : "password") : type}
                placeholder={label}
                className="w-full rounded-xl border border-gray-300 px-4 pb-5 pt-6 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...field}
              />
              {showToggle &&
                (showToggle[0] ? (
                  <EyeOff
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={showToggle[1]}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={showToggle[1]}
                  />
                ))}
            </div>
          </FormControl>
          <FormMessage className="text-xs text-red-500 px-1" />
        </FormItem>
      )}
    />
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center select-none">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Sign up
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to enjoy the feature of Revolutie
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-6">
              {renderFloatingField("id", "Your id")}
              {renderFloatingField("password", "Password", "password", [
                showPassword,
                () => setShowPassword(!showPassword),
              ])}
              {renderFloatingField(
                "confirmPassword",
                "Confirm Password",
                "password",
                [showConfirm, () => setShowConfirm(!showConfirm)],
              )}
              {renderFloatingField("email", "Email")}
              {renderFloatingField("location", "Location")}
              {renderFloatingField("phoneNumber", "Phone Number")}
              {renderFloatingField("nickname", "Nickname")}
              {renderFloatingField("name", "Name")}
            </div>

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
