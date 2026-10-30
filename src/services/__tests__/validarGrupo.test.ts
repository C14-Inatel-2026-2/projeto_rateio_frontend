import { describe, it, expect } from "vitest"
import { validarCriacaoGrupo, validarAdicionarMembro, ValidarRemoverMembro } from "../validarGrupo"

describe("ValidarGrupo", () => {
    describe("ValidarCriacaoGrupo", () => {
        it("Validar com sucesso quando nome é válido e possui ao menos 2 membros", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem",
                membros: ["Ninho", "Paulo"],
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it("deve rejeitar quando o nome está vazio ou há menos de 2 membros", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Brasil",
                membros: ['Carlos', 'carlos'],
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Não é permitido adicionar membros duplicados.")
        })
    })

    describe("validarAdicionarMembro", () => {
        it("Rejeitar ao tentar adicionar um membro já existente no grupo", () => {
            const resultado = validarAdicionarMembro({
                membrosAtuais: ["Paulo", "Henrique"],
                novoMembro: "Paulo",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Membro já existe no grupo.")
        })

        it("Aceitar um novo membro inédito no grupo", () => {
            const resultado = validarAdicionarMembro({
                membrosAtuais: ["Paulo", "Henrique"],
                novoMembro: "Eduardo",
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })
    })

    describe("validarRemoverMembro", () => {
        it("Rejeitar a remoção de membro quando o grupo já possui despesas registradas", () => {
            const resultado = ValidarRemoverMembro({
                membrosAtuais: ['Paulo', 'Henrique', 'Eduardo'],
                membroParaRemover: 'Paulo',
                possuiDespesasRegistradas: true,
            })
            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Não é possível remover um membro de um grupo com despesas registradas.")
        })

        it("Permitir remover membro quando o grupo não possui despesas registradas", () => {
            const resultado = ValidarRemoverMembro({
                membrosAtuais: ['Paulo', 'Henrique', 'Eduardo'],
                membroParaRemover: 'Paulo',
                possuiDespesasRegistradas: false,
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })
    })
})