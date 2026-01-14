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
import { accountDetailsUpdateSchema } from "@/Schema/userValidation/userSchema";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ChangeNameAndEmail() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
    },
    resolver: zodResolver(accountDetailsUpdateSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/account-details-update`, data);
      if (res) {
        const data = res.data.data.username;
        console.log(res.data.data);
        if (data) {
          toast.success("Fullname and email change successfully");
          setTimeout(() => {
            router.push(`/u/${data}`);
          }, 300);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-md mx-auto"
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Full name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Action */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full"
          >
            {isSubmitting ? "Updating..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
