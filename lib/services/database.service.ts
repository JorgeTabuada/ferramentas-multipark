import { supabaseDashboard, supabaseFerramentas, supabaseDashboardAdmin, supabaseFerramentasAdmin } from '../supabase/clients';

export class DatabaseService {
  
  // ===================================
  // OPERAÇÕES DASHBOARD (Operacional)
  // ===================================
  
  // Reservas - CRUD completo
  static async getReservas(filters?: {
    parqueId?: string;
    dataInicio?: string;
    dataFim?: string;
    estado?: string;
  }) {
    let query = supabaseDashboard
      .from('reservas')
      .select(`
        *,
        parque:parques(nome_parque, cidade),
        condutor_recolha:profiles!condutor_recolha_id(full_name),
        condutor_entrega:profiles!condutor_entrega_id(full_name)
      `);
    
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
  
  // Inserir/Atualizar reservas (UPSERT)
  static async upsertReservas(reservas: any[]) {
    const results = {
      inserted: 0,
      updated: 0,
      errors: [] as string[]
    };
    
    for (const reserva of reservas) {
      try {
        // Verificar se já existe (chave: license_plate + allocation)
        const { data: existing } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', reserva.license_plate)
          .eq('alocation', reserva.allocation)
          .single();
        
        if (existing) {
          // UPDATE
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
          // INSERT
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
  
  // Atualizar reservas com dados de caixa
  static async updateReservasWithCaixa(caixaData: any[]) {
    const results = {
      updated: 0,
      notFound: 0,
      errors: [] as string[]
    };
    
    for (const caixa of caixaData) {
      try {
        // Encontrar reserva pela matrícula
        const { data: reserva } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', caixa.matricula)
          .single();
        
        if (reserva) {
          // Inserir/atualizar na tabela de caixa
          const { error } = await supabaseDashboard
            .from('caixa_transacoes_validadas')
            .upsert({
              reserva_id: reserva.id_pk,
              valor_transacao: caixa.valor,
              metodo_pagamento: caixa.metodo_pagamento,
              data_transacao: caixa.data_transacao,
              observacoes: caixa.observacoes
            });
          
          if (error) throw error;
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
  
  // Atualizar reservas com dados de entrega
  static async updateReservasWithEntregas(entregaData: any[]) {
    const results = {
      updated: 0,
      notFound: 0,
      errors: [] as string[]
    };
    
    for (const entrega of entregaData) {
      try {
        // Encontrar reserva pela matrícula + allocation
        const { data: reserva } = await supabaseDashboard
          .from('reservas')
          .select('id_pk')
          .eq('license_plate', entrega.license_plate)
          .eq('alocation', entrega.allocation)
          .single();
        
        if (reserva) {
          // Atualizar estado da reserva
          const { error } = await supabaseDashboard
            .from('reservas')
            .update({
              estado_reserva_atual: 'entregue',
              check_out_real: entrega.data_entrega,
              condutor_entrega_nome: entrega.condutor_entrega,
              observacoes_entrega: entrega.observacoes,
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
  
  // Parques
  static async getParques() {
    return supabaseDashboard
      .from('parques')
      .select('*')
      .eq('ativo', true)
      .order('nome_parque');
  }
  
  // ===================================
  // OPERAÇÕES FERRAMENTAS (RH/Analytics)
  // ===================================
  
  // Colaboradores RH
  static async getColaboradores() {
    return supabaseFerramentas
      .from('rh_colaboradores')
      .select(`
        *,
        contratos:rh_contratos(*),
        ausencias:rh_ausencias_ferias(*)
      `)
      .eq('ativo', true)
      .order('nome_completo');
  }
  
  // Dashboard unificado
  static async getDashboardData(parqueId?: string) {
    const hoje = new Date().toISOString().split('T')[0];
    
    const [reservasHoje, parques, colaboradores] = await Promise.all([
      // Reservas de hoje
      this.getReservas({
        parqueId,
        dataInicio: hoje,
        dataFim: hoje
      }),
      
      // Lista de parques
      this.getParques(),
      
      // Colaboradores ativos (sample)
      supabaseFerramentas
        .from('rh_colaboradores')
        .select('id, nome_completo, funcao')
        .eq('ativo', true)
        .limit(5)
    ]);
    
    return {
      reservasHoje: reservasHoje.data || [],
      parques: parques.data || [],
      colaboradores: colaboradores.data || [],
      stats: {
        totalReservasHoje: reservasHoje.data?.length || 0,
        totalParques: parques.data?.length || 0,
        totalColaboradores: colaboradores.data?.length || 0
      }
    };
  }
  
  // Sincronização de Parques entre bases
  static async syncParques() {
    try {
      console.log('🔄 Iniciando sincronização de parques...');
      
      // Obter parques da base Dashboard
      const { data: parquesDashboard, error: errorDashboard } = await supabaseDashboard
        .from('parques')
        .select('*');
      
      if (errorDashboard) throw errorDashboard;
      if (!parquesDashboard) return;
      
      let synced = 0;
      
      // Sincronizar com base Ferramentas
      for (const parque of parquesDashboard) {
        const { error } = await supabaseFerramentas
          .from('parques')
          .upsert({
            id: parque.id_pk,
            nome_parque: parque.nome_parque,
            cidade: parque.cidade,
            morada: parque.morada,
            capacidade_total: parque.capacidade_total,
            capacidade_coberto: parque.capacidade_coberto,
            capacidade_descoberto: parque.capacidade_descoberto,
            updated_at: new Date().toISOString()
          });
        
        if (!error) synced++;
      }
      
      console.log(`✅ Sincronização concluída: ${synced}/${parquesDashboard.length} parques`);
      return { synced, total: parquesDashboard.length };
    } catch (error) {
      console.error('❌ Erro na sincronização de parques:', error);
      throw error;
    }
  }
  
  // Health check das bases
  static async healthCheck() {
    const results = {
      dashboard: { status: 'unknown', error: null },
      ferramentas: { status: 'unknown', error: null }
    };
    
    try {
      const { data } = await supabaseDashboard.from('parques').select('count').limit(1);
      results.dashboard.status = 'healthy';
    } catch (error: any) {
      results.dashboard.status = 'error';
      results.dashboard.error = error.message;
    }
    
    try {
      const { data } = await supabaseFerramentas.from('rh_colaboradores').select('count').limit(1);
      results.ferramentas.status = 'healthy';
    } catch (error: any) {
      results.ferramentas.status = 'error';
      results.ferramentas.error = error.message;
    }
    
    return results;
  }
}