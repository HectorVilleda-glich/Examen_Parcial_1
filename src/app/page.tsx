import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#dde3ea] bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#007bd2]">
            Work<span className="text-[#374151]">Clone</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard"
                className="rounded-lg bg-[#007bd2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3] shadow-sm">
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium text-[#374151] transition hover:text-[#007bd2]">
                  Iniciar sesion
                </Link>
                <Link href="/register"
                  className="rounded-lg bg-[#007bd2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0066b3] shadow-sm">
                  Crear cuenta gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f7f9fb] via-white to-[#e8f4fc]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dde3ea] bg-white px-4 py-1.5 text-xs font-medium text-[#6b7280] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#007bd2]" />
              Plataforma lider para conectar talento freelance
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl lg:text-6xl">
              Encuentra el{" "}
              <span className="text-[#007bd2]">talento ideal</span>
              <br />para tus proyectos
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#6b7280] sm:text-xl">
              Conectamos empresas con profesionales freelance de Latinoamerica.
              Publica proyectos, recibe propuestas y trabaja de forma segura.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register"
                className="rounded-xl bg-[#007bd2] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#0066b3] shadow-lg shadow-[#007bd2]/20">
                Quiero contratar
              </Link>
              <Link href="/register"
                className="rounded-xl border-2 border-[#dde3ea] bg-white px-8 py-3.5 text-base font-semibold text-[#374151] transition hover:border-[#007bd2]/30 hover:bg-[#f7f9fb]">
                Quiero trabajar
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="border-b border-[#dde3ea] bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "+10 anos", label: "En el mercado" },
              { value: "+50K", label: "Proyectos publicados" },
              { value: "+100K", label: "Freelancers registrados" },
              { value: "98%", label: "Satisfaccion" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-[#007bd2]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#007bd2]">Como funciona</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1f2937]">En tres pasos simples</h2>
            <p className="mt-3 text-[#6b7280]">Publica tu proyecto y recibe propuestas en minutos.</p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Publica tu proyecto", desc: "Describe el trabajo que necesitas, define tu presupuesto y elige la categoria adecuada." },
              { step: "02", title: "Recibe propuestas", desc: "Freelancers calificados te enviaran sus propuestas con precios y tiempos de entrega." },
              { step: "03", title: "Elige y trabaja", desc: "Selecciona al profesional ideal, acuerda los detalles y comienza a trabajar." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-[#dde3ea] bg-white p-8 shadow-sm transition hover:shadow-md">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#007bd2] text-lg font-bold text-white">{item.step}</span>
                <h3 className="mt-5 text-xl font-bold text-[#1f2937]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#007bd2]">Categorias</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1f2937]">Encuentra profesionales en cualquier area</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: "</>", title: "Programacion" },
              { icon: "🎨", title: "Diseno" },
              { icon: "📊", title: "Marketing" },
              { icon: "✍️", title: "Contenido" },
              { icon: "🔧", title: "Soporte" },
              { icon: "📋", title: "Otros" },
            ].map((cat) => (
              <div key={cat.title} className="rounded-xl border border-[#dde3ea] bg-[#f7f9fb] p-6 text-center transition hover:border-[#007bd2]/30 hover:bg-white hover:shadow-sm">
                <span className="text-2xl">{cat.icon}</span>
                <p className="mt-3 text-sm font-semibold text-[#374151]">{cat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#007bd2] to-[#0066b3] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Listo para empezar?</h2>
          <p className="mt-4 text-lg text-blue-100">Unete a miles de empresas y freelancers que ya confian en nosotros.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/register"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#007bd2] transition hover:bg-blue-50 shadow-lg">
              Crear cuenta gratis
            </Link>
            <Link href="/login"
              className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dde3ea] bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="text-xl font-bold text-[#007bd2]">
              Work<span className="text-[#374151]">Clone</span>
            </Link>
            <p className="text-sm text-[#6b7280]">
              &copy; {new Date().getFullYear()} WorkClone. Plataforma inspirada en Workana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
