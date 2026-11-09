import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
import { cadastrar, login } from '../authService'

global.fetch = vi.fn()

describe('authService', () => {
    afterEach(() => vi.resetAllMocks())

    describe('cadastrar', () => {
        it('deve retornar o membro criado quando a API responde 201', async () => {
            const membroMock = { id: 'uuid-1', nome: 'Paulo', email: 'paulo@email.com' };

            (fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => membroMock,
            })

            const resultado = await cadastrar({
                nome: 'Paulo',
                email: 'paulo@email.com',
                senha: 'senha1234',
            })

            expect(resultado).toEqual(membroMock)
            expect(fetch).toHaveBeenCalledTimes(1)
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/membros'),
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('deve enviar apenas nome, email e senha, sem confirmação de senha', async () => {
            (fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'uuid-1', nome: 'Paulo', email: 'paulo@email.com' }),
            })

            await cadastrar({ nome: 'Paulo', email: 'paulo@email.com', senha: 'senha1234' })

            const opcoes = (fetch as Mock).mock.calls[0][1]
            const corpo = JSON.parse(opcoes.body)
            expect(Object.keys(corpo).sort()).toEqual(['email', 'nome', 'senha'])
        })

        it('deve lançar erro quando o e-mail já está cadastrado (409)', async () => {
            (fetch as Mock).mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: async () => ({ mensagem: 'Email ja cadastrado' }),
            })

            await expect(
                cadastrar({ nome: 'Paulo', email: 'paulo@email.com', senha: 'senha1234' })
            ).rejects.toThrow('E-mail já cadastrado.')
        })

        it('deve usar a mensagem do backend em erro de validação (400)', async () => {
            (fetch as Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ mensagem: 'Nome, email e senha sao obrigatorios' }),
            })

            await expect(
                cadastrar({ nome: '', email: '', senha: '' })
            ).rejects.toThrow('Nome, email e senha sao obrigatorios')
        })

        it('deve usar mensagem genérica quando o erro vem sem corpo', async () => {
            (fetch as Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => {
                    throw new Error('sem corpo')
                },
            })

            await expect(
                cadastrar({ nome: 'Paulo', email: 'paulo@email.com', senha: 'senha1234' })
            ).rejects.toThrow('Erro ao criar conta.')
        })
    })

    describe('login', () => {
        it('deve retornar o membro quando a API responde 200', async () => {
            const membroMock = { id: 'uuid-1', nome: 'Paulo', email: 'paulo@email.com' };

            (fetch as Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => membroMock,
            })

            const resultado = await login({ email: 'paulo@email.com', senha: 'senha1234' })

            expect(resultado).toEqual(membroMock)
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/membros/login'),
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('deve lançar erro quando as credenciais são inválidas (401)', async () => {
            (fetch as Mock).mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ mensagem: 'Email ou senha invalidos' }),
            })

            await expect(
                login({ email: 'paulo@email.com', senha: 'errada123' })
            ).rejects.toThrow('E-mail ou senha inválidos.')
        })
    })
})