import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmeService {
  private alertaSubject = new Subject<string>();
  private sensibilidade: number = 1; // Sensibilidade padrão

  constructor() { }

  emitirAlerta(mensagem: string) {
    this.alertaSubject.next(mensagem);
  }

  getAlertas() {
    return this.alertaSubject.asObservable();
  }

  setSensibilidade(novaSensibilidade: number) {
    this.sensibilidade = novaSensibilidade;
  }

  getSensibilidade() {
    return this.sensibilidade;
  }
}