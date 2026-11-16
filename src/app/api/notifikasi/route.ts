import { NextResponse } from 'next/server';
import { getSessionUser } from '@/src/lib/auth/session';
import {
  getJumlahBelumDibaca,
  getNotifikasiUser,
  tandaiNotifikasiDibaca,
  tandaiSemuaNotifikasiDibaca,
} from '@/src/lib/notifikasi/query';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  try {
    const [notifikasi, belumDibaca] = await Promise.all([
      getNotifikasiUser(user.id),
      getJumlahBelumDibaca(user.id),
    ]);
    return NextResponse.json({ ok: true, notifikasi, belumDibaca });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  let body: { aksi?: string; id?: number };
  try {
    body = (await request.json()) as { aksi?: string; id?: number };
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const aksi = body.aksi ?? 'tandai_semua';

  try {
    if (aksi === 'tandai_satuan') {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ ok: false, error: 'ID notifikasi tidak valid' }, { status: 422 });
      }
      await tandaiNotifikasiDibaca(user.id, id);
    } else if (aksi === 'tandai_semua') {
      await tandaiSemuaNotifikasiDibaca(user.id);
    } else {
      return NextResponse.json({ ok: false, error: 'Aksi tidak dikenal' }, { status: 422 });
    }

    const belumDibaca = await getJumlahBelumDibaca(user.id);
    return NextResponse.json({ ok: true, belumDibaca });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
