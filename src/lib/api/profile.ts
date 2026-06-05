import type { Address, AddressPayload, UpdateProfilePayload, UserProfile } from "@/types";

// Mock Data Awal (Sudah disesuaikan dengan BE)
let MOCK_PROFILE: UserProfile = {
  id: "u-123",
  name: "Nad Tiarsono",
  email: "nad@example.com",
  phone: "081234567890",
  role: "customer",
  isVerified: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  dateOfBirth: "1995-08-15",
  memberSince: "2024-01",
  preferences: {
    newsletter: true,
    emailOrderUpdates: true,
    smsNotifications: false,
  },
  addresses: [
    {
      id: "addr-1",
      label: "Home",
      name: "Nad Tiarsono",
      phone: "081234567890",
      province: "DKI Jakarta",
      city: "Central Jakarta",
      postalCode: "10110",
      address: "Jl. Sudirman No. 1, Kos Area",
      isDefault: true,
    },
  ],
};

export const getOrders = async (): Promise<{ data: any[] }> => {
    await delay(500);
    return {
      data: [
        {
          id: "ORD-2026-8921",
          createdAt: new Date().toISOString(),
          status: "delivered",
          total: 98000,
          items: [
            {
              quantity: 2,
              price: 49000,
              variant: {
                product: { name: "ASI Booster Tea – Thai Milk Tea" }
              }
            }
          ]
        },
        {
          id: "ORD-2026-7732",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 hari lalu
          status: "processing",
          total: 176000,
          items: [
            {
              quantity: 3,
              price: 39000,
              variant: { product: { name: "Kookie Bites – Chocolate Chip" } }
            },
            {
              quantity: 1,
              price: 59000,
              variant: { product: { name: "Almon Mix – Vanilla" } }
            }
          ]
        }
      ]
    };
  }

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const profileApi = {
  getProfile: async (): Promise<{ data: UserProfile }> => {
    await delay(500);
    return { data: { ...MOCK_PROFILE } };
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<{ data: UserProfile }> => {
    await delay(500);
    MOCK_PROFILE = { ...MOCK_PROFILE, ...payload } as UserProfile;
    return { data: { ...MOCK_PROFILE } };
  },

  addAddress: async (payload: AddressPayload): Promise<{ data: UserProfile }> => {
    await delay(500);
    const newAddress: Address = { ...payload, id: `addr-${Date.now()}` };
    
    if (newAddress.isDefault) {
      MOCK_PROFILE.addresses.forEach(a => a.isDefault = false);
    }
    
    MOCK_PROFILE.addresses.push(newAddress);
    return { data: { ...MOCK_PROFILE } };
  },

  updateAddress: async (id: string, payload: AddressPayload): Promise<{ data: UserProfile }> => {
    await delay(500);
    if (payload.isDefault) {
      MOCK_PROFILE.addresses.forEach(a => a.isDefault = false);
    }
    MOCK_PROFILE.addresses = MOCK_PROFILE.addresses.map(a => 
      a.id === id ? { ...a, ...payload } : a
    );
    return { data: { ...MOCK_PROFILE } };
  },

  deleteAddress: async (id: string): Promise<{ data: UserProfile }> => {
    await delay(500);
    MOCK_PROFILE.addresses = MOCK_PROFILE.addresses.filter(a => a.id !== id);
    return { data: { ...MOCK_PROFILE } };
  },

  setDefaultAddress: async (id: string): Promise<{ data: UserProfile }> => {
    await delay(500);
    MOCK_PROFILE.addresses = MOCK_PROFILE.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    return { data: { ...MOCK_PROFILE } };
  },

  changePassword: async (payload: any): Promise<{ success: boolean }> => {
    await delay(800);
    return { success: true };
  }



};