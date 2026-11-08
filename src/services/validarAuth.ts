import { error } from "console"
import { ValidacaoResultado } from "./validarGrupo"

export interface validacaoResultado {
    valido: boolean,
    erros: string[]
}

export interface ValidarCadastroParams {
    nome: string,
    email: string,
    senha: string,
    confirmacaoSenha: string
}

export interface ValidarLoginParams {
    email: string,
    senha: string
}

const TAMANHO_MINIMO_SENHA = 8
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function emailEhValido(email: string): boolean {
    return REGEX_EMAIL.test(email.trim())
}

export function ValidarCadastro({
    nome,
    email,
    senha,
    confirmacaoSenha,
}: ValidarCadastroParams): ValidacaoResultado {
    const erros: string[] = []

    if (!nome || nome.trim() === '') {
        erros.push('Nome é obrigatório.')
    }
    if (!email || !emailEhValido(email)) {
        erros.push('E-mail inválido.')
    }
    if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
        erros.push(`A senha deve ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`)
    }
    if (senha !== confirmacaoSenha) {
        erros.push('As senhas não conferem.')
    }
    return { valido: erros.length === 0, erros }
}

export function validarLogin({ email, senha }: ValidarLoginParams): ValidacaoResultado {

    const erros: string[] = []

    if (!email || !emailEhValido(email)) {
        erros.push('E-mail inválido.')
    }
    if (!senha) {
        erros.push('Senha é obrigatório.')
    }

    return { valido: erros.length === 0, erros }
}