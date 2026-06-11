import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role ? "/dashboard" : "/onboarding/role");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#f7f9fb] px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#007bd2]">
          Plataforma freelance
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1f2937]">
          Work<span className="text-[#007bd2]">Clone</span>
        </h1>
        <p className="mt-4 text-lg text-[#6b7280]">
          Conecta freelancers con empresas. Publica proyectos, envía propuestas
          y gestiona tu talento en un solo lugar.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-md bg-[#007bd2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3]"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-[#dde3ea] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#eef2f6]"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}
