// Constantes descritivas para melhorar a legibilidade e manutenção
const LOCALE_PADRAO = 'pt-BR';
const MOEDA_PADRAO = 'BRL';

export function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat(LOCALE_PADRAO, {
        style: 'currency',
        currency: MOEDA_PADRAO,
    }).format(valor);
}

export function descreverSaldo(valor: number): string {
    if (valor > 0) {
        return `A receber: ${formatarMoeda(valor)}`;
    } else if (valor < 0) {
        return `Deve: ${formatarMoeda(Math.abs(valor))}`;
    } else {
        return "Quitado";
    }
}