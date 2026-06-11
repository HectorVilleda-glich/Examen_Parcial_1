"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import {
  AuthDivider,
  AuthError,
  AuthInput,
  AuthSubmitButton,
} from "@/components/auth/auth-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
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
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout
      variant="login"
      title="Inicia sesión"
      subtitle="Ingresa a tu cuenta para continuar."
      footer={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-workana-blue hover:text-workana-blue-dark"
          >
            Regístrate
          </Link>
        </>
      }
    >
      {registered && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Cuenta creada correctamente. Ya puedes iniciar sesión.
        </div>
      )}

      <GoogleSignInButton callbackUrl="/dashboard" />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
        />

        <AuthInput
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
        />

        {error && <AuthError message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Ingresando...">
          Ingresar
        </AuthSubmitButton>
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
