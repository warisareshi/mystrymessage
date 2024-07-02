"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@components/ui/use-toast";
import ApiResponse from "@/types/ApiResponse";
import { Button } from "@components/ui/button";
import { useDebounceCallback } from "usehooks-ts";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { verifySchema } from "@schemas";

export default function VerifyForm() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const [otp, setOtp] = useState("");

  const debounced = useDebounceCallback(setOtp, 300);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  useEffect(() => {
    const submitIt = async () => {
      try {
        const response = await axios.post<ApiResponse>("/api/verify-code", {
          username: params.username,
          code: otp,
        });

        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace("/sign-in");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setTimeout(() => {
          toast({
            title: "Verification Failed",
            description:
              axiosError.response?.data.message ??
              "An error occurred. Please try again.",
            variant: "destructive",
          });
        }, 10000);
      }
    };

    submitIt();
  }, [otp, params.username]); 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    value={otp}
                    onChange={(enteredOtp) => debounced(enteredOtp)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
