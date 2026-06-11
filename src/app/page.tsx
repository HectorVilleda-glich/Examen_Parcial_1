import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Examen I</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Proyecto con Next.js, PostgreSQL, Prisma, Auth.js y Tailwind CSS.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {session?.user ? (
          <>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Sesión activa:{" "}
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {session.user.email ?? session.user.name}
              </span>
            </p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
              >
                Cerrar sesión
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <li>Next.js (App Router)</li>
        <li>PostgreSQL + Prisma ORM</li>
        <li>Auth.js / NextAuth</li>
        <li>Tailwind CSS</li>
        <li>Despliegue en Vercel</li>
      </ul>
    </main>
  );
}
