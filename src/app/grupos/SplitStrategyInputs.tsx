"use client"

import React from "react"
import type { EstrategiaDivisao } from "@/src/services/despesaService"
import type { MembroGrupo } from "@/src/services/grupoService"

interface SplitStrategyInputProps {
    estrategia: EstrategiaDivisao
    participantes: MembroGrupo[]
    pesos: Record<string, number>
    valoresFixos: Record<string, number>
    onChangePeso: (membroId: string, peso: number) => void
    onChangeValorFixo: (membroId: string, valor: number) => void
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
        return <></>
    }

    if (estrategia === "POR_PESO") {
        return <></>
    }

    return <></>
}