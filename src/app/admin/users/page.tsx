"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { PlusCircle, ShieldCheck, Shield, Ban, RotateCcw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { adminUsersApi, type AdminUser } from "@/lib/api/adminUsers";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Create Admin Dialog ──────────────────────────────────────────────────────
function CreateAdminDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" as "admin" | "super_admin" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Semua field wajib diisi");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter");
      return;
    }
    setLoading(true);
    try {
      await adminUsersApi.create(form);
      toast.success("Admin berhasil dibuat");
      onCreated();
      onClose();
      setForm({ name: "", email: "", password: "", role: "admin" });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal membuat admin";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Akun Admin Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@mamabear.id"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as "admin" | "super_admin" }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Buat Admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { state } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUsersApi.getAll();
      const data = res.data?.data ?? (res.data as any)?.data ?? [];
      setAdmins(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Gagal memuat daftar admin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleChangeRole = async (admin: AdminUser) => {
    const newRole = admin.role === "admin" ? "super_admin" : "admin";
    const label = newRole === "super_admin" ? "Super Admin" : "Admin";
    if (!confirm(`Ubah role ${admin.name} menjadi ${label}?`)) return;

    setActionLoading(admin.id + "_role");
    try {
      await adminUsersApi.updateRole(admin.id, newRole);
      toast.success(`Role ${admin.name} berhasil diubah menjadi ${label}`);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal mengubah role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (admin: AdminUser) => {
    if (!confirm(`Nonaktifkan akun ${admin.name}?`)) return;
    setActionLoading(admin.id + "_deactivate");
    try {
      await adminUsersApi.deactivate(admin.id);
      toast.success(`Akun ${admin.name} berhasil dinonaktifkan`);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal menonaktifkan akun");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (admin: AdminUser) => {
    setActionLoading(admin.id + "_reactivate");
    try {
      await adminUsersApi.reactivate(admin.id);
      toast.success(`Akun ${admin.name} berhasil diaktifkan kembali`);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal mengaktifkan akun");
    } finally {
      setActionLoading(null);
    }
  };

  const isSelf = (id: string) => state.user?.id === id;

  return (
    <div className="flex flex-1 flex-col p-6 md:p-8">
      <AdminPageHeader title="Manajemen Admin" userName={state.user?.name ?? "Admin"} />

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Akun Admin ({admins.length})
          </h2>
          <Button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2"
          >
            <PlusCircle className="size-4" />
            Tambah Admin
          </Button>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Admin</TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Bergabung</TableHead>
                <TableHead className="text-right font-medium">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Belum ada akun admin
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => {
                  const isActive = !admin.bannedAt;
                  return (
                    <TableRow key={admin.id} className={!isActive ? "opacity-60" : ""}>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold uppercase">
                            {admin.name.substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {admin.name}
                              {isSelf(admin.id) && (
                                <span className="ml-2 text-xs text-muted-foreground">(kamu)</span>
                              )}
                            </span>
                            <span className="text-sm text-muted-foreground">{admin.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            admin.role === "super_admin"
                              ? "border-purple-300 bg-purple-50 text-purple-700"
                              : "border-blue-300 bg-blue-50 text-blue-700"
                          }
                        >
                          {admin.role === "super_admin" ? (
                            <ShieldCheck className="mr-1 size-3" />
                          ) : (
                            <Shield className="mr-1 size-3" />
                          )}
                          {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(admin.createdAt), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Change role button — tidak bisa untuk diri sendiri */}
                          {!isSelf(admin.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              disabled={actionLoading === admin.id + "_role"}
                              onClick={() => handleChangeRole(admin)}
                              title={admin.role === "super_admin" ? "Turunkan ke Admin" : "Jadikan Super Admin"}
                            >
                              {actionLoading === admin.id + "_role" ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : admin.role === "super_admin" ? (
                                "→ Admin"
                              ) : (
                                "→ Super Admin"
                              )}
                            </Button>
                          )}

                          {/* Activate / Deactivate */}
                          {!isSelf(admin.id) && (
                            isActive ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                disabled={actionLoading === admin.id + "_deactivate"}
                                onClick={() => handleDeactivate(admin)}
                                title="Nonaktifkan"
                              >
                                {actionLoading === admin.id + "_deactivate" ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Ban className="size-4" />
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                disabled={actionLoading === admin.id + "_reactivate"}
                                onClick={() => handleReactivate(admin)}
                                title="Aktifkan Kembali"
                              >
                                {actionLoading === admin.id + "_reactivate" ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="size-4" />
                                )}
                              </Button>
                            )
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateAdminDialog
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={fetchAdmins}
      />
    </div>
  );
}