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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import AuthBanner from "@/components/AuthBanner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const resetPasswordSchema = z
    .object({
      password: z.string().min(1, "Password is required"),
      confirmPassword: z.string().min(1, "Confirm password is required"),
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

  const handleSubmit = (data: ResetPasswordSchema) => {
    console.log(data);
    setPassword(data.password);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
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
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90"
                >
                  {loading ? "Resetting..." : "Reset Password"}
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
