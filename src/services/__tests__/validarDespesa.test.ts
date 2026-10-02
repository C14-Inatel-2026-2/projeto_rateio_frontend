import { describe, it, expect } from 'vitest';
import { validarDespesa } from '../validarDespesa';

describe('validarDespesa', () => {
    it('deve retornar válido quando todos os campos estão corretos', () => {
        const resultado = validarDespesa({
            descricao: 'Almoço',
            valor: 50,
            participantes: ['Ana', 'Bob'],
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
})
