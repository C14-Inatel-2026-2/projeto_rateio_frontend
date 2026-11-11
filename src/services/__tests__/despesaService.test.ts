import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { criarDespesa, listarDespesas, estornarDespesa } from "../despesaService"

global.fetch = vi.fn()

describe("despesaService", () => {
    afterEach(() => vi.resetAllMocks())

    it("criarDespesa deve enviar para /grupos/{grupoId}/despesas?membroId= e retornar 201", async () => {
        const despesaMock = {
            id: "d1",
            descricao: "Jantar",
            valorTotal: "100.00",
            pagadorId: "m1",
            estrategia: "IGUAL",
            status: "ATIVA",
            data: "2026-11-04T20:15:00Z",
            parcelas: [
                { membroId: "m1", valor: "33.34" },
                { membroId: "m2", valor: "33.33" },
                { membroId: "m3", valor: "33.33" },
            ],
        };
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 201, json: async () => despesaMock })

        const resultado = await criarDespesa("g1", "m1", {
            descricao: "Jantar",
            valorTotal: 100,
            pagadorId: "m1",
            estrategia: "IGUAL",
            participantes: [{ membroId: "m1" }, { membroId: "m2" }, { membroId: "m3" }],
        })

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(despesaMock)
        expect(url).toContain("/grupos/g1/despesas?membroId=m1")
        expect(opcoes.method).toBe("POST")
    })

    it("criarDespesa deve traduzir erro quando pagador não pertence ao grupo (400)", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ mensagem: "Pagador fora do grupo" }),
        })

        await expect(
            criarDespesa("g1", "m1", {
                descricao: "Jantar",
                valorTotal: 80,
                pagadorId: "intruso",
                estrategia: "IGUAL",
                participantes: [{ membroId: "m1" }],
            }),
        ).rejects.toThrow("O pagador não pertence ao grupo.")
    })

    it("listarDespesas deve retornar a lista de despesas do grupo", async () => {
        const listaMock = [
            { id: "d1", descricao: "Jantar", valorTotal: "100.00", pagadorId: "m1", status: "ATIVA", data: "2026-11-04T20:15:00Z" },
        ];
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => listaMock })

        const resultado = await listarDespesas("g1", "m1")

        expect(resultado).toEqual(listaMock)
    })

    it("estornarDespesa deve chamar POST /grupos/{grupoId}/despesas/{despesaId}/estorno", async () => {
        const estornoMock = { id: "d1", status: "ESTORNADA" };
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => estornoMock })

        const resultado = await estornarDespesa("g1", "d1", "m1")

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(estornoMock)
        expect(url).toContain("/grupos/g1/despesas/d1/estorno?membroId=m1")
        expect(opcoes.method).toBe("POST")
    })
})