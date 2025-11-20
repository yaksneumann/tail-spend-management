import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contract } from '../services/mock-data.service';

@Component({
  selector: 'app-email-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Contract Renewal Email Preview</h2>
            <button class="close-btn" (click)="closeModal()">
              <i class="icon-close"></i>
            </button>
          </div>
          
          <div class="email-container">
            <!-- Email Header Banner -->
            <div class="email-header">
              <div class="company-logo">
                <div class="logo-icon">📧</div>
                <div class="company-info">
                  <h3>SmartTail | PROCUREMENT</h3>
                </div>
              </div>
            </div>
            
            <!-- Alert Banner -->
            <div class="alert-banner">
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <h2>PAY ATTENTION!</h2>
                <p>YOUR CONTRACTOR'S CONTRACT IS ABOUT TO END SOON..</p>
              </div>
            </div>
            
            <!-- Email Content -->
            <div class="email-content">
              <div class="email-greeting">
                <p><strong>Dear {{ contract()?.internalOwner || 'Contract Owner' }},</strong></p>
              </div>
              
              <div class="email-body">
                <p>The Procurement Department would like to inform you that your contract/service is set to expire in approximately <strong>{{ calculateMonthsToExpire() }} months</strong>. To ensure uninterrupted service, please let us know your choice from the following options:</p>
                
                <div class="contract-details">
                  <div class="detail-row">
                    <span class="label">Contractor Name:</span>
                    <span class="value">{{ contract()?.vendor || 'N/A' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Contact Email:</span>
                    <span class="value">{{ contract()?.detail?.email || 'N/A' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Contract ID:</span>
                    <span class="value">{{ contract()?.contract || 'N/A' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Expiration Date:</span>
                    <span class="value">{{ formatDate(contract()?.renewalDate) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Contract Value:</span>
                    <span class="value">\${{ formatCurrency(contract()?.cost || 0) }}</span>
                  </div>
                </div>
                
                <p class="action-prompt"><strong>Please choose one of the following options – click on the relevant button for this contract:</strong></p>
              </div>
              
              <!-- Action Buttons -->
              <div class="action-buttons">
                <button class="action-btn terminate-btn" (click)="selectAction('terminate')">
                  <i class="btn-icon">🛑</i>
                  TERMINATE
                </button>
                <button class="action-btn prolong-btn" (click)="selectAction('prolong')">
                  <i class="btn-icon">🔄</i>
                  PROLONG
                </button>
                <button class="action-btn modify-btn" (click)="selectAction('modify')">
                  <i class="btn-icon">✏️</i>
                  MODIFY
                </button>
              </div>
              
              @if (selectedAction()) {
                <div class="action-feedback">
                  <div class="feedback-content" [class]="'feedback-' + selectedAction()">
                    <i [class]="getFeedbackIcon()"></i>
                    <p>You have selected to <strong>{{ selectedAction()?.toUpperCase() }}</strong> this contract.</p>
                    @if (selectedAction() === 'terminate') {
                      <p class="feedback-detail">The contract will be marked for termination and the vendor will be notified.</p>
                    } @else if (selectedAction() === 'prolong') {
                      <p class="feedback-detail">The contract will be renewed with the same terms and conditions.</p>
                    } @else if (selectedAction() === 'modify') {
                      <p class="feedback-detail">You will be contacted to discuss modifications to the contract terms.</p>
                    }
                  </div>
                </div>
              }
              
              <div class="email-footer">
                <p>We kindly ask for your response at your earliest convenience so we can plan accordingly.</p>
                <p>We are happy to provide you with excellent service and appreciate your cooperation.</p>
                
                <div class="signature">
                  <p><strong>Best regards,</strong></p>
                  <p><strong>Procurement Department</strong></p>
                  <p>Sarah Martinez</p>
                  <p>Senior Procurement Manager</p>
                  <p>📧 sarah.martinez@company.com</p>
                  <p>📞 +1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Close Preview</button>
            <button class="btn btn-primary" (click)="sendEmail()" [disabled]="!selectedAction()">
              <i class="icon-send"></i>
              {{ getButtonText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent {
  @Input() contract = signal<Contract | null>(null);
  @Input() isVisible = signal(false);
  @Output() close = new EventEmitter<void>();
  @Output() actionSelected = new EventEmitter<{contract: Contract, action: string}>();

  selectedAction = signal<string | null>(null);

  closeModal() {
    this.selectedAction.set(null);
    this.isVisible.set(false);
    this.close.emit();
  }

  selectAction(action: string) {
    this.selectedAction.set(action);
  }

  sendEmail() {
    const currentContract = this.contract();
    const action = this.selectedAction();
    
    if (currentContract && action) {
      this.actionSelected.emit({contract: currentContract, action});
      this.closeModal();
    }
  }

  calculateMonthsToExpire(): number {
    const contractData = this.contract();
    if (!contractData?.renewalDate) return 0;
    
    const renewalDate = new Date(contractData.renewalDate);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  getFeedbackIcon(): string {
    switch(this.selectedAction()) {
      case 'terminate': return 'icon-terminate';
      case 'prolong': return 'icon-renew';
      case 'modify': return 'icon-edit';
      default: return 'icon-check';
    }
  }

  getButtonText(): string {
    const action = this.selectedAction();
    if (action) {
      const actionText = action.charAt(0).toUpperCase() + action.slice(1);
      return `Send Email & ${actionText}`;
    }
    return 'Send Email';
  }
}