"use client"

export type Aba = "resumo" | "despesas" | "extrato" | "membros"

interface GroupTabsProps {
    ativa: Aba
    onChange: (aba: Aba) => void
}

const abas: { id: Aba; rotulo: string }[] = [
    { id: "resumo", rotulo: "Resumo" },
    { id: "despesas", rotulo: "Despesas" },
    { id: "extrato", rotulo: "Extrato" },
    { id: "membros", rotulo: "Membros" },
]

export default function GroupTabs({ ativa, onChange }: GroupTabsProps) {
    return (
        <nav className="flex gap-2 border-b border-slate-200">
            {abas.map((aba) => (
                <button
                    key={aba.id}
                    type="button"
                    onClick={() => onChange(aba.id)}
                    className={
                        ativa === aba.id
                            ? "-mb-px border-b-2 border-indigo-600 px-5 py-3 text-base font-medium text-indigo-600"
                            : "-mb-px border-b-2 border-transparent px-5 py-3 text-base font-medium text-slate-500 transition hover:text-slate-800"
                    }
                >
                    {aba.rotulo}
                </button>
            ))}
        </nav>
    )
}