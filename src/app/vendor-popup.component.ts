import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    }
    .vendor-popup-container {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 2.5rem 2rem 2rem 2rem;
      max-width: 480px;
      width: 100%;
      text-align: left;
      position: relative;
    }
    .vendor-popup-title {
      color: #005a9e;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
    }
    .vendor-popup-message p {
      margin-bottom: 1rem;
      color: #222;
      font-size: 1.05rem;
    }
    .vendor-popup-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
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
  `]
})
export class VendorPopupComponent {
  @Output() closed = new EventEmitter<boolean>();

  accept() {
    this.closed.emit(true);
  }

  decline() {
    this.closed.emit(false);
  }
}
