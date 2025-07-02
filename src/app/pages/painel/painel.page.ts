import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonRange,
  IonButton,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  settingsOutline,
  informationCircleOutline,
  buildOutline,
  shieldCheckmark,
  shieldOutline,
  pulse,
  pulseOutline,
  checkmarkCircle,
  closeCircle,
  flash,
  trash,
  documentText
} from 'ionicons/icons';

import { AcelerometroService } from '../../services/acelerometro.service';
import { AlarmeService } from '../../services/alarme.service';
import { LogsService } from '../../services/logs.service';
import { ConfiguracaoAlarme } from '../../types';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonRange,
    IonButton,
    IonIcon
  ]
})
export class PainelPage implements OnInit, OnDestroy {
  configuracao: ConfiguracaoAlarme = { sensibilidade: 5, ativo: false };
  alarmeAtivo = false;
  monitorando = false;
  permissaoSensores = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private acelerometroService: AcelerometroService,
    private alarmeService: AlarmeService,
    private logsService: LogsService,
    private alertController: AlertController
  ) {
    addIcons({
      settingsOutline,
      informationCircleOutline,
      buildOutline,
      shieldCheckmark,
      shieldOutline,
      pulse,
      pulseOutline,
      checkmarkCircle,
      closeCircle,
      flash,
      trash,
      documentText
    });
  }

  ngOnInit() {
    this.initializeSubscriptions();
    this.verificarPermissoes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeSubscriptions() {
    // Configuração do alarme
    this.subscriptions.push(
      this.alarmeService.getConfiguracao().subscribe(config => {
        this.configuracao = { ...config };
      })
    );

    // Status do alarme
    this.subscriptions.push(
      this.alarmeService.getStatusAlarme().subscribe(status => {
        this.alarmeAtivo = status;
      })
    );

    // Status do monitoramento
    this.subscriptions.push(
      this.acelerometroService.isMonitorando().subscribe(monitorando => {
        this.monitorando = monitorando;
      })
    );
  }

  private async verificarPermissoes() {
    this.permissaoSensores = await this.acelerometroService.requestPermission();
  }

  toggleAlarme() {
    this.alarmeService.ativarDesativarAlarme(this.configuracao.ativo);
  }

  onSensibilidadeChange() {
    this.alarmeService.setSensibilidade(this.configuracao.sensibilidade);
  }

  getSensibilityDescription(): string {
    const level = this.configuracao.sensibilidade;
    if (level <= 3) return 'Baixa Sensibilidade';
    if (level <= 6) return 'Sensibilidade Média';
    return 'Alta Sensibilidade';
  }

  getSensibilityDetails(): string {
    const level = this.configuracao.sensibilidade;
    if (level <= 3) {
      return 'Detecta apenas quedas e impactos muito fortes. Menos falsos positivos.';
    }
    if (level <= 6) {
      return 'Detecta quedas moderadas e impactos. Equilíbrio entre precisão e sensibilidade.';
    }
    return 'Detecta movimentos bruscos e quedas leves. Mais sensível, mas pode gerar falsos positivos.';
  }

  async testarAlarme() {
    const alert = await this.alertController.create({
      header: 'Teste de Alarme',
      message: 'Deseja simular um alerta de queda para testar o sistema?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Testar',
          handler: () => {
            this.alarmeService.emitirAlerta('TESTE', 'Teste de funcionamento do sistema de alarme');
          }
        }
      ]
    });

    await alert.present();
  }

  async limparLogs() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Deseja realmente limpar todos os logs? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpar',
          handler: () => {
            this.logsService.clearLogs();
            this.logsService.addLog('Logs limpos pelo usuário');
          }
        }
      ]
    });

    await alert.present();
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }
}
