import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { ROLE_LABELS } from "@/lib/roles";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.role) {
    redirect("/onboarding/role");
  }

  const roleLabel = ROLE_LABELS[session.user.role];

  return (
    <div className="min-h-screen bg-workana-gray-50">
      <header className="border-b border-workana-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-workana-blue">
            Work<span className="text-workana-gray-700">Clone</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-workana-gray-500 sm:inline">
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
                className="rounded-md border border-workana-gray-200 px-3 py-1.5 text-sm font-medium text-workana-gray-700 transition hover:bg-workana-gray-100"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-lg border border-workana-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-workana-blue">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-workana-gray-900">
            Hola, {session.user.name ?? "usuario"}
          </h1>
          <p className="mt-3 max-w-2xl text-workana-gray-500">
            Bienvenido a tu panel principal. Aquí podrás gestionar proyectos,
            propuestas y perfiles en los próximos sprints.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-workana-blue-light px-4 py-2 text-sm font-medium text-workana-blue-dark">
            <span className="h-2 w-2 rounded-full bg-workana-blue" />
            Cuenta: {roleLabel}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <DashboardCard
              title={
                session.user.role === "FREELANCER"
                  ? "Explorar proyectos"
                  : "Publicar un proyecto"
              }
              description="Módulo disponible en el Sprint 2."
            />
            <DashboardCard
              title={
                session.user.role === "FREELANCER"
                  ? "Mi perfil profesional"
                  : "Buscar freelancers"
              }
              description="Módulo disponible en el Sprint 2."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-workana-gray-200 bg-workana-gray-50 p-6">
      <h2 className="font-semibold text-workana-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-workana-gray-500">{description}</p>
    </div>
  );
}
