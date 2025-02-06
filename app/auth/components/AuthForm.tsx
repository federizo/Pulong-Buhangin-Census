"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { loginWithEmailAndPassword } from "../actions";
import { AuthTokenResponse } from "@supabase/supabase-js";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password can not be empty" }),
});

export default function AuthForm() {
  const [isPending, startTransition] = useTransition();
  const [eye, setEye] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = (await loginWithEmailAndPassword(
        data
      )) as AuthTokenResponse;

      if (error) {
        toast({
          title: "Fail to login",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.message}</code>
            </pre>
          ),
        });
        setAttempt(attempt + 1);
      } else {
        toast({
          title: "Successfully login 🎉",
        });
      }
    });
  }

  return (
    <div className="flex h-screen w-screen bg-white">
      {/* Left Section (Black Background) - Visible Only on Desktop */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center rounded-r-full">
        <Image
          src="/images/census-logo.png" // Replace with actual logo path
          alt="Logo"
          width={300}
          height={300}
          className="mb-4"
        />
      </div>

      {/* Right Section (White Background) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 dark:bg-white">
        <div className="max-w-sm w-full text-center">
          {/* Logo for Mobile View (Hidden on Large Screens) */}
          <div className="lg:hidden flex justify-center mb-6">
            <Image
              src="/images/census-logo-black.png" // Replace with actual logo path
              alt="Mobile Logo"
              width={170}
              height={170}
            />
          </div>

          <h2 className="text-3xl font-semibold text-center text-zinc-700">
            Pulong Buhangin
          </h2>
          <h2 className="text-3xl font-semibold text-center mb-6 text-zinc-700">
            Census
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...form.register("email")}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 shadow-xl bg-white text-black dark:bg-white dark:text-black"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={eye ? "text" : "password"}
                placeholder="Password"
                {...form.register("password")}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 shadow-xl bg-white text-black dark:bg-white dark:text-black"
              />
              <span
                onClick={() => setEye(!eye)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {eye ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-900 flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Log In"
              )}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              {attempt >= 3 && (
                <div className="text-red-500">
                  Forgot your password? Please contact your administrator
                </div>
              )}
            </div>

            {/* Create Account */}
            {/* <div className="text-center">
              <button className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-300">
                Create new account
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
