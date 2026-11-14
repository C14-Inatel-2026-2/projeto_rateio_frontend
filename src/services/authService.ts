import { requisicao } from "./http"

export interface MembroResponse {
    id: string,
    nome: string,
    email: string
}

export interface CadastrarParams {
    nome: string,
    email: string,
    senha: string
}

export interface LoginParams {
    email: string,
    senha: string
}

export async function cadastrar({ nome, email, senha }: CadastrarParams): Promise<MembroResponse> {
    return requisicao<MembroResponse>(`/membros`, {
        metodo: 'POST',
        corpo: { nome, email, senha },
        mensagemPadrao: 'Erro ao criar conta.'
    })

}

export async function login({ email, senha }: LoginParams): Promise<MembroResponse> {
    return requisicao<MembroResponse>(`/membros/login`, {
        metodo: 'POST',
        corpo: { email, senha },
        mensagemPadrao: "Erro ao fazer login.",
    })
}