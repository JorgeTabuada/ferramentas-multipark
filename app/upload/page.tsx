'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type UploadType = 'reservados' | 'caixa' | 'entregas';

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    parsed: number;
    inserted?: number;
    updated?: number;
    notFound?: number;
    errors: string[];
  };
  validation?: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  error?: string;
  details?: string;
}

export default function UploadPage() {
  const [selectedType, setSelectedType] = useState<UploadType>('reservados');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadTypes = [
    {
      id: 'reservados' as UploadType,
      title: 'Upload Reservados',
      description: 'Ficheiros Excel com dados de reservas (base principal)',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'caixa' as UploadType,
      title: 'Upload Caixa',
      description: 'Ficheiros Excel com dados de caixa (atualiza reservas)',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'entregas' as UploadType,
      title: 'Upload Entregas',
      description: 'Ficheiros Excel com dados de entregas (finaliza reservas)',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;
    
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Tipo de ficheiro não suportado. Use Excel (.xlsx, .xls) ou CSV.');
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('Ficheiro muito grande. Máximo 50MB.');
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
    toast.success(`Ficheiro ${selectedFile.name} carregado`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/upload/${selectedType}`, {
        method: 'POST',
        body: formData
      });
      
      const result: UploadResult = await response.json();
      
      setResult(result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Erro no processamento');
      }
      
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro na comunicação com o servidor');
      setResult({
        success: false,
        message: 'Erro na comunicação',
        error: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Upload de Ficheiros</h1>
            <p className="text-muted-foreground">Sistema de upload Excel para dados operacionais</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      {/* Tipo de Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Selecionar Tipo de Upload</CardTitle>
          <CardDescription>Escolha o tipo de ficheiro que pretende carregar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uploadTypes.map(type => (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedType === type.id 
                    ? type.color
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <h3 className="font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Carregar Ficheiro</CardTitle>
          <CardDescription>
            Formatos suportados: Excel (.xlsx, .xls), CSV | Tamanho máximo: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Arraste o ficheiro aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  Upload para: {uploadTypes.find(t => t.id === selectedType)?.title}
                </p>
              </div>
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="text-blue-600 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB | Tipo: {selectedType}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Button */}
      {file && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Processar Ficheiro</CardTitle>
            <CardDescription>
              O ficheiro será analisado e os dados inseridos/atualizados na base de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A processar...
                </>
              ) : (
                <>🚀 Processar Ficheiro</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.success ? (
                <CheckCircle className="text-green-600 mr-2" size={24} />
              ) : (
                <XCircle className="text-red-600 mr-2" size={24} />
              )}
              Resultado do Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg mb-4 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className="font-medium mb-2">{result.message}</p>
              
              {result.success && result.data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{result.data.parsed}</p>
                    <p className="text-sm text-gray-600">Analisados</p>
                  </div>
                  {result.data.inserted !== undefined && (
                    <div>
                      <p className="text-2xl font-bold text-green-600">{result.data.inserted}</p>
                      <p className="text-sm text-gray-600">Inseridos</p>
                    </div>
                  )}
                  {result.data.updated !== undefined && (
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{result.data.updated}</p>
                      <p className="text-sm text-gray-600">Atualizados</p>
                    </div>
                  )}
                  <div>
                    <p className="text-2xl font-bold text-red-600">{result.data.errors.length}</p>
                    <p className="text-sm text-gray-600">Erros</p>
                  </div>
                </div>
              )}
              
              {result.data?.errors && result.data.errors.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-red-700 mb-2">Erros encontrados:</p>
                  <ul className="text-sm text-red-600 list-disc list-inside max-h-32 overflow-y-auto">
                    {result.data.errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.data.errors.length > 10 && (
                      <li className="font-medium">... e mais {result.data.errors.length - 10} erros</li>
                    )}
                  </ul>
                </div>
              )}
              
              {!result.success && result.error && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">{result.error}</p>
                  {result.details && (
                    <p className="text-xs text-red-500 mt-1">{result.details}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={resetUpload} variant="outline">
                Carregar Outro Ficheiro
              </Button>
              <Link href="/reservas">
                <Button>
                  Ver Reservas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}