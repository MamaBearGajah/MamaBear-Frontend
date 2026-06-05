"use client";

import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/config/order-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  orderDate: string;
  className?: string;
}

export default function OrderTimeline({
  currentStatus,
  orderDate,
  className,
}: OrderTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <Card
        className={cn(
          "border border-[#F8D7E3] bg-white shadow-sm",
          className,
        )}
      >
        <CardHeader className="border-b border-[#F8D7E3] px-5 py-4">
          <CardTitle className="text-base font-bold text-gray-800">
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-4">
          <div className="rounded-2xl bg-rose-50 px-4 py-4 text-center">
            <p className="text-sm font-semibold text-rose-700">
              Order Cancelled
            </p>
            <p className="mt-1 text-xs text-rose-600">
              This order has been cancelled.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

  return (
    <Card
      className={cn(
        "border border-[#F8D7E3] bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="border-b border-[#F8D7E3] px-5 py-4">
        <CardTitle className="text-base font-bold text-gray-800">
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <div className="space-y-4">
          {ORDER_STATUS_FLOW.map((status, index) => {
            const completed = currentIndex >= 0 && index <= currentIndex;
            const isActive = status === currentStatus;

            return (
              <div key={status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2",
                      completed
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-slate-50",
                    )}
                  >
                    {completed ? (
                      <svg
                        className="size-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-dark-pink" : "text-slate-400",
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < ORDER_STATUS_FLOW.length - 1 && (
                    <div
                      className={cn(
                        "mt-1 h-8 w-0.5",
                        completed ? "bg-emerald-500" : "bg-slate-200",
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {ORDER_STATUS_LABELS[status]}
                  </p>
                  {index === 0 && (
                    <p className="text-xs text-slate-500">
                      {new Date(orderDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {isActive && (
                    <p className="mt-1 text-xs font-medium text-dark-pink">
                      {completed ? "Completed" : "In progress"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
