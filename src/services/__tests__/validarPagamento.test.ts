import { describe, it, expect } from "vitest"
import { ValidarPagamento } from "../validarPagamento"

const sugestoes = [
    { deId: "m2", deNome: "Bia", paraId: "m1", paraNome: "Ana", valor: "20.00" },
]

describe("ValidarPagamento", () => {
    it("deve aceitar pagamento válido igual ou menor que a dívida sugerida", () => {
        const resultado = ValidarPagamento({
            pagadorId: "m2",
            paraId: "m1",
            valor: 20,
            transferenciaSugerida: sugestoes,
        })

        expect(resultado.valido).toBe(true)
        expect(resultado.erros).toHaveLength(0)
    })

    it("deve rejeitar pagamento de valor maior que a dívida", () => {
        const resultado = ValidarPagamento({
            pagadorId: "m2",
            paraId: "m1",
            valor: 25,
            transferenciaSugerida: sugestoes,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("O valor informado é maior que a dívida.")
    })

    it("deve rejeitar pagamento para si mesmo ou valor não positivo", () => {
        const resultado = ValidarPagamento({
            pagadorId: "m1",
            paraId: "m1",
            valor: 0,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("Não é possível registrar um pagamento para si mesmo.")
        expect(resultado.erros).toContain("Valor deve ser maior que zero, com no máximo 2 casas decimais.")
    })
})