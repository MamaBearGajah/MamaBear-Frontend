"use client";
import Link from "next/link";

import {
  BarChart3,
  Tag,
//   Megaphone,
//   Drill
//   Facebook,
} from "lucide-react";

type Widget = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const widgets: Widget[] = [
  {
    title: "Google Analytics",
    description: "Track website traffic and user behavior",
    icon: BarChart3,
    color: "bg-blue-500",
  },
  {
    title: "Google Tag Manager",
    description: "Manage tracking tags in one place",
    icon: Tag,
    color: "bg-yellow-500",
  },
  // {
  //   title: "Google Ads",
  //   description: "Track conversions and ad performance",
  //   icon: Megaphone,
  //   color: "bg-red-500",
  // },
  // {
  //   title: "Facebook Pixel",
  //   description: "Measure Meta ads and retarget users",
  //   icon: Drill,
  //   color: "bg-blue-600",
  // },
];

export default function WidgetOptions() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-semibold">
        Marketing Integrations
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {widgets.map((widget) => (
          <Link
            key={widget.title}
            href={`/admin/widget/${widget.title
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="group block cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* Icon */}
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white ${widget.color}`}
            >
              <widget.icon className="h-6 w-6" />
            </div>

            {/* Text */}
            <h2 className="text-base font-semibold">
              {widget.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {widget.description}
            </p>

            {/* Action hint */}
            <div className="mt-4 text-sm text-gray-400 group-hover:text-gray-600">
              Click to configure →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}