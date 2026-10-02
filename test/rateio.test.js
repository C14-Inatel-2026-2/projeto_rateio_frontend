import { describe, it, expect } from 'vitest';
import { calcularDivisaoDespesa } from './rateio';

describe('calcularDivisaoDespesa', () => {
    // Padrão 1: API Definition - Cenário básico sem sobra
    it('deve dividir um valor exato igualmente entre os participantes', () => {
        const resultado = calcularDivisaoDespesa(100.00, 2);
        expect(resultado).toEqual([50.00, 50.00]);
    });

    // Padrão 2: Differential Test - Divisão inexata e distribuição de centavos
    it('deve distribuir a sobra de centavos de forma determinística somando o total exato', () => {
        const resultado = calcularDivisaoDespesa(100.00, 3);

        // Verifica a distribuição determinística do centavo
        expect(resultado).toEqual([33.34, 33.33, 33.33]);

        // Garantia de integridade do valor total
        const somaTotal = resultado.reduce((acc, val) => acc + val, 0);
        expect(somaTotal).toBe(100.00);
    });

    // Padrão 3: Exceptional Limit - Tratamento de entradas inválidas
    it('deve lançar exceção quando o valor for menor ou igual a zero', () => {
        expect(() => calcularDivisaoDespesa(0, 2)).toThrow("O valor da despesa deve ser maior que zero.");
        expect(() => calcularDivisaoDespesa(-50, 2)).toThrow("O valor da despesa deve ser maior que zero.");
    });

    it('deve lançar exceção quando o número de pessoas for menor que 1', () => {
        expect(() => calcularDivisaoDespesa(100, 0)).toThrow("O número de pessoas deve ser um inteiro maior ou igual a 1.");
    });
});