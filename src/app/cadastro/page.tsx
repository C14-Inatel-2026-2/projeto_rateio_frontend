import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function CadastroPage() {
    return (
        <main>
            <h1>Criar Conta</h1>
            <RegisterForm />
            <p>
                Já tem Conta? <Link href="/login">Entrar</Link>
            </p>
        </main>
    )
}