export interface Alerta {
  id: number;
  tipo: string;
  mensagem: string;
  data: Date;
}

export interface ConfiguracaoAlarme {
  sensibilidade: number;
  ativo: boolean;
}

export interface Log {
  id: number;
  alertaId: number;
  data: Date;
  descricao: string;
}

export interface DadosAcelerometro {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}
