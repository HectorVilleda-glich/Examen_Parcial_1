import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.role) {
    redirect("/onboarding/role");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  const roleLabel = ROLE_LABELS[session.user.role];
  const isFreelancer = session.user.role === "FREELANCER";

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#dde3ea] bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#374151] sm:flex">
            <Link href="/dashboard" className="text-[#007bd2]">
              Dashboard
            </Link>
            <Link href="/onboarding/profile" className="hover:text-[#007bd2]">
              Mi Perfil
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
        {!profile && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 shadow-sm">
            <strong className="font-semibold">Perfil incompleto.</strong>{" "}
            Completa tus datos profesionales para aparecer en las búsquedas.
            <Link
              href="/onboarding/profile"
              className="ml-2 font-semibold text-amber-800 underline hover:text-amber-900"
            >
              Completar perfil &rarr;
            </Link>
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#007bd2]">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[#1f2937]">
            Hola, {session.user.name ?? "usuario"}
          </h1>
          <p className="mt-2 text-[#6b7280]">
            {isFreelancer
              ? "Explora proyectos y haz crecer tu carrera freelance."
              : "Publica proyectos y encuentra el talento ideal para tu equipo."}
          </p>
        </div>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#e8f4fc] px-4 py-2 text-sm font-medium text-[#0066b3] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#007bd2]" />
          {roleLabel}
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label={isFreelancer ? "Proyectos disponibles" : "Proyectos publicados"}
            value="—"
            subtitle="Próximamente"
          />
          <StatCard
            label={isFreelancer ? "Propuestas enviadas" : "Postulaciones recibidas"}
            value="—"
            subtitle="Próximamente"
          />
          <StatCard
            label={isFreelancer ? "Perfil visto" : "Freelancers contactados"}
            value="—"
            subtitle="Próximamente"
          />
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {isFreelancer ? (
            <>
              <ActionCard
                title="Explorar proyectos"
                description="Encuentra proyectos freelance que se ajusten a tus habilidades y disponibilidad."
                href="#"
                disabled
              />
              <ActionCard
                title="Mi perfil profesional"
                description="Muestra tu experiencia, portafolio y tarifa para atraer mejores oportunidades."
                href="/onboarding/profile"
                disabled={false}
              />
            </>
          ) : (
            <>
              <ActionCard
                title="Publicar un proyecto"
                description="Describe el trabajo que necesitas y recibe propuestas de freelancers calificados."
                href="#"
                disabled
              />
              <ActionCard
                title="Buscar freelancers"
                description="Encuentra profesionales por especialidad, país y tarifa para tu próximo proyecto."
                href="#"
                disabled
              />
            </>
          )}
        </div>

        {profile && (
          <div className="rounded-lg border border-[#dde3ea] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f2937]">
              Resumen del perfil
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {profile.title && (
                <ProfileField label="Título" value={profile.title} />
              )}
              {profile.country && (
                <ProfileField label="País" value={profile.country} />
              )}
              {profile.hourlyRate && (
                <ProfileField
                  label="Tarifa"
                  value={`$${profile.hourlyRate}/hora`}
                />
              )}
              {profile.bio && (
                <div className="sm:col-span-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">
                    Biografía
                  </span>
                  <p className="mt-1 text-sm text-[#1f2937]">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-lg border border-[#dde3ea] bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-[#1f2937]">{value}</p>
      <p className="mt-1 text-xs text-[#9ca3af]">{subtitle}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  disabled: boolean;
}) {
  const classes = `rounded-lg border p-6 shadow-sm transition ${
    disabled
      ? "cursor-not-allowed border-dashed border-[#dde3ea] bg-[#f7f9fb] opacity-60"
      : "border-[#dde3ea] bg-white hover:border-[#007bd2] hover:shadow-md"
  }`;

  const content = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>
        {disabled ? (
          <span className="rounded-full bg-[#eef2f6] px-2.5 py-0.5 text-xs font-medium text-[#6b7280]">
            Pronto
          </span>
        ) : (
          <span className="text-[#007bd2]">&rarr;</span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        {description}
      </p>
    </>
  );

  if (disabled) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">
        {label}
      </span>
      <p className="mt-1 text-sm font-medium text-[#1f2937]">{value}</p>
    </div>
  );
}
