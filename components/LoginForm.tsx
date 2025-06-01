"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseDashboard } from '@/lib/supabase/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email e palavra-passe são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabaseDashboard.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // Verificar perfil do utilizador
        const { data: profile, error: profileError } = await supabaseDashboard
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error('Erro ao carregar perfil do utilizador');
        }

        if (!profile?.ativo) {
          throw new Error('Conta não ativa. Contacte o administrador.');
        }

        // Redirecionar para dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="bg-blue-900 text-white px-3 py-1 rounded text-xl font-black mr-2">
              P
            </span>
            <span className="text-2xl font-bold text-blue-900">MULTIPARK</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ferramentas Multipark
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta para aceder ao sistema
          </p>
        </div>

        {/* Formulário de Login */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="o.seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          {/* Botão de Login */}
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  A entrar...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </div>

          {/* Info adicional */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Não tem conta? Contacte o administrador
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}