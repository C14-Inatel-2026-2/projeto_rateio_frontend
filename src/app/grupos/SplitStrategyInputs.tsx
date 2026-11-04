"use client"

import React from "react"
import type { EstrategiaDivisao } from "@/src/services/validarDespesa"

interface SplitStrategyInputProps {
    estrategia: EstrategiaDivisao
    participantes: string[]
    pesos: Record<string, number>
    valoresFixos: Record<string, number>
    onChangePeso: (participante: string, peso: number) => void
    onChangeValorFixo: (participante: string, valor: number) => void
}

export default function SplitStrategyInput({
    estrategia,
    participantes,
    pesos,
    valoresFixos,
    onChangePeso,
    onChangeValorFixo,
}: SplitStrategyInputProps) {
    if (estrategia === "IGUAL") {
        return (
            <></>
        )
    }

    if (estrategia === "PESO") {
        return (
            <></>
        )
    }


    return (
        <></>
    )

}