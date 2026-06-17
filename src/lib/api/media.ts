import { apiClient } from "./client";

export interface SignedUploadData {
  uploadUrl: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  folder: string;
}

export interface UploadResult {
  imageUrl: string;
  publicId: string;
}

/**
 * Step 1: Minta signed URL dari BE
 */
export async function getSignedUploadUrl(
  folder: string,
  fileName?: string,
  fileType?: string
): Promise<SignedUploadData> {
  const { data } = await apiClient.post<{ success: boolean; data: SignedUploadData }>(
    "/media/sign",
    { folder, fileName, fileType }
  );
  return data.data;
}

/**
 * Step 2: Upload file langsung ke Cloudinary pakai signed URL
 */
export async function uploadToCloudinary(
  file: File,
  signedData: SignedUploadData
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signedData.apiKey);
  formData.append("timestamp", String(signedData.timestamp));
  formData.append("signature", signedData.signature);
  formData.append("folder", signedData.folder);

  const res = await fetch(signedData.uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload ke Cloudinary gagal: ${errText}`);
  }

  const json = await res.json() as { secure_url: string };
  if (!json.secure_url) throw new Error("secure_url tidak ada di response Cloudinary");
  return json.secure_url;
}

/**
 * Upload via server (fallback jika signed URL tidak tersedia)
 */
export async function uploadViaServer(
  file: File,
  folder = "uploads"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const { data } = await apiClient.post<{ success: boolean; data: UploadResult }>(
    "/media/upload",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  if (!data.data?.imageUrl) {
    throw new Error("imageUrl tidak ditemukan di response upload");
  }
  return data.data;
}

/**
 * Upload gambar dengan auto-fallback:
 * Coba signed URL dulu, kalau gagal pakai server upload
 */
export async function uploadImage(
  file: File,
  folder = "uploads"
): Promise<string> {
  try {
    const signedData = await getSignedUploadUrl(folder, file.name, file.type);
    return await uploadToCloudinary(file, signedData);
  } catch (signedErr) {
    console.warn("Signed URL upload gagal, fallback ke server upload:", signedErr);
    const result = await uploadViaServer(file, folder);
    return result.imageUrl;
  }
}

/**
 * Upload blog cover image
 */
export async function uploadBlogCoverImage(file: File): Promise<string> {
  return uploadImage(file, "blog");
}

/**
 * Upload product image
 */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, "products");
}

/**
 * Hapus file dari Cloudinary
 */
export async function deleteMedia(publicId: string): Promise<void> {
  await apiClient.delete(`/media/${encodeURIComponent(publicId)}`);
}