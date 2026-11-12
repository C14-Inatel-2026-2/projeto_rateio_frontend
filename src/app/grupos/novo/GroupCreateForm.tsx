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

        const jaExiste = emails.some((e) => e.toLocaleLowerCase() === limpo.toLowerCase())

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


      const inputClasse =
        "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"

    const semDados = !nomeGrupo.trim() || emails.length === 0

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {erros.length > 0 && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erros.map((erro) => (
                        <p key={erro}>{erro}</p>
                    ))}
                </div>
            )}

            {grupoCriado && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    Grupo criado com sucesso.
                </div>
            )}

            <div>
                <label htmlFor="nomeGrupo" className="mb-1.5 block text-base font-medium text-slate-700">
                    Nome do grupo
                </label>
                <input
                    id="nomeGrupo"
                    type="text"
                    value={nomeGrupo}
                    onChange={(e) => setNomeGrupo(e.target.value)}
                    placeholder="Ex.: Viagem"
                    className={inputClasse}
                />
            </div>

            <div>
                <label htmlFor="emailMembro" className="mb-1.5 block text-base font-medium text-slate-700">
                    Emails dos outros membros
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="emailMembro"
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleAdicionarMembroNaLista()
                            }
                        }}
                        placeholder="email@exemplo.com"
                        className={inputClasse}
                    />
                    <button
                        type="button"
                        onClick={handleAdicionarMembroNaLista}
                        className="rounded-lg border-2 border-indigo-600 bg-white px-6 py-3 text-base font-medium text-indigo-600 transition hover:bg-indigo-50"
                    >
                        Adicionar
                    </button>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Você entra no grupo automaticamente. Adicione pelo menos uma pessoa.
                </p>

                {emails.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {emails.map((email) => (
                            <li
                                key={email}
                                className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700"
                            >
                                {email}
                                <button
                                    type="button"
                                    onClick={() => handleRemoverMembroDaLista(email)}
                                    aria-label={`Remover ${email}`}
                                    className="text-indigo-400 transition hover:text-indigo-700"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                type="submit"
                disabled={enviando || semDados}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {enviando ? "Criando..." : "Criar grupo"}
            </button>
        </form>
    )
}