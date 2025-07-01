import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  public logs: any[] = [];

  constructor(private logsService: LogsService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logsService.getLogs().subscribe((data) => {
      this.logs = data;
    });
  }
}