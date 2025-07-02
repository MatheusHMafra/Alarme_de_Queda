import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'painel',
    loadComponent: () => import('./pages/painel/painel.page').then((m) => m.PainelPage),
  },
  {
    path: 'logs',
    loadComponent: () => import('./pages/logs/logs.page').then((m) => m.LogsPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
