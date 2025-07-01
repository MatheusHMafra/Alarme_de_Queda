import { Component } from '@angular/core';
import { AlarmeService } from '../../services/alarme.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
})
export class PainelPage {
  public sensibilidade: number;
  public alarmeAtivo: boolean;

  constructor(private alarmeService: AlarmeService) {
    this.sensibilidade = 5; // valor padrão de sensibilidade
    this.alarmeAtivo = false; // alarme desativado por padrão
  }

  public configurarSensibilidade(novaSensibilidade: number): void {
    this.sensibilidade = novaSensibilidade;
    this.alarmeService.configurarSensibilidade(this.sensibilidade);
  }

  public ativarDesativarAlarme(): void {
    this.alarmeAtivo = !this.alarmeAtivo;
    this.alarmeService.ativarDesativarAlarme(this.alarmeAtivo);
  }
}