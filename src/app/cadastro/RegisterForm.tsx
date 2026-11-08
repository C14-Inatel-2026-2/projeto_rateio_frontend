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

    return (
        <></>
    )


}