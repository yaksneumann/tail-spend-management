import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="about-section">
      <h2>About SmartTail</h2>
      <ul class="about-list">
        <li>Aviad Hay</li>
        <li>Marina Eppel</li>
        <li>Meir Ben Yeshaya</li>
        <li>Naama Efrat</li>
        <li>Tom Milbaum</li>
        <li>Noga Sharabani</li>
      </ul>
      <div class="about-meta">
        <p><strong>Developer:</strong> Yakov Neumann</p>
        <p><strong>Mentor:</strong> Eyal Nuhamovici</p>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      max-width: 420px;
      margin: 48px auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 2.5rem 2rem 2rem 2rem;
      text-align: center;
    }
    .about-section h2 {
      color: #005a9e;
      margin-bottom: 1.5rem;
      font-size: 2rem;
      font-weight: 700;
    }
    .about-list {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem 0;
    }
    .about-list li {
      font-size: 1.1rem;
      color: #222;
      margin-bottom: 0.5rem;
    }
    .about-meta p {
      margin: 0.5rem 0;
      color: #444;
      font-size: 1rem;
    }
  `]
})
export class AboutComponent {}
