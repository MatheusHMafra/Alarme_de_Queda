import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { DadosAcelerometro } from '../types';
import { AlarmeService } from './alarme.service';

@Injectable({
  providedIn: 'root'
})
export class AcelerometroService {
  private dadosAcelerometro = new BehaviorSubject<DadosAcelerometro>({ x: 0, y: 0, z: 0, timestamp: 0 });
  private monitorandoSubject = new BehaviorSubject<boolean>(false);
  private subscription?: Subscription;
  private intervalSubscription?: Subscription;
  
  private ultimaLeitura: DadosAcelerometro = { x: 0, y: 0, z: 0, timestamp: 0 };

  constructor(private alarmeService: AlarmeService) { }

  startMonitoring(): void {
    if (this.monitorandoSubject.value) {
      return; // Já está monitorando
    }

    // Verifica se o dispositivo suporta DeviceMotionEvent
    if (window.DeviceMotionEvent) {
      this.monitorandoSubject.next(true);
      
      // Listener para eventos de movimento do dispositivo
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), true);
      
      // Fallback: simulação de dados para teste em navegador
    } else {
      console.warn('DeviceMotionEvent não suportado, usando simulação para teste');
      this.startSimulation();
    }
  }

  stopMonitoring(): void {
    if (!this.monitorandoSubject.value) {
      return; // Já parou
    }

    this.monitorandoSubject.next(false);
    
    // Remove o listener
    window.removeEventListener('devicemotion', this.handleDeviceMotion.bind(this), true);
    
    // Para a simulação se estiver rodando
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  private handleDeviceMotion(event: DeviceMotionEvent): void {
    if (!event.accelerationIncludingGravity) {
      return;
    }

    const dados: DadosAcelerometro = {
      x: event.accelerationIncludingGravity.x || 0,
      y: event.accelerationIncludingGravity.y || 0,
      z: event.accelerationIncludingGravity.z || 0,
      timestamp: Date.now()
    };

    this.ultimaLeitura = dados;
    this.dadosAcelerometro.next(dados);
    this.analisarQueda(dados);
  }

  private startSimulation(): void {
    this.monitorandoSubject.next(true);
    
    // Simula dados do acelerômetro para teste
    this.intervalSubscription = interval(100).subscribe(() => {
      const dados: DadosAcelerometro = {
        x: (Math.random() - 0.5) * 2, // -1 a 1
        y: (Math.random() - 0.5) * 2, // -1 a 1
        z: 9.8 + (Math.random() - 0.5) * 0.5, // ~9.8 com variação
        timestamp: Date.now()
      };

      // Simula uma queda ocasionalmente (5% de chance)
      if (Math.random() < 0.05) {
        dados.x = Math.random() * 15;
        dados.y = Math.random() * 15;
        dados.z = Math.random() * 15;
      }

      this.ultimaLeitura = dados;
      this.dadosAcelerometro.next(dados);
      this.analisarQueda(dados);
    });
  }

  private analisarQueda(dados: DadosAcelerometro): void {
    // Calcula a magnitude total da aceleração
    const magnitude = Math.sqrt(dados.x * dados.x + dados.y * dados.y + dados.z * dados.z);
    
    // Obtém a sensibilidade configurada
    const sensibilidade = this.alarmeService.getSensibilidade();
    
    // Detecta queda baseada na sensibilidade
    // Valores baixos de magnitude indicam queda livre
    // Valores altos indicam impacto
    const limiteQuedaLivre = 2; // Menor que aceleração da gravidade indica queda livre
    const limiteImpacto = 15 + (10 - sensibilidade) * 2; // Sensibilidade influencia o limite de impacto
    
    if (magnitude < limiteQuedaLivre) {
      this.alarmeService.emitirAlerta('QUEDA_LIVRE', `Queda livre detectada! Magnitude: ${magnitude.toFixed(2)} m/s²`);
    } else if (magnitude > limiteImpacto) {
      this.alarmeService.emitirAlerta('IMPACTO', `Impacto detectado! Magnitude: ${magnitude.toFixed(2)} m/s²`);
    }
  }

  getDadosAcelerometro(): Observable<DadosAcelerometro> {
    return this.dadosAcelerometro.asObservable();
  }

  isMonitorando(): Observable<boolean> {
    return this.monitorandoSubject.asObservable();
  }

  getUltimaLeitura(): DadosAcelerometro {
    return this.ultimaLeitura;
  }

  // Solicita permissão para usar sensores (iOS 13+)
  async requestPermission(): Promise<boolean> {
    if (typeof (window as any).DeviceMotionEvent !== 'undefined' && 
        typeof (window as any).DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await (window as any).DeviceMotionEvent.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
        return false;
      }
    }
    return true; // Não precisa de permissão ou já tem
  }
}
