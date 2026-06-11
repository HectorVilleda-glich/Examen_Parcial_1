import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isUserRole } from "@/lib/roles";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Nombre, email, contraseña y tipo de cuenta son obligatorios." },
        { status: 400 },
      );
    }

    if (!isUserRole(role)) {
      return NextResponse.json(
        { error: "El tipo de cuenta seleccionado no es válido." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electrónico." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
    });

    return NextResponse.json({ message: "Usuario creado correctamente." });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
