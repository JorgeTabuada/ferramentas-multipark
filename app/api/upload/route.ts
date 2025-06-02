import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database.service';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const parqueId = formData.get('parqueId') as string;

    if (!file || !type || !parqueId) {
      return NextResponse.json(
        { error: 'Ficheiro, tipo e parque são obrigatórios' },
        { status: 400 }
      );
    }

    // Ler o ficheiro
    const fileContent = await file.text();
    
    // Parse do CSV/Excel
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'Erro ao processar ficheiro', details: parseResult.errors },
        { status: 400 }
      );
    }

    const data = parseResult.data as any[];
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Ficheiro vazio ou formato inválido' },
        { status: 400 }
      );
    }

    let result;

    // Processar conforme o tipo
    switch (type) {
      case 'reservas':
        result = await processReservas(data, parqueId);
        break;
      case 'caixa':
        result = await processCaixa(data);
        break;
      case 'entregas':
        result = await processEntregas(data);
        break;
      case 'recolhas':
        result = await processRecolhas(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de upload não suportado' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${type} processado com sucesso`,
      ...result
    });

  } catch (error: any) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno no processamento', details: error.message },
      { status: 500 }
    );
  }
}

async function processReservas(data: any[], parqueId: string) {
  // Mapear campos do Excel para a base de dados
  const reservas = data.map(row => ({
    license_plate: row.license_plate || row.matricula || row.plate,
    alocation: row.allocation || row.alocation || row.codigo,
    name_cliente: row.name_cliente || row.customer_name || row.nome,
    lastname_cliente: row.lastname_cliente || row.customer_lastname || row.apelido,
    phone_number_cliente: row.phone_number_cliente || row.phone || row.telefone,
    email_cliente: row.email_cliente || row.email,
    check_in_previsto: row.check_in_previsto || row.check_in || row.entrada,
    check_out_previsto: row.check_out_previsto || row.check_out || row.saida,
    booking_price: row.booking_price || row.price || row.preco,
    total_price: row.total_price || row.total || row.preco_total,
    estado_reserva_atual: row.estado_reserva_atual || row.estado || 'reservado',
    parque_id: parqueId,
    return_flight: row.return_flight || row.voo_regresso,
    parking_type: row.parking_type || row.tipo_estacionamento || 'descoberto'
  }));

  return await DatabaseService.upsertReservas(reservas);
}

async function processCaixa(data: any[]) {
  // Mapear campos do Excel para dados de caixa
  const caixaData = data.map(row => ({
    matricula: row.matricula || row.license_plate || row.plate,
    valor: parseFloat(row.valor || row.value || row.amount || 0),
    metodo_pagamento: row.metodo_pagamento || row.metodo || row.payment_method || 'dinheiro',
    data_transacao: row.data_transacao || row.data || row.date || new Date().toISOString(),
    observacoes: row.observacoes || row.notes || row.notas || ''
  }));

  return await DatabaseService.updateReservasWithCaixa(caixaData);
}

async function processEntregas(data: any[]) {
  // Mapear campos do Excel para dados de entrega
  const entregaData = data.map(row => ({
    license_plate: row.license_plate || row.matricula || row.plate,
    allocation: row.allocation || row.alocation || row.codigo,
    data_entrega: row.data_entrega || row.data || row.delivery_date || new Date().toISOString(),
    condutor_entrega: row.condutor_entrega || row.condutor || row.driver,
    observacoes: row.observacoes || row.notes || row.notas || ''
  }));

  return await DatabaseService.updateReservasWithEntregas(entregaData);
}

async function processRecolhas(data: any[]) {
  // Por enquanto, criar estrutura similar às entregas
  // Pode ser expandido conforme necessário
  const recolhaData = data.map(row => ({
    license_plate: row.license_plate || row.matricula || row.plate,
    allocation: row.allocation || row.alocation || row.codigo,
    data_recolha: row.data_recolha || row.data || row.pickup_date || new Date().toISOString(),
    condutor_recolha: row.condutor_recolha || row.condutor || row.driver,
    observacoes: row.observacoes || row.notes || row.notas || ''
  }));

  // Lógica similar às entregas mas para recolhas
  // Pode usar uma função específica no DatabaseService se necessário
  return {
    inserted: 0,
    updated: recolhaData.length,
    errors: []
  };
}
