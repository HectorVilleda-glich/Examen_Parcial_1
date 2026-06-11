import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      bio?: string;
      hourlyRate?: number;
      country?: string;
    };

    const { title, bio, hourlyRate, country } = body;

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { title, bio, hourlyRate, country },
      create: {
        userId: session.user.id,
        title,
        bio,
        hourlyRate,
        country,
      },
    });

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar el perfil." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(profile ?? {});
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener el perfil." },
      { status: 500 },
    );
  }
}
