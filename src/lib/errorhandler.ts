import axios from "axios";

type ApiErrorResult = {
  title: string;
  description: string;
  code?: string | number;
};

export function handleApiError(error: unknown): ApiErrorResult {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    if (status === 400) {
      return {
        title: "Request tidak valid",
        description: message || "Periksa kembali data yang kamu masukkan.",
        code: status,
      };
    }

    if (status === 401) {
      return {
        title: "Sesi berakhir",
        description: "Silakan login kembali untuk melanjutkan.",
        code: status,
      };
    }

    if (status === 403) {
      return {
        title: "Akses ditolak",
        description: "Kamu tidak memiliki izin untuk melakukan aksi ini.",
        code: status,
      };
    }

    if (status === 404) {
      return {
        title: "Data tidak ditemukan",
        description: "Data yang kamu cari tidak tersedia.",
        code: status,
      };
    }

    if (status && status >= 500) {
      return {
        title: "Server bermasalah",
        description: "Terjadi kendala pada server. Coba lagi beberapa saat.",
        code: status,
      };
    }

    return {
      title: "Terjadi kesalahan",
      description: message || "Coba ulangi beberapa saat lagi.",
      code: status,
    };
  }

  if (error instanceof Error) {
    return {
      title: "Terjadi kesalahan",
      description: error.message,
    };
  }

  return {
    title: "Terjadi kesalahan",
    description: "Coba ulangi beberapa saat lagi.",
  };
}