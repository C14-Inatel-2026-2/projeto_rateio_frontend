import { requisicao } from "./http"

export interface SaldoMembro {
    membroId: string
    nome: string
    saldo: string
}

export interface TransferenciaSugerida {
    deId: string
    deNome: string
    paraId: string
    paraNome: string
    valor: string
}

export function consultarSaldos(grupoId: string, membroId: string): Promise<SaldoMembro[]> {
    return requisicao<SaldoMembro[]>(`/grupos/${grupoId}/saldos`, {
        membroId,
        mensagemPadrao: "Erro ao consultar saldos.",
    })
}

export function consultarQuitacao(grupoId: string, membroId: string): Promise<TransferenciaSugerida[]> {
    return requisicao<TransferenciaSugerida[]>(`/grupos/${grupoId}/quitacao`, {
        membroId,
        mensagemPadrao: "Erro ao consultar a quitação sugerida.",
    })
}