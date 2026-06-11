import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (!session.user.role) redirect("/onboarding/role");

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });

  const projectCount = await prisma.project.count({
    where: session.user.role === "CLIENTE"
      ? { clientId: session.user.id }
      : { status: "ABIERTO" },
  });

  const roleLabel = ROLE_LABELS[session.user.role];
  const isFreelancer = session.user.role === "FREELANCER";

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#374151] sm:flex">
            <Link href="/dashboard" className="text-[#007bd2]">Dashboard</Link>
            {isFreelancer ? (
              <Link href="/projects/explore" className="hover:text-[#007bd2] transition-colors">Explorar proyectos</Link>
            ) : (
              <Link href="/projects/new" className="hover:text-[#007bd2] transition-colors">Publicar proyecto</Link>
            )}
            <Link href="/onboarding/profile" className="hover:text-[#007bd2] transition-colors">Mi Perfil</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#6b7280] sm:inline">{session.user.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button type="submit" className="rounded-lg border border-[#dde3ea] px-4 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#eef2f6]">Cerrar sesion</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {!profile && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-800 shadow-sm">
            <strong className="font-semibold">Perfil incompleto.</strong> Completa tus datos profesionales para que otros te encuentren.
            <Link href="/onboarding/profile" className="ml-2 font-semibold text-amber-900 underline hover:text-amber-950">Completar perfil &rarr;</Link>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#007bd2]">Dashboard</p>
          <h1 className="text-3xl font-bold text-[#1f2937]">Hola, {session.user.name ?? "usuario"}</h1>
          <p className="text-[#6b7280]">
            {isFreelancer
              ? "Explora proyectos freelance y haz crecer tu carrera profesional."
              : "Publica proyectos y encuentra el talento ideal para tu equipo."}
          </p>
        </div>

        <div className="mb-10 inline-flex items-center gap-2 rounded-lg border border-[#dde3ea] bg-white px-4 py-2 text-sm font-medium text-[#0066b3] shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[#007bd2]" />
          {roleLabel}
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={isFreelancer ? "Proyectos abiertos" : "Mis proyectos"} value={String(projectCount)} icon={isFreelancer ? "🔍" : "📋"} />
          <StatCard label={isFreelancer ? "Propuestas enviadas" : "Postulaciones recibidas"} value="—" icon="📨" />
          <StatCard label={isFreelancer ? "Perfil visto" : "Freelancers contactados"} value="—" icon="👁" />
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {isFreelancer ? (
            <>
              <ActionCard
                title="Explorar proyectos"
                desc="Encuentra proyectos freelance que se ajusten a tus habilidades y experiencia."
                href="/projects/explore"
                cta="Ver proyectos"
              />
              <ActionCard
                title="Mi perfil profesional"
                desc="Actualiza tu informacion, portafolio y tarifa por hora."
                href="/onboarding/profile"
                cta="Editar perfil"
              />
            </>
          ) : (
            <>
              <ActionCard
                title="Publicar un proyecto"
                desc="Describe el trabajo que necesitas y recibe propuestas de freelancers calificados."
                href="/projects/new"
                cta="Publicar proyecto"
              />
              <ActionCard
                title="Buscar freelancers"
                desc="Encuentra profesionales por especialidad, pais y tarifa."
                href="#"
                cta="Proximamente"
                disabled
              />
            </>
          )}
        </div>

        {profile && (
          <div className="rounded-xl border border-[#dde3ea] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1f2937]">Resumen del perfil</h2>
              <Link href="/onboarding/profile" className="text-sm font-medium text-[#007bd2] hover:text-[#0066b3] hover:underline">
                Editar
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {profile.title && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Titulo</span>
                  <p className="mt-1 text-sm font-medium text-[#1f2937]">{profile.title}</p>
                </div>
              )}
              {profile.country && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Pais</span>
                  <p className="mt-1 text-sm font-medium text-[#1f2937]">{profile.country}</p>
                </div>
              )}
              {profile.hourlyRate && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Tarifa</span>
                  <p className="mt-1 text-sm font-medium text-[#1f2937]">${profile.hourlyRate}/hora</p>
                </div>
              )}
              {profile.bio && (
                <div className="sm:col-span-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">Biografia</span>
                  <p className="mt-1 text-sm leading-relaxed text-[#1f2937]">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-[#dde3ea] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-[#1f2937]">{value}</p>
    </div>
  );
}

function ActionCard({ title, desc, href, cta, disabled }: { title: string; desc: string; href: string; cta: string; disabled?: boolean }) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-[#1f2937]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{desc}</p>
      </div>
      <div className="mt-5">
        <span className={`inline-block rounded-lg px-5 py-2 text-sm font-semibold transition ${
          disabled
            ? "bg-[#eef2f6] text-[#9ca3af]"
            : "bg-[#007bd2] text-white hover:bg-[#0066b3]"
        }`}>
          {cta}
        </span>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <div className="rounded-xl border border-dashed border-[#dde3ea] bg-[#f7f9fb] p-6 opacity-60 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="block rounded-xl border border-[#dde3ea] bg-white p-6 shadow-sm transition-all hover:border-[#007bd2]/30 hover:shadow-md">
      {content}
    </Link>
  );
}
