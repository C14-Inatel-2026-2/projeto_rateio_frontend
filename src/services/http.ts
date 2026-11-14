const API_BASE = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
    status: number

    constructor(mensagem: string, status: number) {
        super(mensagem)
        this.name = "ApiError"
        this.status = status
    }
}

const MENSAGENS: Record<string, string> = {
    "Membro nao encontrado": "Membro não encontrado.",
    "Grupo nao encontrado": "Grupo não encontrado.",
    "Membro repetido no grupo": "Esse membro já está no grupo.",
    "Grupo precisa de ao menos 2 membros": "O grupo precisa ter ao menos 2 membros.",
    "Grupo com despesas nao permite remover membros": "Não é possível remover membros de um grupo com despesas.",
    "Nome do grupo e ao menos um membro sao obrigatorios": "Informe o nome do grupo e ao menos um membro.",
    "Emails dos membros nao podem ser vazios": "Os e-mails dos membros não podem ficar vazios.",
    "Email, membroId e grupoId sao obrigatorios": "Informe o e-mail do membro.",
    "Pagador fora do grupo": "O pagador não pertence ao grupo.",
    "Participante fora do grupo": "Há participante que não pertence ao grupo.",
    "Participante repetido": "Há participante repetido.",
    "Soma das parcelas diferente do total": "A soma dos valores fixos difere do total da despesa.",
    "Valor invalido": "Valor inválido. Confira os dados da despesa.",
    "Email ja cadastrado": "E-mail já cadastrado.",
    "Email ou senha invalidos": "E-mail ou senha inválidos.",
    "Despesa nao encontrada": "Despesa não encontrada.",
    "Despesa ja estornada": "Esta despesa já foi estornada.",
    "Valor maior que a divida": "O valor informado é maior que a dívida.",
    "Pagamento nao encontrado": "Pagamento não encontrado.",
    "Pagamento ja estornado": "Este pagamento já foi estornado.",
}

export function traduzirMensagem(mensagem: string | undefined, padrao: string): string {
    if (!mensagem) {
        return padrao
    }

    return MENSAGENS[mensagem] ?? mensagem
}

interface OpcoesRequisicao {
    metodo?: "GET" | "POST" | "DELETE"
    corpo?: unknown
    membroId?: string
    mensagemPadrao?: string
}

export async function requisicao<T>(
    caminho: string,
    { metodo = "GET", corpo, membroId, mensagemPadrao = "Erro ao comunicar com o servidor." }: OpcoesRequisicao = {},
): Promise<T> {

    const query = membroId ? `?membroId=${encodeURIComponent(membroId)}` : ""
    const temCorpo = corpo !== undefined

    let res: Response

    try {
        res = await fetch(`${API_BASE}${caminho}${query}`, {
            method: metodo,
            headers: temCorpo ? { "Content-Type": "application/json" } : undefined,
            body: temCorpo ? JSON.stringify(corpo) : undefined,
        })
    } catch (error) {
        throw new ApiError("Não foi possível conectar ao servidor", 0)
    }


    if (!res.ok) {
        const dados = await res.json().catch(() => null)
        throw new ApiError(traduzirMensagem(dados?.mensagem, mensagemPadrao), res.status)
    }

    if (res.status === 204) {
        return undefined as T
    }

    return res.json()
}