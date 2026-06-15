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
    defaultValues: {
      email: "admin@mamabear.id",
      password: "Admin@12345",
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
        // Surface the real error instead of swallowing it
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
        // Surface the real error instead of swallowing it
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
    <div
      className={`my-auto flex h-screen w-full flex-col items-center justify-center bg-[#FFF5F8] lg:flex-row`}
    >
      <AuthBanner />
      <div className="form flex w-full flex-col items-center justify-center px-4 py-10 text-[#6C4735] sm:px-8 lg:w-[50%]">
        <div className="w-full max-w-md">
          <h1 className="mb-1 text-2xl font-black">Welcome back, Mama! 👋</h1>
          <p className="mb-6 text-sm">Sign in to your Mamabear account</p>
          {error && <AuthErrorMessage error={error} />}
          {error === "Email belum diverifikasi" && (
            <span
              onClick={handleResendVerificationEmail}
              className="mb-2 block cursor-pointer text-sm text-[#6C4735] hover:underline"
            >
              Send email verification to your email
            </span>
          )}
          {/* FORM */}
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3 lg:max-w-md"
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

              <div className="flex items-center justify-between">
                <Controller
                  name="rememberMe"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation={"horizontal"}>
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-black">Remember me</span>
                    </Field>
                  )}
                />
                {/* forgot password */}
                <Field>
                  <Link
                    href="/forgot-password"
                    className="text-right text-sm text-pink-500"
                  >
                    Forgot password?
                  </Link>
                </Field>
              </div>
              <Field>
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  Sign in
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {/* register */}
          <div className="flex items-center justify-center">
            <h3 className="text-sm text-black">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-lg font-bold text-pink-500"
              >
                Register Here
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
