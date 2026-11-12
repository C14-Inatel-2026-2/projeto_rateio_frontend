import { requisicao } from "./http";

export type StatusPagamento = "ATIVO" | "ESTORNADO"
export type TipoLancamentoExtrato = "DESPESA" | "PAGAMENTO"
export type StatusLancamentoExtrato = "ATIVA" | "ESTORNADA" | "ATIVO" | "ESTORNADO"

export interface PagamentoResponse {
    id: string
    deId: string
    paraId: string
    valor: string
    status: StatusPagamento
    data: string
}

export interface ItemExtrato {
    tipo: TipoLancamentoExtrato
    id: string
    autorId: string
    autorNome: string
    valor: string
    status: StatusLancamentoExtrato
    data: string
}

export interface RegistrarPagamentoParams {
    paraId: string
    valor: number
}

export function registrarPagamento(
    grupoId: string,
    membroId: string,
    { paraId, valor }: RegistrarPagamentoParams
): Promise<PagamentoResponse> {
    return requisicao<PagamentoResponse>(`/grupos/${grupoId}/pagamentos`, {
        metodo: "POST",
        corpo: { paraId, valor: valor.toFixed(2) },
        membroId,
        mensagemPadrao: "Erro ao registrar pagamento."
    })
}



export function estornarPagamento(
    grupoId: string,
    pagamentoId: string,
    membroId: string
): Promise<{ id: string; status: StatusPagamento }> {
    return requisicao(`/grupos/${grupoId}/pagamentos/${pagamentoId}/estorno`, {
        metodo: "POST",
        membroId,
        mensagemPadrao: "Erro ao estornar pagamento."
    })
}

export function consultarExtrato(
    grupoId: string,
    membroId: string,
): Promise<ItemExtrato[]> {
    return requisicao<ItemExtrato[]>(`/grupos/${grupoId}/extrato`, {
        membroId,
        mensagemPadrao: "Erro ao consultar extrato do grupo."
    })
}