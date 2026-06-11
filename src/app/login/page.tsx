"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthError, AuthInput, AuthSubmitButton } from "@/components/auth/auth-form";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales invalidas. Verifica tu email y contrasena.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout variant="login" title="Iniciar sesion" subtitle="Accede a tu cuenta para gestionar proyectos y propuestas."
      footer={
        <span>
          &iquest;No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-[#007bd2] hover:text-[#0066b3] underline">
            Registrate
          </Link>
        </span>
      }>
      {registered && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-sm">
          Cuenta creada con exito. Ahora inicia sesion.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput id="email" name="email" label="Correo electronico" type="email" placeholder="tu@correo.com" />
        <AuthInput id="password" name="password" label="Contrasena" type="password" placeholder="Ingresa tu contrasena" />
        {error && <AuthError message={error} />}
        <AuthSubmitButton loading={loading} loadingText="Ingresando...">Iniciar sesion</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
