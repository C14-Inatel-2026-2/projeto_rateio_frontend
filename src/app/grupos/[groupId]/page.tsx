import MemberManager from "../MemberManager"
import ExpenseForm from "../ExpenseForm"
import type { MembroGrupo } from "@/src/services/grupoService"

interface GroupDashboardPageProps {
    params: Promise<{ groupId: string }>
}

export default async function GroupDashboardPage({
    params,
}: GroupDashboardPageProps) {
    const { groupId } = await params
    const membrosIniciais: MembroGrupo[] = [
        { id: "m1", nome: "Ninho", email: "ninho@email.com" },
        { id: "m2", nome: "Gustavinho", email: "gustavo@email.com" },
        { id: "m3", nome: "Paulinho", email: "paulo@email.com" },
    ]

    return (
        <main>
            <h1>Painel do Grupo: {groupId}</h1>
            <MemberManager
                groupId={groupId}
                initialMembers={membrosIniciais}
            />
            <hr />
            <ExpenseForm membrosDoGrupo={membrosIniciais.map((m) => m.nome)} />
        </main>
    )
}