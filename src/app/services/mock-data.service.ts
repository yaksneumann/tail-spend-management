import { Injectable, signal } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Contract {
  contract: string;
  vendor: string;
  contact: string;
  detail: { email: string };
  internalOwner: string;
  renewalDate: string;
  cost: number;
  renewalStatus: 'Bot Pending' | 'Completed' | 'Manual Review' | 'Auto-Renew' | 'Expiring Soon' | 'Terminated';
  comments: string;
}

export interface DashboardStats {
  totalContracts: number;
  expiringContracts: number;
  pendingReviews: number;
  autoRenewals: number;
  totalValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private contractsSignal = signal<Contract[]>(MOCK_CONTRACTS);
  
  private contractsSubject = new BehaviorSubject<Contract[]>(MOCK_CONTRACTS);
  contracts$ = this.contractsSubject.asObservable();

  constructor() {}

  getContracts(): Observable<Contract[]> {
    return of(this.contractsSignal());
  }

  getDashboardStats(): Observable<DashboardStats> {
    const contracts = this.contractsSignal();
    const stats: DashboardStats = {
      totalContracts: contracts.length,
      expiringContracts: contracts.filter(c => 
        c.renewalStatus === 'Expiring Soon' || 
        new Date(c.renewalDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      ).length,
      pendingReviews: contracts.filter(c => c.renewalStatus === 'Manual Review' || c.renewalStatus === 'Bot Pending').length,
      autoRenewals: contracts.filter(c => c.renewalStatus === 'Auto-Renew').length,
      totalValue: contracts.reduce((sum, c) => sum + c.cost, 0)
    };
    return of(stats);
  }

  updateContractStatus(contractId: string, status: Contract['renewalStatus']): Observable<boolean> {
    const contracts = this.contractsSignal();
    const index = contracts.findIndex(c => c.contract === contractId);
    if (index !== -1) {
      const updatedContracts = [...contracts];
      updatedContracts[index] = { ...updatedContracts[index], renewalStatus: status };
      this.contractsSignal.set(updatedContracts);
      this.contractsSubject.next(updatedContracts);
      return of(true);
    }
    return of(false);
  }

  getExpiringContracts(): Observable<Contract[]> {
    const contracts = this.contractsSignal();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    const expiring = contracts.filter(contract => 
      new Date(contract.renewalDate) <= threeMonthsFromNow &&
      contract.renewalStatus !== 'Completed' &&
      contract.renewalStatus !== 'Terminated'
    );
    
    return of(expiring);
  }
}

export const MOCK_CONTRACTS: Contract[] = [
  {
    contract: 'CN2023118',
    vendor: 'Acme Supplies',
    contact: 'Jane Smith',
    detail: { email: 'jane.smith@acmesupplies.com' },
    internalOwner: 'E. Levi',
    renewalDate: '2025-01-15',
    cost: 12500,
    renewalStatus: 'Bot Pending',
    comments: 'Need to review SLA before renewal'
  },
  {
    contract: 'CN2023119',
    vendor: 'TechFlow Solutions',
    contact: 'Michael Chen',
    detail: { email: 'michael.chen@techflow.com' },
    internalOwner: 'A. Rodriguez',
    renewalDate: '2025-02-28',
    cost: 25000,
    renewalStatus: 'Manual Review',
    comments: 'Price negotiation required'
  },
  {
    contract: 'CN2023120',
    vendor: 'Global Office Supplies',
    contact: 'Sarah Johnson',
    detail: { email: 'sarah.j@globaloffice.com' },
    internalOwner: 'M. Thompson',
    renewalDate: '2025-03-10',
    cost: 8750,
    renewalStatus: 'Auto-Renew',
    comments: 'Standard renewal, no changes needed'
  },
  {
    contract: 'CN2023121',
    vendor: 'CloudTech Services',
    contact: 'David Park',
    detail: { email: 'david.park@cloudtech.io' },
    internalOwner: 'J. Williams',
    renewalDate: '2024-12-31',
    cost: 45000,
    renewalStatus: 'Expiring Soon',
    comments: 'Critical service - urgent renewal needed'
  },
  {
    contract: 'CN2023122',
    vendor: 'Marketing Plus',
    contact: 'Lisa Brown',
    detail: { email: 'lisa.brown@marketingplus.com' },
    internalOwner: 'K. Davis',
    renewalDate: '2025-01-30',
    cost: 18500,
    renewalStatus: 'Manual Review',
    comments: 'Review campaign performance metrics'
  },
  {
    contract: 'CN2023123',
    vendor: 'Security First Inc',
    contact: 'Robert Wilson',
    detail: { email: 'robert.wilson@securityfirst.com' },
    internalOwner: 'N. Garcia',
    renewalDate: '2025-04-15',
    cost: 32000,
    renewalStatus: 'Bot Pending',
    comments: 'Security audit required before renewal'
  },
  {
    contract: 'CN2023124',
    vendor: 'Logistics Express',
    contact: 'Emily Taylor',
    detail: { email: 'emily.taylor@logisticsexp.com' },
    internalOwner: 'P. Martinez',
    renewalDate: '2025-02-14',
    cost: 15750,
    renewalStatus: 'Completed',
    comments: 'Recently renewed for 2 years'
  },
  {
    contract: 'CN2023125',
    vendor: 'Data Analytics Pro',
    contact: 'James Anderson',
    detail: { email: 'james.anderson@dataanalytics.pro' },
    internalOwner: 'R. Lee',
    renewalDate: '2025-05-20',
    cost: 28000,
    renewalStatus: 'Auto-Renew',
    comments: 'Performance metrics exceeded targets'
  }
];