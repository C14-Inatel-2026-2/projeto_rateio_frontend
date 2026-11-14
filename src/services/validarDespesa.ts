import type { EstrategiaDivisao, ParticipanteDespesa } from "./despesaService"
import type { ValidacaoResultado } from "./validarGrupo"
import { emCentavos, temNoMaximoDuasCasas } from "./formatarMoeda"


export interface ValidarDespesaParams {
    descricao: string
    valorTotal: number
    pagadorId: string
    estrategia: EstrategiaDivisao
    participantes: ParticipanteDespesa[]
    idsDoGrupo: string[]
}


export function validarDespesa({
    descricao,
    valorTotal,
    pagadorId,
    estrategia,
    participantes,
    idsDoGrupo,
}: ValidarDespesaParams): ValidacaoResultado {
    const erros: string[] = []

    if (!descricao || descricao.trim() === "") {
        erros.push("Descrição é obrigatória.")
    }

    if (typeof valorTotal !== "number" || !(valorTotal > 0) || !temNoMaximoDuasCasas(valorTotal)) {
        erros.push("Valor deve ser maior que zero, com no máximo 2 casas decimais.")
    }

    if (!idsDoGrupo.includes(pagadorId)) {
        erros.push("O pagador informado não pertence ao grupo.")
    }

    if (participantes.length === 0) {
        erros.push("Selecione ao menos 1 participante.")
    }

    const ids = participantes.map((p) => p.membroId)

    if (new Set(ids).size !== ids.length) {
        erros.push("Há participante repetido.")
    }

    if (ids.some((id) => !idsDoGrupo.includes(id))) {
        erros.push("Há participante que não pertence ao grupo.")
    }

    if (estrategia === "POR_PESO" && participantes.some((p) => !(typeof p.peso === "number" && p.peso > 0))) {
        erros.push("Todos os participantes devem ter peso maior que zero.")
    }

    if (estrategia === "VALORES_FIXOS") {
        const valoresOk = participantes.every(
            (p) => typeof p.valor === "number" && p.valor > 0 && temNoMaximoDuasCasas(p.valor),
        )

        if (!valoresOk) {
            erros.push("Todos os participantes devem ter valor maior que zero, com no máximo 2 casas decimais.")
        } else if (valorTotal > 0) {
            const soma = participantes.reduce((acc, p) => acc + emCentavos(p.valor as number), 0)

            if (soma !== emCentavos(valorTotal)) {
                erros.push("A soma dos valores fixos difere do valor total da despesa.")
            }
        }
    }

    return { valido: erros.length === 0, erros }
}