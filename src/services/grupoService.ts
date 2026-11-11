import { requisicao } from "./http";

export interface MembroGrupo {
    id: string
    nome: string
    email: string
}

export interface GrupoResumo {
    id: string
    nome: string
}

export interface Grupo {
    id: string
    nome: string
    membros: MembroGrupo[]
}

export interface CriarGrupoParams {
    nome: string
    emails: string[]
}

export function criarGrupo(membroId: string, { nome, emails }: CriarGrupoParams): Promise<Grupo> {
    return requisicao<Grupo>("/grupos", {
        metodo: "POST",
        corpo: { nome, emails },
        membroId,
        mensagemPadrao: "Erro ao criar grupo."
    })
}

export function listarGrupos(membroId: string): Promise<GrupoResumo[]> {
    return requisicao<GrupoResumo[]>("/grupos", {
        membroId,
        mensagemPadrao: "Erro ao listar grupos."
    })
}


export function buscarGrupo(grupoId: string, membroId: string): Promise<Grupo> {
    return requisicao<Grupo>(`/grupos/${grupoId}`, {
        membroId,
        mensagemPadrao: "Erro ao carregar o grupo",
    })
}

export function adicionarMembro(grupoId: string, membroId: string, email: string): Promise<MembroGrupo> {
    return requisicao<MembroGrupo>(`/grupos/${grupoId}/membros`, {
        metodo: "POST",
        corpo: { email },
        membroId,
        mensagemPadrao: "Erro ao adicionar membro.",
    })
}

export function removerMembro(grupoId: string, membroId: string, alvoId: string): Promise<void> {
    return requisicao<void>(`/grupos/${grupoId}/membros/${alvoId}`, {
        metodo: "DELETE",
        membroId,
        mensagemPadrao: "Erro ao remover membro."
    })
}