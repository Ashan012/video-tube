"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { changeAvatarImageSchema } from "@/Schema/userValidation/userSchema";
import { useState } from "react";
import axios from "axios";

export default function changeCoverImage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(changeAvatarImageSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/change-avatar-image`, data);
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input type="file" placeholder="Avatar" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {isSubmitting ? (
          <Button type="submit">Submit</Button>
        ) : (
          <Button type="submit" disabled>
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
