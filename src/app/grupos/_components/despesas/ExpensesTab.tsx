"use client"

import { useState } from "react"
import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"
import type { Despesa } from "@/src/services/despesaService"
import type { MembroGrupo } from "@/src/services/grupoService"
import { formatarMoeda } from "@/src/services/formatarMoeda"

interface ExpensesTabProps {
    groupId: string
    membros: MembroGrupo[]
}

export default function ExpensesTab({ groupId, membros }: ExpensesTabProps) {
    const [mostrandoForm, setMostrandoForm] = useState(false)
    const [versao, setVersao] = useState(0)
    const [ultima, setUltima] = useState<Despesa | null>(null)

    function nomeDe(id: string): string {
        return membros.find((m) => m.id === id)?.nome ?? "Desconhecido"
    }

    function handleCriada(despesa: Despesa) {
        setUltima(despesa)
        setMostrandoForm(false)
        setVersao((v) => v + 1)
    }

    function abrirForm() {
        setUltima(null)
        setMostrandoForm(true)
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">
                    {mostrandoForm ? "Nova despesa" : "Despesas do grupo"}
                </h2>
                {mostrandoForm ? (
                    <button
                        type="button"
                        onClick={() => setMostrandoForm(false)}
                        className="rounded-lg px-4 py-2 text-base font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={abrirForm}
                        className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700"
                    >
                        + Nova despesa
                    </button>
                )}
            </div>

            {ultima && !mostrandoForm && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <p className="font-medium">Despesa registrada. Parcelas:</p>
                    <ul className="mt-1">
                        {ultima.parcelas.map((p) => (
                            <li key={p.membroId}>
                                {nomeDe(p.membroId)}: {formatarMoeda(p.valor)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {mostrandoForm ? (
                <ExpenseForm groupId={groupId} membrosDoGrupo={membros} onExpenseCreated={handleCriada} />
            ) : (
                <ExpenseList groupId={groupId} membros={membros} versao={versao} />
            )}
        </section>
    )
}