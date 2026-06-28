"use client";

import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
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
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password is required and must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(
          8,
          "Confirm password is required and must be at least 8 characters"
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const token = params.get("token") as string;

  const errorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "Token tidak valid atau expired";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };

  const handleSubmit = async (data: ResetPasswordSchema) => {
    const { password } = data;
    try {
      setError("");
      setIsLoading(true);
      await authApi.resetPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status || 500));
        toast.error(errorMessage(e.response?.status || 500));
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
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
          <h1 className="mb-1 text-2xl font-black">Reset Password 🔒</h1>
          <p className="mb-6 text-sm">Enter your new password.</p>
          {error && <AuthErrorMessage error={error} />}
          {/* FORM */}
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={`space-y-3 ${success ? "hidden" : ""}`}
          >
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <InputGroupAddon>
                        <LockIcon />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter your confirm password"
                      />
                      <InputGroupAddon>
                        <LockIcon />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
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
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {success && (
            <div className="text-center">
              <div className="mb-4 text-6xl">✔</div>
              <h3 className="mb-2 text-xl font-black">
                Password resetted successfully!
              </h3>
              <p className="mb-6 text-sm">
                You can now login with your new password.
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
