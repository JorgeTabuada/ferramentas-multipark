"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  Car,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';

interface DashboardProps {
  selectedPark: string;
  setSelectedPark: (park: string) => void;
}

export function Dashboard({ selectedPark, setSelectedPark }: DashboardProps) {
  const router = useRouter();

  const parks = [
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'porto', label: 'Porto' },
    { value: 'faro', label: 'Faro' }
  ];

  const appModules = [
    {
      id: 'reservas',
      title: 'Gestão de Reservas',
      description: 'Visualizar e gerir todas as reservas',
      icon: FileSpreadsheet,
      color: 'bg-blue-500',
      href: '/reservas'
    },
    {
      id: 'upload',
      title: 'Upload de Excel',
      description: 'Importar dados via ficheiros Excel',
      icon: Upload,
      color: 'bg-green-500',
      href: '/upload'
    },
    {
      id: 'analytics',
      title: 'Relatórios',
      description: 'Dashboard e análises de dados',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/analytics'
    },
    {
      id: 'colaboradores',
      title: 'RH / Colaboradores',
      description: 'Gestão de recursos humanos',
      icon: Users,
      color: 'bg-orange-500',
      href: '/rh'
    },
    {
      id: 'movimentacoes',
      title: 'Movimentações',
      description: 'Histórico de movimentos de veículos',
      icon: Car,
      color: 'bg-red-500',
      href: '/movimentacoes'
    },
    {
      id: 'health',
      title: 'System Health',
      description: 'Monitorização do sistema',
      icon: Activity,
      color: 'bg-teal-500',
      href: '/api/health'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Definições do sistema',
      icon: Settings,
      color: 'bg-gray-500',
      href: '/configuracoes'
    },
    {
      id: 'ajuda',
      title: 'Ajuda & Suporte',
      description: 'Documentação e suporte',
      icon: HelpCircle,
      color: 'bg-indigo-500',
      href: '/ajuda'
    }
  ];

  const handleModuleClick = (href: string) => {
    if (href.startsWith('/api/')) {
      // Abrir APIs numa nova tab
      window.open(href, '_blank');
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-blue-900 text-white px-3 py-1 rounded mr-2 font-black text-2xl">
              P
            </div>
            <span className="text-blue-900 font-bold text-2xl">MULTIPARK</span>
          </div>
          <div className="text-sm text-gray-600">
            Sistema de Gestão Completo
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Ferramentas Multipark
          </h1>
          <p className="text-gray-600">
            Seleciona um módulo abaixo para começar a trabalhar
          </p>
        </div>

        {/* Park Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seleção de Parque</CardTitle>
            <CardDescription>
              Escolhe o parque para filtrar os dados nas aplicações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {parks.map((park) => (
                <Button
                  key={park.value}
                  variant={selectedPark === park.value ? "default" : "outline"}
                  onClick={() => setSelectedPark(park.value)}
                  className="flex-1"
                >
                  {park.label}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Parque atual: <strong>{parks.find(p => p.value === selectedPark)?.label}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {appModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleModuleClick(module.href)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Aceder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistema Status</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">
                Todas as bases funcionais
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parque Ativo</CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {parks.find(p => p.value === selectedPark)?.label}
              </div>
              <p className="text-xs text-muted-foreground">
                Dados filtrados por parque
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Versão</CardTitle>
              <Settings className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">v2.0.0</div>
              <p className="text-xs text-muted-foreground">
                Sistema multi-database
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
