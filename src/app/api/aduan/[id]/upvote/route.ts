import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { getVerifiedWarga } from '@/src/lib/auth/guard';

async function getUpvoteState(aduanId: number, userId: number) {
  const existing = await db.orm.public.Upvote.where({ aduanId, userId }).first();
  return Boolean(existing);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  const { id } = await context.params;
  const aduanId = Number(id);
  if (!Number.isInteger(aduanId) || aduanId <= 0) {
    return NextResponse.json({ ok: false, error: 'ID aduan tidak valid' }, { status: 422 });
  }

  try {
    const aduan = await db.orm.public.Aduan.first({ id: aduanId });
    if (!aduan) {
      return NextResponse.json({ ok: false, error: 'Aduan tidak ditemukan' }, { status: 404 });
    }

    let bolehUpvote = true;
    let alasan: string | null = null;
    if (viewer.role === 'Warga') {
      if (aduan.pelaporId === viewer.id) {
        bolehUpvote = false;
        alasan = 'Ini aduan Anda sendiri.';
      } else if (!viewer.kecamatanId) {
        bolehUpvote = false;
        alasan = 'Akun Anda belum memiliki kecamatan. Atur kecamatan Anda di halaman Profil.';
      } else if (aduan.kecamatanId !== viewer.kecamatanId) {
        bolehUpvote = false;
        alasan = 'Anda hanya dapat mendukung aduan di kecamatan Anda.';
      }
    } else {
      bolehUpvote = false;
      alasan = 'Hanya warga yang dapat mendukung aduan.';
    }

    return NextResponse.json({
      ok: true,
      totalUpvote: aduan.totalUpvote,
      sudahUpvote: await getUpvoteState(aduanId, viewer.id),
      bolehUpvote,
      alasan,
    });
  } catch (error) {
    console.error('GET upvote gagal:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getVerifiedWarga();
  if (!user) {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
    }
    return NextResponse.json(
      { ok: false, error: 'Akun Anda belum terverifikasi.' },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const aduanId = Number(id);
  if (!Number.isInteger(aduanId) || aduanId <= 0) {
    return NextResponse.json({ ok: false, error: 'ID aduan tidak valid' }, { status: 422 });
  }

  try {
    const aduan = await db.orm.public.Aduan.first({ id: aduanId });
    if (!aduan) {
      return NextResponse.json({ ok: false, error: 'Aduan tidak ditemukan' }, { status: 404 });
    }

    if (aduan.pelaporId === user.id) {
      return NextResponse.json(
        { ok: false, error: 'Anda tidak dapat mendukung aduan Anda sendiri.' },
        { status: 422 },
      );
    }

    if (!user.kecamatanId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Akun Anda belum memiliki kecamatan. Atur kecamatan Anda di halaman Profil terlebih dahulu.',
        },
        { status: 403 },
      );
    }
    if (aduan.kecamatanId !== user.kecamatanId) {
      return NextResponse.json(
        { ok: false, error: 'Anda hanya dapat mendukung aduan di kecamatan Anda.' },
        { status: 403 },
      );
    }

    const existing = await db.orm.public.Upvote.where({ aduanId, userId: user.id }).first();

    if (existing) {
      await db.orm.public.Upvote.where({ aduanId, userId: user.id }).delete();
      await db.orm.public.Aduan.where({ id: aduanId }).update({
        totalUpvote: Math.max(0, aduan.totalUpvote - 1),
      });
      return NextResponse.json({
        ok: true,
        sudahUpvote: false,
        totalUpvote: Math.max(0, aduan.totalUpvote - 1),
      });
    }

    await db.orm.public.Upvote.create({ aduanId, userId: user.id });
    await db.orm.public.Aduan.where({ id: aduanId }).update({
      totalUpvote: aduan.totalUpvote + 1,
    });
    return NextResponse.json({
      ok: true,
      sudahUpvote: true,
      totalUpvote: aduan.totalUpvote + 1,
    });
  } catch (error) {
    console.error('POST upvote gagal:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
