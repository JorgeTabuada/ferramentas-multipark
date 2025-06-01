import { supabaseDashboard, supabaseFerramentas } from '../supabase/clients';
import type { ReservadoExcel, CaixaExcel, EntregaExcel } from '../excel/parser';

export class DatabaseService {
  static async getReservas(filters?: {
    parqueId?: string;
    dataInicio?: string;
    dataFim?: string;
    estado?: string;
  }) {
    let query = supabaseDashboard
      .from('reservas')
      .select('*');
    
    if (filters?.parqueId) {
      query = query.eq('parque_id', filters.parqueId);
    }
    
    if (filters?.dataInicio) {
      query = query.gte('check_in_previsto', filters.dataInicio);
    }
    
    if (filters?.dataFim) {
      query = query.lte('check_out_previsto', filters.dataFim);
    }
    
    if (filters?.estado) {
      query = query.eq('estado_reserva_atual', filters.estado);
    }
    
    return query.order('created_at_db', { ascending: false });
  }
  
  static async upsertReservas(reservas: ReservadoExcel[]) {
    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as string[]
    };
    
    for (const reserva of reservas) {
      try {
        const { data: existing } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', reserva.license_plate)
          .eq('alocation', reserva.allocation)
          .single();
        
        if (existing) {
          const { error } = await supabaseDashboard
            .from('reservas')
            .update({
              ...reserva,
              updated_at_db: new Date().toISOString()
            })
            .eq('id_pk', existing.id_pk);
          
          if (error) throw error;
          results.updated++;
        } else {
          const { error } = await supabaseDashboard
            .from('reservas')
            .insert({
              ...reserva,
              created_at_db: new Date().toISOString()
            });
          
          if (error) throw error;
          results.inserted++;
        }
      } catch (error: any) {
        console.error('Erro ao processar reserva:', error);
        results.errors.push(`${reserva.license_plate}: ${error.message}`);
      }
    }
    
    return results;
  }
  
  static async updateReservasWithCaixa(caixaData: CaixaExcel[]) {
    const results = {
      updated: 0,
      notFound: 0,
      errors: [] as string[]
    };
    
    for (const caixa of caixaData) {
      try {
        const { data: reserva } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', caixa.matricula)
          .single();
        
        if (reserva) {
          results.updated++;
        } else {
          results.notFound++;
        }
      } catch (error: any) {
        console.error('Erro ao processar caixa:', error);
        results.errors.push(`${caixa.matricula}: ${error.message}`);
      }
    }
    
    return results;
  }
  
  static async updateReservasWithEntregas(entregaData: EntregaExcel[]) {
    const results = {
      updated: 0,
      notFound: 0,
      errors: [] as string[]
    };
    
    for (const entrega of entregaData) {
      try {
        const { data: reserva } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', entrega.license_plate)
          .eq('alocation', entrega.allocation)
          .single();
        
        if (reserva) {
          const { error } = await supabaseDashboard
            .from('reservas')
            .update({
              estado_reserva_atual: 'entregue',
              check_out_real: entrega.data_entrega,
              updated_at_db: new Date().toISOString()
            })
            .eq('id_pk', reserva.id_pk);
          
          if (error) throw error;
          results.updated++;
        } else {
          results.notFound++;
        }
      } catch (error: any) {
        console.error('Erro ao processar entrega:', error);
        results.errors.push(`${entrega.license_plate}: ${error.message}`);
      }
    }
    
    return results;
  }
  
  static async getParques() {
    return supabaseDashboard
      .from('parques')
      .select('*')
      .eq('ativo', true)
      .order('nome_parque');
  }
  
  static async getDashboardData(parqueId?: string) {
    const hoje = new Date().toISOString().split('T')[0];
    
    const [reservasHoje, parques] = await Promise.all([
      this.getReservas({
        parqueId,
        dataInicio: hoje,
        dataFim: hoje
      }),
      this.getParques()
    ]);
    
    return {
      reservasHoje: reservasHoje.data || [],
      parques: parques.data || [],
      stats: {
        totalReservasHoje: reservasHoje.data?.length || 0,
        totalParques: parques.data?.length || 0,
        totalColaboradores: 0
      }
    };
  }
  
  static async healthCheck() {
    const results = {
      dashboard: { status: 'unknown', error: null },
      ferramentas: { status: 'unknown', error: null }
    };
    
    try {
      await supabaseDashboard.from('parques').select('count').limit(1);
      results.dashboard.status = 'healthy';
    } catch (error: any) {
      results.dashboard.status = 'error';
      results.dashboard.error = error.message;
    }
    
    try {
      await supabaseFerramentas.from('rh_colaboradores').select('count').limit(1);
      results.ferramentas.status = 'healthy';
    } catch (error: any) {
      results.ferramentas.status = 'error';
      results.ferramentas.error = error.message;
    }
    
    return results;
  }
}