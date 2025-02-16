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
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Section (Animated Background) */}
      <motion.div
        initial={{ x: "-100%" }} // Start off-screen left
        animate={{ x: "0%" }} // Move into view
        transition={{ duration: 1, ease: "easeOut" }} // Smooth effect
        className="hidden lg:flex w-[60%] relative bg-white h-full overflow-hidden"
      >
        {/* Background Image */}
        <Image
          src="/images/Login BG.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="left" // Moves image slightly left
          className="opacity-50 rounded-r-full shadow-xl"
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
        initial={{ x: "100%" }} // Start off-screen right
        animate={{ x: "0%" }} // Move into view
        transition={{ duration: 1, ease: "easeOut" }} // Smooth effect
        className="w-full lg:w-[35%] flex items-center justify-center bg-white px-6 dark:bg-white"
      >
        <div className="max-w-sm w-full text-center mx-auto">
          {/* Logo for Mobile View */}
          <div className="lg:hidden flex justify-center mb-6">
            <Image
              src="/images/census-logo-black.png"
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

          {/* Login Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...form.register("email")}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 shadow-xl bg-white text-black"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={eye ? "text" : "password"}
                placeholder="Password"
                {...form.register("password")}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-zinc-200 shadow-xl bg-white text-black"
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

            {/* Forgot Password Message */}
            <div className="text-center">
              {attempt >= 3 && (
                <div className="text-red-500">
                  Forgot your password? Please contact your administrator
                </div>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
