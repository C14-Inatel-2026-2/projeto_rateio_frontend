import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { criarDespesa } from '../despesaService';

global.fetch = vi.fn();

describe('despesaService', () => {
    afterEach(() => vi.resetAllMocks());

    it('deve retornar a despesa criada quando a API responde 201', async () => {
        const despesaMock = {
            id: 1,
            descricao: 'Almoço',
            valor: 100,
            pagador: 'Paulo',
            estrategia: 'IGUAL',
        };

        (fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => despesaMock,
        })

        const resultado = await criarDespesa({
            descricao: 'Almoço',
            valor: 100,
            participantes: ['Paulo', 'Gustavinho', 'Caua'],
            pagador: 'Paulo',
            estrategia: 'IGUAL',
        });

        expect(resultado).toEqual(despesaMock);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/despesas'),
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('deve lançar erro quando a API rejeita pagador que não pertence ao grupo', async () => {
        (fetch as Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                message: 'O pagador informado não pertence ao grupo.',
            }),
        })

        await expect(
            criarDespesa({
                descricao: 'Jantar',
                valor: 80,
                participantes: ['Paulo'],
                pagador: 'Desconhecido',
            })
        ).rejects.toThrow('O pagador informado não pertence ao grupo.')
    })
})