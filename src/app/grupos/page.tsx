import Link from "next/link";
import GroupCreateForm from "./GroupCreateForm";

export default function NovoGrupo() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-14 shadow-sm">
        <Link href="/grupos" className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Meus grupos
        </Link>
        <h1 className="mb-2 text-4xl font-semibold text-slate-900">Novo grupo</h1>
        <p className="mb-10 text-lg text-slate-500">
          Dê um nome e convide quem vai dividir as contas
        </p>
        <GroupCreateForm />
      </div>
    </main>
  )
}