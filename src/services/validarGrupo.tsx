export interface ValidarCriacaoGroupoParams {
    nome: string
    membros: string[]
}

export interface validarAdicionarMembroParams {
    membrosAtuais: string[]
    novoMembro: string
}

export interface ValidarRemoverMembroParams {
    membrosAtuais: string[]
    membroParaRemover: string
    possuiDespesasRegistradas: boolean
}

export interface ValidacaoResultado {
    valido: boolean;
    erros: string[];
}

export function validarCriacaoGrupo({
    nome,
    membros,
}: ValidarCriacaoGroupoParams): ValidacaoResultado {
    const erros: string[] = []


    if (!nome || nome.trim() === "") {
        erros.push('Nome do grupo é obrigatório.');
    }


    const membrosLimpos = Array.isArray(membros) ? membros.map((m) => m.trim()).filter((m) => m !== '') : [];

    if (membrosLimpos.length < 2) {
        erros.push('O grupo deve ter ao menos 2 membros.');
    }

    const membrosNormalizados = membrosLimpos.map((m) => m.toLowerCase());
    const possuiDuplicados =
        new Set(membrosNormalizados).size !== membrosNormalizados.length;
    if (possuiDuplicados) {
        erros.push('Não é permitido adicionar membros duplicados.');
    }
    return {
        valido: erros.length === 0,
        erros,
    };
}


export function validarAdicionarMembro({
    membrosAtuais,
    novoMembro,
}: validarAdicionarMembroParams): ValidacaoResultado {
    const erros: string[] = [];
    const nomeLimpo = novoMembro ? novoMembro.trim() : '';

    if (!nomeLimpo) {
        erros.push("Nome do membro é obrigatorio.")
    } else {
        const jaExiste = membrosAtuais.some((m) => m.trim().toLowerCase() === nomeLimpo.toLowerCase())

        if (jaExiste) {
            erros.push('Membro já existe no grupo.')
        }

    }

    return {
        valido: erros.length === 0,
        erros,
    };
}

export function ValidarRemoverMembro({
    membrosAtuais,
    membroParaRemover,
    possuiDespesasRegistradas
}: ValidarRemoverMembroParams): ValidacaoResultado {
    const erros: string[] = []

    if (possuiDespesasRegistradas) {
        erros.push('Não é possível remover um membro de um grupo com despesas registradas.');
    }

    const existeNoGrupo = membrosAtuais.some((m) => m.trim().toLowerCase() === membroParaRemover.trim().toLowerCase())

    if (!existeNoGrupo) {
        erros.push('Membro não encontrado no grupo.');
    }
    return {
        valido: erros.length === 0,
        erros,
    };
}
