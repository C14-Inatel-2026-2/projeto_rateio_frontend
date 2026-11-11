import { describe, it, expect } from "vitest"
import { descreverSaldo } from "../formatarMoeda"

describe("formatarMoeda e descreverSaldo", () => {
    it("deve descrever saldo positivo como A receber", () => {
        const texto = descreverSaldo("60.00")
        expect(texto).toContain("A receber:")
        expect(texto).toContain("60,00")
    })

    it("deve descrever saldo negativo como Deve", () => {
        const texto = descreverSaldo("-20.00")
        expect(texto).toContain("Deve:")
        expect(texto).toContain("20,00")
    })

    it("deve descrever saldo zero como Quitado", () => {
        expect(descreverSaldo("0.00")).toBe("Quitado")
    })
})