import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SaldoService } from './SaldoService';

describe('SaldoService - Suíte de Testes da Entrega 3', () => {
    let saldoService;

    beforeEach(() => {
        saldoService = new SaldoService('https://api.test.com');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // 1. TESTE SEM MOCK (Positivo)
    it('deve calcular o saldo individual corretamente para uma divisão válida', () => {
        const participantes = ['Alice', 'Bob', 'Carlos'];
        const valorTotal = 150.00;

        const resultado = saldoService.calcularSaldoIndividual(valorTotal, participantes);

        expect(resultado).toHaveLength(3);
        expect(resultado[0]).toEqual({ nome: 'Alice', devendo: 50.00 });
    });

    // 2. TESTE SEM MOCK (Negativo)
    it('deve lançar erro ao tentar calcular saldo com valor total zerado ou negativo', () => {
        const participantes = ['Alice', 'Bob'];

        expect(() => {
            saldoService.calcularSaldoIndividual(0, participantes);
        }).toThrow("O valor total deve ser maior que zero.");
    });

    // 3. TESTE COM MOCK (Positivo)
    it('deve buscar saldos do grupo com sucesso via API (com mock de fetch)', async () => {
        const mockResposta = { grupoId: '123', saldos: [{ usuario: 'Alice', saldo: 25.0 }] };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResposta,
        });

        const dados = await saldoService.buscarSaldosDoGrupo('123');

        expect(fetch).toHaveBeenCalledWith('https://api.test.com/grupos/123/saldos');
        expect(dados).toEqual(mockResposta);
    });

    // 4. TESTE COM MOCK (Negativo)
    it('deve tratar erro de servidor (500) ao buscar saldos via API (com mock de fetch)', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });

        await expect(saldoService.buscarSaldosDoGrupo('123')).rejects.toThrow(
            "Erro ao buscar saldos do servidor."
        );
    });
});