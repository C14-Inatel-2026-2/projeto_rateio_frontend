export function formatarMoeda(valor: string | number): string {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function descreverSaldo(valor: string): string {
    const numero = Number(valor)

    if (numero > 0) return `A receber: ${formatarMoeda(numero)}`
    if (numero < 0) return `Deve: ${formatarMoeda(Math.abs(numero))}`
    return "Quitado"
}