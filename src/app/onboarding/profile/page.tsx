"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthError, AuthInput, AuthSubmitButton } from "@/components/auth/auth-form";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        bio: formData.get("bio"),
        hourlyRate: formData.get("hourlyRate")
          ? Number(formData.get("hourlyRate"))
          : null,
        country: formData.get("country"),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No se pudo guardar el perfil.");
      setLoading(false);
      return;
    }

    await update();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout
      variant="register"
      title="Completa tu perfil profesional"
      subtitle="Cuéntanos más sobre ti para que otros te encuentren."
      footer={<span className="text-[#6b7280]">Casi listo para empezar.</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="title"
          name="title"
          label="Título profesional"
          placeholder="Ej: Desarrollador Full Stack, Diseñador UX"
        />

        <div>
          <label
            htmlFor="bio"
            className="mb-1.5 block text-sm font-medium text-[#374151]"
          >
            Biografía
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Cuéntanos sobre tu experiencia y habilidades..."
            className="w-full resize-none rounded-md border border-[#dde3ea] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition placeholder:text-[#6b7280] focus:border-[#007bd2] focus:ring-2 focus:ring-[#007bd2]/20"
          />
        </div>

        <AuthInput
          id="hourlyRate"
          name="hourlyRate"
          label="Tarifa por hora (USD)"
          type="number"
          required={false}
          placeholder="Ej: 25"
        />

        <AuthInput
          id="country"
          name="country"
          label="País"
          required={false}
          placeholder="Ej: Argentina, México, Colombia"
        />

        {error && <AuthError message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Guardando perfil...">
          Ir al Dashboard
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
