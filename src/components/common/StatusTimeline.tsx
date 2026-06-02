"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimelineStep = {
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  label: string;
  date?: string;
  completed: boolean;
};

interface StatusTimelineProps {
  currentStatus: "Pending" | "Processing" | "Delivered" | "Cancelled";
  orderDate: string;
}

export function StatusTimeline({ currentStatus, orderDate }: StatusTimelineProps) {
  const statusOrder = ["Pending", "Processing", "Delivered"];
  const steps: TimelineStep[] = [
    { status: "Pending", label: "Order Placed", date: orderDate, completed: true },
    { status: "Processing", label: "Processing", date: undefined, completed: statusOrder.indexOf(currentStatus) >= 1 },
    { status: "Delivered", label: "Delivered", date: undefined, completed: statusOrder.indexOf(currentStatus) >= 2 },
  ];

  if (currentStatus === "Cancelled") {
    return (
      <Card className="border border-rose-100 bg-white shadow-sm">
        <CardHeader className="px-5 py-5">
          <CardTitle className="text-lg font-semibold text-slate-900">Order Status</CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-4">
          <div className="rounded-3xl bg-rose-50 px-4 py-4 text-center">
            <p className="text-sm font-semibold text-rose-700">Order Cancelled</p>
            <p className="mt-1 text-xs text-rose-600">This order has been cancelled.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-pink-100 bg-white shadow-sm">
      <CardHeader className="px-5 py-5">
        <CardTitle className="text-lg font-semibold text-slate-900">Order Status</CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-4">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.completed
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {step.completed ? (
                    <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className={step.status === currentStatus ? "text-pink-600" : "text-slate-400"}>
                      {index + 1}
                    </span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mt-1 h-8 w-0.5 ${
                      step.completed ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                {step.date && <p className="text-xs text-slate-500">{new Date(step.date).toLocaleDateString("id-ID")}</p>}
                {step.status === currentStatus && !step.completed && (
                  <p className="mt-1 text-xs text-pink-600 font-medium">In progress</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
