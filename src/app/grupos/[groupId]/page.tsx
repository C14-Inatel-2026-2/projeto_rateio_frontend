"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MemberManager from "../MemberManager"
import ExpenseForm from "../ExpenseForm"
import { buscarGrupo, type Grupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"

export default function GroupDashboardPage() {
    const router = useRouter()
    const { groupId } = useParams<{ groupId: string }>()
    const [grupo, setGrupo] = useState<Grupo | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const sessao = obterSessao()
        if (!sessao) {
            router.replace("/login")
            return
        }

        buscarGrupo(groupId, sessao.id)
            .then(setGrupo)
            .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar o grupo."))
            .finally(() => setCarregando(false))
    }, [groupId, router])

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                <div>
                    <Link href="/grupos" className="mb-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        ← Meus grupos
                    </Link>
                    <h1 className="text-4xl font-semibold text-slate-900">{grupo?.nome ?? "Painel do grupo"}</h1>
                </div>

                {carregando && <p className="text-base text-slate-500">Carregando...</p>}

                {erro && (
                    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {erro}
                    </div>
                )}

                {grupo && (
                    <>
                        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Membros</h2>
                            <MemberManager groupId={groupId} initialMembers={grupo.membros} />
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Nova despesa</h2>
                            <ExpenseForm groupId={groupId} membrosDoGrupo={grupo.membros} />
                        </section>
                    </>
                )}
            </div>
        </main>
    )
}