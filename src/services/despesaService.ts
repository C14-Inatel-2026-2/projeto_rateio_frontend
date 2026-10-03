const API_BASE = process.env.NEXT_PUBLIC_API_URL

interface CriarDespesaParams {
    descricao: string
    valor: number
    participantes: string[]
}

export async function criarDespesa({ descricao, valor, participantes }: CriarDespesaParams) {
    const res = await fetch(`${API_BASE}/despesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, valor, participantes }),
    })

    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? 'Erro ao registrar despesa.');
    }

    return res.json()
}
