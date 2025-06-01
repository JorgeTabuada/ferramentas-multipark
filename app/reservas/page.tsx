"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReservasPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`Ficheiro selecionado: ${selectedFile.name}`);
    }
  };

  const handleProcessFile = () => {
    if (!file) {
      toast.error('Por favor selecione um ficheiro primeiro');
      return;
    }
    
    // Aqui vai a lógica de processamento do Excel
    toast.success('A processar ficheiro... (simulado)');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-blue-900 text-white px-3 py-1 rounded mr-2 font-black text-2xl">
              P
            </div>
            <span className="text-blue-900 font-bold text-2xl">MULTIPARK</span>
          </div>
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-blue-900">Upload de Reservas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excelFile">Ficheiro Excel de Reservas</Label>
                <Input
                  id="excelFile"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              {file && (
                <div className="text-sm text-gray-600">
                  Ficheiro selecionado: {file.name}
                </div>
              )}
              <Button 
                onClick={handleProcessFile}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!file}
              >
                Processar Ficheiro
              </Button>
            </CardContent>
          </Card>

          {/* Dashboard Analytics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-blue-900">Dashboard de Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">142</div>
                  <div className="text-sm text-gray-600">Reservas Hoje</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-sm text-gray-600">Check-ins</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <div className="text-sm text-gray-600">Canceladas</div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">
                  📊 Área reservada para gráficos e tabelas de dados reais
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Ligação ao Supabase será implementada aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Pesquisar e Filtrar Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="searchLicense">Matrícula</Label>
                <Input id="searchLicense" placeholder="Ex: 00-AA-00" />
              </div>
              <div>
                <Label htmlFor="searchClient">Nome Cliente</Label>
                <Input id="searchClient" placeholder="Nome do cliente" />
              </div>
              <div>
                <Label htmlFor="searchDate">Data</Label>
                <Input id="searchDate" type="date" />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Pesquisar
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">
                📋 Tabela de resultados será exibida aqui
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Com funcionalidades de edição, eliminação e exportação
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
