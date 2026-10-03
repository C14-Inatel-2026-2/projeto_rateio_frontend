interface ValidarDespesaParams {
    descricao: string
    valor: number
    participantes: string[]
}

interface ValidacaoResultado {
    valido: boolean
    erros: string[]
}

export function validarDespesa({ descricao, valor, participantes }: ValidarDespesaParams): ValidacaoResultado {
    const erros: string[] = []

    if (!descricao || descricao.trim() === '') {
        erros.push('Descrição é obrigatória.')
    }
    if (typeof valor !== 'number' || valor <= 0) {
        erros.push('Valor deve ser maior que zero.')
    }
    if (!Array.isArray(participantes) || participantes.length === 0) {
        erros.push('Selecione ao menos 1 participante.')
    }

    return { valido: erros.length === 0, erros }
}
