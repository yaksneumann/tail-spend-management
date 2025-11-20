import { Component, signal, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vendor-popup-overlay">
      <div class="vendor-popup-container">
        <h2 class="vendor-popup-title">Contract Renewal Request</h2>
        <div class="vendor-popup-message">
          <p>Dear <strong>[XPE Contact Name]</strong>,</p>
          <p>Our collaboration has brought clear value to our operations, and we truly appreciate the positive working relationship we’ve built. We would like to inform you that the current service agreement is set to expire in approximately <strong>X months</strong>. We greatly appreciate the fruitful cooperation and hope to continue working together for the long term.</p>
          <p>Given the success of our partnership, we would like to renew the agreement without considering alternative options. However, as a returning customer, we would appreciate a gesture of goodwill in the form of a <strong>10% discount</strong>.</p>
          <p>If this request can be approved, please send us an updated price proposal. If not, we kindly ask you to provide the best possible offer you can extend. This proposal will be reviewed against the option of exploring other alternatives.</p>
          <p>We look forward to your response at the earliest convenience.</p>
          <br />
          <p><strong>Best regards,</strong></p>
          <p>[Your Full Name]<br />VP Procurement | Business Operations<br />[Contact Details]</p>
        </div>
        <div class="vendor-popup-actions">
          <button class="btn btn-success" (click)="accept()">Accept & Send Proposal</button>
          <button class="btn btn-outline" (click)="decline()">Decline</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vendor-popup-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.35);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .vendor-popup-container {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 1.5rem 0.75rem 1rem 0.75rem;
      max-width: 480px;
      width: 100%;
      text-align: left;
      position: relative;
      max-height: 95vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .vendor-popup-title {
      color: #005a9e;
      margin-bottom: 1.2rem;
      font-size: 1.2rem;
      font-weight: 700;
      text-align: center;
    }
    .vendor-popup-message p {
      margin-bottom: 1rem;
      color: #222;
      font-size: 1.02rem;
    }
    .vendor-popup-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.2rem;
      position: sticky;
      bottom: 0;
      background: linear-gradient(to top, #fff 90%, #fff0 100%);
      padding-bottom: 0.5rem;
      z-index: 2;
    }
    .btn {
      padding: 0.6rem 1.1rem;
      border-radius: 8px;
      font-size: 0.98rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-success {
      background: linear-gradient(135deg, #0078d4, #106ebe);
      color: #fff;
      border: none;
    }
    .btn-success:hover {
      background: linear-gradient(135deg, #106ebe, #005a9e);
    }
    .btn-outline {
      background: #fff;
      color: #005a9e;
      border: 2px solid #005a9e;
    }
    .btn-outline:hover {
      background: #e6f2fb;
    }
    @media (max-width: 600px) {
      .vendor-popup-container {
        padding: 0.7rem 0.2rem 0.5rem 0.2rem;
        max-width: 98vw;
      }
      .vendor-popup-title {
        font-size: 1rem;
      }
      .btn {
        font-size: 0.92rem;
        padding: 0.5rem 0.7rem;
      }
    }
  `]
})
export class VendorPopupComponent {
  @Output() closed = new EventEmitter<boolean>();
  private router = inject(Router);

  accept() {
    this.closed.emit(true);
    this.router.navigate(['/']);
  }

  decline() {
    this.closed.emit(false);
    this.router.navigate(['/']);
  }
}
