"use client"

import React, { useState } from "react"
import { registrarPagamento } from "@/src/services/pagamentoService"
import { validarPagamento } from "@/src/services/validarPagamento"
import type { TransferenciaSugerida } from "@/src/services/saldoService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"
import { formatarMoeda } from "@/src/services/formatarMoeda"

interface PaymentFormProps {
    groupId: string
    membros: MembroGrupo[]
    inicial?: { paraId: string; valor: string }
    sugestoes?: TransferenciaSugerida[]
    onPaid: () => void
    onCancel: () => void
}

const inputClasse =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"

export default function PaymentForm({
    groupId,
    membros,
    inicial,
    sugestoes,
    onPaid,
    onCancel,
}: PaymentFormProps) {
    const sessao = obterSessao()
    const destinatarios = membros.filter((m) => m.id !== sessao?.id)

    const [paraId, setParaId] = useState(inicial?.paraId ?? destinatarios[0]?.id ?? "")
    const [valor, setValor] = useState(inicial?.valor ?? "")
    const [erros, setErros] = useState<string[]>([])
    const [enviando, setEnviando] = useState(false)

    function nomeDe(id: string): string {
        return membros.find((m) => m.id === id)?.nome ?? "Desconhecido"
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErros([])

        if (!sessao) {
            setErros(["Sessão expirada. Faça login novamente."])
            return
        }

        const valorNumerico = Number(valor)

        const validacao = validarPagamento({
            pagadorId: sessao.id,
            paraId,
            valor: valorNumerico,
            transferenciaSugerida: sugestoes,
        })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        setEnviando(true)
        try {
            await registrarPagamento(groupId, sessao.id, { paraId, valor: valorNumerico })
            onPaid()
        } catch (err) {
            const mensagem = err instanceof Error ? err.message : "Erro ao registrar pagamento."
            const amigavel = mensagem.toLowerCase().includes("maior que a divida")
                ? "O valor não pode passar do que você deve a essa pessoa."
                : mensagem
            setErros([amigavel])
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 px-6">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-8 shadow-lg"
            >
                <h3 className="text-2xl font-semibold text-slate-900">Registrar pagamento</h3>

                {erros.length > 0 && (
                    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {erros.map((erro) => (
                            <p key={erro}>{erro}</p>
                        ))}
                    </div>
                )}

                <div>
                    <label htmlFor="quemPaga" className="mb-1.5 block text-base font-medium text-slate-700">
                        Quem paga
                    </label>
                    <input
                        id="quemPaga"
                        type="text"
                        value={`${sessao?.nome ?? ""} (você)`}
                        readOnly
                        className={`${inputClasse} bg-slate-50 text-slate-500`}
                    />
                </div>

                <div>
                    <label htmlFor="paraQuem" className="mb-1.5 block text-base font-medium text-slate-700">
                        Para
                    </label>
                    <select
                        id="paraQuem"
                        value={paraId}
                        onChange={(e) => setParaId(e.target.value)}
                        className={inputClasse}
                    >
                        {destinatarios.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="valorPagamento" className="mb-1.5 block text-base font-medium text-slate-700">
                        Valor (R$)
                    </label>
                    <input
                        id="valorPagamento"
                        type="number"
                        min="0"
                        step="0.01"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        placeholder="20.00"
                        className={inputClasse}
                    />
                    {inicial && (
                        <p className="mt-2 text-sm text-slate-500">
                            Sugestão da quitação: {formatarMoeda(inicial.valor)} para {nomeDe(inicial.paraId)}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={enviando}
                        className="rounded-lg px-5 py-2.5 text-base font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={enviando || !paraId || !valor}
                        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-base font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {enviando ? "Registrando..." : "Registrar pagamento"}
                    </button>
                </div>
            </form>
        </div>
    )
}