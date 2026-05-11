"use client";

// Note: Because this needs to run on server, we will use a hybrid approach or an API route.
// But for Next.js 14+, we can use Server Actions.
// Actually, I'll create a simple API route for more stability with large files.

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function uploadToR2(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const key = `notoprajan/${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await r2.send(command);
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${key}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw new Error("Gagal mengunggah ke Cloudflare");
  }
}
