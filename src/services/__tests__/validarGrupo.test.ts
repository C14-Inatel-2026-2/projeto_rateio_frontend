import { describe, it, expect } from "vitest"
import {
    validarCriacaoGrupo,
    validarAdicionarMembro,
    validarRemoverMembro,
} from "../validarGrupo"
import type { MembroGrupo } from "../grupoService"

const membrosBase: MembroGrupo[] = [
    { id: "m1", nome: "Paulo", email: "paulo@email.com" },
    { id: "m2", nome: "Gustavo", email: "gustavo@email.com" },
    { id: "m3", nome: "Luiz", email: "luiz@email.com" },
]

describe("validarGrupo", () => {
    describe("validarCriacaoGrupo", () => {
        it("Validar com sucesso quando nome e e-mails convidados são válidos", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem C14",
                emails: ["gustavo@email.com", "luiz@email.com"],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it("Rejeitar quando o nome do grupo está vazio", () => {
            const resultado = validarCriacaoGrupo({
                nome: "   ",
                emails: ["gustavo@email.com"],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Nome do grupo é obrigatório.")
        })

        it("Rejeitar quando a lista de e-mails está vazia", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem",
                emails: [],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Informe o e-mail de ao menos 1 membro.")
        })

        it("Rejeitar quando há e-mail em formato inválido na lista", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem",
                emails: ["email-invalido"],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Há e-mail inválido na lista.")
        })

        it("Rejeitar quando há e-mails repetidos na lista (ignorando maiúsculas)", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem",
                emails: ["gustavo@email.com", "GUSTAVO@email.com"],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Não é permitido repetir membros.")
        })

        it("Rejeitar quando o criador informa seu próprio e-mail na lista", () => {
            const resultado = validarCriacaoGrupo({
                nome: "Viagem",
                emails: ["PAULO@email.com"],
                emailCriador: "paulo@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain(
                "Você ja faz parte do grupo; não informe seu próprio e-mail.",
            )
        })
    })

    describe("validarAdicionarMembro", () => {
        it("Aceitar um novo e-mail válido e inédito no grupo", () => {
            const resultado = validarAdicionarMembro({
                membrosAtuais: membrosBase,
                email: "caua@email.com",
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it("Rejeitar quando o e-mail já pertence ao grupo (ignorando maiúsculas)", () => {
            const resultado = validarAdicionarMembro({
                membrosAtuais: membrosBase,
                email: "GUSTAVO@email.com",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Esse membro já está no grupo.")
        })

        it("Rejeitar quando o e-mail informado é inválido", () => {
            const resultado = validarAdicionarMembro({
                membrosAtuais: membrosBase,
                email: "invalido@",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("E-mail inválido.")
        })
    })

    describe("validarRemoverMembro", () => {
        it("Permitir remover membro quando ele existe e o grupo tem 3 ou mais membros", () => {
            const resultado = validarRemoverMembro({
                membrosAtuais: membrosBase,
                alvoId: "m3",
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it("Rejeitar quando o membro alvo não existe no grupo", () => {
            const resultado = validarRemoverMembro({
                membrosAtuais: membrosBase,
                alvoId: "id-inexistente",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("Membro não encontrado no grupo.")
        })

        it("Rejeitar quando a remoção deixaria o grupo com menos de 2 membros", () => {
            const apenasDois = membrosBase.slice(0, 2)

            const resultado = validarRemoverMembro({
                membrosAtuais: apenasDois,
                alvoId: "m2",
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain("O grupo precisa ter ao menos 2 membros.")
        })
    })
})