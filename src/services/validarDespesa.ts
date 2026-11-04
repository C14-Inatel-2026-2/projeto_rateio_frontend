export type EstrategiaDivisao = "IGUAL" | "PESO" | "FIXO"

interface ValidarDespesaParams {
    descricao: string
    valor: number
    participantes: string[]
    pagador?: string
    membrosDoGrupo?: string[]
    estrategia?: EstrategiaDivisao
    pesos?: Record<string, number>
    valoresFixos?: Record<string, number>
}

interface ValidacaoResultado {
    valido: boolean
    erros: string[]
}

export interface ParcelaParticipante {
    participante: string
    valor: number
}


export function validarDespesa({
    descricao,
    valor,
    participantes,
    pagador,
    membrosDoGrupo,
    estrategia = 'IGUAL',
    pesos,
    valoresFixos

}: ValidarDespesaParams): ValidacaoResultado {
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

    if (pagador !== undefined && membrosDoGrupo !== undefined) {
        const pagadorLimpo = pagador.trim().toLocaleLowerCase()
        const pertenceAoGrupo = pagadorLimpo !== "" && membrosDoGrupo.some((m) => m.trim().toLocaleLowerCase() === pagadorLimpo)

        if (!pertenceAoGrupo) {
            erros.push("O pagador informado não pertence ao grupo.")
        }
    }

    if (estrategia === "PESO" && Array.isArray(participantes) && participantes.length > 0) {
        const pesosValidos = pesos && participantes.every((p) => typeof pesos[p] === "number" && pesos[p] > 0)

        if (!pesosValidos) {
            erros.push("Todos os participantes devem ter pesos maior que 0.")
        }
    }

    if (
        estrategia === "FIXO" &&
        typeof valor === "number" &&
        valor > 0 && Array.isArray(participantes) &&
        participantes.length > 0
    ) {

        const totalCentavos = Math.round(valor * 100)
        const somaFixosCentavos = participantes.reduce((acc, participantes) => {
            const valorParticipante = valoresFixos?.[participantes] ?? 0
            return acc + Math.round(valorParticipante * 100)
        }, 0)

        if (somaFixosCentavos !== totalCentavos) {
            erros.push("A soma dos valores fixos difere do valor total da despesa.")
        }

    }

    return { valido: erros.length === 0, erros }
}

export function calcularParcelasPorEstrategia({
    valor,
    participantes,
    estrategia = 'IGUAL',
    pesos = {},
    valoresFixos = {}
}: {
    valor: number
    participantes: string[]
    estrategia?: EstrategiaDivisao
    pesos?: Record<string, number>
    valoresFixos?: Record<string, number>
}): ParcelaParticipante[] {
    const totalCentavos = Math.round(valor * 100)
    const qtd = participantes.length


    if (estrategia === "FIXO") {
        return participantes.map((participante) => ({
            participante,
            valor: Number((Math.round((valoresFixos[participante] ?? 0) * 100) / 100).toFixed(2))
        }))
    }

    if (estrategia === "PESO") {
        const somaPesos = participantes.reduce((acc, p) => acc + (pesos[p] ?? 1), 0)

        const parcelasCentavos = participantes.map((p) => Math.floor((totalCentavos * (pesos[p] ?? 1)) / somaPesos))

        const somaDistribuida = parcelasCentavos.reduce((a, b) => a + b, 0)
        let restoCentavos = totalCentavos - somaDistribuida

        for (let i = 0; i < qtd && restoCentavos > 0; i++) {
            parcelasCentavos[i] += 1
            restoCentavos--
        }

        return participantes.map((participante, index) => ({
            participante,
            valor: parcelasCentavos[index] / 100,
        }));
    }

    const baseCentavos = Math.floor(totalCentavos / qtd)
    let restoCentavos = totalCentavos % qtd

    return participantes.map((participante) => {
        let parcela = baseCentavos

        if (restoCentavos > 0) {
            parcela += 1;
            restoCentavos--;
        }

        return {
            participante,
            valor: parcela / 100
        }
    })







}


