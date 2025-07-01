import { Component } from '@angular/core';
import { AcelerometroService } from '../../services/acelerometro.service';
import { AlarmeService } from '../../services/alarme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  inclinacao: number;
  alertaAtivo: boolean = false;

  constructor(private acelerometroService: AcelerometroService, private alarmeService: AlarmeService) {
    this.monitorarInclinacao();
  }

  monitorarInclinacao() {
    this.acelerometroService.obterInclinacao().subscribe((inclinacao) => {
      this.inclinacao = inclinacao;
      this.verificarAlerta();
    });
  }

  verificarAlerta() {
    if (this.inclinacao > 30) { // Exemplo de limite de inclinação
      this.alarmeService.ativarAlarme();
      this.alertaAtivo = true;
    } else {
      this.alarmeService.desativarAlarme();
      this.alertaAtivo = false;
    }
  }
}