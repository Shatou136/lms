// import { env } from "@/lib/env";

// export function useConstructUrl(key: string): string {
//     return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
// }

// hooks/use-construct-url.ts
// Now constructs Cloudinary URLs from a public_id

export function useConstructUrl(key: string): string {
  if (!key) return "";

  // If it's already a full URL (e.g. old Tigris URLs), return as-is
  if (key.startsWith("http")) return key;

  // Construct Cloudinary delivery URL from public_id
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${key}`;
}