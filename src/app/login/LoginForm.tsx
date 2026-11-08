"use client"

import React, { useState } from "react"
import { validarLogin } from "@/src/services/validarAuth"
import { login, type MembroResponse } from "@/src/services/authService"


interface LoginFormProps {
    onLoginSucess?: (membro: MembroResponse) => void
}

export default function LoginForm({ onLoginSucess }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erros, setErros] = useState<string[]>([])
    const [enviando, setEnviando] = useState(false)
    const [membroLogado, setMembroLogado] = useState<MembroResponse | null>(null)

    async function handleSubmit(e: React.FormEvent) {
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
            setMembroLogado(membro)
            onLoginSucess?.(membro)
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