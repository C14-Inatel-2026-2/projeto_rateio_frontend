import Link from "next/link"
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main>
            <h1>Entrar</h1>
            <LoginForm />
            <p>
                Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
            </p>
        </main>
    )
}