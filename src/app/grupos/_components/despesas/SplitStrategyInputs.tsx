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

const linhaClasse =
    "flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3"

const campoClasse =
    "w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-right text-base text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"

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
            <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                O valor será dividido igualmente entre todos os membros.
            </p>
        )
    }

    if (estrategia === "POR_PESO") {
        return (
            <div className="space-y-3">
                {participantes.map((m) => (
                    <div key={m.id} className={linhaClasse}>
                        <span className="text-base text-slate-800">{m.nome}</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={pesos[m.id] ?? 1}
                            onChange={(e) => onChangePeso(m.id, Number(e.target.value))}
                            aria-label={`Peso de ${m.nome}`}
                            className={campoClasse}
                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {participantes.map((m) => (
                <div key={m.id} className={linhaClasse}>
                    <span className="text-base text-slate-800">{m.nome}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">R$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={valoresFixos[m.id] ?? ""}
                            onChange={(e) => onChangeValorFixo(m.id, Number(e.target.value))}
                            aria-label={`Valor de ${m.nome}`}
                            className={campoClasse}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}