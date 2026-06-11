"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthError, AuthInput, AuthSubmitButton } from "@/components/auth/auth-form";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      setLoading(false);
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No se pudo crear la cuenta. Intenta de nuevo.");
      return;
    }

    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout variant="register" title="Crear cuenta gratuita" subtitle="Unete a WorkClone y comienza a trabajar."
      footer={
        <span>
          &iquest;Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-[#007bd2] hover:text-[#0066b3] underline">
            Inicia sesion
          </Link>
        </span>
      }>
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput id="name" name="name" label="Nombre completo" type="text" placeholder="Ej: Juan Perez" />
        <AuthInput id="email" name="email" label="Correo electronico" type="email" placeholder="tu@correo.com" />
        <AuthInput id="password" name="password" label="Contrasena" type="password" minLength={6} placeholder="Minimo 6 caracteres" />
        {error && <AuthError message={error} />}
        <AuthSubmitButton loading={loading} loadingText="Creando cuenta...">Crear cuenta gratis</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
