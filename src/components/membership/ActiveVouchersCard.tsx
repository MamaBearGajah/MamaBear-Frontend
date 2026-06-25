// Single Responsibility: menampilkan voucher aktif milik user

import { Tag, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { ActiveVoucher } from "@/hooks/useMembership";

interface Props {
  vouchers: ActiveVoucher[];
}

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "Tidak ada batas waktu";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-gray-400 hover:text-[#F05A89] hover:bg-pink-50 transition-colors"
      title="Salin kode"
    >
      {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

const TYPE_LABELS: Record<string, string> = {
  fixed: "Potongan Harga",
  percent: "Diskon %",
  free_shipping: "Gratis Ongkir",
  point_redeem: "Tukar Poin",
  tier_benefit: "Benefit Tier",
};

export function ActiveVouchersCard({ vouchers }: Props) {
  if (vouchers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#F8D7E3] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={15} className="text-[#F05A89]" />
        <p className="text-sm font-bold text-gray-700">Voucher Aktif ({vouchers.length})</p>
      </div>

      <div className="space-y-2.5">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="flex items-center gap-3 rounded-xl border border-dashed border-pink-200 bg-pink-50/50 px-4 py-3"
          >
            {/* Code */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-[#F05A89] text-sm">
                  {voucher.code}
                </span>
                <CopyButton code={voucher.code} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {TYPE_LABELS[voucher.type] ?? voucher.type} ·{" "}
                {voucher.type === "percent"
                  ? `${voucher.value}%`
                  : `Rp ${voucher.value.toLocaleString("id-ID")}`}
              </p>
            </div>

            {/* Expiry */}
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-400">s/d</p>
              <p className="text-xs font-semibold text-gray-600">
                {formatDate(voucher.endDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}