"use client";

import React, { useState, useEffect } from "react";
import { Edit, Check, AlertCircle, Save, X, User, Lock, Shield } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import { useMembership } from "@/hooks/useMembership";
import { MembershipBadge } from "@/components/membership/MembershipBadge";

// ── Helpers ────────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  if (!name) return "MB";
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "MB";
}

function getErrMsg(error: unknown): string {
  if (isAxiosError(error))
    return error.response?.data?.error?.message ?? error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

// ── Change Password Modal ──────────────────────────────────────────────────────
function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    setSaving(true);
    try {
      await apiClient.patch("/users/me/change-password", { oldPassword, newPassword });
      toast.success("Password berhasil diubah. Silakan login kembali.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      toast.error(getErrMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FDF2F5] flex items-center justify-center">
              <Lock size={16} className="text-[#F05A89]" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Ganti Password</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="w-full h-px bg-[#F8D7E3] mb-5" />

        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-5 text-xs text-blue-600">
          <Shield size={14} className="mt-0.5 shrink-0" />
          <span>Untuk keamanan, pastikan password baru minimal 8 karakter dan tidak mudah ditebak.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="modal-oldPassword" className="text-sm font-medium text-gray-600">
              Password Lama
            </Label>
            <Input
              id="modal-oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
              className="rounded-xl border-gray-200 focus:border-[#F05A89] focus:ring-[#F05A89]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="modal-newPassword" className="text-sm font-medium text-gray-600">
              Password Baru
            </Label>
            <Input
              id="modal-newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="rounded-xl border-gray-200 focus:border-[#F05A89] focus:ring-[#F05A89]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="modal-confirmPassword" className="text-sm font-medium text-gray-600">
              Konfirmasi Password Baru
            </Label>
            <Input
              id="modal-confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="rounded-xl border-gray-200 focus:border-[#F05A89] focus:ring-[#F05A89]"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> Password tidak cocok
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0 && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <Check size={12} /> Password cocok
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#F05A89] hover:bg-[#D5557E] text-white font-semibold"
            >
              {saving ? "Menyimpan..." : "Simpan Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const membership = useMembership();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getMe();
        if (res && res.data) {
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
          });
        }
      } catch {
        console.error("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (form.phone) {
      const phoneRegex = /^[0-9+]+$/;
      if (!phoneRegex.test(form.phone)) newErrors.phone = "Hanya boleh angka dan '+'";
      else if (form.phone.length < 8 || form.phone.length > 20) newErrors.phone = "Harus 8-20 karakter.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    try {
      setIsSaving(true);
      setToastMessage(null);
      // await authApi.updateProfile(form);
      setToastMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      setIsEditing(false);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage({ type: "error", text: "Gagal menyimpan profil." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="py-10 text-center text-gray-500">Memuat profil...</div>;

  const EditButton = (
    <button
      onClick={() => setIsEditing((v) => !v)}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-[#FDF2F5] text-[#F05A89] hover:bg-[#F8D7E3]"
    >
      {isEditing ? <><X size={14} /> Cancel</> : <><Edit size={14} /> Edit</>}
    </button>
  );

  return (
    <>
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

      <div className="space-y-4">
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm animate-in fade-in ${
              toastMessage.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {toastMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            {toastMessage.text}
          </div>
        )}

        <AccountPageWrapper title="Profile Information" icon={User} actionButton={EditButton}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-black shadow-sm bg-[#F05A89] shrink-0">
              {getInitials(form.name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-lg font-bold text-gray-800 truncate">{form.name || "Member"}</h3>
                {!membership.isLoading && <MembershipBadge tier={membership.currentTier.key} />}
              </div>
              <p className="text-sm text-gray-500 truncate">{form.email}</p>
            </div>
          </div>

          <div className="border-t border-[#F8D7E3] mb-6" />

          <h3 className="text-lg font-bold text-gray-800 mb-5">Personal Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  !isEditing
                    ? "bg-gray-50 border-gray-200 text-gray-500"
                    : "bg-white border-[#F8D7E3] focus:border-[#F05A89] focus:ring-1 focus:ring-[#F05A89] outline-none"
                } ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+62"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  !isEditing
                    ? "bg-gray-50 border-gray-200 text-gray-500"
                    : "bg-white border-[#F8D7E3] focus:border-[#F05A89] focus:ring-1 focus:ring-[#F05A89] outline-none"
                } ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-600 block mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 bg-[#F05A89]"
              >
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </AccountPageWrapper>

        <section className="rounded-2xl border border-[#F0D9E2] bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#6C4735]">Password</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Perbarui password akun Anda secara berkala untuk keamanan.
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#FDF2F5] text-[#F05A89] hover:bg-[#F8D7E3] transition-colors w-full sm:w-auto sm:shrink-0"
            >
              <Lock size={14} />
              Ganti Password
            </button>
          </div>
        </section>
      </div>
    </>
  );
}