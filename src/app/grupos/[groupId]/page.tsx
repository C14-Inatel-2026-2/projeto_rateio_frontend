import { group } from "console";
import MemberManager from "../MemberManager";
import { fa } from "zod/locales";

interface GroupDashboardPageProps {
    params: Promise<{ groupId: string }>
}

export default async function GroupDashboardPage({
    params,
}: GroupDashboardPageProps) {

    const { groupId } = await params

    return (
        <main>
            <h1>Painel do Grupo: {groupId}</h1>
            <MemberManager
                groupId={groupId}
                initialMembers={["Ninho", "Linho"]}
                hasRecordedExpenses={false}
            />
        </main>
    )

}