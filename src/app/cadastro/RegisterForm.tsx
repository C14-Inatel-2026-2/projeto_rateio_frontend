"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { validarCadastro } from "@/src/services/validarAuth"
import { cadastrar } from "@/src/services/authService"

export default function RegisterForm() {
    const router = useRouter()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmacaoSenha, setConfirmacaoSenha] = useState("")
    const [erros, setErros] = useState<string[]>([])
    const [enviando, setEnviando] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErros([])

        const validacao = validarCadastro({ nome, email, senha, confirmacaoSenha })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        setEnviando(true)
        try {
            await cadastrar({ nome: nome.trim(), email: email.trim(), senha })
            router.push("/login")
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao criar conta."
            setErros([mensagem])
        } finally {
            setEnviando(false)
        }
    }

       const campoVazio = !nome.trim() || !email.trim() || !senha || !confirmacaoSenha

    const inputClasse =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {erros.length > 0 && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erros.map((erro) => (
                        <p key={erro}>{erro}</p>
                    ))}
                </div>
            )}

            <div>
                <label htmlFor="nome" className="mb-1 block text-sm font-medium text-slate-700">
                    Nome
                </label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className={inputClasse}
                />
            </div>

            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    autoComplete="email"
                    className={inputClasse}
                />
            </div>

            <div>
                <label htmlFor="senha" className="mb-1 block text-sm font-medium text-slate-700">
                    Senha
                </label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    className={inputClasse}
                />
            </div>

            <div>
                <label htmlFor="confirmacaoSenha" className="mb-1 block text-sm font-medium text-slate-700">
                    Confirmar senha
                </label>
                <input
                    id="confirmacaoSenha"
                    type="password"
                    value={confirmacaoSenha}
                    onChange={(e) => setConfirmacaoSenha(e.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    className={inputClasse}
                />
            </div>

            <button
                type="submit"
                disabled={enviando || campoVazio}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {enviando ? "Criando conta..." : "Criar conta"}
            </button>
        </form>
    )


}