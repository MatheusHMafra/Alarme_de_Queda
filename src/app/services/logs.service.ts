import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Log } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private logs: Log[] = [];
  private logsSubject = new BehaviorSubject<Log[]>([]);

  constructor() { }

  addLog(message: string, alertaId?: number): void {
    const newLog: Log = {
      id: this.logs.length + 1,
      alertaId: alertaId || 0,
      data: new Date(),
      descricao: message
    };
    
    this.logs.unshift(newLog); // Adiciona no início da lista
    
    // Mantém apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    
    this.logsSubject.next([...this.logs]);
  }

  getLogs(): Observable<Log[]> {
    return this.logsSubject.asObservable();
  }

  clearLogs(): void {
    this.logs = [];
    this.logsSubject.next([]);
  }

  getLogsArray(): Log[] {
    return [...this.logs];
  }
}
