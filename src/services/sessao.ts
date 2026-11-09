
export interface Sessao {
    id: string,
    nome: string,
    email: string,
}

export const NOME_COOKIE = "rateio_membro"
const SETE_DIAS_EM_SEGUNDOS = 60 * 60 * 24 * 7

export function serializarSessao(membro: Sessao): string {
    const valor = encodeURIComponent(JSON.stringify(membro))
    return `${NOME_COOKIE}=${valor}; path=/; SameSite=Lax; max-age=${SETE_DIAS_EM_SEGUNDOS}`
}

export function lerSessao(cookies: string): Sessao | null {
    const par = cookies.split("; ").find((item) => item.startsWith(`${NOME_COOKIE}=`))

    if (!par) {
        return null
    }

    try {
        const bruto = decodeURIComponent(par.slice(NOME_COOKIE.length + 1))
        const dados = JSON.parse(bruto)
        if (typeof dados?.id !== "string" || dados.id === "") {
            return null
        }

        return { id: dados.id, nome: String(dados.nome ?? ""), email: String(dados.email ?? "") }
    } catch (error) {
        return null
    }
}

export function salvarSessao(membro: Sessao): void {
    document.cookie = serializarSessao(membro)
}

export function limparSessao(): void {
    document.cookie = `${NOME_COOKIE}=; path=/; max-age=0`
}

export function obterSessao(): Sessao | null {
    if (typeof document === "undefined") return null
    return lerSessao(document.cookie)
}