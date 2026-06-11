# Examen I

Aplicación web desarrollada con el stack requerido para el examen parcial:

- **Next.js** (App Router, TypeScript)
- **npm** (gestor de paquetes)
- **PostgreSQL** (base de datos)
- **Prisma** (ORM)
- **Auth.js / NextAuth** (autenticación)
- **Tailwind CSS** (estilos)
- **Vercel** (despliegue)

## Requisitos previos

- Node.js 20+
- npm
- PostgreSQL (local o servicio en la nube: Neon, Supabase, Vercel Postgres)

## Configuración local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env
```

3. Editar `.env` con tu conexión PostgreSQL y un `AUTH_SECRET` seguro:

```bash
openssl rand -base64 32
```

4. Crear las tablas en la base de datos:

```bash
npm run db:push
```

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run db:push` | Sincronizar esquema Prisma con la BD |
| `npm run db:migrate` | Crear/aplicar migraciones |
| `npm run db:studio` | Prisma Studio |

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Configura las variables de entorno:
   - `DATABASE_URL` — URL de PostgreSQL (p. ej. Vercel Postgres o Neon)
   - `AUTH_SECRET` — secreto para Auth.js
   - `AUTH_URL` — URL pública de la app (p. ej. `https://tu-app.vercel.app`)
4. Vercel detectará Next.js automáticamente y ejecutará `npm run build`.

El script `postinstall` ejecuta `prisma generate` para generar el cliente de Prisma en cada despliegue.

## Estructura del proyecto

```
src/
├── app/                    # App Router (páginas y API routes)
│   ├── api/auth/           # Auth.js handlers
│   ├── api/register/       # Registro de usuarios
│   ├── login/
│   └── register/
├── auth.ts                 # Configuración Auth.js
├── components/
└── lib/prisma.ts           # Cliente Prisma
prisma/
└── schema.prisma           # Modelos de base de datos
```

## Autenticación

- **Correo y contraseña** — registro en `/register`, login en `/login`
- **Google OAuth** — botón "Continuar con Google" (requiere `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`)
- **Roles de usuario** — `FREELANCER` o `CLIENT` (Cliente/Empresa)
- Usuarios de Google sin rol son redirigidos a `/onboarding/role`
- Rutas protegidas con middleware: usuarios autenticados no pueden volver a `/login` ni `/register`

## Flujo de rutas

| Ruta | Acceso |
|------|--------|
| `/` | Público (redirige al dashboard si hay sesión) |
| `/login`, `/register` | Solo invitados |
| `/onboarding/role` | Sesión activa sin rol (p. ej. Google) |
| `/dashboard` | Sesión activa con rol asignado |

## Google OAuth

1. Crea credenciales en [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. URI de redirección autorizada: `http://localhost:3000/api/auth/callback/google`
3. En producción: `https://tu-dominio.vercel.app/api/auth/callback/google`
4. Agrega las variables en `.env` y en Vercel

## Modelo User (Prisma)

```prisma
enum UserRole {
  FREELANCER
  CLIENT
}

model User {
  role UserRole?  // Freelancer o Cliente/Empresa
  // ... campos Auth.js
}
```

Después de cambiar el esquema:

```bash
npm run db:push
```
