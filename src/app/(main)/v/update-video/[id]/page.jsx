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
import { updateVideoSchema } from "@/Schema/videoValidation/videoSchema";
import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdateVideo() {
  const { id } = useParams();

  if (!id) {
    return null;
  }
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      thumbnail: null,
    },
    resolver: zodResolver(updateVideoSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail);
    formData.append("videoId", id);

    try {
      console.log("data.thumbnail====>", data.thumbnail);
      const res = await axios.post("/api/update-video", formData);
      if (res.data) {
        toast.success("Update Video Successfully 🎉", {
          description: "Redirecting to Video...",
        });

        setTimeout(() => {
          router.replace(`/v/watch/${res.data.data._id}`);
        }, 800);
      }
    } catch (err) {
      toast.error("Update Failed ❌", {
        description: err?.response?.data?.message || "Something went Wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">Update Video</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Video title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Video description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target?.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating..." : "Update Video"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
