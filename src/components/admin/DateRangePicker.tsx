"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMaxReportDate, isValidReportDateRange } from "@/lib/admin/report-date-range";
import { cn } from "@/lib/utils";
import type { ReportDateRange } from "@/types";

export type DateRangePickerProps = {
  value: ReportDateRange;
  onChange: (range: ReportDateRange) => void;
  className?: string;
  disabled?: boolean;
};

export default function DateRangePicker({
  value,
  onChange,
  className,
  disabled = false,
}: DateRangePickerProps) {
  const maxDate = getMaxReportDate();
  const isInvalid = !isValidReportDateRange(value);

  const updateField = (field: keyof ReportDateRange, nextValue: string) => {
    onChange({ ...value, [field]: nextValue });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="report-from" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            From
          </Label>
          <Input
            id="report-from"
            type="date"
            value={value.from}
            max={value.to || maxDate}
            disabled={disabled}
            onChange={(event) => updateField("from", event.target.value)}
            className="h-10 min-w-[160px] rounded-full border-[#E9D9DF] bg-white px-4"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="report-to" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            To
          </Label>
          <Input
            id="report-to"
            type="date"
            value={value.to}
            min={value.from}
            max={maxDate}
            disabled={disabled}
            onChange={(event) => updateField("to", event.target.value)}
            className="h-10 min-w-[160px] rounded-full border-[#E9D9DF] bg-white px-4"
          />
        </div>
      </div>

      {isInvalid && (
        <p className="text-xs text-rose-600">
          Tanggal mulai harus sebelum atau sama dengan tanggal akhir.
        </p>
      )}
    </div>
  );
}
