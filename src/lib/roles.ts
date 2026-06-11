import { UserRole } from "@prisma/client";

export const ROLE_LABELS: Record<UserRole, string> = {
  FREELANCER: "Freelancer",
  CLIENT: "Cliente / Empresa",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  FREELANCER: "Busco proyectos y quiero ofrecer mis servicios.",
  CLIENT: "Busco talento para publicar proyectos y contratar.",
};

export function isUserRole(value: string): value is UserRole {
  return value === "FREELANCER" || value === "CLIENT";
}
