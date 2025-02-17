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
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password can not be empty" }),
});

export default function AuthForm() {
  const [isPending, startTransition] = useTransition();
  const [eye, setEye] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-900">
      {/* Left Section (Animated Background) */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden lg:flex w-[60%] relative bg-white dark:bg-zinc-900 h-full overflow-hidden"
      >
        {/* Background Image with Dynamic Opacity */}
        <Image
          src="/images/bg-1.png"
          alt="Background"
          layout="fill"
          width={3440}
          height={1440}
          objectFit="cover"
          objectPosition="left"
          className="rounded-r-full shadow-xl opacity-80 dark:opacity-30 "
        />

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/census-logo.png"
            alt="Logo"
            width={350}
            height={350}
            className="drop-shadow-lg"
          />
        </div>
      </motion.div>

      {/* Right Section (Login Form - Animates from Right to Left) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full lg:w-[35%] flex items-center justify-center bg-white dark:bg-zinc-900 px-6"
      >
        <div className="max-w-sm w-full text-center mx-auto">
          {/* Mobile Logo Transition (Fixes Missing Logo) */}
          <div className="lg:hidden flex justify-center mb-6">
            {mounted && (
              <Image
                src={
                  currentTheme === "dark"
                    ? "/images/PB-LOGO-white.png"
                    : "/images/census-logo-black.png"
                }
                alt="Mobile Logo"
                width={170}
                height={170}
                className="transition-all duration-500 ease-in-out"
              />
            )}
          </div>

          <h2 className="text-3xl font-semibold text-center text-zinc-700 dark:text-white">
            Pulong Buhangin
          </h2>
          <h2 className="text-3xl font-semibold text-center mb-6 text-zinc-700 dark:text-white">
            Census
          </h2>

          {/* Login Form */}
          <form className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 dark:focus:ring-gray-700 shadow-xl bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 dark:focus:ring-gray-700 shadow-xl bg-white text-black dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded-md hover:bg-blue-900 flex items-center justify-center gap-2 dark:bg-blue-800 dark:hover:bg-blue-600"
            >
              Log In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
