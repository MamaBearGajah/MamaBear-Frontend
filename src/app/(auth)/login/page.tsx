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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <div
      className={`my-auto flex h-screen w-full flex-col items-center justify-center bg-[#FFF5F8] lg:flex-row`}
    >
      <AuthBanner />
      <div className="form flex flex-col items-center justify-center text-[#6C4735] lg:w-[50%]">
        <h1 className="mb-1 text-2xl font-black">Welcome back, Mama! 👋</h1>
        <p className="mb-6 text-sm">Sign in to your Mamabear account</p>
        {/* FORM */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full max-w-xs space-y-3"
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
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </Field>
          </FieldGroup>
        </form>
        {/* register */}
        <div className="flex items-center justify-center">
          <h3 className="text-sm text-black">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-lg font-bold text-pink-500">
              Register Here
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
