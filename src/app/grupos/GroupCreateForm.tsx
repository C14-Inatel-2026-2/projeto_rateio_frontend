"use client"

import React, { useState } from 'react'
import { validarCriacaoGrupo } from '@/src/services/validarGrupo'
import { criarGrupo, type Grupo } from '@/src/services/grupoService'
import { obterSessao } from '@/src/services/sessao'


interface GroupCreateFormProps {
    onGroupCreated?: (grupo: Grupo) => void;
}

export default function GroupCreateForm({ onGroupCreated }: GroupCreateFormProps) {

    const [nomeGrupo, setNomeGrupo] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [emails, setEmails] = useState<string[]>([])
    const [erros, setErros] = useState<string[]>([])
    const [grupoCriado, setGrupoCriado] = useState<Grupo | null>(null)
    const [enviando, setEnviando] = useState(false)

    function handleAdicionarMembroNaLista() {
        const limpo = emailInput.trim();
        if (!limpo) {
            return
        };

        const jaExiste = emails.some((e) => e.toLocaleLowerCase() === limpo)

        if (jaExiste) {
            setErros(['Não é permitido repetir membros.']);
            return;
        }

        setErros([]);
        setEmails((prev) => [...prev, limpo]);
        setEmailInput('');
    }

    function handleRemoverMembroDaLista(emailParaRemover: string) {
        setEmails((prev) => prev.filter((m) => m !== emailParaRemover));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErros([]);
        setGrupoCriado(null);

        const sessao = obterSessao()
        if (!sessao) {
            setErros(["Sessão expirada. Faça login novamente."])
            return
        }

        const validacao = validarCriacaoGrupo({
            nome: nomeGrupo,
            emails,
            emailCriador: sessao.email
        });
        if (!validacao.valido) {
            setErros(validacao.erros);
            return;
        }
        setEnviando(true)
        try {
            const resposta = await criarGrupo(sessao.id, {
                nome: nomeGrupo.trim(),
                emails,
            })

            setGrupoCriado(resposta);
            onGroupCreated?.(resposta);
            setEmails([])
        } catch (err) {
            const mensagem =
                err instanceof Error ? err.message : 'Erro ao criar grupo.';
            setErros([mensagem]);
        } finally {
            setEnviando(false)
        }
    }


    return (
        <>
            {/* FAZER ESSA BOMBA DE CONFIGURAÇÃO */}
        </>
    )
}