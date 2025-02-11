"use client";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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
import { toast } from "@/components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMember } from "../../actions";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    role: z.enum(["user", "admin"]),
    status: z.enum(["active", "resigned"]),
    email: z.string().email(),
    password: z
      .string()
      .optional()
      .refine(
        (value) => !value || /[A-Z]/.test(value), // ✅ Require at least one uppercase letter
        { message: "Password must contain at least one uppercase letter." }
      )
      .refine(
        (value) => !value || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]/.test(value), // ✅ Require special character
        { message: "Password must contain at least one special character." }
      )
      .refine(
        (value) => !value || value.length >= 8, // ✅ Enforce minimum length
        { message: "Password must be at least 8 characters long." }
      ),
    confirm: z.string().min(6, { message: "Password should be 6 characters" }),
    agentId: z.string().min(6, { message: "Agent ID must be 6 digits." }),
    permission: z.array(z.string()),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Passowrd doesn't match",
    path: ["confirm"],
  });

export default function MemberForm() {
  const [isPending, startTransition] = useTransition();
  const [eye, setEye] = useState<boolean>(false);

  const roles = ["admin", "user"];
  const status = ["active", "resigned"];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      role: "user",
      status: "active",
      email: "",
      agentId: "",
      permission: [],
    },
  });

  useEffect(() => {
    const generateAgentId = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // ✅ Always return a string
    };
    form.setValue("agentId", generateAgentId());
  }, [form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await createMember(data);
      if (result.success) {
        toast({
          title: result.message,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white"> </code>
            </pre>
          ),
        });
        location.reload();
      } else {
        document.getElementById("create-trigger")?.click();
        const response = await createMember(data);
        toast({
          title: response.message,
        });
      }
    });
  }

  const permission = ["item1", "item2", "item3", "item4", "item5"];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 "
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@gmail.com"
                  type="text"
                  {...field}
                  onChange={field.onChange}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex gap-1 items-center rounded-md relative">
                  <Input
                    placeholder="******"
                    {...field}
                    type={!eye ? "password" : "text"}
                    className="border-[1px] bg-white dark:bg-slate-700 outline-none mr-1"
                  />
                  <a
                    onClick={() => setEye(!eye)}
                    className="absolute right-4 cursor-pointer"
                  >
                    {!eye ? <FaEye /> : <FaEyeSlash />}
                  </a>
                </div>
                {/* <Input
                  placeholder="******"
                  type="password"
                  onChange={field.onChange}
                /> */}
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
                <div className="flex gap-1 items-center rounded-md relative">
                  <Input
                    placeholder="******"
                    {...field}
                    type={!eye ? "password" : "text"}
                    className="border-[1px] bg-white dark:bg-slate-700 outline-none mr-1"
                  />
                  <a
                    onClick={() => setEye(!eye)}
                    className="absolute right-4 cursor-pointer"
                  >
                    {!eye ? <FaEye /> : <FaEyeSlash />}
                  </a>
                </div>
                {/* <Input
                  placeholder="******"
                  type="password"
                  onChange={field.onChange}
                /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="display name" onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent ID</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormDescription>
                This is your unique 6-digit Agent ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role, index) => {
                    return (
                      <SelectItem value={role} key={index}>
                        {role === "user" ? "enumerator" : "admin"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.map((status, index) => {
                    return (
                      <SelectItem value={status} key={index}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                status resign mean the user is no longer work here.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full flex gap-2 items-center"
          variant="outline"
        >
          Submit{" "}
          <AiOutlineLoading3Quarters
            className={cn("animate-spin", { hidden: !isPending })}
          />
        </Button>
      </form>
    </Form>
  );
}
