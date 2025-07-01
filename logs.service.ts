import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private logs: string[] = [];

  constructor() { }

  addLog(message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push(`${timestamp}: ${message}`);
  }

  getLogs(): string[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}