"use client";

import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import AuthBanner from "@/components/AuthBanner";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { authApi } from "../../../lib/api/auth";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .pipe(z.email("Invalid email format")),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean(),
  });
  type LoginSchema = z.infer<typeof loginSchema>;

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    // FIX: hapus hardcoded admin credentials
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const errorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 401:
        return "Email atau password salah";
      case 403:
        return "Email belum diverifikasi";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };

  const handleSubmit = async (data: LoginSchema) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    try {
      setIsLoading(true);
      setError(null);
      await login(loginData);
      toast.success("Login berhasil");
      router.push(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status ?? 500));
        toast.error(errorMessage(e.response?.status ?? 500));
      } else {
        const message = e instanceof Error ? e.message : String(e);
        console.error("Login non-axios error:", e);
        setError(message || "An unexpected error occurred");
        toast.error(message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.resendVerification(form.getValues("email"));
      toast.success("Email verification sent successfully");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status ?? 500));
        toast.error(errorMessage(e.response?.status ?? 500));
      } else {
        const message = e instanceof Error ? e.message : String(e);
        console.error("Login non-axios error:", e);
        setError(message || "An unexpected error occurred");
        toast.error(message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthBanner />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mb-8 text-sm text-gray-500">
            Welcome back to MamaBear
          </p>

          {error && <AuthErrorMessage error={error} />}
          {error === "Email belum diverifikasi" && (
            <span
              onClick={handleResendVerificationEmail}
              className="mb-4 block cursor-pointer text-sm text-[#6C4735] hover:underline"
            >
              Kirim ulang email verifikasi
            </span>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldGroup>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon size={16} className="text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...form.register("email")}
                  />
                </InputGroup>
              </FieldGroup>
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldGroup>
                <InputGroup>
                  <InputGroupAddon>
                    <LockIcon size={16} className="text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...form.register("password")}
                  />
                  <InputGroupButton
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </InputGroupButton>
                </InputGroup>
              </FieldGroup>
              {form.formState.errors.password && (
                <FieldError>{form.formState.errors.password.message}</FieldError>
              )}
            </Field>

            <div className="flex items-center justify-between">
              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    Remember me
                  </label>
                )}
              />
              <Link
                href="/forgot-password"
                className="text-sm text-pink-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[var(--mamabear-dark-pink)] py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-pink-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}