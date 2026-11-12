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

        const membrosOrdenados = [...membros].sort((a, b) => a.nome.localeCompare(b.nome))

    return (
        <div className="space-y-6">
            {erro && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            {mensagemSucesso && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {mensagemSucesso}
                </div>
            )}

            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {membrosOrdenados.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div>
                            <p className="text-base font-medium text-slate-900">{m.nome}</p>
                            <p className="text-sm text-slate-500">{m.email}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoverMembro(m.id)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAdicionarMembro} noValidate>
                <label htmlFor="novoEmail" className="mb-1.5 block text-base font-medium text-slate-700">
                    Adicionar membro
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="novoEmail"
                        type="email"
                        value={novoEmail}
                        onChange={(e) => setNovoEmail(e.target.value)}
                        placeholder="Email de quem já tem conta"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                        type="submit"
                        disabled={!novoEmail.trim()}
                        className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        Adicionar
                    </button>
                </div>
            </form>
        </div>
    )
}