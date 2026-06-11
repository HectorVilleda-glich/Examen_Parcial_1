"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthError, AuthSubmitButton } from "@/components/auth/auth-form";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/roles";
import type { Role } from "@prisma/client";

const ROLES: Role[] = ["FREELANCER", "CLIENTE"];

export default function OnboardingRolePage() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<Role>("FREELANCER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/user/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selectedRole }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No se pudo guardar tu tipo de cuenta.");
      setLoading(false);
      return;
    }

    await update();
    router.push("/onboarding/profile");
    router.refresh();
  }

  return (
    <AuthLayout
      variant="register"
      title="Completa tu perfil"
      subtitle="¿Cómo quieres usar la plataforma?"
      footer={<span className="text-[#6b7280]">Un paso más y listo.</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-3">
          <legend className="mb-1 block text-sm font-medium text-[#374151]">
            Tipo de cuenta
          </legend>
          {ROLES.map((role) => (
            <label
              key={role}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                selectedRole === role
                  ? "border-[#007bd2] bg-[#e8f4fc]"
                  : "border-[#dde3ea] hover:border-[#007bd2]/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="mt-1 accent-[#007bd2]"
              />
              <span>
                <span className="block text-sm font-semibold text-[#1f2937]">
                  {ROLE_LABELS[role]}
                </span>
                <span className="mt-0.5 block text-xs text-[#6b7280]">
                  {ROLE_DESCRIPTIONS[role]}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        {error && <AuthError message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Guardando...">
          Continuar
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
