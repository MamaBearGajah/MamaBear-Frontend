"use client";

import { Eye, EyeOff, LockIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
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
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { toast } from "sonner";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const registerSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z
        .string()
        .min(1, "Email is required")
        .pipe(z.email("Invalid email format")),
      phone: z.string().optional(),
      password: z.string().min(8, "Password is required"),
      confirmPassword: z.string().min(8, "Confirm password is required"),
      terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the Terms of Service",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  type RegisterSchema = z.infer<typeof registerSchema>;

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", terms: false },
  });

  const errorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 409: return "Email or phone already exists";
      case 401: return "Invalid credentials";
      case 500: return "Internal server error";
      default: return "Unknown error";
    }
  };

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setError(null);
      setIsLoading(true);
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone?.trim() === "" ? undefined : data.phone,
      });
      toast.success("Account created successfully", {
        description: "Please check your email to verify your account",
      });
      router.push(`/login`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status ?? 500));
        toast.error("Account creation failed");
      } else {
        setError("An unexpected error occurred");
        toast.error("Account creation failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AuthBanner />

      {/* Form side — scrollable */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#FFF5F8] px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-black text-[#6C4735]">Join Mamabear! 🐻</h1>
          <p className="mb-6 text-sm text-[#6C4735]/70">Create your account in just a minute</p>

          {error && <AuthErrorMessage error={error} />}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {/* Full Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[#6C4735]">Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <UserIcon size={16} className="text-gray-400" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} type="text" placeholder="Enter your full name" />
                    </InputGroup>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[#6C4735]">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <MailIcon size={16} className="text-gray-400" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} type="email" placeholder="Enter your email" />
                    </InputGroup>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[#6C4735]">Phone</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <PhoneIcon size={16} className="text-gray-400" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} type="text" placeholder="Enter your phone" />
                    </InputGroup>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[#6C4735]">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockIcon size={16} className="text-gray-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                      />
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </InputGroupButton>
                    </InputGroup>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[#6C4735]">Confirm Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <LockIcon size={16} className="text-gray-400" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter your confirm password"
                      />
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </InputGroupButton>
                    </InputGroup>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              {/* Terms */}
              <Controller
                name="terms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                      <label htmlFor="terms" className="cursor-pointer text-sm text-[#6C4735]/80">
                        I agree to Mamabear&apos;s{" "}
                        <Link href="/terms" className="text-[#D5557E] hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/policy" className="text-[#D5557E] hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </Field>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-full bg-[#D5557E] py-2.5 text-sm font-semibold text-white hover:bg-[#D5557E]/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-6 text-center text-sm text-[#6C4735]/70">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#D5557E] hover:underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}