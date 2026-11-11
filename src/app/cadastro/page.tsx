import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function CadastroPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-1 text-2xl font-semibold text-slate-900">Criar conta</h1>
                <p className="mb-6 text-sm text-slate-500">
                    Preencha os dados para começar
                </p>
                <RegisterForm />
                <p className="mt-6 text-center text-sm text-slate-600">
                    Já tem conta?{" "}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Entrar
                    </Link>
                </p>
            </div>
        </main>
    );
}