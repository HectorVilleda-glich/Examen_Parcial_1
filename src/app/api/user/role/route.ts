import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/roles";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { role?: string };
    const { role } = body;

    if (!role || !isRole(role)) {
      return NextResponse.json(
        { error: "Debes seleccionar un tipo de cuenta válido." },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
      select: { id: true, role: true },
    });

    return NextResponse.json({ role: user.role });
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar el tipo de cuenta." },
      { status: 500 },
    );
  }
}
