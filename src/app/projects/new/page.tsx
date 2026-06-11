import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/project-categories";
import { createProject } from "@/app/actions/projects";

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "CLIENTE") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </span>
          <span className="text-sm text-[#6b7280]">Publicar proyecto</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-lg border border-[#dde3ea] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#007bd2]">
            Nuevo proyecto
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#1f2937]">
            Publica un proyecto
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Describe el trabajo que necesitas y recibe propuestas de
            freelancers calificados.
          </p>

          <form action={createProject} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-[#374151]"
              >
                Título del proyecto
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Ej: Landing page corporativa"
                className="w-full rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-[#374151]"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Describe el alcance del trabajo, tecnologías deseadas, plazo estimado..."
                className="w-full resize-none rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="mb-1.5 block text-sm font-medium text-[#374151]"
                >
                  Presupuesto estimado (USD)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Ej: 500"
                  className="w-full rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-md bg-[#007bd2] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3]"
              >
                Publicar proyecto
              </button>
              <a
                href="/dashboard"
                className="rounded-md border border-[#dde3ea] px-6 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#eef2f6]"
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
