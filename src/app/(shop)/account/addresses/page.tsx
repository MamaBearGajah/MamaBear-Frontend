"use client";

import React, { useState, useEffect } from "react";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import { MapPin, Plus, Edit2, Trash2, X, AlertCircle, Home, Briefcase } from "lucide-react";
import { profileApi } from "@/lib/api/profile";
import type { Address, AddressPayload } from "@/types";

const ADDRESS_LABELS = ["Home", "Office", "Other"];

function getLabelIcon(label: string) {
  if (label === "Home") return <Home size={13} />;
  if (label === "Office") return <Briefcase size={13} />;
  return <MapPin size={13} />;
}

const EMPTY_ADDR_FORM: AddressPayload = {
  label: "Home", name: "", phone: "", address: "",
  city: "", province: "", postalCode: "", isDefault: false,
};

const mockShippingApi = {
  getProvinces: async () => [
    { id: "prov-1", name: "DKI Jakarta" },
    { id: "prov-2", name: "Jawa Barat" },
    { id: "prov-3", name: "Banten" },
  ],
  getCities: async (provinceId: string) => {
    const cities: Record<string, { id: string, name: string }[]> = {
      "prov-1": [{ id: "city-1", name: "Jakarta Pusat" }, { id: "city-2", name: "Jakarta Selatan" }],
      "prov-2": [{ id: "city-3", name: "Bandung" }, { id: "city-4", name: "Depok" }, { id: "city-5", name: "Bekasi" }],
      "prov-3": [{ id: "city-6", name: "Tangerang" }, { id: "city-7", name: "Tangerang Selatan" }],
    };
    return cities[provinceId] || [];
  }
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddressPayload>(EMPTY_ADDR_FORM);
  const [addrErrors, setAddrErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [provinces, setProvinces] = useState<{ id: string, name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string, name: string }[]>([]);
  const [selectedProvId, setSelectedProvId] = useState<string>("");
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const res = await profileApi.getProfile();
        setAddresses(res.data.addresses || []);
      } catch (error) {
        console.error("Failed to fetch addresses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (showAddrForm && provinces.length === 0) mockShippingApi.getProvinces().then(setProvinces);
  }, [showAddrForm, provinces.length]);

  useEffect(() => {
    if (selectedProvId) {
      setIsLoadingCities(true);
      mockShippingApi.getCities(selectedProvId).then((data) => {
        setCities(data);
        setIsLoadingCities(false);
      });
    } else {
      setCities([]);
    }
  }, [selectedProvId]);

  const openAddAddr = () => {
    setAddrForm(EMPTY_ADDR_FORM);
    setSelectedProvId("");
    setCities([]);
    setAddrErrors({});
    setEditingAddrId(null);
    setShowAddrForm(true);
  };

  const openEditAddr = (addr: Address) => {
    setAddrForm({ ...addr });
    setAddrErrors({});
    setEditingAddrId(addr.id);
    const foundProv = provinces.find(p => p.name === addr.province);
    if (foundProv) setSelectedProvId(foundProv.id);
    setShowAddrForm(true);
  };

  const handleProvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = e.target.value;
    const provName = e.target.options[e.target.selectedIndex].text;
    setSelectedProvId(provId);
    setAddrForm(prev => ({ ...prev, province: provId ? provName : "", city: "" }));
  };

  const validateAddrForm = () => {
    const errs: Record<string, string> = {};
    if (!addrForm.name.trim()) errs.name = "Nama penerima wajib diisi";
    if (!addrForm.phone.trim()) errs.phone = "Nomor telepon wajib diisi";
    if (!addrForm.province) errs.province = "Provinsi wajib dipilih";
    if (!addrForm.city.trim()) errs.city = "Kota wajib dipilih";
    if (!addrForm.address.trim()) errs.address = "Alamat lengkap wajib diisi";
    if (!addrForm.postalCode || !/^\d{5}$/.test(addrForm.postalCode)) errs.postalCode = "Kode pos harus 5 digit angka";
    setAddrErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddr = async () => {
    if (!validateAddrForm()) return;
    try {
      setIsSubmitting(true);
      let res;
      if (editingAddrId) res = await profileApi.updateAddress(editingAddrId, addrForm);
      else res = await profileApi.addAddress(addrForm);
      setAddresses(res.data.addresses);
      setShowAddrForm(false);
      setEditingAddrId(null);
      setAddrForm(EMPTY_ADDR_FORM);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddr = async (id: string) => {
    try {
      const res = await profileApi.deleteAddress(id);
      setAddresses(res.data.addresses);
      setDeleteConfirm(null);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSetDefaultAddr = async (id: string) => {
    try {
      const res = await profileApi.setDefaultAddress(id);
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="py-20 text-center text-gray-500">Memuat buku alamat...</div>;

  const ActionBtn = !showAddrForm ? (
    <button
      onClick={openAddAddr}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 shadow-sm bg-[#F05A89]"
    >
      <Plus size={16} /> Add Address
    </button>
  ) : undefined;

  return (
    <AccountPageWrapper title="Address Book" icon={MapPin} actionButton={ActionBtn}>
      
      {/* FORM ALAMAT */}
      {showAddrForm && (
        <div className="bg-white rounded-2xl border p-6 sm:p-8 mb-6 animate-in zoom-in-95 border-[#F8D7E3]">
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-[#F8D7E3]">
            <h3 className="font-bold text-lg text-gray-800">{editingAddrId ? "Edit Address" : "New Address"}</h3>
            <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }} className="p-1.5 rounded-full hover:bg-[#FDF2F5] transition-colors">
              <X size={20} className="text-[#F05A89]" />
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            {ADDRESS_LABELS.map(lbl => (
              <button
                key={lbl}
                onClick={() => setAddrForm(f => ({ ...f, label: lbl }))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all"
                style={{
                  borderColor: addrForm.label === lbl ? "#F05A89" : "#F8D7E3",
                  backgroundColor: addrForm.label === lbl ? "#FDF2F5" : "white",
                  color: addrForm.label === lbl ? "#F05A89" : "#6B7280",
                }}
              >
                {getLabelIcon(lbl)} {lbl}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-600 block mb-2">Recipient Name *</label>
              <input type="text" value={addrForm.name} onChange={e => setAddrForm(f => ({ ...f, name: e.target.value }))} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:border-[#F05A89] ${addrErrors.name ? 'border-red-500' : 'border-[#F8D7E3]'}`} />
              {addrErrors.name && <p className="text-xs text-red-500 mt-1">{addrErrors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Phone Number *</label>
              <input type="tel" value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:border-[#F05A89] ${addrErrors.phone ? 'border-red-500' : 'border-[#F8D7E3]'}`} />
              {addrErrors.phone && <p className="text-xs text-red-500 mt-1">{addrErrors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Postal Code *</label>
              <input type="text" value={addrForm.postalCode} onChange={e => setAddrForm(f => ({ ...f, postalCode: e.target.value }))} maxLength={5} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:border-[#F05A89] ${addrErrors.postalCode ? 'border-red-500' : 'border-[#F8D7E3]'}`} />
              {addrErrors.postalCode && <p className="text-xs text-red-500 mt-1">{addrErrors.postalCode}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Province *</label>
              <select value={selectedProvId} onChange={handleProvChange} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none appearance-none bg-white ${addrErrors.province ? 'border-red-500' : 'border-[#F8D7E3]'}`}>
                <option value="">Select province...</option>
                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {addrErrors.province && <p className="text-xs text-red-500 mt-1">{addrErrors.province}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">City * {isLoadingCities && <span className="text-[#F05A89] font-normal italic ml-1">Loading...</span>}</label>
              <select value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} disabled={!selectedProvId || isLoadingCities} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none appearance-none ${!selectedProvId ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${addrErrors.city ? 'border-red-500' : 'border-[#F8D7E3]'}`}>
                <option value="">Select city...</option>
                {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              {addrErrors.city && <p className="text-xs text-red-500 mt-1">{addrErrors.city}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-600 block mb-2">Street Address *</label>
              <textarea value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} rows={3} className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:border-[#F05A89] resize-none ${addrErrors.address ? 'border-red-500' : 'border-[#F8D7E3]'}`} />
              {addrErrors.address && <p className="text-xs text-red-500 mt-1">{addrErrors.address}</p>}
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="addrDefault" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} style={{ accentColor: "#F05A89", width: '16px', height: '16px' }} />
              <label htmlFor="addrDefault" className="text-sm cursor-pointer font-semibold text-gray-600">Set as default address</label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }} className="px-6 py-2.5 rounded-full font-bold text-sm transition-colors bg-[#FDF2F5] text-[#F05A89] hover:bg-[#F8D7E3]">Cancel</button>
            <button onClick={handleSaveAddr} disabled={isSubmitting} className="px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50 bg-[#F05A89]">
              {isSubmitting ? "Saving..." : editingAddrId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!showAddrForm && addresses.length === 0 && (
        <div className="text-center py-20 bg-[#FDF2F5] rounded-2xl border border-dashed border-[#F8D7E3]">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">No saved addresses yet</h3>
          <p className="text-sm mb-6 text-gray-500">Save your address to speed up checkout next time!</p>
          <button onClick={openAddAddr} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-transform hover:-translate-y-0.5 bg-[#F05A89]">
            <Plus size={16} strokeWidth={3} /> Add Your First Address
          </button>
        </div>
      )}

      {/* DAFTAR ALAMAT */}
      {!showAddrForm && addresses.length > 0 && (
        <div className="flex flex-col gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="relative bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md" style={{ borderColor: addr.isDefault ? "#F05A89" : "#F8D7E3", backgroundColor: addr.isDefault ? "#FDF2F5" : "white" }}>
              
              {/* Overlay Confirm Delete */}
              {deleteConfirm === addr.id && (
                <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-10 p-4 text-center backdrop-blur-sm">
                  <AlertCircle size={36} style={{ color: "#EF4444" }} className="mb-3" />
                  <p className="font-bold text-lg mb-1 text-gray-800">Delete this address?</p>
                  <p className="text-xs mb-5 text-gray-500">This action cannot be undone.</p>
                  <div className="flex gap-3 w-full max-w-[280px]">
                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-full text-sm font-bold bg-[#FDF2F5] text-[#F05A89]">Cancel</button>
                    <button onClick={() => handleDeleteAddr(addr.id)} className="flex-1 py-2 rounded-full text-sm font-bold text-white bg-red-500">Delete</button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-base sm:text-lg text-gray-800">{addr.name}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5" style={{ borderColor: "#F05A89", color: "#F05A89", backgroundColor: "white" }}>
                    {getLabelIcon(addr.label)} {addr.label}
                  </span>
                  {addr.isDefault && <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-[#F05A89]">Default</span>}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button onClick={() => openEditAddr(addr)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors bg-[#FDF2F5] text-[#F05A89] hover:bg-[#F8D7E3]">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(addr.id)} className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors bg-white border border-[#F8D7E3] text-[#F05A89] hover:bg-gray-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm leading-relaxed text-gray-600">{addr.address}</p>
                <p className="text-sm text-gray-600">{addr.city}, {addr.province} - {addr.postalCode}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dashed border-[#F8D7E3]">
                <p className="text-sm text-gray-600">Phone: <span className="font-bold text-gray-800">{addr.phone}</span></p>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefaultAddr(addr.id)} className="text-xs font-bold transition-all hover:underline text-[#F05A89]">Set as default</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountPageWrapper>
  );
}