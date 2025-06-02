// app/unauthorized/page.tsx
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <span className="bg-blue-900 text-white px-3 py-1 rounded text-xl font-black mr-2">
            P
          </span>
          <span className="text-2xl font-bold text-blue-900">MULTIPARK</span>
        </div>

        {/* Conteúdo */}
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Não tens permissão para aceder a esta área ou a tua conta ainda não foi aprovada.
          </p>
        </div>

        {/* Ações */}
        <div className="space-y-4">
          <Link 
            href="/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar ao Login
          </Link>
          
          <p className="text-xs text-gray-500">
            Se acreditas que isto é um erro, contacta o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}