import Link from "next/link"
import MemberManager from "../MemberManager"
import ExpenseForm from "../ExpenseForm"
import type { MembroGrupo } from "@/src/services/grupoService"

interface GroupDashboardPageProps {
    params: Promise<{ groupId: string }>
}

export default async function GroupDashboardPage({
    params,
}: GroupDashboardPageProps) {
    const { groupId } = await params
    const membrosIniciais: MembroGrupo[] = [
        { id: "m1", nome: "Ninho", email: "ninho@email.com" },
        { id: "m2", nome: "Gustavinho", email: "gustavo@email.com" },
        { id: "m3", nome: "Paulinho", email: "paulo@email.com" },
    ]

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                <div>
                    <Link href="/grupos" className="mb-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        ← Meus grupos
                    </Link>
                    <h1 className="text-4xl font-semibold text-slate-900">Painel do grupo</h1>
                    <p className="mt-1 text-base text-slate-500">Grupo {groupId}</p>
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-slate-900">Membros</h2>
                    <MemberManager groupId={groupId} initialMembers={membrosIniciais} />
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-slate-900">Nova despesa</h2>
                    <ExpenseForm groupId={groupId} membrosDoGrupo={membrosIniciais} />
                </section>
            </div>
        </main>
    )
}