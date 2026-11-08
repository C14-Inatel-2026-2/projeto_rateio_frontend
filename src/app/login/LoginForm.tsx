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
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erros, setErros] = useState<string[]>([])
    const [enviando, setEnviando] = useState(false)
    const [membroLogado, setMembroLogado] = useState<MembroResponse | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        const router = useRouter()
        router.push("/grupos")
        e.preventDefault()
        setErros([])
        setMembroLogado(null)

        const validacao = validarLogin({ email, senha })

        if (!validacao.valido) {
            setErros(validacao.erros)
            return
        }

        setEnviando(true)
        try {
            const membro = await login({ email: email.trim(), senha })
            salvarSessao(membro)
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao fazer login."
            setErros([mensagem])
        } finally {
            setEnviando(false)
        }
    }

    return (
        <></>
    )
}