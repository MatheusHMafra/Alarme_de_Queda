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