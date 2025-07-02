import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfiguracaoAlarme, Alerta } from '../types';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmeService {
  private configuracao: ConfiguracaoAlarme = {
    sensibilidade: 5,
    ativo: false
  };
  
  private configuracaoSubject = new BehaviorSubject<ConfiguracaoAlarme>(this.configuracao);
  private alertaSubject = new BehaviorSubject<Alerta | null>(null);
  private statusAlarmeSubject = new BehaviorSubject<boolean>(false);

  constructor(private logsService: LogsService) { }

  // Configuração do alarme
  getConfiguracao(): Observable<ConfiguracaoAlarme> {
    return this.configuracaoSubject.asObservable();
  }

  setSensibilidade(sensibilidade: number): void {
    this.configuracao.sensibilidade = sensibilidade;
    this.configuracaoSubject.next({ ...this.configuracao });
    this.logsService.addLog(`Sensibilidade alterada para: ${sensibilidade}`);
  }

  ativarDesativarAlarme(ativo: boolean): void {
    this.configuracao.ativo = ativo;
    this.configuracaoSubject.next({ ...this.configuracao });
    this.statusAlarmeSubject.next(ativo);
    
    const status = ativo ? 'ativado' : 'desativado';
    this.logsService.addLog(`Alarme ${status}`);
  }

  // Status do alarme
  getStatusAlarme(): Observable<boolean> {
    return this.statusAlarmeSubject.asObservable();
  }

  // Alertas
  emitirAlerta(tipo: string, mensagem: string): void {
    if (!this.configuracao.ativo) {
      return; // Não emite alerta se estiver desativado
    }

    const alerta: Alerta = {
      id: Date.now(),
      tipo,
      mensagem,
      data: new Date()
    };

    this.alertaSubject.next(alerta);
    this.logsService.addLog(`ALERTA: ${mensagem}`, alerta.id);
    
    // Vibração (se disponível)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  getAlertas(): Observable<Alerta | null> {
    return this.alertaSubject.asObservable();
  }

  getSensibilidade(): number {
    return this.configuracao.sensibilidade;
  }

  isAlarmeAtivo(): boolean {
    return this.configuracao.ativo;
  }
}
