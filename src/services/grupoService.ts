const API_BASE = process.env.NEXT_PUBLIC_API_URL

export interface GrupoResponse {
    id: string
    nome: string
    membros: string[]
    possuiDespesas?: boolean
}

export interface CriarGrupoParams {
    nome: string;
    membros: string[]
}

export async function criarGrupo({
    nome,
    membros,
}: CriarGrupoParams): Promise<GrupoResponse> {
    const res = await fetch(`${API_BASE}/grupos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, membros }),
    });
    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? 'Erro ao criar grupo.');
    }
    return res.json();
}

export async function adicionarMembroGrupo(
    grupoId: string,
    novoMembro: string
): Promise<GrupoResponse> {

    const res = await fetch(`${API_BASE}/grupos/${grupoId}/membros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoMembro }),
    })

    if (!res.ok) {
        const body = await res.json()
        throw new Error(body.message ?? 'Erro ao adicionar membro no grupo.');
    }

    return res.json();
}

export async function removerMembroGrupo(
    grupoId: string,
    membroNome: string
): Promise<GrupoResponse> {
    const res = await fetch(
        `${API_BASE}/grupos/${grupoId}/membros/${encodeURIComponent(membroNome)}`,
        {
            method: 'DELETE',
        }
    )

    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? 'Erro ao remover membro do grupo.');
    }
    return res.json();
}