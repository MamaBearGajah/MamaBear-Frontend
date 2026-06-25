"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { siteSettingsApi, type SiteSettings } from "@/lib/api/siteSettings";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// ─── Form type: semua nullable field jadi string ──────────────────────────────
type SettingsForm = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialInstagram: string;
  socialTiktok: string;
  socialFacebook: string;
  socialWhatsapp: string;
  shippingOriginCityId: string;
  taxRate: number;
  currency: string;
  maintenanceMode: boolean;
};

const DEFAULT_FORM: SettingsForm = {
  siteName: "Mamabear",
  siteDescription: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialInstagram: "",
  socialTiktok: "",
  socialFacebook: "",
  socialWhatsapp: "",
  shippingOriginCityId: "",
  taxRate: 0,
  currency: "IDR",
  maintenanceMode: false,
};

// Konversi SiteSettings (nullable) → SettingsForm (non-nullable) satu tempat
function toForm(data: SiteSettings): SettingsForm {
  return {
    siteName:             data.siteName             ?? DEFAULT_FORM.siteName,
    siteDescription:      data.siteDescription      ?? "",
    contactEmail:         data.contactEmail         ?? "",
    contactPhone:         data.contactPhone         ?? "",
    contactAddress:       data.contactAddress       ?? "",
    socialInstagram:      data.socialInstagram      ?? "",
    socialTiktok:         data.socialTiktok         ?? "",
    socialFacebook:       data.socialFacebook       ?? "",
    socialWhatsapp:       data.socialWhatsapp       ?? "",
    shippingOriginCityId: data.shippingOriginCityId ?? "",
    taxRate:              Number(data.taxRate        ?? 0),
    currency:             data.currency             ?? "IDR",
    maintenanceMode:      data.maintenanceMode      ?? false,
  };
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">{title}</h2>
      {children}
      <Separator />
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4 sm:items-start">
      <div className="pt-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const { state } = useAuth();
  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    siteSettingsApi
      .get()
      .then((res) => {
        if (res.data) setForm(toForm(res.data));
      })
      .catch(() => toast.error("Gagal memuat settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof SettingsForm, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteSettingsApi.update(form);
      toast.success("Settings berhasil disimpan");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal menyimpan settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader
        title="Settings"
        userName={state.user?.name ?? "Admin"}
      />

      <div className="mt-8 max-w-3xl space-y-8">
        {/* Site info */}
        <Section title="Informasi Toko">
          <Field id="siteName" label="Nama Toko">
            <Input
              id="siteName"
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
              placeholder="Mamabear"
            />
          </Field>
          <Field id="siteDescription" label="Deskripsi Toko" hint="Tampil di meta tag SEO">
            <Textarea
              id="siteDescription"
              value={form.siteDescription}
              onChange={(e) => set("siteDescription", e.target.value)}
              placeholder="Produk perawatan ibu & bayi terpercaya"
              rows={2}
            />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Kontak">
          <Field id="contactEmail" label="Email">
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="hello@mamabear.id"
            />
          </Field>
          <Field id="contactPhone" label="Nomor Telepon">
            <Input
              id="contactPhone"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="+6281234567890"
            />
          </Field>
          <Field id="contactAddress" label="Alamat">
            <Textarea
              id="contactAddress"
              value={form.contactAddress}
              onChange={(e) => set("contactAddress", e.target.value)}
              placeholder="Jl. Kenanga No. 12, Jakarta Selatan"
              rows={2}
            />
          </Field>
        </Section>

        {/* Social media */}
        <Section title="Media Sosial">
          <Field id="socialInstagram" label="Instagram">
            <Input
              id="socialInstagram"
              value={form.socialInstagram}
              onChange={(e) => set("socialInstagram", e.target.value)}
              placeholder="https://instagram.com/mamabear.id"
            />
          </Field>
          <Field id="socialTiktok" label="TikTok">
            <Input
              id="socialTiktok"
              value={form.socialTiktok}
              onChange={(e) => set("socialTiktok", e.target.value)}
              placeholder="https://tiktok.com/@mamabear.id"
            />
          </Field>
          <Field id="socialFacebook" label="Facebook">
            <Input
              id="socialFacebook"
              value={form.socialFacebook}
              onChange={(e) => set("socialFacebook", e.target.value)}
              placeholder="https://facebook.com/mamabear.id"
            />
          </Field>
          <Field id="socialWhatsapp" label="WhatsApp">
            <Input
              id="socialWhatsapp"
              value={form.socialWhatsapp}
              onChange={(e) => set("socialWhatsapp", e.target.value)}
              placeholder="https://wa.me/6281234567890"
            />
          </Field>
        </Section>

        {/* Shipping & commerce */}
        <Section title="Pengiriman & Transaksi">
          <Field id="shippingOriginCityId" label="Kota Asal Pengiriman" hint="City ID dari RajaOngkir">
            <Input
              id="shippingOriginCityId"
              value={form.shippingOriginCityId}
              onChange={(e) => set("shippingOriginCityId", e.target.value)}
              placeholder="151 (Jakarta Pusat)"
            />
          </Field>
          <Field id="taxRate" label="Pajak (%)" hint="0 = tidak ada pajak">
            <Input
              id="taxRate"
              type="number"
              min={0}
              max={100}
              value={form.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
              placeholder="11"
            />
          </Field>
          <Field id="currency" label="Mata Uang">
            <Input
              id="currency"
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              placeholder="IDR"
            />
          </Field>
        </Section>

        {/* Maintenance */}
        <Section title="Mode Pemeliharaan">
          <Field
            id="maintenanceMode"
            label="Maintenance Mode"
            hint="Saat aktif, pengunjung akan melihat halaman under maintenance"
          >
            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="maintenanceMode"
                checked={form.maintenanceMode}
                onCheckedChange={(v) => set("maintenanceMode", v)}
              />
              <span className="text-sm text-muted-foreground">
                {form.maintenanceMode ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </Field>
        </Section>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Simpan Settings
          </Button>
        </div>
      </div>
    </div>
  );
}