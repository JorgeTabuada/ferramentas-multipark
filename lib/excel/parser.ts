import * as XLSX from 'xlsx';

export interface ReservadoExcel {
  license_plate: string;
  allocation: string;
  name_cliente?: string;
  lastname_cliente?: string;
  phone_number_cliente?: string;
  email_cliente?: string;
  check_in_previsto?: string;
  check_out_previsto?: string;
  booking_price?: number;
  parking_price?: number;
  delivery_price?: number;
  total_price?: number;
  estado_reserva_atual?: string;
  parque_id?: string;
  parking_type?: string;
  return_flight?: string;
}

export interface CaixaExcel {
  matricula: string;
  valor: number;
  metodo_pagamento?: string;
  data_transacao?: string;
  observacoes?: string;
}

export interface EntregaExcel {
  license_plate: string;
  allocation: string;
  data_entrega?: string;
  hora_entrega?: string;
  condutor_entrega?: string;
  observacoes?: string;
}

export class ExcelParser {
  static async parseFile(file: File, type: 'reservados' | 'caixa' | 'entregas'): Promise<any[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`🔍 Parsing ${type}:`, {
      fileName: file.name,
      sheetName: workbook.SheetNames[0],
      rows: jsonData.length,
      sample: jsonData[0]
    });
    
    switch (type) {
      case 'reservados':
        return this.parseReservados(jsonData);
      case 'caixa':
        return this.parseCaixa(jsonData);
      case 'entregas':
        return this.parseEntregas(jsonData);
      default:
        throw new Error(`Tipo ${type} não suportado`);
    }
  }
  
  static parseReservados(rawData: any[]): ReservadoExcel[] {
    return rawData.map(row => {
      const mapped: ReservadoExcel = {
        license_plate: this.cleanString(row['License Plate'] || row['Matrícula'] || row['matricula'] || ''),
        allocation: this.cleanString(row['Allocation'] || row['Alocação'] || row['alocacao'] || ''),
        name_cliente: this.cleanString(row['Customer Name'] || row['Nome Cliente'] || row['nome_cliente']),
        lastname_cliente: this.cleanString(row['Customer Last Name'] || row['Apelido Cliente'] || row['lastname_cliente']),
        phone_number_cliente: this.cleanString(row['Phone'] || row['Telefone'] || row['phone_number_cliente']),
        email_cliente: this.cleanString(row['Email'] || row['email_cliente']),
        check_in_previsto: this.parseDate(row['Check In'] || row['Data Entrada'] || row['check_in_previsto']),
        check_out_previsto: this.parseDate(row['Check Out'] || row['Data Saída'] || row['check_out_previsto']),
        booking_price: this.parseNumber(row['Booking Price'] || row['Preço Reserva'] || row['booking_price']),
        parking_price: this.parseNumber(row['Parking Price'] || row['Preço Estacionamento'] || row['parking_price']),
        delivery_price: this.parseNumber(row['Delivery Price'] || row['Preço Entrega'] || row['delivery_price']),
        total_price: this.parseNumber(row['Total Price'] || row['Preço Total'] || row['total_price']),
        estado_reserva_atual: this.cleanString(row['Status'] || row['Estado'] || row['estado_reserva_atual'] || 'reservado'),
        parque_id: this.cleanString(row['Park'] || row['Parque'] || row['parque_id']),
        parking_type: this.cleanString(row['Type'] || row['Tipo'] || row['parking_type']),
        return_flight: this.cleanString(row['Return Flight'] || row['Voo Regresso'] || row['return_flight'])
      };
      
      if (!mapped.license_plate || !mapped.allocation) {
        console.warn('⚠️ Linha inválida:', row);
        return null;
      }
      
      return mapped;
    }).filter(Boolean) as ReservadoExcel[];
  }
  
  static parseCaixa(rawData: any[]): CaixaExcel[] {
    return rawData.map(row => {
      const mapped: CaixaExcel = {
        matricula: this.cleanString(row['Matrícula'] || row['License Plate'] || row['matricula'] || ''),
        valor: this.parseNumber(row['Valor'] || row['Value'] || row['valor'] || 0),
        metodo_pagamento: this.cleanString(row['Método'] || row['Method'] || row['metodo_pagamento']),
        data_transacao: this.parseDate(row['Data'] || row['Date'] || row['data_transacao']),
        observacoes: this.cleanString(row['Observações'] || row['Notes'] || row['observacoes'])
      };
      
      if (!mapped.matricula) {
        console.warn('⚠️ Linha inválida:', row);
        return null;
      }
      
      return mapped;
    }).filter(Boolean) as CaixaExcel[];
  }
  
  static parseEntregas(rawData: any[]): EntregaExcel[] {
    return rawData.map(row => {
      const mapped: EntregaExcel = {
        license_plate: this.cleanString(row['License Plate'] || row['Matrícula'] || row['license_plate'] || ''),
        allocation: this.cleanString(row['Allocation'] || row['Alocação'] || row['allocation'] || ''),
        data_entrega: this.parseDate(row['Data Entrega'] || row['Delivery Date'] || row['data_entrega']),
        hora_entrega: this.cleanString(row['Hora Entrega'] || row['Delivery Time'] || row['hora_entrega']),
        condutor_entrega: this.cleanString(row['Condutor'] || row['Driver'] || row['condutor_entrega']),
        observacoes: this.cleanString(row['Observações'] || row['Notes'] || row['observacoes'])
      };
      
      if (!mapped.license_plate || !mapped.allocation) {
        console.warn('⚠️ Linha inválida:', row);
        return null;
      }
      
      return mapped;
    }).filter(Boolean) as EntregaExcel[];
  }
  
  static cleanString(value: any): string {
    if (!value) return '';
    return String(value).trim().toUpperCase();
  }
  
  static parseNumber(value: any): number {
    if (!value) return 0;
    const cleaned = String(value).replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }
  
  static parseDate(value: any): string | null {
    if (!value) return null;
    
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        const parts = String(value).split(/[\/\-]/);
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const newDate = new Date(`${year}-${month}-${day}`);
          if (!isNaN(newDate.getTime())) {
            return newDate.toISOString();
          }
        }
        return null;
      }
      return date.toISOString();
    } catch {
      return null;
    }
  }
  
  static validateFileStructure(data: any[], type: 'reservados' | 'caixa' | 'entregas'): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!data || data.length === 0) {
      errors.push('Ficheiro vazio ou sem dados');
      return { valid: false, errors, warnings };
    }
    
    const sample = data[0];
    const headers = Object.keys(sample);
    
    switch (type) {
      case 'reservados':
        const hasRequired = headers.some(h => 
          h.toLowerCase().includes('license') || 
          h.toLowerCase().includes('matrícula') ||
          h.toLowerCase().includes('allocation') ||
          h.toLowerCase().includes('alocação')
        );
        if (!hasRequired) {
          errors.push('Headers obrigatórios em falta: License Plate, Allocation');
        }
        break;
        
      case 'caixa':
        const hasMatricula = headers.some(h => 
          h.toLowerCase().includes('matrícula') ||
          h.toLowerCase().includes('license')
        );
        if (!hasMatricula) {
          errors.push('Header obrigatório em falta: Matrícula');
        }
        break;
        
      case 'entregas':
        const hasMatriculaEntrega = headers.some(h => 
          h.toLowerCase().includes('license') ||
          h.toLowerCase().includes('matrícula')
        );
        if (!hasMatriculaEntrega) {
          errors.push('Header obrigatório em falta: License Plate');
        }
        break;
    }
    
    if (data.length > 10000) {
      warnings.push(`Ficheiro muito grande (${data.length} linhas)`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}