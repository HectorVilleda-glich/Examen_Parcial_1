import type { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  FREELANCER: "Freelancer",
  CLIENTE: "Cliente / Empresa",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  FREELANCER: "Busco proyectos y quiero ofrecer mis servicios.",
  CLIENTE: "Busco talento para publicar proyectos y contratar.",
};

export function isRole(value: string): value is Role {
  return value === "FREELANCER" || value === "CLIENTE";
}
