import Link from "next/link";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  variant?: "login" | "register";
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  variant = "login",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-workana-blue to-workana-blue-dark p-12 text-white lg:flex">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Work<span className="opacity-90">Clone</span>
          </Link>
        </div>

        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            {variant === "login"
              ? "Conecta con proyectos y talento freelance"
              : "Únete a la comunidad de freelancers y empresas"}
          </h2>
          <p className="text-base text-blue-100">
            {variant === "login"
              ? "Accede a tu cuenta para gestionar proyectos, propuestas y perfiles profesionales."
              : "Publica proyectos o encuentra oportunidades laborales en un solo lugar."}
          </p>
        </div>

        <p className="text-sm text-blue-100/80">
          Plataforma inspirada en Workana · Examen I
        </p>
      </aside>

      <main className="flex w-full flex-col justify-center bg-white px-6 py-10 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-xl font-bold text-workana-blue"
            >
              Work<span className="text-workana-gray-700">Clone</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-workana-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-workana-gray-500">{subtitle}</p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-workana-gray-500">
            {footer}
          </div>
        </div>
      </main>
    </div>
  );
}
