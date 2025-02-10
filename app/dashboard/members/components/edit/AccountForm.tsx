"use client";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import { IPermission } from "@/lib/types";
import { updateMemberAccountById } from "../../actions";

const FormSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value || /[A-Z]/.test(value), // ✅ Require at least one uppercase letter
        { message: "Password must contain at least one uppercase letter." }
      )
      .refine(
        (value) =>
          !value || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]/.test(value), // ✅ Require special character
        { message: "Password must contain at least one special character." }
      )
      .refine(
        (value) => !value || value.length >= 8, // ✅ Enforce minimum length
        { message: "Password must be at least 8 characters long." }
      ),
    confirm: z.string().optional(),
  })
  .refine((data) => !data.password || data.confirm === data.password, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function AccountForm({ permission }: { permission: IPermission }) {
  const [isPending, startTransition] = useTransition();
  const [eye, setEye] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: permission.member.email,
      password: "",
      confirm: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submitting data:", data);
    startTransition(async () => {
      try {
        const response = await updateMemberAccountById(permission.member_id, data);
        const { error } = JSON.parse(response);
        console.log("API Response:", response);

        if (error) {
          toast({
            title: "Failed to Update",
            description: error.message,
          });
        } else {
          toast({
            title: "Successfully Updated",
          });
          setEdit(true);
        }
      } catch (error) {
        toast({
          title: "Unexpected Error",
          description: String(error),
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={edit}
                  {...field}
                  placeholder="email@gmail.com"
                  type="email"
                />
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
      <FormLabel>New Password</FormLabel>
      <FormControl>
        <div className="flex items-center relative">
          <Input
            {...field}
            placeholder="Enter new password"
            type={eye ? "password" : "text"} // ✅ Toggle visibility
            className="bg-white dark:bg-slate-700 pr-10"
          />
          {/* ✅ Eye Icon - Toggle Password Visibility */}
          <span
            onClick={() => setEye(!eye)}
            className="absolute right-3 cursor-pointer"
          >
            {eye ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="confirm"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Confirm Password</FormLabel>
      <FormControl>
        <div className="flex items-center relative">
          <Input
            {...field}
            placeholder="Confirm password"
            type={eye ? "password" : "text"} // ✅ Toggle visibility
            className="bg-white dark:bg-slate-700 pr-10"
          />
          {/* ✅ Eye Icon - Toggle Password Visibility */}
          <span
            onClick={() => setEye(!eye)}
            className="absolute right-3 cursor-pointer"
          >
            {eye ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>



        <Button
          type="submit"
          className="flex items-center gap-2 w-full"
          variant="outline"
          disabled={isPending}
        >
          {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update"}
        </Button>
      </form>
    </Form>
  );
}
