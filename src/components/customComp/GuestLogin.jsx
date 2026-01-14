import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export function GuestLogin({ isSubmitting, setIsSubmitting }) {
  const router = useRouter();

  const guestLogin = async () => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: process.env.NEXT_PUBLIC_USERNAME,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      });

      if (response?.ok) {
        toast.success("Welcome back 👋", {
          description: "Redirecting to home...",
        });
        setTimeout(() => router.replace("/"), 300);
      } else {
        toast.error("Login failed ❌", {
          description: "Invalid username or password",
        });
      }
    } catch (error) {
      toast.error("Something went wrong ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center mb-3">
      <button
        disabled={isSubmitting}
        onClick={guestLogin}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-black bg-white text-black font-semibold shadow hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging in..." : "Guest Login"}
      </button>
    </div>
  );
}
