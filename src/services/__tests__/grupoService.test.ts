import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { criarGrupo, listarGrupos, adicionarMembro, removerMembro } from "../grupoService"

global.fetch = vi.fn()

describe("grupoService", () => {
    afterEach(() => vi.resetAllMocks())

    it("criarGrupo deve enviar nome e emails com o membroId na URL", async () => {
        const grupoMock = { id: "g1", nome: "Viagem", membros: [] };
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 201, json: async () => grupoMock })

        const resultado = await criarGrupo("m1", { nome: "Viagem", emails: ["maria@x.com"] })

        const [url, opcoes] = (fetch as Mock).mock.calls[0]
        expect(resultado).toEqual(grupoMock)
        expect(url).toContain("/grupos?membroId=m1")
        expect(JSON.parse(opcoes.body)).toEqual({ nome: "Viagem", emails: ["maria@x.com"] })
    })

    it("listarGrupos deve retornar a lista de grupos do membro", async () => {
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 200, json: async () => [{ id: "g1", nome: "Viagem" }] })

        const resultado = await listarGrupos("m1")

        expect(resultado).toHaveLength(1)
    })

    it("adicionarMembro deve lançar erro quando a pessoa já está no grupo (409)", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 409,
            json: async () => ({ mensagem: "Membro repetido no grupo" }),
        })

        await expect(adicionarMembro("g1", "m1", "maria@x.com")).rejects.toThrow("Esse membro já está no grupo.")
    })

    it("removerMembro deve resolver sem corpo quando a API responde 204", async () => {
        (fetch as Mock).mockResolvedValueOnce({ ok: true, status: 204 })

        await expect(removerMembro("g1", "m1", "m2")).resolves.toBeUndefined()
    })

    it("removerMembro deve lançar erro quando o grupo tem despesas (409)", async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 409,
            json: async () => ({ mensagem: "Grupo com despesas nao permite remover membros" }),
        })

        await expect(removerMembro("g1", "m1", "m2")).rejects.toThrow(
            "Não é possível remover membros de um grupo com despesas.",
        )
    })
})