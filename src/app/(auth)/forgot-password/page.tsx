"use client";

import { MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import AuthBanner from "@/components/AuthBanner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../../lib/api/auth";
import axios from "axios";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .pipe(z.email("Invalid email format")),
  });
  type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const errorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 404:
        return "Email not found";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };

  const handleSubmit = async (data: ForgotPasswordSchema) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword(data.email);
      setSuccess(true);
      toast.success("Reset link sent successfully");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status ?? 500));
        toast.error(errorMessage(e.response?.status ?? 500));
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`my-auto flex h-screen w-full flex-col items-center justify-center bg-[#FFF5F8] lg:flex-row`}
    >
      <AuthBanner />
      <div className="form mx-auto flex w-full flex-col items-center justify-center text-[#6C4735] lg:w-[50%]">
        <div className="w-full max-w-md px-4">
          <Link
            href="/login"
            className="text-left text-sm text-pink-500 hover:underline"
          >
            ← Back to Login
          </Link>
          <h1 className="mb-1 text-2xl font-black">Forgot Password? 🔒</h1>
          <p className="mb-6 text-sm">
            No worries! Enter your email and we&apos;ll send a reset link.
          </p>
          {error && <AuthErrorMessage error={error} />}
          {/* FORM */}
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={`space-y-3 ${success ? "hidden" : ""}`}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {success && (
            <div className="text-center">
              <div className="mb-4 text-6xl">📧</div>
              <h3 className="mb-2 text-xl font-black">Reset Link Sent!</h3>
              <p className="mb-2 text-sm">
                Check your inbox at{" "}
                <strong>{form.getValues().email || ""}</strong>
              </p>
              <p className="mb-6 text-xs">
                The link will expire in 1 hour. Check your spam folder if you
                don&apos;t see it.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full rounded-full bg-[#D5557E] hover:bg-[#D5557E]/90"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
