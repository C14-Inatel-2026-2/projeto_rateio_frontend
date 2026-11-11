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

    return <></>
}