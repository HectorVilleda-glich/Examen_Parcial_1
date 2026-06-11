"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ProjectCategory } from "@prisma/client";

export async function createProject(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "CLIENTE") {
    throw new Error("No autorizado");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budget = formData.get("budget") as string;
  const category = formData.get("category") as ProjectCategory;

  if (!title || !description || !category) {
    throw new Error("Título, descripción y categoría son obligatorios");
  }

  await prisma.project.create({
    data: {
      title,
      description,
      budget: budget ? Number(budget) : null,
      category,
      clientId: session.user.id,
    },
  });

  revalidatePath("/projects/explore");
  redirect("/projects/explore");
}
