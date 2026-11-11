import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { consultarSaldos, consultarQuitacao } from "../saldoService"

global.fetch = vi.fn()

describe("saldoService", () => {
    afterEach(() => vi.resetAllMocks())

    it("consultarSaldos deve retornar os saldos consolidados do grupo", async () => {
        const saldosMock = [
            { membroId: "m1", nome: "Ana", saldo: "60.00" },
            { membroId: "m2", nome: "Bia", saldo: "-20.00" },
            { membroId: "m3", nome: "Caio", saldo: "-40.00" },
        ];
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => saldosMock })

        const resultado = await consultarSaldos("g1", "m1")

        const [url] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(saldosMock)
        expect(url).toContain("/grupos/g1/saldos?membroId=m1")
    })

    it("consultarQuitacao deve retornar as transferências mínimas sugeridas", async () => {
        const quitacaoMock = [
            { deId: "m3", deNome: "Caio", paraId: "m1", paraNome: "Ana", valor: "40.00" },
            { deId: "m2", deNome: "Bia", paraId: "m1", paraNome: "Ana", valor: "20.00" },
        ];
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => quitacaoMock })

        const resultado = await consultarQuitacao("g1", "m1")

        const [url] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(quitacaoMock)
        expect(url).toContain("/grupos/g1/quitacao?membroId=m1")
    })

    it("deve lançar erro traduzido quando o grupo não existe (404)", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ mensagem: "Grupo nao encontrado" }),
        })

        await expect(consultarSaldos("g-inexistente", "m1")).rejects.toThrow("Grupo não encontrado.")
    })
})