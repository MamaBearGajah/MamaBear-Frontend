﻿"use client";

import React, { useState, useEffect } from "react";
import { Edit, Check, AlertCircle, Save, X, User } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";



function getInitials(name: string) {
  if (!name) return "MB";
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "MB";
}



export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      } catch (error) {
        console.error("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error("Password baru minimal 8 karakter"); return; }
    setSavingPassword(true);
    try {
      await apiClient.patch("/users/me/change-password", { oldPassword, newPassword });
      toast.success("Password berhasil diubah. Silakan login kembali.");
      setOldPassword(""); setNewPassword("");
    } catch (err) { toast.error(getErrMsg(err)); }
    finally { setSavingPassword(false); }
  };

  function getErrMsg(error: unknown): string {
  if (isAxiosError(error))
    return error.response?.data?.error?.message ?? error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

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
      // await authApi.updateProfile(form); // Ganti dengan API aslimu
      setToastMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      setIsEditing(false);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      setToastMessage({ type: "error", text: "Gagal menyimpan profil." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="py-10 text-center text-gray-500">Memuat profil...</div>;

  const EditButton = (
    <button
      onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-[#FDF2F5] text-[#F05A89] hover:bg-[#F8D7E3]"
    >
      {isEditing ? <><X size={14} /> Cancel</> : <><Edit size={14} /> Edit</>}
    </button>
  );

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm animate-in fade-in ${toastMessage.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {toastMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          {toastMessage.text}
        </div>
      )}

      <AccountPageWrapper title="Profile Information" icon={User} actionButton={EditButton}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-black shadow-sm bg-[#F05A89]">
            {getInitials(form.name)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{form.name || "Member"}</h3>
            <p className="text-sm text-gray-500">{form.email}</p>
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
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-white border-[#F8D7E3] focus:border-[#F05A89] focus:ring-1 focus:ring-[#F05A89] outline-none'} ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="+62"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-white border-[#F8D7E3] focus:border-[#F05A89] focus:ring-1 focus:ring-[#F05A89] outline-none'} ${errors.phone ? 'border-red-500' : ''}`}
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
        <br></br>

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
              <section className="rounded-2xl border border-[#F0D9E2] bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-[#6C4735]">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="oldPassword">Old Password</Label>
                    <Input id="oldPassword" className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed' type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Current Password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed' type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 Characters" />
                  </div>
                  <Button type="submit" disabled={savingPassword} className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90 text-white">
                    {savingPassword ? "Saving..." : "Change Password"}
                  </Button>
                </form>
              </section>
    </div>
  );
}