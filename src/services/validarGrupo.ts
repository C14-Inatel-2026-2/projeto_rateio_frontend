import { emailEhValido } from "./validarAuth";
import type { MembroGrupo } from "./grupoService";

export interface ValidacaoResultado {
    valido: boolean;
    erros: string[];
}

function normalizar(email: string): string {
    return email.trim().toLocaleLowerCase()
}

export function validarCriacaoGrupo({
    nome,
    emails,
    emailCriador,
}: {
    nome: string,
    emails: string[],
    emailCriador: string,
}): ValidacaoResultado {
    const erros: string[] = [];

    if (!nome || nome.trim() === "") {
        erros.push("Nome do grupo é obrigatório.")
    }

    const normalizados = emails.map(normalizar)

    if (normalizados.length < 1) {
        erros.push("Informe o e-mail de ao menos 1 membro.")
    }

    if (normalizados.some((email) => !emailEhValido(email))) {
        erros.push("Há e-mail inválido na lista.")
    }

    if (new Set(normalizados).size !== normalizados.length) {
        erros.push("Não é permitido repetir membros.")
    }

    if (normalizados.includes(normalizar(emailCriador))) {
        erros.push("Você ja faz parte do grupo; não informe seu próprio e-mail.")
    }

    return {
        valido: erros.length === 0,
        erros,
    };
}

export function validarAdicionarMembro({
    membrosAtuais,
    email,
}: {
    membrosAtuais: MembroGrupo[]
    email: string
}): ValidacaoResultado {
    const erros: string[] = []
    if (!email || !emailEhValido(email)) {
        erros.push("E-mail inválido.")
    } else if (membrosAtuais.some((m) => normalizar(m.email) === normalizar(email))) {
        erros.push("Esse membro já está no grupo.")
    }
    return { valido: erros.length === 0, erros }
}
export function validarRemoverMembro({
    membrosAtuais,
    alvoId,
}: {
    membrosAtuais: MembroGrupo[]
    alvoId: string
}): ValidacaoResultado {
    const erros: string[] = []
    if (!membrosAtuais.some((m) => m.id === alvoId)) {
        erros.push("Membro não encontrado no grupo.")
    }
    if (membrosAtuais.length - 1 < 2) {
        erros.push("O grupo precisa ter ao menos 2 membros.")
    }
    return { valido: erros.length === 0, erros }
}