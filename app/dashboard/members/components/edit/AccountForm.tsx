"use client";

import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import { toast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IPermission } from "@/lib/types";
import { updateMemberAccountById } from "../../actions";

const FormSchema = z
  .object({
    email: z.string().email(),
    agentId: z.string().min(6, { message: "Agent ID must be 6 digits." }),
    password: z
      .string()
      .optional()
      .refine((value) => !value || /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine(
        (value) => !value || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]/.test(value),
        {
          message: "Password must contain at least one special character.",
        }
      )
      .refine((value) => !value || value.length >= 8, {
        message: "Password must be at least 8 characters long.",
      }),
    confirm: z.string().optional(),
  })
  .refine((data) => !data.password || data.confirm === data.password, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function AccountForm({
  permission,
}: {
  permission: IPermission;
}) {
  const [isPending, startTransition] = useTransition();
  const [eye, setEye] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(true);

  // ✅ Debugging: Check if `agentId` exists
  console.log("Permission Object:", JSON.stringify(permission, null, 2));
  console.log("Agent ID:", permission?.member?.agentId);

  // ✅ Set initial values properly
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: permission?.member?.email || "",
      password: "",
      confirm: "",
      agentId: String(permission?.agent_id || ""), // ✅ Fix: Use correct path
    },
    mode: "onChange", // ✅ Allows reactivity
  });

  // ✅ Ensure `agentId` updates when `permission` is available
  useEffect(() => {
    if (permission?.agent_id) {
      console.log("Updating Agent ID in Form:", permission.agent_id);
      form.setValue("agentId", String(permission.agent_id), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [permission?.agent_id, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submitting data:", data);
    startTransition(async () => {
      try {
        const response = await updateMemberAccountById(
          permission.member_id,
          data
        );
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
        {/* Email Field */}
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

        {/* Agent ID Field - Read Only */}
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || permission?.agentId || ""}
                  disabled
                  readOnly
                  className=" cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
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
                    type={eye ? "text" : "password"}
                    className="bg-white dark:bg-slate-700 pr-10"
                  />
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

        {/* Confirm Password Field */}
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
                    type={eye ? "text" : "password"}
                    className="bg-white dark:bg-slate-700 pr-10"
                  />
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="flex items-center gap-2 w-full"
          variant="outline"
          disabled={isPending}
        >
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}
