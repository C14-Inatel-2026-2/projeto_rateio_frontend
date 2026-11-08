import { describe, it, expect } from "vitest";
import { validarCadastro, validarLogin } from "../validarAuth";

describe('validarAuth', () => {
    describe('validarCadastro', () => {
        it('Validar com sucesso quando todos os campos estão corretos', () => {
            const resultado = validarCadastro({
                nome: 'Paulo',
                email: 'pauloLindo@gmail.com',
                senha: 'senha1234',
                confirmacaoSenha: 'senha1234'
            })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it('Retornar todos os erros quando nenhum campo é preenchido', () => {
            const resultado = validarCadastro({
                nome: '',
                email: '',
                senha: '',
                confirmacaoSenha: '',
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain('Nome é obrigatório.')
            expect(resultado.erros).toContain('E-mail inválido.')
            expect(resultado.erros).toContain('A senha deve ter ao menos 8 caracteres.')
        })

        it('Rejeitar e-mail em formato inválido', () => {
            const resultado = validarCadastro({
                nome: 'Paulo',
                email: 'PauloLindo@',
                senha: 'senha1234',
                confirmacaoSenha: 'senha1234',
            })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain('E-mail inválido.')
        })

        it('Rejeitar senha curta', () => {
            const resultado = validarCadastro({
                nome: 'Paulo',
                email: 'PauloLindo@gmail.com',
                senha: '1234',
                confirmacaoSenha: '1234',
            })
            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain('A senha deve ter ao menos 8 caracteres.')
        })

        it('Rejeitar quando a confirmação de senha é diferente', () => {
            const resultado = validarCadastro({
                nome: 'Paulo',
                email: 'PauloLindo@gmail.com',
                senha: 'senhas1234',
                confirmacaoSenha: '123senhas66',
            })
            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain('As senhas não conferem.')
        })
    })


    describe('validarLogin', () => {
        it('Validar com sucesso com e-mail válido e senha preenchida', () => {
            const resultado = validarLogin({ email: 'PauloLindo@gmail.com', senha: 'senhas1234' })

            expect(resultado.valido).toBe(true)
            expect(resultado.erros).toHaveLength(0)
        })

        it('Rejeitar e-mail e a senha vazios', () => {
            const resultado = validarLogin({ email: '', senha: '' })

            expect(resultado.valido).toBe(false)
            expect(resultado.erros).toContain('E-mail inválido.')
            expect(resultado.erros).toContain('Senha é obrigatório.')
        })
    })
})