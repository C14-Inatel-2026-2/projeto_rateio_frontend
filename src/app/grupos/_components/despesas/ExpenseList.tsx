"use client"

import { useEffect, useState } from "react"
import {
    listarDespesas,
    estornarDespesa,
    type DespesaResumo,
} from "@/src/services/despesaService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"
import { formatarMoeda } from "@/src/services/formatarMoeda"

interface ExpenseListProps {
    groupId: string
    membros: MembroGrupo[]
    versao: number
}

function formatarData(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function ExpenseList({ groupId, membros, versao }: ExpenseListProps) {
    const [despesas, setDespesas] = useState<DespesaResumo[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [erroEstorno, setErroEstorno] = useState<string | null>(null)
    const [alvo, setAlvo] = useState<DespesaResumo | null>(null)
    const [estornando, setEstornando] = useState(false)
    const [recarga, setRecarga] = useState(0)

    useEffect(() => {
        const sessao = obterSessao()
        if (!sessao) return

        let ativo = true

        listarDespesas(groupId, sessao.id)
            .then((lista) => {
                if (!ativo) return
                setDespesas(
                    [...lista].sort(
                        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
                    ),
                )
                setErro(null)
            })
            .catch((err) => {
                if (ativo) setErro(err instanceof Error ? err.message : "Erro ao listar despesas.")
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })

        return () => {
            ativo = false
        }
    }, [groupId, versao, recarga])

    function nomeDe(id: string): string {
        return membros.find((m) => m.id === id)?.nome ?? "Desconhecido"
    }

    async function confirmarEstorno() {
        const sessao = obterSessao()
        if (!sessao || !alvo) return

        setErroEstorno(null)
        setEstornando(true)
        try {
            await estornarDespesa(groupId, alvo.id, sessao.id)
        } catch (err) {
            setErroEstorno(err instanceof Error ? err.message : "Erro ao estornar despesa.")
        } finally {
            setEstornando(false)
            setAlvo(null)
            setRecarga((r) => r + 1)
        }
    }

    if (carregando) {
        return <p className="text-base text-slate-500">Carregando...</p>
    }

    if (erro) {
        return (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {erroEstorno && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erroEstorno}
                </div>
            )}

            {despesas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 px-8 py-12 text-center">
                    <p className="text-lg font-medium text-slate-800">Nenhuma despesa ainda.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-base">
                        <thead className="bg-slate-50 text-sm text-slate-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Descrição</th>
                                <th className="px-5 py-3 font-medium">Pago por</th>
                                <th className="px-5 py-3 font-medium">Valor</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Data</th>
                                <th className="px-5 py-3 font-medium">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {despesas.map((d) => {
                                const estornada = d.status === "ESTORNADA"
                                const textoClasse = estornada ? "text-slate-400 line-through" : "text-slate-900"
                                return (
                                    <tr key={d.id}>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{d.descricao}</td>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{nomeDe(d.pagadorId)}</td>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{formatarMoeda(d.valorTotal)}</td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={
                                                    estornada
                                                        ? "rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500"
                                                        : "rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
                                                }
                                            >
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">{formatarData(d.data)}</td>
                                        <td className="px-5 py-4">
                                            {estornada ? (
                                                <span className="text-slate-400">-</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setAlvo(d)}
                                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    Estornar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {alvo && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 px-6">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Estornar a despesa &quot;{alvo.descricao}&quot;?
                        </h3>
                        <p className="mt-2 text-base text-slate-500">
                            Ela continua no histórico, marcada como estornada.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setAlvo(null)}
                                disabled={estornando}
                                className="rounded-lg px-5 py-2.5 text-base font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarEstorno}
                                disabled={estornando}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-base font-medium text-white transition hover:bg-red-700 disabled:bg-slate-300"
                            >
                                {estornando ? "Estornando..." : "Sim, estornar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}