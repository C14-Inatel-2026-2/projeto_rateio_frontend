import { describe, it, expect } from 'vitest';
import { calcularParcelasPorEstrategia, validarDespesa } from '../validarDespesa';

describe('validarDespesa', () => {
    it('deve retornar válido quando todos os campos estão corretos', () => {
        const resultado = validarDespesa({
            descricao: 'Almoço',
            valor: 50,
            participantes: ['Paulo', 'Gustavinho'],
            pagador: 'Paulo',
            membrosDoGrupo: ['Paulo', 'Gustavinho'],
            estrategia: "IGUAL"
        })

        expect(resultado.valido).toBe(true)
        expect(resultado.erros).toHaveLength(0)
    })

    it('deve retornar todos os erros quando nenhum campo é preenchido', () => {
        const resultado = validarDespesa({
            descricao: '',
            valor: -10,
            participantes: [],
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain('Descrição é obrigatória.')
        expect(resultado.erros).toContain('Valor deve ser maior que zero.')
        expect(resultado.erros).toContain('Selecione ao menos 1 participante.')
    })

    it("Dividir R$ 100,00 igualmente entre 3 somando exatamente R$ 100,00 com centavo determinístico", () => {
        const parcelas = calcularParcelasPorEstrategia({
            valor: 100,
            participantes: ["Paulo", "Gustavinho", "Luiz"],
            estrategia: "IGUAL"
        })

        expect(parcelas).toEqual([
            { participante: "Paulo", valor: 33.34 },
            { participante: "Gustavinho", valor: 33.33 },
            { participante: "Luiz", valor: 33.33 },
        ])

        const soma = parcelas.reduce((acc, p) => acc + Math.round(p.valor * 100), 0) / 100;
        expect(soma).toBe(100)

    })

    it("rejeitar divisão por valores fixos cuja soma difere do valor total", () => {
        const resultado = validarDespesa({
            descricao: "Jantar",
            valor: 100,
            participantes: ["Paulo", "Caua"],
            pagador: "Paulo",
            membrosDoGrupo: ["Paulo", "Caua"],
            estrategia: "FIXO",
            valoresFixos: { Ana: 40, Bob: 50 }
        })

        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain(
            'A soma dos valores fixos difere do valor total da despesa.'
        )
    })

    it('Rejeitar quando o pagador não pertence ao grupo', () => {
        const resultado = validarDespesa({
            descricao: 'Mercado',
            valor: 150,
            participantes: ['Ana', 'Bob'],
            pagador: 'Intruso',
            membrosDoGrupo: ['Ana', 'Bob'],
            estrategia: 'IGUAL',
        })
        expect(resultado.valido).toBe(false)
        expect(resultado.erros).toContain(
            'O pagador informado não pertence ao grupo.'
        )
    })
    it('Calcular divisão por peso corretamente', () => {
        const parcelas = calcularParcelasPorEstrategia({
            valor: 100,
            participantes: ['Ana', 'Bob'],
            estrategia: 'PESO',
            pesos: { Ana: 3, Bob: 1 },
        });
        expect(parcelas).toEqual([
            { participante: 'Ana', valor: 75 },
            { participante: 'Bob', valor: 25 },
        ])
    })
})
