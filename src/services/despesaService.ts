import type { EstrategiaDivisao, ParcelaParticipante } from "./validarDespesa"

const API_BASE = process.env.NEXT_PUBLIC_API_URL

interface CriarDespesaParams {
    descricao: string
    valor: number
    participantes: string[]
    pagador?: string
    estrategia?: EstrategiaDivisao
    parcelas?: ParcelaParticipante[]
}

export async function criarDespesa({ descricao, valor, participantes, pagador, estrategia = "IGUAL", parcelas }: CriarDespesaParams) {
    const res = await fetch(`${API_BASE}/despesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descricao,
            valor,
            participantes,
            pagador,
            estrategia,
            parcelas,
        }),
    })

    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? 'Erro ao registrar despesa.');
    }

    return res.json()
}
