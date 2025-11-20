import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { ContractsTableComponent } from './components/contracts-table.component';
import { AboutComponent } from './about.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, ContractsTableComponent, AboutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SmartTail');
  protected readonly currentView = signal<'dashboard' | 'contracts'>('dashboard');

  showDashboard() {
    this.currentView.set('dashboard');
  }

  showContracts() {
    this.currentView.set('contracts');
  }
}
