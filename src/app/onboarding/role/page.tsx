"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import {
  AuthError,
  AuthSubmitButton,
} from "@/components/auth/auth-form";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/roles";
import { UserRole } from "@prisma/client";

const ROLES: UserRole[] = ["FREELANCER", "CLIENT"];

export default function OnboardingRolePage() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>("FREELANCER");
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
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthLayout
      variant="register"
      title="Completa tu perfil"
      subtitle="Indica si te registraste como freelancer o como cliente/empresa."
      footer={<span className="text-workana-gray-500">Un paso más y listo.</span>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-3">
          <legend className="mb-1 block text-sm font-medium text-workana-gray-700">
            Tipo de cuenta
          </legend>
          {ROLES.map((role) => (
            <label
              key={role}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition ${
                selectedRole === role
                  ? "border-workana-blue bg-workana-blue-light"
                  : "border-workana-gray-200 hover:border-workana-blue/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
                className="mt-1 accent-workana-blue"
              />
              <span>
                <span className="block text-sm font-semibold text-workana-gray-900">
                  {ROLE_LABELS[role]}
                </span>
                <span className="mt-0.5 block text-xs text-workana-gray-500">
                  {ROLE_DESCRIPTIONS[role]}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        {error && <AuthError message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Guardando...">
          Continuar al dashboard
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
