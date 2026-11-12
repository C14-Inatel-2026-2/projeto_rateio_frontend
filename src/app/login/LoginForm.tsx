"use client"

import React, { useState } from "react"
import { validarLogin } from "@/src/services/validarAuth"
import { login, type MembroResponse } from "@/src/services/authService"
import { useRouter } from "next/navigation"
import { salvarSessao } from "@/src/services/sessao"


interface LoginFormProps {
    onLoginSuccess?: (membro: MembroResponse) => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erros, setErros] = useState<string[]>([])
    const [enviando, setEnviando] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErros([])

        const validacao = validarLogin({ email, senha })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        setEnviando(true)
        try {
            const membro = await login({ email: email.trim(), senha })
            salvarSessao(membro)
            onLoginSuccess?.(membro)
            router.push("/grupos")
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao fazer login."
            setErros([mensagem])
        } finally {
            setEnviando(false)
        }
    }

        const campoVazio = !email.trim() || !senha

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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            <button
                type="submit"
                disabled={enviando || campoVazio}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {enviando ? "Entrando..." : "Entrar"}
            </button>
        </form>
    )
}