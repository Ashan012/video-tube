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
import { changeAvatarImageSchema } from "@/Schema/userValidation/userSchema";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ChangeAvatar() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(changeAvatarImageSchema),
    defaultValues: {
      avatar: null,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("avatar", data.avatar);

    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/change-avatar-image`, formData);

      if (res) {
        const data = res.data.data.username;
        if (data) {
          toast.success("avatar upload successfully");
          setTimeout(() => {
            router.push(`/u/${data}`);
          }, 300);
        }
      }
    } catch (error) {
      toast.error("Avatar update failed", {
        description: error?.response?.data?.message || "Something went wrong",
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
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6"
      >
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-xl font-semibold">Change profile picture</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a clear image for better visibility
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar Input */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    New avatar
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Action */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full"
            >
              {isSubmitting ? "Updating..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
