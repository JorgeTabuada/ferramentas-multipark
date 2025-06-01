import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database.service';

export async function GET(req: NextRequest) {
  try {
    // Obter parâmetros de query
    const { searchParams } = new URL(req.url);
    const parqueId = searchParams.get('parqueId') || undefined;
    const dataInicio = searchParams.get('dataInicio') || undefined;
    const dataFim = searchParams.get('dataFim') || undefined;
    const estado = searchParams.get('estado') || undefined;

    // Buscar reservas com filtros
    const result = await DatabaseService.getReservas({
      parqueId,
      dataInicio,
      dataFim,
      estado
    });

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      data: result.data || [],
      count: result.data?.length || 0,
      filters: { parqueId, dataInicio, dataFim, estado },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Erro na API reservas:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar reservas',
      details: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validação básica
    if (!body.license_plate || !body.alocation) {
      return NextResponse.json(
        { error: 'license_plate e alocation são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar/atualizar reserva usando upsert
    const result = await DatabaseService.upsertReservas([body]);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Reserva processada com sucesso',
      timestamp: new Date().toISOString()
    }, {
      status: 201
    });

  } catch (error: any) {
    console.error('❌ Erro ao criar reserva:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar reserva',
      details: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}