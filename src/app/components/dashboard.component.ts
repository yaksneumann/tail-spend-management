import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Contract, DashboardStats } from '../services/mock-data.service';
import { EmailModalComponent } from './email-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EmailModalComponent],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">
            <i class="icon-briefcase"></i>
            Tail Spend Management Dashboard
          </h1>
          <p class="dashboard-subtitle">Monitor and manage your procurement contracts</p>
        </div>
      </header>

      <!-- Critical Notifications -->
      @if (expiringContracts().length > 0) {
        <div class="notification-banner" role="alert">
          <div class="notification-content">
            <div class="notification-icon">
              <i class="icon-alert"></i>
            </div>
            <div class="notification-text">
              <h3>{{ expiringContracts().length }} Contracts Require Immediate Attention</h3>
              <p>Contracts expiring within the next 3 months</p>
            </div>
            <div class="notification-actions">
              <button class="btn btn-primary" (click)="scrollToContracts()">
                Review Now
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">
            <i class="icon-contracts"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardStats()?.totalContracts || 0 }}</h3>
            <p class="stat-label">Total Contracts</p>
          </div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="icon-clock"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardStats()?.expiringContracts || 0 }}</h3>
            <p class="stat-label">Expiring Soon</p>
          </div>
        </div>

        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="icon-review"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardStats()?.pendingReviews || 0 }}</h3>
            <p class="stat-label">Pending Reviews</p>
          </div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="icon-auto"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardStats()?.autoRenewals || 0 }}</h3>
            <p class="stat-label">Auto-Renewals</p>
          </div>
        </div>

        <div class="stat-card stat-card-accent">
          <div class="stat-icon">
            <i class="icon-money"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">\${{ formatCurrency(dashboardStats()?.totalValue || 0) }}</h3>
            <p class="stat-label">Total Contract Value</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2 class="section-title">Quick Actions</h2>
        <div class="action-cards">
          <div class="action-card" (click)="scrollToContracts()">
            <i class="icon-list"></i>
            <h3>View All Contracts</h3>
            <p>Browse and manage all contracts</p>
          </div>
          <div class="action-card">
            <i class="icon-plus"></i>
            <h3>Add New Contract</h3>
            <p>Register a new vendor contract</p>
          </div>
          <div class="action-card">
            <i class="icon-report"></i>
            <h3>Generate Report</h3>
            <p>Export contract analytics</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2 class="section-title">Contracts Requiring Attention</h2>
        <div class="activity-list">
          @for (contract of expiringContracts(); track contract.contract) {
            <div class="activity-item" [class]="'status-' + contract.renewalStatus.toLowerCase().replace(' ', '-')">
              <div class="activity-icon">
                <i [class]="getStatusIcon(contract.renewalStatus)"></i>
              </div>
              <div class="activity-content">
                <h4>{{ contract.vendor }} - {{ contract.contract }}</h4>
                <p>{{ contract.comments }}</p>
                <div class="activity-meta">
                  <span class="renewal-date">Expires: {{ formatDate(contract.renewalDate) }}</span>
                  <span class="contract-value">\${{ formatCurrency(contract.cost) }}</span>
                  <span class="status-badge" [class]="'status-' + contract.renewalStatus.toLowerCase().replace(' ', '-')">
                    {{ contract.renewalStatus }}
                  </span>
                </div>
              </div>
              <div class="activity-actions">
                <button class="btn btn-sm btn-info" (click)="showEmailModal(contract)">
                  <i class="icon-email"></i>
                  Email
                </button>
                <button class="btn btn-sm btn-success" (click)="showEmailModal(contract)">
                  Renew as is
                </button>
                <button class="btn btn-sm btn-warning" (click)="takeAction(contract, 'review')">
                  Review
                </button>
                <button class="btn btn-sm btn-danger" (click)="takeAction(contract, 'terminate')">
                  Terminate
                </button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <i class="icon-check-circle"></i>
              <h3>All caught up!</h3>
              <p>No contracts require immediate attention.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Email Modal -->
    <app-email-modal 
      [contract]="selectedContractForEmail"
      [isVisible]="emailModalVisible"
      (close)="closeEmailModal()"
      (actionSelected)="handleEmailAction($event)"
    ></app-email-modal>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private mockDataService = inject(MockDataService);
  
  dashboardStats = signal<DashboardStats | null>(null);
  expiringContracts = signal<Contract[]>([]);
  
  // Email modal state
  emailModalVisible = signal(false);
  selectedContractForEmail = signal<Contract | null>(null);

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.dashboardStats.set(stats);
    });

    this.mockDataService.getExpiringContracts().subscribe(contracts => {
      this.expiringContracts.set(contracts);
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'Bot Pending': 'icon-bot',
      'Manual Review': 'icon-review',
      'Auto-Renew': 'icon-auto',
      'Expiring Soon': 'icon-alert',
      'Completed': 'icon-check',
      'Terminated': 'icon-x'
    };
    return iconMap[status] || 'icon-clock';
  }

  scrollToContracts() {
    // This would scroll to contracts section or navigate to contracts page
    console.log('Scrolling to contracts section');
  }

  takeAction(contract: Contract, action: string) {
    console.log(`Taking action ${action} on contract ${contract.contract}`);
    // This would open a modal or perform the action
    
    let newStatus: Contract['renewalStatus'];
    switch(action) {
      case 'prolong':
        newStatus = 'Auto-Renew';
        break;
      case 'terminate':
        newStatus = 'Terminated';
        break;
      case 'review':
      default:
        newStatus = 'Manual Review';
        break;
    }
    
    this.mockDataService.updateContractStatus(contract.contract, newStatus).subscribe(() => {
      this.loadDashboardData(); // Refresh data
    });
  }

  showEmailModal(contract: Contract) {
    this.selectedContractForEmail.set(contract);
    this.emailModalVisible.set(true);
  }

  closeEmailModal() {
    this.emailModalVisible.set(false);
    this.selectedContractForEmail.set(null);
  }

  handleEmailAction(event: {contract: Contract, action: string}) {
    console.log('Email action taken:', event.action, 'for contract:', event.contract.contract);
    this.takeAction(event.contract, event.action);
  }
}