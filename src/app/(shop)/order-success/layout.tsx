import AuthGuard from "@/components/auth/AuthGuard";

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
