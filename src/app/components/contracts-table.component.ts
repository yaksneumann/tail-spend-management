import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Contract } from '../services/mock-data.service';
import { EmailModalComponent } from './email-modal.component';

@Component({
  selector: 'app-contracts-table',
  standalone: true,
  imports: [CommonModule, FormsModule, EmailModalComponent],
  template: `
    <div class="contracts-container">
      <div class="contracts-header">
        <h2 class="contracts-title">
          <i class="icon-contracts"></i>
          Contract Management
        </h2>
        <div class="header-actions">
          <div class="search-box">
            <i class="icon-search"></i>
            <input 
              type="text" 
              placeholder="Search contracts..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input"
            >
          </div>
          <select 
            [(ngModel)]="statusFilter" 
            (change)="onFilterChange()" 
            class="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Bot Pending">Bot Pending</option>
            <option value="Manual Review">Manual Review</option>
            <option value="Auto-Renew">Auto-Renew</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Completed">Completed</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="contracts-table">
            <thead>
              <tr>
                <th (click)="sortBy('contract')" class="sortable">
                  Contract ID
                  <i class="sort-icon" [class]="getSortIcon('contract')"></i>
                </th>
                <th (click)="sortBy('vendor')" class="sortable">
                  Vendor
                  <i class="sort-icon" [class]="getSortIcon('vendor')"></i>
                </th>
                <th>Contact</th>
                <th>Email</th>
                <th>Internal Owner</th>
                <th (click)="sortBy('renewalDate')" class="sortable">
                  Renewal Date
                  <i class="sort-icon" [class]="getSortIcon('renewalDate')"></i>
                </th>
                <th (click)="sortBy('cost')" class="sortable">
                  Cost
                  <i class="sort-icon" [class]="getSortIcon('cost')"></i>
                </th>
                <th>Status</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (contract of paginatedContracts(); track contract.contract) {
                <tr class="contract-row" [class]="'status-' + contract.renewalStatus.toLowerCase().replace(' ', '-')">
                  <td class="contract-id">
                    <strong>{{ contract.contract }}</strong>
                  </td>
                  <td class="vendor-name">
                    <div class="vendor-info">
                      <strong>{{ contract.vendor }}</strong>
                    </div>
                  </td>
                  <td class="contact-name">{{ contract.contact }}</td>
                  <td class="contact-email">
                    <a href="mailto:{{ contract.detail.email }}" class="email-link">
                      {{ contract.detail.email }}
                    </a>
                  </td>
                  <td class="internal-owner">{{ contract.internalOwner }}</td>
                  <td class="renewal-date" [class]="isExpiringSoon(contract.renewalDate) ? 'expiring' : ''">
                    {{ formatDate(contract.renewalDate) }}
                  </td>
                  <td class="contract-cost">
                    \${{ formatCurrency(contract.cost) }}
                  </td>
                  <td class="contract-status">
                    <span class="status-badge" [class]="'status-' + contract.renewalStatus.toLowerCase().replace(' ', '-')">
                      <i [class]="getStatusIcon(contract.renewalStatus)"></i>
                      {{ contract.renewalStatus }}
                    </span>
                  </td>
                  <td class="contract-comments">
                    <span class="comment-preview" [title]="contract.comments">
                      {{ contract.comments.length > 50 ? contract.comments.substring(0, 50) + '...' : contract.comments }}
                    </span>
                  </td>
                  <td class="contract-actions">
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-success" 
                        (click)="showEmailModal(contract)"
                        [disabled]="contract.renewalStatus === 'Completed' || contract.renewalStatus === 'Terminated'"
                      >
                        <i class="icon-check"></i>
                        Renew as is
                      </button>
                      <button 
                        class="btn btn-sm btn-warning" 
                        (click)="takeAction(contract, 'review')"
                        [disabled]="contract.renewalStatus === 'Completed' || contract.renewalStatus === 'Terminated'"
                      >
                        <i class="icon-review"></i>
                        Review
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        (click)="takeAction(contract, 'terminate')"
                        [disabled]="contract.renewalStatus === 'Terminated'"
                      >
                        <i class="icon-x"></i>
                        Terminate
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="10" class="empty-row">
                    <div class="empty-state">
                      <i class="icon-search"></i>
                      <h3>No contracts found</h3>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      @if (filteredContracts().length > itemsPerPage) {
        <div class="pagination">
          <button 
            class="btn btn-outline" 
            [disabled]="currentPage() === 1"
            (click)="previousPage()"
          >
            Previous
          </button>
          
          <div class="page-info">
            Page {{ currentPage() }} of {{ totalPages() }} 
            ({{ filteredContracts().length }} total contracts)
          </div>
          
          <button 
            class="btn btn-outline" 
            [disabled]="currentPage() === totalPages()"
            (click)="nextPage()"
          >
            Next
          </button>
        </div>
      }
    </div>

    <!-- Email Modal -->
    <app-email-modal 
      [contract]="selectedContractForEmail"
      [isVisible]="emailModalVisible"
      (close)="closeEmailModal()"
      (actionSelected)="handleEmailAction($event)"
    ></app-email-modal>
  `,
  styleUrls: ['./contracts-table.component.css']
})
export class ContractsTableComponent implements OnInit {
  private mockDataService = inject(MockDataService);

  contracts = signal<Contract[]>([]);
  filteredContracts = signal<Contract[]>([]);
  paginatedContracts = signal<Contract[]>([]);
  
  searchTerm = '';
  statusFilter = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  currentPage = signal(1);
  itemsPerPage = 10;
  totalPages = signal(1);
  
  // Email modal state
  emailModalVisible = signal(false);
  selectedContractForEmail = signal<Contract | null>(null);

  ngOnInit() {
    this.loadContracts();
  }

  private loadContracts() {
    this.mockDataService.getContracts().subscribe(contracts => {
      this.contracts.set(contracts);
      this.applyFilters();
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.contracts();

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(contract =>
        contract.vendor.toLowerCase().includes(term) ||
        contract.contract.toLowerCase().includes(term) ||
        contract.contact.toLowerCase().includes(term) ||
        contract.detail.email.toLowerCase().includes(term) ||
        contract.internalOwner.toLowerCase().includes(term) ||
        contract.comments.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(contract => contract.renewalStatus === this.statusFilter);
    }

    // Apply sorting
    if (this.sortColumn) {
      filtered = this.sortContracts(filtered, this.sortColumn, this.sortDirection);
    }

    this.filteredContracts.set(filtered);
    this.updatePagination();
  }

  private sortContracts(contracts: Contract[], column: string, direction: 'asc' | 'desc'): Contract[] {
    return [...contracts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (column) {
        case 'renewalDate':
          aValue = new Date(a.renewalDate);
          bValue = new Date(b.renewalDate);
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        default:
          aValue = (a as any)[column]?.toString().toLowerCase() || '';
          bValue = (b as any)[column]?.toString().toLowerCase() || '';
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'icon-sort';
    return this.sortDirection === 'asc' ? 'icon-sort-up' : 'icon-sort-down';
  }

  private updatePagination() {
    const total = this.filteredContracts().length;
    this.totalPages.set(Math.ceil(total / this.itemsPerPage));
    
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.paginatedContracts.set(this.filteredContracts().slice(startIndex, endIndex));
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.updatePagination();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  isExpiringSoon(dateString: string): boolean {
    const renewalDate = new Date(dateString);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return renewalDate <= threeMonthsFromNow;
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

  takeAction(contract: Contract, action: string) {
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
      this.loadContracts(); // Refresh data
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