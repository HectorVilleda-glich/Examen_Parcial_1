"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createProposal(projectId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "FREELANCER") {
    throw new Error("Solo los freelancers pueden enviar propuestas");
  }

  const bidAmount = formData.get("bidAmount") as string;
  const deliveryDays = formData.get("deliveryDays") as string;
  const coverLetter = formData.get("coverLetter") as string;

  if (!bidAmount || !deliveryDays || !coverLetter) {
    throw new Error("Todos los campos son obligatorios");
  }

  await prisma.proposal.create({
    data: {
      projectId,
      freelancerId: session.user.id,
      bidAmount: Number(bidAmount),
      deliveryDays: Number(deliveryDays),
      coverLetter,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}?success=1`);
}
