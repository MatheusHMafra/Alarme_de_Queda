import { Component, OnInit, OnDestroy } from '@angular/core';
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
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trash,
  documentTextOutline,
  download,
  warningOutline,
  informationCircleOutline,
  alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { LogsService } from '../../services/logs.service';
import { Log } from '../../types';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel
  ]
})
export class LogsPage implements OnInit, OnDestroy {
  logs: Log[] = [];
  logsFiltrados: Log[] = [];
  filtroAtivo = 'todos';

  private subscription?: Subscription;

  constructor(
    private logsService: LogsService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      trash,
      documentTextOutline,
      download,
      warningOutline,
      informationCircleOutline,
      alertCircleOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.carregarLogs();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private carregarLogs() {
    this.subscription = this.logsService.getLogs().subscribe(logs => {
      this.logs = logs;
      this.filtrarLogs();
    });
  }

  filtrarLogs() {
    switch (this.filtroAtivo) {
      case 'alertas':
        this.logsFiltrados = this.logs.filter(log => 
          log.descricao.includes('ALERTA:') || 
          log.descricao.includes('Queda') || 
          log.descricao.includes('Impacto')
        );
        break;
      case 'sistema':
        this.logsFiltrados = this.logs.filter(log => 
          !log.descricao.includes('ALERTA:') && 
          !log.descricao.includes('Queda') && 
          !log.descricao.includes('Impacto')
        );
        break;
      default:
        this.logsFiltrados = [...this.logs];
    }
  }

  getLogClass(log: Log): string {
    if (log.descricao.includes('ALERTA:') || 
        log.descricao.includes('Queda') || 
        log.descricao.includes('Impacto')) {
      return 'log-alerta';
    }
    if (log.descricao.includes('ativado') || 
        log.descricao.includes('desativado') || 
        log.descricao.includes('Sensibilidade')) {
      return 'log-sistema';
    }
    return 'log-normal';
  }

  getLogIcon(log: Log): string {
    if (log.descricao.includes('ALERTA:') || 
        log.descricao.includes('Queda') || 
        log.descricao.includes('Impacto')) {
      return 'alert-circle-outline';
    }
    if (log.descricao.includes('ativado')) {
      return 'checkmark-circle-outline';
    }
    if (log.descricao.includes('desativado')) {
      return 'warning-outline';
    }
    return 'information-circle-outline';
  }

  getLogColor(log: Log): string {
    if (log.descricao.includes('ALERTA:') || 
        log.descricao.includes('Queda') || 
        log.descricao.includes('Impacto')) {
      return 'danger';
    }
    if (log.descricao.includes('ativado')) {
      return 'success';
    }
    if (log.descricao.includes('desativado')) {
      return 'warning';
    }
    return 'primary';
  }

  getFilterLabel(): string {
    switch (this.filtroAtivo) {
      case 'alertas': return 'Alertas';
      case 'sistema': return 'Sistema';
      default: return 'Todos';
    }
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
          handler: async () => {
            this.logsService.clearLogs();
            const toast = await this.toastController.create({
              message: 'Logs limpos com sucesso',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
          }
        }
      ]
    });

    await alert.present();
  }

  async exportarLogs() {
    try {
      const dadosExport = this.logs.map(log => ({
        id: log.id,
        data: log.data.toISOString(),
        descricao: log.descricao,
        alertaId: log.alertaId
      }));

      const jsonString = JSON.stringify(dadosExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `alarme_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);

      const toast = await this.toastController.create({
        message: 'Logs exportados com sucesso',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Erro ao exportar logs',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  trackByFn(index: number, item: Log): number {
    return item.id;
  }
}
