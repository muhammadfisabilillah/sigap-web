import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { getSessionUser } from "@/src/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Harus login terlebih dahulu" }, { status: 401 });
  }

  if (user.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Akses hanya untuk admin" }, { status: 403 });
  }

  try {
    const pengajuan = await db.orm.public.VerifikasiDomisili.select(
      "id",
      "userId",
      "status",
      "catatan",
      "fileKtpUrl",
      "createdAt",
    ).all();

    return NextResponse.json({
      ok: true,
      pengajuan,
    });
  } catch (error) {
    console.error("Gagal mengambil pengajuan domisili:", error);

    return NextResponse.json({ ok: false, error: "Gagal mengambil daftar pengajuan domisili" }, { status: 500 });
  }
}
