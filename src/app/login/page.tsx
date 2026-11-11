import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-semibold text-slate-900">Entrar</h1>
                <p className="mb-6 text-sm text-slate-500">
                    Divida contas em grupo sem complicação
                </p>
                <LoginForm />
                <p className="mt-6 text-center text-sm text-slate-600">
                    Ainda não tem conta?{" "}
                    <Link href="/cadastro" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Criar conta
                    </Link>
                </p>
            </div>
        </main>
    );
}