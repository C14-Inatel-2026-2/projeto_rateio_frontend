const API_BASE = process.env.NEXT_PUBLIC_API_URL

export interface MembroResponse {
    id: string,
    nome: string,
    email: string
}

export interface CadastrarParams {
    nome: string,
    email: string,
    senha: string
}

export interface LoginParams {
    email: string,
    senha: string
}

async function lerMensagemDoBackend(res: Response): Promise<string | undefined> {
    const corpo = await res.json().catch(() => null)
    return corpo?.mensagem
}

export async function cadastrar({ nome, email, senha }: CadastrarParams): Promise<MembroResponse> {
    const res = await fetch(`${API_BASE}/membros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    })

    if (!res.ok) {
        if (res.status === 409) {
            throw new Error('E-mail já cadastrado.')
        }

        const mensagem = await lerMensagemDoBackend(res)
        throw new Error(mensagem ?? 'Erro ao criar conta.')
    }

    return res.json()
}

export async function login({ email, senha }: LoginParams): Promise<MembroResponse> {
    const res = await fetch(`${API_BASE}/membros/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    })

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('E-mail ou senha inválidos.')
        }
        const mensagem = await lerMensagemDoBackend(res)
        throw new Error(mensagem ?? 'Erro ao fazer login.')
    }

    return res.json()
}