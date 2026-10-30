import { describe, it, expect, vi, afterEach, type Mock } from "vitest"
import { criarGrupo, adicionarMembroGrupo, removerMembroGrupo } from "../grupoService"

global.fetch = vi.fn()

describe("grupoService ", () => {
    afterEach(() => vi.resetAllMocks())

    it("Retornar confirmação com id e lista de membros ao criar grupo com sucesso", async () => {
        const grupoMock = {
            id: "grupo-1",
            nome: "Cmerece",
            membros: ["Ninho", "Paulinho", "Gustavinho", "Luiz"],
        };

        (fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => grupoMock,
        });

        const resultado = await criarGrupo({
            nome: 'Cmerece',
            membros: ["Ninho", "Paulinho", "Gustavinho", "Luiz"],
        })

        expect(resultado).toEqual(grupoMock)
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/grupos'),
            expect.objectContaining({ method: 'POST' })
        )
    })
    it('deve lançar erro quando tentar adicionar membro já existente no grupo', async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Membro já existe no grupo.' }),
        })
        await expect(adicionarMembroGrupo('grupo-1', 'Ninho')).rejects.toThrow(
            'Membro já existe no grupo.'
        )
    })
    it('deve lançar erro quando tentar remover membro de grupo com despesas registradas', async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                message: 'Não é permitido remover membro de grupo com despesas.',
            }),
        })
        await expect(removerMembroGrupo('grupo-1', 'Ninho')).rejects.toThrow(
            'Não é permitido remover membro de grupo com despesas.'
        )
    })
})