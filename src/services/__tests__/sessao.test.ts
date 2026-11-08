import { describe, it, expect } from "vitest"
import { serializarSessao, lerSessao, NOME_COOKIE } from "../sessao"

const membro = { id: "uuid-1", nome: "Ana", email: "ana@x.com" }

describe("sessao", () => {
    it("deve serializar e ler a mesma sessão (ida e volta)", () => {
        const cookie = serializarSessao(membro).split(";")[0]

        expect(lerSessao(cookie)).toEqual(membro)
    })

    it("deve encontrar a sessão entre vários cookies", () => {
        const cookie = `outro=1; ${serializarSessao(membro).split(";")[0]}; tema=escuro`

        expect(lerSessao(cookie)).toEqual(membro)
    })

    it("deve retornar null quando não há cookie de sessão", () => {
        expect(lerSessao("outro=1")).toBeNull()
    })

    it("deve retornar null quando o cookie está corrompido", () => {
        expect(lerSessao(`${NOME_COOKIE}=%7Bquebrado`)).toBeNull()
    })

    it("deve retornar null quando o cookie não tem id", () => {
        const semId = encodeURIComponent(JSON.stringify({ nome: "Ana" }))

        expect(lerSessao(`${NOME_COOKIE}=${semId}`)).toBeNull()
    })
})