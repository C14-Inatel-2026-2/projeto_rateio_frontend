"use client"

import React, { useState } from 'react'
import { validarCriacaoGrupo } from '@/src/services/validarGrupo'
import { criarGrupo, type GrupoResponse } from '@/src/services/grupoService'

interface GroupCreateFormProps {
    onGroupCreated?: (grupo: GrupoResponse) => void;
}

export default function GroupCreateForm({ onGroupCreated }: GroupCreateFormProps) {

    const [nomeGrupo, setNomeGrupo] = useState('');
    const [membroInput, setMembroInput] = useState('');
    const [membros, setMembros] = useState<string[]>([]);
    const [erros, setErros] = useState<string[]>([]);
    const [grupoCriado, setGrupoCriado] = useState<GrupoResponse | null>(null);
    function handleAdicionarMembroNaLista() {
        const limpo = membroInput.trim();
        if (!limpo) return;
        const jaExiste = membros.some(
            (m) => m.toLowerCase() === limpo.toLowerCase()
        );
        if (jaExiste) {
            setErros(['Membro já existe no grupo.']);
            return;
        }
        setErros([]);
        setMembros((prev) => [...prev, limpo]);
        setMembroInput('');
    }
    function handleRemoverMembroDaLista(nome: string) {
        setMembros((prev) => prev.filter((m) => m !== nome));
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErros([]);
        setGrupoCriado(null);
        const validacao = validarCriacaoGrupo({
            nome: nomeGrupo,
            membros,
        });
        if (!validacao.valido) {
            setErros(validacao.erros);
            return;
        }
        try {
            const resposta = await criarGrupo({
                nome: nomeGrupo.trim(),
                membros,
            });
            setGrupoCriado(resposta);
            onGroupCreated?.(resposta);
        } catch (err) {
            const mensagem =
                err instanceof Error ? err.message : 'Erro ao criar grupo.';
            setErros([mensagem]);
        }
    }


    return (
        <>
            {/* FAZER ESSA BOMBA DE CONFIGURAÇÃO */}
        </>
    )
}