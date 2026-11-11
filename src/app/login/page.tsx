import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-14 shadow-sm">
                <h1 className="mb-2 text-4xl font-semibold text-slate-900">Entrar</h1>
                <LoginForm />
                <p className="mt-8 text-center text-base text-slate-600">
                    Ainda não tem conta?{" "}
                    <Link href="/cadastro" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Criar conta
                    </Link>
                </p>
            </div>
        </main>
    );
}