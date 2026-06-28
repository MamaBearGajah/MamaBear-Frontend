// Single Responsibility: menampilkan poin + tombol daily claim + redeem poin

"use client";

import { useState } from "react";
import { Star, Gift, ArrowDownCircle, X, AlertCircle } from "lucide-react";
import { MIN_REDEEM_POINTS, POINT_TO_RUPIAH } from "@/config/membership-constants";

interface Props {
  points: number;
  hasClaimed: boolean;
  isClaiming: boolean;
  isRedeeming?: boolean;
  onClaim: () => void;
  onRedeem?: (points: number) => Promise<{ voucherCode: string; discountValue: number }>;
}

export function PointsCard({
  points,
  hasClaimed,
  isClaiming,
  isRedeeming = false,
  onClaim,
  onRedeem,
}: Props) {
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [redeemInput, setRedeemInput] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [redeemResult, setRedeemResult] = useState<{
    voucherCode: string;
    discountValue: number;
  } | null>(null);

  const parsedPoints = parseInt(redeemInput, 10);
  const discountPreview = !isNaN(parsedPoints) && parsedPoints > 0
    ? parsedPoints * POINT_TO_RUPIAH
    : 0;

  const handleRedeem = async () => {
    setRedeemError("");
    if (!parsedPoints || parsedPoints < MIN_REDEEM_POINTS) {
      setRedeemError(`Minimal redeem ${MIN_REDEEM_POINTS} poin`);
      return;
    }
    if (parsedPoints > points) {
      setRedeemError(`Poin tidak cukup. Kamu hanya punya ${points} poin.`);
      return;
    }
    try {
      const result = await onRedeem!(parsedPoints);
      setRedeemResult(result);
      setRedeemInput("");
    } catch {
      // error sudah di-handle oleh hook
    }
  };

  return (
    <>
      <div className="bg-[#F05A89] p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative stars */}
        <Star className="absolute top-4 right-8 opacity-20" size={20} fill="currentColor" />
        <Star className="absolute bottom-8 right-4 opacity-15" size={14} fill="currentColor" />
        <Star className="absolute top-10 left-4 opacity-10" size={28} fill="currentColor" />

        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">My Points</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-5xl font-black tracking-tight">
              {points.toLocaleString("id-ID")}
            </span>
            <div className="w-9 h-9 bg-[#FFD15B] rounded-full flex items-center justify-center shadow">
              <Star size={16} className="text-white" fill="currentColor" />
            </div>
          </div>

          {/* Daily Login */}
          <div className="border-t border-white/20 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={16} className="opacity-80" />
              <p className="text-white/80 text-sm font-semibold">Daily Login Reward</p>
            </div>
            <button
              onClick={onClaim}
              disabled={hasClaimed || isClaiming}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                hasClaimed
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-white text-[#F05A89] hover:scale-105 shadow-md"
              }`}
            >
              {isClaiming ? "Mengklaim..." : hasClaimed ? "✓ Diklaim" : "Klaim +5 Poin"}
            </button>
          </div>

          {/* Redeem Button */}
          {onRedeem && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownCircle size={16} className="opacity-80" />
                <p className="text-white/80 text-sm font-semibold">Tukar Poin</p>
              </div>
              <button
                onClick={() => { setShowRedeemDialog(true); setRedeemResult(null); }}
                disabled={points < MIN_REDEEM_POINTS}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  points < MIN_REDEEM_POINTS
                    ? "bg-white/20 text-white/60 cursor-not-allowed"
                    : "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:scale-105"
                }`}
              >
                {points < MIN_REDEEM_POINTS
                  ? `Min. ${MIN_REDEEM_POINTS} poin`
                  : "Tukar Jadi Voucher"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Dialog */}
      {showRedeemDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Tukar Poin jadi Voucher</h3>
              <button
                onClick={() => { setShowRedeemDialog(false); setRedeemError(""); setRedeemResult(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {redeemResult ? (
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Star size={24} className="text-emerald-600" fill="currentColor" />
                </div>
                <p className="font-bold text-gray-800">Voucher Berhasil Dibuat!</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Kode Voucher</p>
                  <p className="text-lg font-black tracking-widest text-[#F05A89]">
                    {redeemResult.voucherCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Potongan{" "}
                    <span className="font-bold">
                      Rp {redeemResult.discountValue.toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-gray-400">Berlaku 30 hari. Gunakan saat checkout.</p>
                <button
                  onClick={() => setShowRedeemDialog(false)}
                  className="w-full py-2.5 rounded-xl bg-[#F05A89] text-white font-semibold text-sm hover:bg-[#d94a7a] transition-colors"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Kamu punya <span className="font-bold text-[#F05A89]">{points.toLocaleString("id-ID")} poin</span>.
                  1 poin = Rp {POINT_TO_RUPIAH.toLocaleString("id-ID")} potongan.
                </p>

                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Jumlah poin yang ingin ditukar
                  </label>
                  <input
                    type="number"
                    min={MIN_REDEEM_POINTS}
                    max={points}
                    value={redeemInput}
                    onChange={(e) => { setRedeemInput(e.target.value); setRedeemError(""); }}
                    placeholder={`Min. ${MIN_REDEEM_POINTS} poin`}
                    className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#F05A89]"
                  />
                  {redeemError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-xs">
                      <AlertCircle size={12} />
                      {redeemError}
                    </div>
                  )}
                  {discountPreview > 0 && !redeemError && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ≈ Voucher Rp {discountPreview.toLocaleString("id-ID")}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRedeemDialog(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={isRedeeming || !parsedPoints}
                    className="flex-1 py-2.5 rounded-xl bg-[#F05A89] text-white text-sm font-semibold hover:bg-[#d94a7a] disabled:opacity-50 transition-colors"
                  >
                    {isRedeeming ? "Memproses..." : "Tukar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}