import { requisicao } from "./http"

export type EstrategiaDivisao = "IGUAL" | "POR_PESO" | "VALORES_FIXOS"
export type StatusDespesa = "ATIVA" | "ESTORNADA"

export interface ParticipanteDespesa {
    membroId: string
    peso?: number
    valor?: number
}

export interface CriarDespesaParams {
    descricao: string
    valorTotal: number
    pagadorId: string
    estrategia: EstrategiaDivisao
    participantes: ParticipanteDespesa[]
}

export interface ParcelaDespesa {
    membroId: string
    valor: string
}

export interface Despesa {
    id: string
    descricao: string
    valorTotal: string
    pagadorId: string
    estrategia: EstrategiaDivisao
    status: StatusDespesa
    data: string
    parcelas: ParcelaDespesa[]
}

export interface DespesaResumo {
    id: string
    descricao: string
    valorTotal: string
    pagadorId: string
    status: StatusDespesa
    data: string
}

export function criarDespesa(grupoId: string, membroId: string, params: CriarDespesaParams): Promise<Despesa> {
    return requisicao<Despesa>(`/grupos/${grupoId}/despesas`, {
        metodo: "POST",
        corpo: params,
        membroId,
        mensagemPadrao: "Erro ao registrar despesa.",
    })
}

export function listarDespesas(grupoId: string, membroId: string): Promise<DespesaResumo[]> {
    return requisicao<DespesaResumo[]>(`/grupos/${grupoId}/despesas`, {
        membroId,
        mensagemPadrao: "Erro ao listar despesas.",
    })
}

export function estornarDespesa(
    grupoId: string,
    despesaId: string,
    membroId: string,
): Promise<{ id: string; status: StatusDespesa }> {
    return requisicao(`/grupos/${grupoId}/despesas/${despesaId}/estorno`, {
        metodo: "POST",
        membroId,
        mensagemPadrao: "Erro ao estornar despesa.",
    })
}