import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  settings, 
  documentText, 
  shieldCheckmark, 
  shieldOutline, 
  stopCircle, 
  playCircle, 
  lockOpen, 
  analytics, 
  warning 
} from 'ionicons/icons';

import { AcelerometroService } from '../services/acelerometro.service';
import { AlarmeService } from '../services/alarme.service';
import { LogsService } from '../services/logs.service';
import { ConfiguracaoAlarme, Alerta, Log, DadosAcelerometro } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ],
})
export class HomePage implements OnInit, OnDestroy {
  configuracao: ConfiguracaoAlarme = { sensibilidade: 5, ativo: false };
  alarmeAtivo = false;
  monitorando = false;
  permissaoSensores = false;
  dadosAcelerometro: DadosAcelerometro = { x: 0, y: 0, z: 0, timestamp: 0 };
  ultimoAlerta: Alerta | null = null;
  logsRecentes: Log[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private acelerometroService: AcelerometroService,
    private alarmeService: AlarmeService,
    private logsService: LogsService
  ) {
    addIcons({ 
      settings, 
      documentText, 
      shieldCheckmark, 
      shieldOutline, 
      stopCircle, 
      playCircle, 
      lockOpen, 
      analytics, 
      warning 
    });
  }

  ngOnInit() {
    this.initializeSubscriptions();
    this.verificarPermissoes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.acelerometroService.stopMonitoring();
  }

  private initializeSubscriptions() {
    // Configuração do alarme
    this.subscriptions.push(
      this.alarmeService.getConfiguracao().subscribe(config => {
        this.configuracao = config;
      })
    );

    // Status do alarme
    this.subscriptions.push(
      this.alarmeService.getStatusAlarme().subscribe(status => {
        this.alarmeAtivo = status;
        if (status) {
          this.acelerometroService.startMonitoring();
        } else {
          this.acelerometroService.stopMonitoring();
        }
      })
    );

    // Status do monitoramento
    this.subscriptions.push(
      this.acelerometroService.isMonitorando().subscribe(monitorando => {
        this.monitorando = monitorando;
      })
    );

    // Dados do acelerômetro
    this.subscriptions.push(
      this.acelerometroService.getDadosAcelerometro().subscribe(dados => {
        this.dadosAcelerometro = dados;
      })
    );

    // Alertas
    this.subscriptions.push(
      this.alarmeService.getAlertas().subscribe(alerta => {
        if (alerta) {
          this.ultimoAlerta = alerta;
        }
      })
    );

    // Logs
    this.subscriptions.push(
      this.logsService.getLogs().subscribe(logs => {
        this.logsRecentes = logs.slice(0, 5); // Últimos 5 logs
      })
    );
  }

  private async verificarPermissoes() {
    this.permissaoSensores = await this.acelerometroService.requestPermission();
  }

  async solicitarPermissao() {
    this.permissaoSensores = await this.acelerometroService.requestPermission();
    if (this.permissaoSensores) {
      this.logsService.addLog('Permissão dos sensores concedida');
    } else {
      this.logsService.addLog('Permissão dos sensores negada');
    }
  }

  toggleAlarme() {
    if (!this.permissaoSensores) {
      this.solicitarPermissao();
      return;
    }

    const novoStatus = !this.alarmeAtivo;
    this.alarmeService.ativarDesativarAlarme(novoStatus);
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  getMagnitude(): number {
    const { x, y, z } = this.dadosAcelerometro;
    return Math.sqrt(x * x + y * y + z * z);
  }

  trackByFn(index: number, item: Log): number {
    return item.id;
  }
}
