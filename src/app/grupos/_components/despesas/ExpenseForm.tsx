"use client"

import React, { useState } from "react"
import { validarDespesa } from "@/src/services/validarDespesa"
import {
    criarDespesa,
    type EstrategiaDivisao,
    type Despesa,
    type ParticipanteDespesa,
} from "@/src/services/despesaService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"
import SplitStrategyInput from "./SplitStrategyInputs"

interface ExpenseFormProps {
    groupId: string
    membrosDoGrupo: MembroGrupo[]
    onExpenseCreated?: (despesa: Despesa) => void
}

export default function ExpenseForm({
    groupId,
    membrosDoGrupo,
    onExpenseCreated,
}: ExpenseFormProps) {
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState<string>("")
    const [pagadorId, setPagadorId] = useState<string>(membrosDoGrupo[0]?.id ?? "")
    const [estrategia, setEstrategia] = useState<EstrategiaDivisao>("IGUAL")
    const [pesos, setPesos] = useState<Record<string, number>>({})
    const [valoresFixos, setValoresFixos] = useState<Record<string, number>>({})
    const [erros, setErros] = useState<string[]>([])
    const [despesaRegistrada, setDespesaRegistrada] = useState<Despesa | null>(null)
    const [enviando, setEnviando] = useState(false)

    function handleChangePeso(membroId: string, peso: number) {
        setPesos((prev) => ({ ...prev, [membroId]: peso }))
    }

    function handleChangeValorFixo(membroId: string, valorFixo: number) {
        setValoresFixos((prev) => ({ ...prev, [membroId]: valorFixo }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErros([])
        setDespesaRegistrada(null)

        const sessao = obterSessao()
        if (!sessao) {
            setErros(["Sessão expirada. Faça login novamente."])
            return
        }

        const valorNumerico = Number(valor)
        const idsDoGrupo = membrosDoGrupo.map((m) => m.id)

        const participantes: ParticipanteDespesa[] = membrosDoGrupo.map((m) => {
            if (estrategia === "POR_PESO") {
                return { membroId: m.id, peso: pesos[m.id] ?? 1 }
            }
            if (estrategia === "VALORES_FIXOS") {
                return { membroId: m.id, valor: valoresFixos[m.id] ?? 0 }
            }
            return { membroId: m.id }
        })

        const validacao = validarDespesa({
            descricao,
            valorTotal: valorNumerico,
            pagadorId,
            estrategia,
            participantes,
            idsDoGrupo,
        })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        setEnviando(true)
        try {
            const criada = await criarDespesa(groupId, sessao.id, {
                descricao: descricao.trim(),
                valorTotal: valorNumerico,
                pagadorId,
                estrategia,
                participantes,
            })

            setDespesaRegistrada(criada)
            setDescricao("")
            setValor("")
            onExpenseCreated?.(criada)
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao registrar despesa."
            setErros([mensagem])
        } finally {
            setEnviando(false)
        }
    }

        const inputClasse =
        "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"

    const opcoes: { valor: EstrategiaDivisao; rotulo: string }[] = [
        { valor: "IGUAL", rotulo: "Igualmente" },
        { valor: "POR_PESO", rotulo: "Por peso" },
        { valor: "VALORES_FIXOS", rotulo: "Valores fixos" },
    ]

    const campoVazio = !descricao.trim() || !valor

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {erros.length > 0 && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erros.map((erro) => (
                        <p key={erro}>{erro}</p>
                    ))}
                </div>
            )}

            {despesaRegistrada && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    Despesa registrada com sucesso.
                </div>
            )}

            <div>
                <label htmlFor="descricao" className="mb-1.5 block text-base font-medium text-slate-700">
                    Descrição
                </label>
                <input
                    id="descricao"
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex.: Aluguel"
                    className={inputClasse}
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="valor" className="mb-1.5 block text-base font-medium text-slate-700">
                        Valor total (R$)
                    </label>
                    <input
                        id="valor"
                        type="number"
                        min="0"
                        step="0.01"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        placeholder="100.00"
                        className={inputClasse}
                    />
                </div>

                <div>
                    <label htmlFor="pagador" className="mb-1.5 block text-base font-medium text-slate-700">
                        Quem pagou
                    </label>
                    <select
                        id="pagador"
                        value={pagadorId}
                        onChange={(e) => setPagadorId(e.target.value)}
                        className={inputClasse}
                    >
                        {membrosDoGrupo.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <span className="mb-1.5 block text-base font-medium text-slate-700">Como dividir</span>
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
                    {opcoes.map((opcao) => (
                        <button
                            key={opcao.valor}
                            type="button"
                            onClick={() => setEstrategia(opcao.valor)}
                            className={
                                estrategia === opcao.valor
                                    ? "rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-indigo-600 shadow-sm"
                                    : "rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                            }
                        >
                            {opcao.rotulo}
                        </button>
                    ))}
                </div>
            </div>

            <SplitStrategyInput
                estrategia={estrategia}
                participantes={membrosDoGrupo}
                pesos={pesos}
                valoresFixos={valoresFixos}
                onChangePeso={handleChangePeso}
                onChangeValorFixo={handleChangeValorFixo}
            />

            <button
                type="submit"
                disabled={enviando || campoVazio}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {enviando ? "Registrando..." : "Registrar despesa"}
            </button>
        </form>
    )
}