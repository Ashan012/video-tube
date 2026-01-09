"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { signInSchema } from "@/Schema/userValidation/userSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.username,
        password: data.password,
      });

      if (response?.ok) {
        toast.success("Welcome back 👋", {
          description: "Redirecting to home...",
        });

        setTimeout(() => {
          router.replace("/");
        }, 300);
      } else {
        toast.error("Login failed ❌", {
          description: "Invalid username or password",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-semibold text-center mb-1">Sign In</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Welcome back to BeeTube
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/sign-up")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
