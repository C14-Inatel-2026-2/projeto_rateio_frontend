import { describe, it, expect } from "vitest"
import { validarDespesa } from "../validarDespesa"

const idsDoGrupo = ["m1", "m2", "m3"]

describe("validarDespesa", () => {
    it("Validar com sucesso uma despesa IGUAL correta", () => {
        const resultado = validarDespesa({
            descricao: "Jantar",
            valorTotal: 100,
            pagadorId: "m1",
            estrategia: "IGUAL",
            participantes: [{ membroId: "m1" }, { membroId: "m2" }, { membroId: "m3" }],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(true)
        expect(resultado.erros).toHaveLength(0)
    })

    it("Rejeitar descrição vazia e valor inválido ou com mais de 2 casas", () => {
        const resultado = validarDespesa({
            descricao: "   ",
            valorTotal: 10.555,
            pagadorId: "m1",
            estrategia: "IGUAL",
            participantes: [{ membroId: "m1" }],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("Descrição é obrigatória.")
        expect(resultado.erros).toContain("Valor deve ser maior que zero, com no máximo 2 casas decimais.")
    })

    it("Rejeitar quando pagador ou participante não pertence ao grupo", () => {
        const resultado = validarDespesa({
            descricao: "Mercado",
            valorTotal: 50,
            pagadorId: "intruso",
            estrategia: "IGUAL",
            participantes: [{ membroId: "m1" }, { membroId: "outro-intruso" }],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("O pagador informado não pertence ao grupo.")
        expect(resultado.erros).toContain("Há participante que não pertence ao grupo.")
    })

    it("Rejeitar participante repetido", () => {
        const resultado = validarDespesa({
            descricao: "Uber",
            valorTotal: 30,
            pagadorId: "m1",
            estrategia: "IGUAL",
            participantes: [{ membroId: "m1" }, { membroId: "m1" }],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("Há participante repetido.")
    })

    it("Rejeitar estratégia POR_PESO quando algum participante tem peso <= 0", () => {
        const resultado = validarDespesa({
            descricao: "Churrasco",
            valorTotal: 120,
            pagadorId: "m1",
            estrategia: "POR_PESO",
            participantes: [
                { membroId: "m1", peso: 2 },
                { membroId: "m2", peso: 0 },
            ],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("Todos os participantes devem ter peso maior que zero.")
    })

    it("Rejeitar estratégia VALORES_FIXOS cuja soma difere do valorTotal", () => {
        const resultado = validarDespesa({
            descricao: "Hotel",
            valorTotal: 100,
            pagadorId: "m1",
            estrategia: "VALORES_FIXOS",
            participantes: [
                { membroId: "m1", valor: 40 },
                { membroId: "m2", valor: 50 },
            ],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain("A soma dos valores fixos difere do valor total da despesa.")
    })

    it("Aceitar estratégia VALORES_FIXOS quando a soma bate exatamente com o total", () => {
        const resultado = validarDespesa({
            descricao: "Hotel",
            valorTotal: 100,
            pagadorId: "m1",
            estrategia: "VALORES_FIXOS",
            participantes: [
                { membroId: "m1", valor: 40 },
                { membroId: "m2", valor: 60 },
            ],
            idsDoGrupo,
        })

        expect(resultado.valido).toBe(true)
        expect(resultado.erros).toHaveLength(0)
    })
})