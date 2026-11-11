import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function CadastroPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-14 shadow-sm">
                <h1 className="mb-2 text-4xl font-semibold text-slate-900">Criar conta</h1>
                <p className="mb-10 text-lg text-slate-500">
                    Preencha os dados para começar
                </p>
                <RegisterForm />
                <p className="mt-8 text-center text-base text-slate-600">
                    Já tem conta?{" "}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Entrar
                    </Link>
                </p>
            </div>
        </main>
    );
}