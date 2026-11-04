"use client"

import React, { useState } from "react"
import {
    validarDespesa,
    calcularParcelasPorEstrategia,
    type EstrategiaDivisao,
    type ParcelaParticipante
} from "@/src/services/validarDespesa"
import { criarDespesa } from "@/src/services/despesaService"
import SplitStrategyInput from "./SplitStrategyInputs"
import { set } from "zod"

interface ExpenseFormProps {
    membrosDoGrupo: string[]
}

export default function ExpenseForm({ membrosDoGrupo }: ExpenseFormProps) {
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState<string>('');
    const [pagador, setPagador] = useState<string>(membrosDoGrupo[0] ?? '');
    const [estrategia, setEstrategia] = useState<EstrategiaDivisao>('IGUAL');
    const [pesos, setPesos] = useState<Record<string, number>>({});
    const [valoresFixos, setValoresFixos] = useState<Record<string, number>>({});
    const [erros, setErros] = useState<string[]>([]);
    const [parcelasRegistradas, setParcelasRegistradas] = useState<
        ParcelaParticipante[] | null
    >(null);

    function handleChangePeso(participante: string, peso: number) {
        setPesos((prev) => ({ ...prev, [participante]: peso }))
    }

    function handleChangeValorFixo(participante: string, valorFixo: number) {
        setValoresFixos((prev) => ({ ...prev, [participante]: valorFixo }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErros([])
        setParcelasRegistradas(null)

        const valorNumerico = Number(valor)

        const validacao = validarDespesa({
            descricao,
            valor: valorNumerico,
            participantes: membrosDoGrupo,
            pagador,
            membrosDoGrupo,
            estrategia,
            pesos,
            valoresFixos
        })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        const parcelas = calcularParcelasPorEstrategia({
            valor: valorNumerico,
            participantes: membrosDoGrupo,
            estrategia,
            pesos,
            valoresFixos
        })

        try {
            await criarDespesa({
                descricao: descricao.trim(),
                valor: valorNumerico,
                participantes: membrosDoGrupo,
                pagador,
                estrategia,
                parcelas,
            })

            setParcelasRegistradas(parcelas)
            setDescricao('')
            setValor('')
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao registrar Despesa"
            setErros([mensagem])
        }
    }

    return (
        <></>
    )

}