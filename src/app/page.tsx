import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Rateio de Despesas do Grupo
        </h1>
        <p className="mb-6 text-sm text-slate-500">Bem-vindo ao sistema.</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}