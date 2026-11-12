"use client"

import { useEffect, useState } from "react"
import PaymentForm from "@/src/app/grupos/_components/pagamentos/PaymentForm"
import { estornarDespesa } from "@/src/services/despesaService"
import {
    consultarExtrato,
    estornarPagamento,
    type ItemExtrato,
} from "@/src/services/pagamentoService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"
import { formatarMoeda } from "@/src/services/formatarMoeda"

interface ExtractTabProps {
    groupId: string
    membros: MembroGrupo[]
}

function formatarData(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function ExtractTab({ groupId, membros }: ExtractTabProps) {
    const [itens, setItens] = useState<ItemExtrato[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [erroEstorno, setErroEstorno] = useState<string | null>(null)
    const [alvo, setAlvo] = useState<ItemExtrato | null>(null)
    const [estornando, setEstornando] = useState(false)
    const [pagando, setPagando] = useState(false)
    const [recarga, setRecarga] = useState(0)

    useEffect(() => {
        const sessao = obterSessao()
        if (!sessao) return

        let ativo = true

        consultarExtrato(groupId, sessao.id)
            .then((lista) => {
                if (!ativo) return
                setItens(lista)
                setErro(null)
            })
            .catch((err) => {
                if (ativo) setErro(err instanceof Error ? err.message : "Erro ao consultar extrato do grupo.")
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })

        return () => {
            ativo = false
        }
    }, [groupId, recarga])

    async function confirmarEstorno() {
        const sessao = obterSessao()
        if (!sessao || !alvo) return

        setErroEstorno(null)
        setEstornando(true)
        try {
            if (alvo.tipo === "DESPESA") {
                await estornarDespesa(groupId, alvo.id, sessao.id)
            } else {
                await estornarPagamento(groupId, alvo.id, sessao.id)
            }
        } catch (err) {
            setErroEstorno(err instanceof Error ? err.message : "Erro ao estornar.")
        } finally {
            setEstornando(false)
            setAlvo(null)
            setRecarga((r) => r + 1)
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">Histórico do grupo</h2>
                <button
                    type="button"
                    onClick={() => setPagando(true)}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700"
                >
                    + Registrar pagamento
                </button>
            </div>

            {carregando && <p className="text-base text-slate-500">Carregando...</p>}

            {erro && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            {erroEstorno && (
                <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erroEstorno}
                </div>
            )}

            {!carregando && !erro && itens.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 px-8 py-12 text-center">
                    <p className="text-lg font-medium text-slate-800">Nenhuma movimentação ainda.</p>
                </div>
            )}

            {itens.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-base">
                        <thead className="bg-slate-50 text-sm text-slate-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Data</th>
                                <th className="px-5 py-3 font-medium">Tipo</th>
                                <th className="px-5 py-3 font-medium">Autor</th>
                                <th className="px-5 py-3 font-medium">Valor</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {itens.map((item) => {
                                const estornado = item.status === "ESTORNADA" || item.status === "ESTORNADO"
                                const textoClasse = estornado ? "text-slate-400 line-through" : "text-slate-900"
                                return (
                                    <tr key={`${item.tipo}-${item.id}`}>
                                        <td className="px-5 py-4 text-slate-500">{formatarData(item.data)}</td>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{item.tipo}</td>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{item.autorNome}</td>
                                        <td className={`px-5 py-4 ${textoClasse}`}>{formatarMoeda(item.valor)}</td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={
                                                    estornado
                                                        ? "rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500"
                                                        : "rounded-full bg-green-50 px-3 py-1 text-sm text-green-700"
                                                }
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {estornado ? (
                                                <span className="text-slate-400">-</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setAlvo(item)}
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
                            Estornar {alvo.tipo === "DESPESA" ? "a despesa" : "o pagamento"} de {alvo.autorNome} (
                            {formatarMoeda(alvo.valor)})?
                        </h3>
                        <p className="mt-2 text-base text-slate-500">
                            Continua no histórico, marcado como estornado.
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

            {pagando && (
                <PaymentForm
                    groupId={groupId}
                    membros={membros}
                    onPaid={() => {
                        setPagando(false)
                        setRecarga((r) => r + 1)
                    }}
                    onCancel={() => setPagando(false)}
                />
            )}
        </section>
    )
}