import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database.service';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação/autorização (pode adicionar header check aqui)
    const userRole = req.headers.get('x-user-role');
    if (userRole && !['admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Apenas administradores podem sincronizar dados' },
        { status: 403 }
      );
    }
    
    // Executar sincronização
    const result = await DatabaseService.syncParques();
    
    return NextResponse.json({
      success: true,
      message: 'Sincronização de parques concluída com sucesso',
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erro na sincronização de parques:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro na sincronização de parques',
      details: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}