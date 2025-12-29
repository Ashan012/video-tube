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
import { accountDetailsUpdateSchema } from "@/Schema/userValidation/userSchema";
import { useState } from "react";
import axios from "axios";

export default function changePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(accountDetailsUpdateSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/account-details-update`, data);
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="fullname" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
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
