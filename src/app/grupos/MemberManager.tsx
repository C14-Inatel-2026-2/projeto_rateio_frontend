'use client';

import React, { useState } from 'react'
import { validarAdicionarMembro, ValidarRemoverMembro } from '../../services/validarGrupo'
import { adicionarMembroGrupo, removerMembroGrupo } from '../../services/grupoService'

interface MemberManagerProps {
    groupId: string;
    initialMembers: string[];
    hasRecordedExpenses?: boolean;
}

export default function MemberManager({
    groupId,
    initialMembers,
    hasRecordedExpenses = false,
}: MemberManagerProps) {
    const [membros, setMembros] = useState<string[]>(initialMembers)
    const [novoMembro, setNovoMembro] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
    async function handleAdicionarMembro(e: React.FormEvent) {
        e.preventDefault()
        setErro(null)
        setMensagemSucesso(null)
        const validacao = validarAdicionarMembro({
            membrosAtuais: membros,
            novoMembro,
        });
        if (!validacao.valido) {
            setErro(validacao.erros[0]);
            return;
        }
        const nomeLimpo = novoMembro.trim();
        try {
            const grupoAtualizado = await adicionarMembroGrupo(groupId, nomeLimpo);
            setMembros(grupoAtualizado.membros);
            setNovoMembro('');
            setMensagemSucesso(`Membro ${nomeLimpo} adicionado com sucesso.`)
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Erro ao adicionar membro.'
            setErro(msg);
        }
    }
    async function handleRemoverMembro(membroParaRemover: string) {
        setErro(null);
        setMensagemSucesso(null);
        const validacao = ValidarRemoverMembro({
            membrosAtuais: membros,
            membroParaRemover,
            possuiDespesasRegistradas: hasRecordedExpenses,
        });
        if (!validacao.valido) {
            setErro(validacao.erros[0]);
            return;
        }
        try {
            const grupoAtualizado = await removerMembroGrupo(
                groupId,
                membroParaRemover
            );
            setMembros(grupoAtualizado.membros)
            setMensagemSucesso(`Membro ${membroParaRemover} removido com sucesso.`)
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Erro ao remover membro.'
            setErro(msg);
        }
    }
    return (
        <> {/* FAZER ESSA BOMBA DE CONFIGURAÇÃO */} </>
    )

}