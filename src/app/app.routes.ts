import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { DashboardComponent } from './components/dashboard.component';
import { ContractsTableComponent } from './components/contracts-table.component';
import { VendorPopupComponent } from './vendor-popup.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'contracts', component: ContractsTableComponent },
  { path: 'about', component: AboutComponent },
  { path: 'vendor-ui', component: VendorPopupComponent },
];
