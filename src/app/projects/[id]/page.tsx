import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/project-categories";
import { createProposal } from "@/app/actions/proposals";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

function formatBudget(budget: number | null): string {
  if (budget === null) return "A convenir";
  return new Intl.NumberFormat("es-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(budget);
}

export default async function ProjectDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { success } = await searchParams;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, image: true } },
    },
  });

  if (!project) notFound();

  const isOwner = session.user.id === project.clientId;

  let proposals: Array<{
    id: string;
    bidAmount: number;
    deliveryDays: number;
    coverLetter: string;
    status: string;
    createdAt: Date;
    freelancer: { name: string | null; image: string | null; profile: { title: string | null; country: string | null } | null };
  }> = [];

  if (isOwner) {
    proposals = await prisma.proposal.findMany({
      where: { projectId: project.id },
      include: {
        freelancer: {
          select: {
            name: true,
            image: true,
            profile: { select: { title: true, country: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const isFreelancer = session.user.role === "FREELANCER";

  let alreadyApplied = false;
  if (isFreelancer) {
    const existing = await prisma.proposal.findFirst({
      where: { projectId: project.id, freelancerId: session.user.id },
      select: { id: true },
    });
    alreadyApplied = !!existing;
  }

  const createProposalWithId = createProposal.bind(null, project.id);

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>
          <Link href={isOwner ? "/dashboard" : "/projects/explore"} className="text-sm font-medium text-[#007bd2] hover:underline">
            &larr; Volver
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {success && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 shadow-sm">
            Propuesta enviada con exito. El cliente revisara tu postulacion.
          </div>
        )}

        <div className="rounded-xl border border-[#dde3ea] bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-[#e8f4fc] px-3 py-1 text-xs font-semibold text-[#0066b3]">
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              {project.status === "ABIERTO" ? "Abierto" : project.status}
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
            <h2 className="text-lg font-semibold text-[#1f2937]">Descripcion del proyecto</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#6b7280]">
              {project.description}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#1f2937] mb-4">
              Propuestas recibidas ({proposals.length})
            </h2>
            {proposals.length === 0 ? (
              <div className="rounded-xl border border-[#dde3ea] bg-white p-8 text-center shadow-sm">
                <p className="text-[#6b7280]">Aun no has recibido propuestas para este proyecto.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="rounded-xl border border-[#dde3ea] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f4fc] text-sm font-bold text-[#007bd2]">
                          {(proposal.freelancer.name || "F")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1f2937]">{proposal.freelancer.name || "Freelancer"}</p>
                          <p className="text-xs text-[#6b7280]">
                            {proposal.freelancer.profile?.title || "Freelancer"}
                            {proposal.freelancer.profile?.country && ` - ${proposal.freelancer.profile.country}`}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        proposal.status === "PENDIENTE"
                          ? "bg-amber-50 text-amber-700"
                          : proposal.status === "ACEPTADA"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          proposal.status === "PENDIENTE" ? "bg-amber-600" : proposal.status === "ACEPTADA" ? "bg-green-600" : "bg-red-600"
                        }`} />
                        {proposal.status === "PENDIENTE" ? "Pendiente" : proposal.status === "ACEPTADA" ? "Aceptada" : "Rechazada"}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <div className="rounded-md bg-[#f7f9fb] px-3 py-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Oferta</p>
                        <p className="text-sm font-bold text-[#1f2937]">{formatBudget(proposal.bidAmount)}</p>
                      </div>
                      <div className="rounded-md bg-[#f7f9fb] px-3 py-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Entrega</p>
                        <p className="text-sm font-bold text-[#1f2937]">{proposal.deliveryDays} dias</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#dde3ea] pt-4">
                      <p className="text-sm leading-relaxed text-[#6b7280] whitespace-pre-wrap">{proposal.coverLetter}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#dde3ea] pt-4">
                      <p className="text-xs text-[#9ca3af]">
                        Recibida el {new Date(proposal.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                      {proposal.status === "PENDIENTE" && (
                        <div className="flex gap-2">
                          <button className="rounded-md bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700">
                            Aceptar
                          </button>
                          <button className="rounded-md border border-[#dde3ea] px-4 py-1.5 text-xs font-semibold text-[#374151] transition hover:bg-[#eef2f6]">
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isFreelancer && !alreadyApplied && (
          <div className="mt-8 rounded-xl border border-[#dde3ea] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#1f2937]">Envia tu propuesta</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Define tu tarifa, tiempo de entrega y convence al cliente.
            </p>

            <form action={createProposalWithId} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="bidAmount" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Tu oferta economica (USD)
                  </label>
                  <input
                    id="bidAmount" name="bidAmount" type="number" required min={1} step={0.01}
                    placeholder="Ej: 150"
                    className="w-full rounded-md border border-[#dde3ea] px-4 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryDays" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Tiempo estimado (Dias)
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
                  Propuesta / Carta de presentacion
                </label>
                <textarea
                  id="coverLetter" name="coverLetter" rows={5} required
                  placeholder="Explica por que eres el freelancer ideal, tu experiencia y como abordarias el trabajo..."
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
              El cliente revisara tu propuesta y te contactara si hay interes.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
