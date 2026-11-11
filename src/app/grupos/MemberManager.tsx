"use client"

import React, { useState } from "react"
import {
    validarAdicionarMembro,
    validarRemoverMembro,
} from "@/src/services/validarGrupo"
import {
    adicionarMembro,
    removerMembro,
    type MembroGrupo,
} from "@/src/services/grupoService"
import { obterSessao } from "@/src/services/sessao"

interface MemberManagerProps {
    groupId: string
    initialMembers: MembroGrupo[]
}

export default function MemberManager({
    groupId,
    initialMembers,
}: MemberManagerProps) {
    const [membros, setMembros] = useState<MembroGrupo[]>(initialMembers)
    const [novoEmail, setNovoEmail] = useState("")
    const [erro, setErro] = useState<string | null>(null)
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)

    async function handleAdicionarMembro(e: React.FormEvent) {
        e.preventDefault()
        setErro(null)
        setMensagemSucesso(null)

        const sessao = obterSessao()
        if (!sessao) {
            setErro("Sessão expirada. Faça login novamente.")
            return
        }

        const validacao = validarAdicionarMembro({
            membrosAtuais: membros,
            email: novoEmail,
        })

        if (!validacao.valido) {
            setErro(validacao.erros[0])
            return
        }

        const emailLimpo = novoEmail.trim().toLowerCase()

        try {
            const membroAdicionado = await adicionarMembro(
                groupId,
                sessao.id,
                emailLimpo,
            )
            setMembros((prev) => [...prev, membroAdicionado])
            setNovoEmail("")
            setMensagemSucesso(`Membro ${membroAdicionado.nome} adicionado com sucesso.`)
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Erro ao adicionar membro."
            setErro(msg)
        }
    }

    async function handleRemoverMembro(alvoId: string) {
        setErro(null)
        setMensagemSucesso(null)

        const sessao = obterSessao()
        if (!sessao) {
            setErro("Sessão expirada. Faça login novamente.")
            return
        }

        const validacao = validarRemoverMembro({
            membrosAtuais: membros,
            alvoId,
        })

        if (!validacao.valido) {
            setErro(validacao.erros[0])
            return
        }

        try {
            await removerMembro(groupId, sessao.id, alvoId)
            setMembros((prev) => prev.filter((m) => m.id !== alvoId))
            setMensagemSucesso("Membro removido com sucesso.")
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Erro ao remover membro."
            setErro(msg)
        }
    }

    return (
        <>
            {/* FAZER ESSA BOMBA DE CONFIGURAÇÃO */}
        </>
    )
}