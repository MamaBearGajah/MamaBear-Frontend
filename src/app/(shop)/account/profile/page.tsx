
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  id: string;
  label?: string;
  receiverName: string;
  phone: string;
  address: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
  isDefault: boolean;
}

interface Province { province_id: string; province: string; }
interface City { city_id: string; city_name: string; type: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getErrMsg(error: unknown): string {
  if (isAxiosError(error))
    return error.response?.data?.error?.message ?? error.message;
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

// ─── Address Form Modal ───────────────────────────────────────────────────────

function AddressFormModal({
  address,
  provinces,
  onClose,
  onSaved,
}: {
  address?: Address;
  provinces: Province[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!address;
  const [cities, setCities] = useState<City[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    label: address?.label ?? "",
    receiverName: address?.receiverName ?? "",
    phone: address?.phone ?? "",
    address: address?.address ?? "",
    provinceId: address?.provinceId ?? "",
    cityId: address?.cityId ?? "",
    postalCode: address?.postalCode ?? "",
  });

  useEffect(() => {
    if (form.provinceId) {
      apiClient
        .get(`/shipping/cities?province=${form.provinceId}`)
        .then((r) => setCities(r.data?.data?.rajaongkir?.results ?? []))
        .catch(() => setCities([]));
    }
  }, [form.provinceId]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await apiClient.patch(`/users/me/addresses/${address!.id}`, form);
        toast.success("Alamat berhasil diperbarui");
      } else {
        await apiClient.post("/users/me/addresses", form);
        toast.success("Alamat berhasil ditambahkan");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getErrMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-[#6C4735]">
          {isEdit ? "Edit Alamat" : "Tambah Alamat"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="label">Label (opsional)</Label>
              <Input id="label" placeholder="Rumah / Kantor" value={form.label} onChange={e => set("label", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="receiverName">Nama Penerima *</Label>
              <Input id="receiverName" required value={form.receiverName} onChange={e => set("receiverName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">No. Telepon *</Label>
              <Input id="phone" required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="08xxxxxxxxxx" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Input id="address" required value={form.address} onChange={e => set("address", e.target.value)} placeholder="Jl. Mawar No. 1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="provinceId">Provinsi *</Label>
              <select
                id="provinceId"
                required
                value={form.provinceId}
                onChange={e => { set("provinceId", e.target.value); set("cityId", ""); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih provinsi</option>
                {provinces.map(p => (
                  <option key={p.province_id} value={p.province_id}>{p.province}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cityId">Kota / Kabupaten *</Label>
              <select
                id="cityId"
                required
                value={form.cityId}
                onChange={e => set("cityId", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={!form.provinceId}
              >
                <option value="">Pilih kota</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Kode Pos *</Label>
              <Input id="postalCode" required value={form.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="60111" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#D5557E] hover:bg-[#D5557E]/90 text-white">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { state } = useAuth();
  const { user } = state;

  // Profile state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();

  useEffect(() => {
    fetchAddresses();
    apiClient.get("/shipping/provinces")
      .then(r => setProvinces(r.data?.data?.rajaongkir?.results ?? []))
      .catch(() => {});
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await apiClient.get("/users/me/addresses");
      const data = res.data?.data ?? res.data ?? [];
      setAddresses(Array.isArray(data) ? data : []);
    } catch { setAddresses([]); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await apiClient.patch("/users/me", {
        ...(name.trim() && { name: name.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
      });
      toast.success("Profil berhasil diperbarui");
    } catch (err) { toast.error(getErrMsg(err)); }
    finally { setSavingProfile(false); }
  };

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

  const handleSetDefault = async (id: string) => {
    try {
      await apiClient.patch(`/users/me/addresses/${id}/default`);
      toast.success("Alamat default diubah");
      fetchAddresses();
    } catch (err) { toast.error(getErrMsg(err)); }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Hapus alamat ini?")) return;
    try {
      await apiClient.delete(`/users/me/addresses/${id}`);
      toast.success("Alamat dihapus");
      fetchAddresses();
    } catch (err) { toast.error(getErrMsg(err)); }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 text-center text-sm text-zinc-500">
        Kamu belum login.
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-[#6C4735]">Profil Saya</h1>

      {/* ── Update Profil ── */}
      <section className="rounded-2xl border border-[#F0D9E2] bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#6C4735]">Informasi Akun</h2>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={user.email} disabled className="bg-zinc-50 text-zinc-400" />
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">No. Telepon</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
          </div>
          <Button type="submit" disabled={savingProfile} className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90 text-white">
            {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </section>

      {/* ── Alamat ── */}
      <section className="rounded-2xl border border-[#F0D9E2] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#6C4735]">Alamat Pengiriman</h2>
          <Button
            size="sm"
            onClick={() => { setEditingAddress(undefined); setShowAddressModal(true); }}
            className="bg-[#D5557E] hover:bg-[#D5557E]/90 text-white gap-1"
          >
            <Plus className="size-4" /> Tambah
          </Button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-sm text-zinc-400">Belum ada alamat tersimpan.</p>
        ) : (
          <ul className="space-y-3">
            {addresses.map(addr => (
              <li key={addr.id} className={`rounded-xl border p-4 text-sm space-y-1 ${addr.isDefault ? "border-[#D5557E] bg-[#FFF5F8]" : "border-zinc-200"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {addr.label && <span className="text-xs font-bold text-[#D5557E] uppercase">{addr.label}</span>}
                    {addr.isDefault && <span className="ml-2 text-xs bg-[#D5557E] text-white rounded-full px-2 py-0.5">Default</span>}
                    <p className="font-medium text-[#6C4735] mt-0.5">{addr.receiverName} · {addr.phone}</p>
                    <p className="text-zinc-500">{addr.address}, Kota {addr.cityId}, {addr.postalCode}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!addr.isDefault && (
                      <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-[#D5557E]" onClick={() => handleSetDefault(addr.id)}>
                        <Star className="size-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-[#6C4735]" onClick={() => { setEditingAddress(addr); setShowAddressModal(true); }}>
                      <Pencil className="size-4" />
                    </Button>
                    {!addr.isDefault && (
                      <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-destructive" onClick={() => handleDeleteAddress(addr.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Ganti Password ── */}
      <section className="rounded-2xl border border-[#F0D9E2] bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#6C4735]">Ganti Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">Password Lama</Label>
            <Input id="oldPassword" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Password saat ini" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimal 8 karakter" />
          </div>
          <Button type="submit" disabled={savingPassword} className="w-full bg-[#D5557E] hover:bg-[#D5557E]/90 text-white">
            {savingPassword ? "Menyimpan..." : "Ganti Password"}
          </Button>
        </form>
      </section>

      {/* ── Address Modal ── */}
      {showAddressModal && (
        <AddressFormModal
          address={editingAddress}
          provinces={provinces}
          onClose={() => setShowAddressModal(false)}
          onSaved={fetchAddresses}
        />
      )}
    </main>
  );
}