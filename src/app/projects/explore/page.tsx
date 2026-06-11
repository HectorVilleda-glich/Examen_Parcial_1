import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/project-categories";

function formatBudget(budget: number | null): string {
  if (budget === null) return "A convenir";
  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(budget);
}

export default async function ExploreProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { status: "ABIERTO" },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#374151] sm:flex">
            <Link href="/dashboard" className="hover:text-[#007bd2]">
              Dashboard
            </Link>
            <Link href="/projects/explore" className="text-[#007bd2]">
              Explorar
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#6b7280] sm:inline">
              {session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-[#dde3ea] px-3 py-1.5 text-sm font-medium text-[#374151] transition hover:bg-[#eef2f6]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#007bd2]">
              Explorar proyectos
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#1f2937]">
              Proyectos disponibles
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              {projects.length > 0
                ? `${projects.length} proyecto${projects.length !== 1 ? "s" : ""} abierto${projects.length !== 1 ? "s" : ""} para explorar.`
                : "No hay proyectos abiertos en este momento."}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#007bd2] hover:text-[#0066b3] hover:underline"
          >
            &larr; Volver al Dashboard
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#dde3ea] bg-white p-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f4fc]">
              <svg className="h-8 w-8 text-[#007bd2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-[#1f2937]">
              No hay proyectos disponibles
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">
          Los nuevos proyectos publicados aparecerán aquí. Vuelve más tarde.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-[#dde3ea] bg-white p-6 shadow-sm transition-all hover:border-[#007bd2]/30 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full bg-[#e8f4fc] px-3 py-1 text-xs font-semibold text-[#0066b3]">
                        {CATEGORY_LABELS[project.category]}
                      </span>
                      <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Abierto
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold text-[#1f2937] transition-colors hover:text-[#007bd2]">
                      {project.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      Publicado por {project.client.name || "Cliente"} &middot;{" "}
                      {new Date(project.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#6b7280] line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right sm:min-w-[160px]">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">
                      Presupuesto
                    </p>
                    <p className="mt-1 text-xl font-bold text-green-600">
                      {formatBudget(project.budget)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end border-t border-[#dde3ea] pt-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="rounded-md bg-[#007bd2] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0066b3]"
                  >
                    Ver detalles y postularse
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
