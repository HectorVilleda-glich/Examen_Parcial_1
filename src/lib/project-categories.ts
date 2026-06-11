import type { ProjectCategory } from "@prisma/client";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  PROGRAMACION: "Programación",
  DISENO: "Diseño",
  MARKETING: "Marketing",
  CONTENIDO: "Contenido / Redacción",
  SOPORTE: "Soporte / Virtual Assistant",
  OTRO: "Otro",
};

export const CATEGORIES: ProjectCategory[] = [
  "PROGRAMACION",
  "DISENO",
  "MARKETING",
  "CONTENIDO",
  "SOPORTE",
  "OTRO",
];

export const STATUS_LABELS: Record<string, string> = {
  ABIERTO: "Abierto",
  EN_PROGRESO: "En progreso",
  FINALIZADO: "Finalizado",
};
