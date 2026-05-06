"use client";

import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MamaInput } from "@/components/common/MamaInput";
import { MamaButton } from "@/components/common/MamaButton";
import { MamaToast } from "@/components/common/MamaToast";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("login data", data);

    MamaToast.success(
      "Login berhasil",
      "Selamat datang kembali di Mamabear."
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <MamaInput
        id="email"
        label="Email Address"
        placeholder="your@email.com"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <MamaInput
        id="password"
        label="Password"
        type="password"
        withPasswordToggle
        placeholder="Masukkan password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password")}
      />

      <MamaButton
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign In
      </MamaButton>
    </form>
  );
}