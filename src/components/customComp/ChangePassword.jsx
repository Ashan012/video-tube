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
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { changePasswordSchema } from "@/Schema/userValidation/userSchema";

export default function ChangePassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/change-password`, data);

      if (response) {
        toast.success("Password changed successfully 👏", {
          description: "Redirecting to home...",
        });
        setTimeout(() => router.replace("/"), 800);
      }
    } catch (error) {
      toast.error("Password update failed ❌", {
        description: error?.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex items-center justify-center px-4 bg-gray-50 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6"
      >
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-semibold">Change Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your password to keep your account secure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter old password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="new-password"
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
              className="w-full rounded-full mt-2 hover:bg-neutral-800"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
