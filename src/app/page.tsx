import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role ? "/dashboard" : "/onboarding/role");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-workana-gray-50 px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-workana-blue">
          Plataforma freelance
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-workana-gray-900">
          Work<span className="text-workana-blue">Clone</span>
        </h1>
        <p className="mt-4 text-lg text-workana-gray-500">
          Conecta freelancers con empresas. Publica proyectos, envía propuestas
          y gestiona tu talento en un solo lugar.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-md bg-workana-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-workana-blue-dark"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-workana-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-workana-gray-700 transition hover:bg-workana-gray-100"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}
