import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { criarDespesa } from '../despesaService';

global.fetch = vi.fn()

describe('despesaService', () => {
    afterEach(() => vi.resetAllMocks());

    it('deve retornar a despesa criada quando a API responde 201', async () => {
        const despesaMock = { id: 1, descricao: 'Almoço', valor: 50 };

        (fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => despesaMock,
        });

        const resultado = await criarDespesa({
            descricao: 'Almoço',
            valor: 50,
            participantes: ['Ana', 'Bob'],
        });

        expect(resultado).toEqual(despesaMock)
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/despesas'),
            expect.objectContaining({ method: 'POST' }),
        )
    });

    it('deve lançar erro quando a API responde com falha', async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Grupo não encontrado.' }),
        })
        await expect(
            criarDespesa({ descricao: 'Jantar', valor: 80, participantes: ['Ana'] }),
        ).rejects.toThrow('Grupo não encontrado.')
    });
});
