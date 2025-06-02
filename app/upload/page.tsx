"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  inserted: number;
  updated: number;
  errors: string[];
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [parqueId, setParqueId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const uploadTypes = [
    { value: 'reservas', label: 'Reservas (Base Principal)', description: 'Excel com reservas para inserir/atualizar' },
    { value: 'caixa', label: 'Dados de Caixa', description: 'Excel com transações de caixa' },
    { value: 'entregas', label: 'Entregas', description: 'Excel com dados de entrega de veículos' },
    { value: 'recolhas', label: 'Recolhas', description: 'Excel com dados de recolha de veículos' }
  ];

  const parques = [
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'porto', label: 'Porto' },
    { value: 'faro', label: 'Faro' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é Excel
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast.error('Por favor, seleciona um ficheiro Excel (.xlsx, .xls) ou CSV');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType || !parqueId) {
      toast.error('Por favor, preenche todos os campos');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', uploadType);
      formData.append('parqueId', parqueId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        toast.success(
          `Upload concluído! ${result.inserted} inseridos, ${result.updated} atualizados`
        );
      } else {
        throw new Error(result.error || 'Erro no upload');
      }
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(`Erro no upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Upload de Ficheiros</h1>
        <p className="text-gray-600 mt-2">
          Sistema de importação de dados Excel para as bases Multipark
        </p>
      </div>

      <div className="grid gap-6">
        {/* Formulário de Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Dados
            </CardTitle>
            <CardDescription>
              Seleciona o tipo de dados e o ficheiro Excel para importar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo de Upload */}
            <div className="space-y-2">
              <Label htmlFor="uploadType">Tipo de Dados</Label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona o tipo de dados..." />
                </SelectTrigger>
                <SelectContent>
                  {uploadTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Parque */}
            <div className="space-y-2">
              <Label htmlFor="parque">Parque</Label>
              <Select value={parqueId} onValueChange={setParqueId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona o parque..." />
                </SelectTrigger>
                <SelectContent>
                  {parques.map((parque) => (
                    <SelectItem key={parque.value} value={parque.value}>
                      {parque.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Ficheiro */}
            <div className="space-y-2">
              <Label htmlFor="file">Ficheiro Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileSpreadsheet className="h-4 w-4" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {/* Botão de Upload */}
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !uploadType || !parqueId || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A processar...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados do Upload */}
        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resultados do Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {uploadResult.inserted}
                  </div>
                  <div className="text-sm text-green-700">Novos Registos</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {uploadResult.updated}
                  </div>
                  <div className="text-sm text-blue-700">Atualizações</div>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Erros encontrados:</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <ul className="text-sm text-red-700 space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>Instruções de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">📁 Formato dos Ficheiros:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Reservas:</strong> License Plate, Allocation, Customer Name, Check-in, Check-out, Price, Estado</li>
                <li>• <strong>Caixa:</strong> Matrícula, Valor, Método, Data, Observações</li>
                <li>• <strong>Entregas:</strong> License Plate, Allocation, Data Entrega, Condutor, Observações</li>
                <li>• <strong>Recolhas:</strong> License Plate, Allocation, Data Recolha, Condutor, Observações</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🔄 Lógica de Atualização:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Reservas:</strong> UPSERT por License Plate + Allocation</li>
                <li>• <strong>Outros:</strong> Atualizam dados existentes nas reservas</li>
                <li>• Colunas vazias não sobrepõem dados existentes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
