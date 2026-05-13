import Link from "next/link";

export default function Header() {
  return (
    <div className="font-[var(--font-quicksand)]] flex h-[20vh] items-center justify-center gap-3 border md:h-[10vh]">
      <Link href="/">Home</Link>
      <Link href="#">Search</Link>
      <Link href="/about">About</Link>
      <Link href="/product">Product</Link>
      <Link href="/consultation">Consultation</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/admin">Admin</Link>
    </div>
  );
}
