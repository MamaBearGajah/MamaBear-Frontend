"use client";

import {
  Eye,
  EyeOff,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
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
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const errorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 409:
        return "Email or phone already exists";
      case 401:
        return "Invalid credentials";
      case 500:
        return "Internal server error";
      default:
        return "Unknown error";
    }
  };

  const onSubmit = async (data: RegisterSchema) => {
    const registerData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone?.trim() === "" ? null : data.phone,
    };
    try {
      setError(null);
      setIsLoading(true);
      await authApi.register(registerData);
      toast.success("Account created successfully", {
        description: "Please check your email to verify your account",
      });
      router.push(`/login`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(errorMessage(e.response?.status ?? 500));
        toast.error("Account creation failed");
        console.log(e.response?.status);
      } else {
        setError("An unexpected error occurred");
        toast.error("Account creation failed");
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
          <h1 className="mb-1 text-2xl font-black">Join Mamabear! 🐻</h1>
          <p className="mb-6 text-sm">Create your account in just a minute</p>
          {error && <AuthErrorMessage error={error} />}
          {/* FORM */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 lg:max-w-md"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                      />
                      <InputGroupAddon>
                        <UserIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
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
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="text"
                        placeholder="Enter your phone"
                      />
                      <InputGroupAddon>
                        <PhoneIcon />
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

              <div className="flex items-center justify-between">
                <Controller
                  name="terms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm text-black">
                          I agree to Mamabear&apos;s
                          <Link href="/terms" className="px-1 text-pink-500">
                            Terms of Service
                          </Link>
                          and
                          <Link href="/policy" className="px-1 text-pink-500">
                            Privacy Policy
                          </Link>
                        </span>
                      </div>
                      {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
              <Field>
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90 disabled:cursor-not-allowed"
                >
                  Register
                </Button>
              </Field>
            </FieldGroup>
          </form>
          {/* register */}
          <div className="flex items-center justify-center">
            <h3 className="text-sm text-black">
              Already have an account?{" "}
              <Link href="/login" className="text-lg font-bold text-pink-500">
                Login Here
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
