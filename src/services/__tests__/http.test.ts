import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { requisicao, traduzirMensagem, ApiError } from "../http"

global.fetch = vi.fn()

describe("http", () => {
    afterEach(() => vi.resetAllMocks())

    it("deve anexar o membroId na URL e enviar o corpo como JSON", async () => {
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ ok: 1 }) })

        await requisicao("/grupos", { metodo: "POST", corpo: { nome: "Viagem" }, membroId: "abc" })

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(url).toContain("/grupos?membroId=abc")
        expect(opcoes.method).toBe("POST")
        expect(JSON.parse(opcoes.body)).toEqual({ nome: "Viagem" })
    })

    it("deve retornar undefined quando a resposta é 204", async () => {
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 204 })

        const resultado = await requisicao("/grupos/1/membros/2", { metodo: "DELETE", membroId: "abc" })

        expect(resultado).toBeUndefined()
    })

    it("deve lançar ApiError com a mensagem traduzida e o status", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 409,
            json: async () => ({ mensagem: "Membro repetido no grupo" }),
        })

        await expect(requisicao("/grupos/1/membros", { metodo: "POST", corpo: {}, membroId: "abc" }))
            .rejects.toMatchObject({ message: "Esse membro já está no grupo.", status: 409 })
    })

    it("deve usar a mensagem padrão quando o erro vem sem corpo", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => {
                throw new Error("sem corpo")
            },
        })

        await expect(requisicao("/grupos", { membroId: "abc", mensagemPadrao: "Erro ao listar grupos." }))
            .rejects.toBeInstanceOf(ApiError)
    })

    it("traduzirMensagem deve repassar mensagens desconhecidas", () => {
        expect(traduzirMensagem("Algo novo", "padrao")).toBe("Algo novo")
        expect(traduzirMensagem(undefined, "padrao")).toBe("padrao")
    })
})