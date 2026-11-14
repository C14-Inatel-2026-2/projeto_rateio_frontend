import type { TransferenciaSugerida } from "./saldoService";
import type { ValidacaoResultado } from "./validarGrupo";
import { emCentavos, temNoMaximoDuasCasas } from "./formatarMoeda";


export interface ValidarPagamentoParams {
    pagadorId: string
    paraId: string
    valor: number
    transferenciaSugerida?: TransferenciaSugerida[]
}

export function validarPagamento({
    pagadorId,
    paraId,
    valor,
    transferenciaSugerida,
}: ValidarPagamentoParams): ValidacaoResultado {
    const erros: string[] = []

    if (!paraId || paraId.trim() === "") {
        erros.push("Selecione o destinatário do pagamento.")
    }
    else if (pagadorId === paraId) {
        erros.push("Não é possível registrar um pagamento para si mesmo.")
    }

    if (typeof valor !== "number" || !(valor > 0) || !temNoMaximoDuasCasas(valor)) {
        erros.push("Valor deve ser maior que zero, com no máximo 2 casas decimais.")
    }

    if (
        erros.length === 0 &&
        Array.isArray(transferenciaSugerida)
    ) {
        const dividaSugerida = transferenciaSugerida?.find(
            (t) => t.deId === pagadorId && t.paraId === paraId
        )

        if (!dividaSugerida) {
            erros.push("O valor informado é maior que a dívida.")
        } else {
            const limiteCentavos = emCentavos(Number(dividaSugerida.valor))
            if (emCentavos(valor) > limiteCentavos) {
                erros.push("O valor informado é maior que a dívida.")
            }
        }
    }

    return { valido: erros.length === 0, erros }
}