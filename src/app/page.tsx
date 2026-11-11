import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">
        <h1 className="mb-3 text-4xl font-semibold text-slate-900">
          Rateio de Despesas do Grupo
        </h1>
        <p className="mb-10 text-lg text-slate-600 font-bold">Bem-vindo ao sistema.</p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="w-64 rounded-xl bg-indigo-600 px-6 py-4 text-lg font-medium text-white transition hover:bg-indigo-700"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="w-64 rounded-xl border-4 border-indigo-600 bg-white px-6 py-4 text-lg font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}