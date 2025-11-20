---
applyTo: "**/*.ts,**/*.html,**/*.scss"
description: Rules and requirements for developing a procurement frontend app in Angular 18+ with contract renewal features. Enforce data and UI standards, leverage modern Angular features, and use mock data for backend interactions.
---

# Procurement Frontend App – Copilot Rules

## Architecture & Framework

- All frontend code must use Angular version 18 or above, leveraging Angular 18+ features such as:
  - Zoneless change detection (remove dependency on zone.js)[web:4][web:8][web:9]
  - Signals API and reactive state management[web:6][web:8]
  - Standalone components and directives (no or minimal NgModules)
  - Optimized deferred views (`*ngDefer`) and server-side rendering improvements
  - Updated forms API with event streams
  - Enhanced compiler, type checking, CLI optimizations, and simplified routing[web:4][web:5][web:6][web:8][web:9]

- Organize the project around scalable, modular UI components:
  - `DashboardComponent` for notifications and contract summaries
  - `ContractsTableComponent` for detailed lists and actions
  - `VendorProfileComponent` for vendor information
  - `ContractModalComponent` for renewals and actions

## Mock Data Strategy

- Simulate all backend APIs with TypeScript-based mock data using Angular services.
- Use the following fields for all contract and vendor objects:
  - contract: Unique contract ID
  - vendor: Vendor company name (consistent spelling)
  - contact: Vendor contact person’s name
  - detail (email): Vendor representative’s email
  - internalOwner: Internal owner of the contract
  - renewalDate: Contract renewal or expiration date
  - cost: Value or recurring cost of the contract
  - renewalStatus: Status (e.g., Bot Pending, Completed, Manual Review)
  - comments: Text note or comments about the contract

### Example


export const MOCK_CONTRACTS = [
{
contract: 'CN2023118',
vendor: 'Acme Supplies',
contact: 'Jane Smith',
detail: { email: 'jane.smith@acmesupplies.com' },
internalOwner: 'E. Levi',
renewalDate: '2026-01-15',
cost: 12500,
renewalStatus: 'Bot Pending',
comments: 'Need to review SLA before renewal'
}
];


## UI/UX Guidelines

- Show a clear, actionable contract renewal notification at the top of the main dashboard, with strong colors and icons (see Playtika notification for inspiration).
- Use call-to-action buttons: “Terminate”, “Prolong”, and “Recruit”.
- Contracts table must include: vendor, contract ID, contact, detail/email, internal owner, renewal date, cost, renewal status, and comments.
- Enable modals or dialogs for reviewing contract details and performing renewal actions.
- Display a summary dashboard with metrics (total contracts, renewals, pending, auto-renew, etc).

## Workflow Logic

- List all contracts, highlighting those expiring or auto-renewing in the next 3 months.
- For expiring contracts, trigger renewal notifications and reminder modals with all relevant contract data.
- Allow users to take action (update, archive, email, etc) directly from the UI.
- Log all actions and status changes for traceability.

## Best Practices

- Use Typescript and Angular CLI standards.
- Apply proper accessibility (`aria-`) attributes and responsive design.
- Code should be clear, documented, and modular, leveraging Angular’s new features for maintainability and performance.

---

End of rules file.
