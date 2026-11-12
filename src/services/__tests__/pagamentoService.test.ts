import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { registrarPagamento, estornarPagamento, consultarExtrato } from "../pagamentoService"

global.fetch = vi.fn()

describe("pagamentoService", () => {
    afterEach(() => vi.resetAllMocks())

    it("registrarPagamento deve enviar POST /grupos/{grupoId}/pagamentos?membroId= com valor formatado", async () => {
        const pagamentoMock = {
            id: "p1",
            deId: "m2",
            paraId: "m1",
            valor: "20.00",
            status: "ATIVO",
            data: "2026-11-04T21:00:00Z",
        };
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 201, json: async () => pagamentoMock })

        const resultado = await registrarPagamento("g1", "m2", { paraId: "m1", valor: 20 })

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(pagamentoMock)
        expect(url).toContain("/grupos/g1/pagamentos?membroId=m2")
        expect(JSON.parse(opcoes.body)).toEqual({ paraId: "m1", valor: "20.00" })
    })

    it("registrarPagamento deve lançar erro quando o valor é maior que a dívida (400)", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ mensagem: "Valor maior que a divida" }),
        })

        await expect(registrarPagamento("g1", "m2", { paraId: "m1", valor: 50 }))
            .rejects.toThrow("O valor informado é maior que a dívida.")
    })

    it("estornarPagamento deve chamar POST /grupos/{grupoId}/pagamentos/{pagamentoId}/estorno", async () => {
        const estornoMock = { id: "p1", status: "ESTORNADO" };
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => estornoMock })

        const resultado = await estornarPagamento("g1", "p1", "m2")

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(estornoMock)
        expect(url).toContain("/grupos/g1/pagamentos/p1/estorno?membroId=m2")
        expect(opcoes.method).toBe("POST")
    })

    it("consultarExtrato deve retornar despesas e pagamentos em ordem cronológica", async () => {
        const extratoMock = [
            { tipo: "DESPESA", id: "d1", autorId: "m1", autorNome: "Ana", valor: "100.00", status: "ATIVA", data: "2026-11-04T20:15:00Z" },
            { tipo: "PAGAMENTO", id: "p1", autorId: "m2", autorNome: "Bia", valor: "20.00", status: "ATIVO", data: "2026-11-04T21:00:00Z" },
        ];
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => extratoMock })

        const resultado = await consultarExtrato("g1", "m1")

        expect(resultado).toEqual(extratoMock)
    })
})