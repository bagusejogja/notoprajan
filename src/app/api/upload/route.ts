import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

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

    await r2.send(command);
    
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${key}`;
    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json({ error: "Gagal mengunggah ke Cloudflare" }, { status: 500 });
  }
}
