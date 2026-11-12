"use client"

import { useEffect, useState } from "react"
import PaymentForm from "@/src/app/grupos/_components/pagamentos/PaymentForm"
import {
    consultarSaldos,
    consultarQuitacao,
    type SaldoMembro,
    type TransferenciaSugerida,
} from "@/src/services/saldoService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"
import { formatarMoeda } from "@/src/services/formatarMoeda"

interface SummaryTabProps {
    groupId: string
    membros: MembroGrupo[]
}

function situacao(saldo: string): { texto: string; classe: string } {
    const numero = Number(saldo)
    if (numero > 0) return { texto: "a receber", classe: "text-green-600" }
    if (numero < 0) return { texto: "a pagar", classe: "text-red-600" }
    return { texto: "quitado", classe: "text-slate-500" }
}

export default function SummaryTab({ groupId, membros }: SummaryTabProps) {
    const sessao = obterSessao()
    const [saldos, setSaldos] = useState<SaldoMembro[]>([])
    const [quitacao, setQuitacao] = useState<TransferenciaSugerida[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [alvo, setAlvo] = useState<TransferenciaSugerida | null>(null)
    const [recarga, setRecarga] = useState(0)

    useEffect(() => {
        const atual = obterSessao()
        if (!atual) return

        let ativo = true

        Promise.all([consultarSaldos(groupId, atual.id), consultarQuitacao(groupId, atual.id)])
            .then(([listaSaldos, listaQuitacao]) => {
                if (!ativo) return
                setSaldos([...listaSaldos].sort((a, b) => a.nome.localeCompare(b.nome)))
                setQuitacao(listaQuitacao)
                setErro(null)
            })
            .catch((err) => {
                if (ativo) setErro(err instanceof Error ? err.message : "Erro ao carregar o resumo.")
            })
            .finally(() => {
                if (ativo) setCarregando(false)
            })

        return () => {
            ativo = false
        }
    }, [groupId, recarga])

    if (carregando) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <p className="text-base text-slate-500">Carregando...</p>
            </section>
        )
    }

    if (erro) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            </section>
        )
    }

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Saldos do grupo</h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-base">
                        <thead className="bg-slate-50 text-sm text-slate-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">Membro</th>
                                <th className="px-5 py-3 font-medium">Saldo</th>
                                <th className="px-5 py-3 font-medium">Situação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {saldos.map((s) => {
                                const { texto, classe } = situacao(s.saldo)
                                return (
                                    <tr key={s.membroId}>
                                        <td className="px-5 py-4 text-slate-900">
                                            {s.nome}
                                            {s.membroId === sessao?.id && " (você)"}
                                        </td>
                                        <td className={`px-5 py-4 font-medium ${classe}`}>{formatarMoeda(s.saldo)}</td>
                                        <td className={`px-5 py-4 ${classe}`}>{texto}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <h2 className="mb-1 text-2xl font-semibold text-slate-900">Como quitar</h2>
                <p className="mb-6 text-base text-slate-500">Sugestão com o menor número de transferências</p>

                {quitacao.length === 0 ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-base font-medium text-green-700">
                        Tudo quitado.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {quitacao.map((t) => (
                            <li
                                key={`${t.deId}-${t.paraId}`}
                                className="flex flex-col gap-3 rounded-xl border border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <span className="text-base text-slate-800">
                                    <span className="font-medium">{t.deNome}</span> paga{" "}
                                    <span className="font-medium">{formatarMoeda(t.valor)}</span> a{" "}
                                    <span className="font-medium">{t.paraNome}</span>
                                </span>
                                {t.deId === sessao?.id ? (
                                    <button
                                        type="button"
                                        onClick={() => setAlvo(t)}
                                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-base font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        Registrar pagamento
                                    </button>
                                ) : (
                                    <span className="text-sm text-slate-400">aguardando {t.deNome}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {alvo && (
                <PaymentForm
                    groupId={groupId}
                    membros={membros}
                    inicial={{ paraId: alvo.paraId, valor: alvo.valor }}
                    sugestoes={quitacao}
                    onPaid={() => {
                        setAlvo(null)
                        setRecarga((r) => r + 1)
                    }}
                    onCancel={() => setAlvo(null)}
                />
            )}
        </div>
    )
}