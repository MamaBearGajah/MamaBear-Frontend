import Link from "next/link";

import { Badge } from "@/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type OrderCardProps = {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Cancelled" | "Pending";
  total: number;
  href: string;
  itemCount?: number;
};

const statusStyles: Record<OrderCardProps["status"], string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Pending: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export function OrderCard({ id, date, status, total, href, itemCount }: OrderCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="border border-pink-100 bg-white shadow-sm">
      <CardHeader className="items-center gap-4 px-5 py-4 sm:flex-row">
        <div className="min-w-0">
          <CardTitle className="text-base text-slate-900">Order {id}</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            {formattedDate}
          </CardDescription>
        </div>
        <Badge className={statusStyles[status]} variant="outline">
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="grid gap-4 px-5 pb-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">Order total</p>
          <p className="text-lg font-semibold text-slate-900">Rp {total.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {itemCount ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "Order summary"}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-sm text-slate-500">Order details are available here.</div>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          View detail
        </Link>
      </CardFooter>
    </Card>
  );
}
