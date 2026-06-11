import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/project-categories";
import { createProposal } from "@/app/actions/proposals";

interface Props {
  params: Promise<{ id: string }>;
}

function formatBudget(budget: number | null): string {
  if (budget === null) return "A convenir";
  return new Intl.NumberFormat("es-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(budget);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, image: true } },
      proposals: {
        where: { freelancerId: session.user.id },
        select: { id: true },
      },
    },
  });

  if (!project) notFound();

  const isFreelancer = session.user.role === "FREELANCER";
  const alreadyApplied = project.proposals.length > 0;
  const createProposalWithId = createProposal.bind(null, project.id);

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>
          <Link href="/projects/explore" className="text-sm font-medium text-[#007bd2] hover:underline">
            &larr; Volver al explorador
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border border-[#dde3ea] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-[#e8f4fc] px-3 py-1 text-xs font-semibold text-[#0066b3]">
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Abierto
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-[#1f2937]">{project.title}</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Publicado por {project.client.name || "Cliente"} &middot;{" "}
            {new Date(project.createdAt).toLocaleDateString("es-ES", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="rounded-lg bg-green-50 px-4 py-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Presupuesto</p>
              <p className="text-lg font-bold text-green-600">{formatBudget(project.budget)}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#dde3ea] pt-8">
            <h2 className="text-lg font-semibold text-[#1f2937]">Descripción del proyecto</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#6b7280]">
              {project.description}
            </p>
          </div>
        </div>

        {isFreelancer && !alreadyApplied && (
          <div className="mt-8 rounded-xl border border-[#dde3ea] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1f2937]">Envía tu propuesta</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Define tu tarifa, tiempo de entrega y convence al cliente.
            </p>

            <form action={createProposalWithId} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="bidAmount" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Tu oferta económica (USD)
                  </label>
                  <input
                    id="bidAmount" name="bidAmount" type="number" required min={1} step={0.01}
                    placeholder="Ej: 150"
                    className="w-full rounded-md border border-[#dde3ea] px-4 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryDays" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Tiempo estimado (Días)
                  </label>
                  <input
                    id="deliveryDays" name="deliveryDays" type="number" required min={1}
                    placeholder="Ej: 5"
                    className="w-full rounded-md border border-[#dde3ea] px-4 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="coverLetter" className="mb-1.5 block text-sm font-medium text-[#374151]">
                  Propuesta / Carta de presentación
                </label>
                <textarea
                  id="coverLetter" name="coverLetter" rows={5} required
                  placeholder="Explica por qué eres el freelancer ideal, tu experiencia y cómo abordarías el trabajo..."
                  className="w-full resize-none rounded-md border border-[#dde3ea] px-4 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                />
              </div>

              <div className="flex justify-end border-t border-[#dde3ea] pt-5">
                <button
                  type="submit"
                  className="rounded-md bg-[#007bd2] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3]"
                >
                  Enviar Propuesta
                </button>
              </div>
            </form>
          </div>
        )}

        {isFreelancer && alreadyApplied && (
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
            <p className="text-lg font-semibold text-green-800">
              Ya enviaste una propuesta para este proyecto
            </p>
            <p className="mt-1 text-sm text-green-700">
              El cliente revisará tu propuesta y te contactará si hay interés.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
