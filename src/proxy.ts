import { NextResponse, type NextRequest } from "next/server"
import { NOME_COOKIE } from "@/src/services/sessao"

export function proxy(request: NextRequest) {
    const logado = request.cookies.has(NOME_COOKIE)

    if (!logado) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/grupos/:path*"],
}