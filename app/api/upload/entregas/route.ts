import { NextRequest, NextResponse } from 'next/server';
import { ExcelParser } from '@/lib/excel/parser';
import { DatabaseService } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum ficheiro fornecido' },
        { status: 400 }
      );
    }
    
    console.log('📁 Processing entregas file:', file.name);
    
    const parsedData = await ExcelParser.parseFile(file, 'entregas');
    const validation = ExcelParser.validateFileStructure(parsedData, 'entregas');
    
    if (!validation.valid) {
      return NextResponse.json({
        error: 'Ficheiro inválido',
        details: validation.errors
      }, { status: 400 });
    }
    
    const result = await DatabaseService.updateReservasWithEntregas(parsedData);
    
    return NextResponse.json({
      success: true,
      message: 'Dados de entrega processados com sucesso',
      data: {
        parsed: parsedData.length,
        updated: result.updated,
        notFound: result.notFound,
        errors: result.errors
      },
      validation
    });
    
  } catch (error: any) {
    console.error('❌ Erro no upload entregas:', error);
    
    return NextResponse.json({
      error: 'Erro no processamento do ficheiro de entregas',
      details: error.message
    }, { status: 500 });
  }
}