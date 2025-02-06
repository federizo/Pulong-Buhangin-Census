"use client";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation"; // Import useRouter

export default function SignOut() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize router

  const onSubmit = async () => {
    startTransition(async () => {
      await logout();
      router.push("/"); // Redirect to the landing page ("/")
    });
  };

  return (
    <form action={onSubmit}>
      <Button
        className="w-full flex items-center gap-2 dark:bg-gradient-dark bg-transparent outline-zinc-800"
        variant="outline"
      >
        Sign Out{" "}
        <AiOutlineLoading3Quarters
          className={cn("animate-spin", { hidden: !isPending })}
        />
      </Button>
    </form>
  );
}
