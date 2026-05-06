"use client";

import { BadgeCheck, Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const imagebg =
    "https://images.unsplash.com/photo-1648375975494-30e0629799a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhc3RmZWVkaW5nJTIwbW90aGVyJTIwYmFieSUyMHdlbGxuZXNzJTIwaGFwcHl8ZW58MXx8fHwxNzc3NjM5MzE4fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const loginSchema = z.object({
    email: z.email().min(1, "Email is required"),
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
      className={`my-auto flex h-screen w-full flex-col items-center justify-center lg:flex-row`}
    >
      <div
        className={`relative hidden h-full w-[50%] bg-[url(${imagebg})] bg- bg-cover bg-right bg-no-repeat lg:block`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(213,85,126,0.85)_0%,rgba(108,71,53,0.7)_100%)]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
              MB
            </div>{" "}
            <span className="text-3xl font-black text-white">mamabear</span>
          </div>
          <h2 className="mb-4 text-3xl leading-tight font-black text-white">
            Supporting Every Mama&apos;s Journey 🐻
          </h2>
          <p className="mb-8 leading-relaxed text-pink-100">
            Join 50,000+ breastfeeding mamas who trust Mamabear for natural,
            effective ASI boosters.
          </p>
          <div className="w-full max-w-xs space-y-3 text-left">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <BadgeCheck />
              </div>
              <span className="text-sm font-semibold">
                Exclusive member discounts
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <BadgeCheck />
              </div>
              <span className="text-sm font-semibold">
                Free lactation consultation
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <BadgeCheck />
              </div>
              <span className="text-sm font-semibold">
                Personalized product recommendations
              </span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <BadgeCheck />
              </div>
              <span className="text-sm font-semibold">
                Track your orders easily
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center lg:w-[50%]">
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
                  href="/auth/forgot-password"
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
            <Link
              href="/auth/Register"
              className="text-lg font-bold text-pink-500"
            >
              Register Here
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
