export function emCentavos(valor: number): number {
    return Math.round(valor * 100)
}

export function temNoMaximoDuasCasas(valor: number): boolean {
    return Math.abs(valor * 100 - Math.round(valor * 100)) < 1e-9
}

export function formatarMoeda(valor: string | number): string {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function descreverSaldo(valor: string): string {
    const numero = Number(valor)

    if (numero > 0) return `A receber: ${formatarMoeda(numero)}`
    if (numero < 0) return `Deve: ${formatarMoeda(Math.abs(numero))}`
    return "Quitado"
}

