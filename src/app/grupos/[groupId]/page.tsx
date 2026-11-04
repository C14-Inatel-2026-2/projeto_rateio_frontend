import MemberManager from '../MemberManager';
import ExpenseForm from '../ExpenseForm';

interface GroupDashboardPageProps {
    params: Promise<{ groupId: string }>;
}

export default async function GroupDashboardPage({
    params,
}: GroupDashboardPageProps) {
    const { groupId } = await params;
    const membrosIniciais = ['Ninho', 'Gustavinho', 'Paulinho'];

    return (
        <main>
            <h1>Painel do Grupo: {groupId}</h1>
            <MemberManager
                groupId={groupId}
                initialMembers={membrosIniciais}
                hasRecordedExpenses={false}
            />
            <hr />
            <ExpenseForm membrosDoGrupo={membrosIniciais} />
        </main>
    );
}