"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { listarGrupos, type GrupoResumo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"

export default function MeusGrupos() {
    const router = useRouter()
    const [grupos, setGrupos] = useState<GrupoResumo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const sessao = obterSessao()
        if (!sessao) {
            router.replace("/login")
            return
        }

        listarGrupos(sessao.id)
            .then((lista) => setGrupos([...lista].sort((a, b) => a.nome.localeCompare(b.nome))))
            .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao listar grupos."))
            .finally(() => setCarregando(false))
    }, [router])

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-4xl font-semibold text-slate-900">Meus grupos</h1>
                    <Link
                        href="/grupos/novo"
                        className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700"
                    >
                        + Novo grupo
                    </Link>
                </div>

                {erro && (
                    <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {erro}
                    </div>
                )}

                {carregando && <p className="text-base text-slate-500">Carregando...</p>}

                {!carregando && !erro && grupos.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
                        <p className="text-lg font-medium text-slate-800">Você ainda não participa de nenhum grupo.</p>
                        <p className="mt-1 text-base text-slate-500">Crie o primeiro com o botão &quot;+ Novo grupo&quot;.</p>
                    </div>
                )}

                {grupos.length > 0 && (
                    <ul className="space-y-4">
                        {grupos.map((grupo) => (
                            <li key={grupo.id}>
                                <Link
                                    href={`/grupos/${grupo.id}`}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                                >
                                    <span className="text-xl font-medium text-slate-900">{grupo.nome}</span>
                                    <span className="text-base font-medium text-indigo-600">Abrir →</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}