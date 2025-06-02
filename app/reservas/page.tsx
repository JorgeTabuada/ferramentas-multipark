"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Car,
  MapPin,
  Users,
  RefreshCw,
  Plus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface Reserva {
  id_pk: string;
  license_plate: string;
  alocation: string;
  name_cliente: string;
  phone_number_cliente: string;
  check_in_previsto: string;
  check_out_previsto: string;
  estado_reserva_atual: string;
  total_price: number;
  parque: {
    nome_parque: string;
    cidade: string;
  };
}

export default function ReservasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParque, setSelectedParque] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const estados = [
    { value: '', label: 'Todos os Estados' },
    { value: 'reservado', label: 'Reservado' },
    { value: 'recolhido', label: 'Recolhido' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const parques = [
    { value: '', label: 'Todos os Parques' },
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'porto', label: 'Porto' },
    { value: 'faro', label: 'Faro' }
  ];

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = async () => {
    setIsLoading(true);
    try {
      // Simular dados por enquanto já que a API pode não estar disponível
      const mockReservas: Reserva[] = [
        {
          id_pk: '1',
          license_plate: '11-AA-22',
          alocation: 'LSB001',
          name_cliente: 'João Silva',
          phone_number_cliente: '912345678',
          check_in_previsto: '2025-06-02T10:00:00Z',
          check_out_previsto: '2025-06-05T14:00:00Z',
          estado_reserva_atual: 'reservado',
          total_price: 75.50,
          parque: {
            nome_parque: 'Parque Lisboa',
            cidade: 'Lisboa'
          }
        },
        {
          id_pk: '2',
          license_plate: '33-BB-44',
          alocation: 'PRT002',
          name_cliente: 'Maria Santos',
          phone_number_cliente: '916543210',
          check_in_previsto: '2025-06-02T08:30:00Z',
          check_out_previsto: '2025-06-04T16:00:00Z',
          estado_reserva_atual: 'recolhido',
          total_price: 65.00,
          parque: {
            nome_parque: 'Parque Porto',
            cidade: 'Porto'
          }
        },
        {
          id_pk: '3',
          license_plate: '55-CC-66',
          alocation: 'FAR003',
          name_cliente: 'Carlos Pereira',
          phone_number_cliente: '918765432',
          check_in_previsto: '2025-06-01T12:00:00Z',
          check_out_previsto: '2025-06-03T18:00:00Z',
          estado_reserva_atual: 'entregue',
          total_price: 85.00,
          parque: {
            nome_parque: 'Parque Faro',
            cidade: 'Faro'
          }
        }
      ];
      
      setReservas(mockReservas);
    } catch (error: any) {
      console.error('Erro ao carregar reservas:', error);
      toast.error(`Erro ao carregar reservas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReservas = reservas.filter(reserva => 
    (searchTerm === '' || 
     reserva.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
     reserva.alocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
     reserva.name_cliente.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedParque === '' || reserva.parque.cidade.toLowerCase() === selectedParque) &&
    (selectedEstado === '' || reserva.estado_reserva_atual === selectedEstado)
  );

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      reservado: "default",
      recolhido: "secondary", 
      entregue: "outline",
      cancelado: "destructive"
    };
    
    return (
      <Badge variant={variants[estado] || "default"}>
        {estado}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Gestão de Reservas</h1>
          <p className="text-gray-600 mt-2">
            Visualização e gestão de todas as reservas do sistema Multipark
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservas.length}</div>
              <p className="text-xs text-muted-foreground">
                Todas as reservas carregadas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservados</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {reservas.filter(r => r.estado_reserva_atual === 'reservado').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recolhidos</CardTitle>
              <Car className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {reservas.filter(r => r.estado_reserva_atual === 'recolhido').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregues</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reservas.filter(r => r.estado_reserva_atual === 'entregue').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
            <CardDescription>
              Utiliza os filtros para encontrar reservas específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Pesquisar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Matrícula, código, nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parque">Parque</Label>
                <Select value={selectedParque} onValueChange={setSelectedParque}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar parque..." />
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
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={loadReservas} className="flex-1 md:flex-initial">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedParque('');
                  setSelectedEstado('');
                  setDataInicio('');
                  setDataFim('');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
              <Button variant="outline" onClick={() => router.push('/upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Excel
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Reservas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Reservas ({filteredReservas.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">A carregar reservas...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Parque</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          Nenhuma reserva encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReservas.map((reserva) => (
                        <TableRow key={reserva.id_pk}>
                          <TableCell className="font-medium">
                            {reserva.license_plate}
                          </TableCell>
                          <TableCell>{reserva.alocation}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reserva.name_cliente}</div>
                              <div className="text-sm text-muted-foreground">
                                {reserva.phone_number_cliente}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reserva.parque?.nome_parque || '-'}</div>
                              <div className="text-sm text-muted-foreground">
                                {reserva.parque?.cidade || '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(reserva.check_in_previsto)}</TableCell>
                          <TableCell>{formatDate(reserva.check_out_previsto)}</TableCell>
                          <TableCell>
                            {getEstadoBadge(reserva.estado_reserva_atual)}
                          </TableCell>
                          <TableCell>{formatPrice(reserva.total_price)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
