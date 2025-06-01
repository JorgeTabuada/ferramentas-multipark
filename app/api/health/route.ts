import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database.service';

export async function GET(req: NextRequest) {
  try {
    // Health check das bases de dados
    const dbHealth = await DatabaseService.healthCheck();
    
    // Verificar se ambas as bases estão saudáveis
    const isHealthy = dbHealth.dashboard.status === 'healthy' && 
                     dbHealth.ferramentas.status === 'healthy';
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      message: 'Multipark Ferramentas API funcionando!',
      databases: {
        dashboard: dbHealth.dashboard.status,
        ferramentas: dbHealth.ferramentas.status
      },
      details: dbHealth
    }, {
      status: isHealthy ? 200 : 503
    });
    
  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      message: 'Erro no health check',
      error: error.message,
      databases: {
        dashboard: 'error',
        ferramentas: 'error'
      }
    }, {
      status: 500
    });
  }
}