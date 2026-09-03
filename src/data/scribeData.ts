// ── OPPORTUNITY SCRIBE TYPES ─────────────────────────────────────────────────

export interface MeddpiccField {
  key: string
  label: string
  current: string | null
  proposed: string
  source: string
  sourceDate: string
}

export interface ScribeContactRole {
  name: string
  email: string
  title: string
  proposedRole: string
  matchStatus: 'matched' | 'different_account' | 'not_found'
}

export interface ScribeNextStepEntry {
  initials: string
  date: string
  steps: string[]
}

export interface ScribeStageRec {
  currentStage: string
  proposedStage: string | null
  evidence: string[]
  regressionSignal?: string
}

export interface ScribeForecastRec {
  currentCategory: string
  proposedCategory: string
  reason: string
}

export interface ScribeCloseDateRec {
  currentDate: string
  proposedDate: string | null
  reason: string
  crossesQuarter: boolean
}

export interface ClosedLostPackage {
  reasonLost: string
  churnTheme: string
  lossNotes: string
  confidence: number
  evidence: string
}

export interface ScribePayload {
  callId: string
  callDate: string
  callDuration: string
  callSource: 'gong' | 'zoom' | 'manual' | 'email_sweep'
  participants: string[]
  accountName: string
  accountId: string
  opportunityName: string
  opportunityId: string
  matchConfidence: 'high' | 'medium' | 'low'
  meddpiccFields: MeddpiccField[]
  nextSteps: {
    proposed: ScribeNextStepEntry
    existingLog: ScribeNextStepEntry[]
  }
  contactRoles: ScribeContactRole[]
  stageRecommendation: ScribeStageRec
  forecastRecommendation: ScribeForecastRec
  closeDateRecommendation: ScribeCloseDateRec
  closedLostPackage?: ClosedLostPackage
}

// ── ACME CORP — POST-CALL UPDATE ─────────────────────────────────────────────

export const ACME_POST_CALL: ScribePayload = {
  callId: 'gong-28491',
  callDate: '2026-07-28',
  callDuration: '32 min',
  callSource: 'gong',
  participants: ['Jordan Park', 'Maya Singh', 'Alex Wong'],
  accountName: 'Acme Corporation',
  accountId: 'acme-corp',
  opportunityName: 'IAM Enterprise Expansion',
  opportunityId: 'deal-1',
  matchConfidence: 'high',
  meddpiccFields: [
    {
      key: 'metrics',
      label: 'Metrics',
      current: 'Reduce contract cycle time',
      proposed: 'Reduce contract cycle time from 9-12 days to <3 days. CFO cited $2.1M annual cost of procurement delays. Target: 40% reduction in manual processes by Q4.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'economic_buyer',
      label: 'Economic Buyer',
      current: 'Maya Singh, CFO',
      proposed: 'Maya Singh, CFO — confirmed budget authority. Approved $120K expansion ceiling pending 2-year term commitment. Wants ROI modeled against current support costs.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'decision_criteria',
      label: 'Decision Criteria',
      current: 'Price, SAP integration, security',
      proposed: 'Price (2-year lock-in discount required), SAP S/4HANA PO workflow integration (must demo), EU data residency for supplier contracts (Legal req from R. Ito), go-live before September product launch.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'decision_process',
      label: 'Decision Process',
      current: null,
      proposed: 'VP Ops (champion) recommends → CFO approves budget → Legal (R. Ito) reviews DPA → Procurement issues PO. Estimated 2-week cycle from proposal to PO.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'paper_process',
      label: 'Paper Process',
      current: null,
      proposed: 'Standard MSA + Order Form. Legal redlines expected within 5 business days. Procurement PO within 2 weeks of legal sign-off. No non-standard terms flagged.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'identified_pain',
      label: 'Identified Pain',
      current: 'Workflow bottlenecks',
      proposed: 'Manual contract routing causing 3-week procurement delays. 3 open support cases on workflow timeouts threatening September product launch. CFO estimates $2.1M annual cost of delays across 400+ vendor contracts.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'champion',
      label: 'Champion',
      current: 'Jordan Park, VP Operations',
      proposed: 'Jordan Park, VP Operations — actively sponsoring internally. Confirmed budget meeting with CFO scheduled this week. 3 calls in 30 days, high engagement. Pushing for September deployment.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
    {
      key: 'competition',
      label: 'Competition',
      current: 'Adobe Sign mentioned',
      proposed: 'Adobe Sign — procurement shortlisted. Jordan: "It is between you and Adobe." COO favors Adobe on price. Our advantage: existing SAP integration, current relationship, and enterprise security posture.',
      source: 'Gong — Jul 28 call',
      sourceDate: '2026-07-28',
    },
  ],
  nextSteps: {
    proposed: {
      initials: 'SM',
      date: 'Jul 28',
      steps: [
        'Send revised proposal with September timeline and 2-year pricing option',
        'Schedule SAP integration demo for IT team (Jordan to arrange attendees)',
        'Prepare EU data residency response for Legal (R. Ito)',
      ],
    },
    existingLog: [
      {
        initials: 'SM',
        date: 'Jul 15',
        steps: ['Reviewed Q3 pricing with CFO — she requested 2-year lock-in discount', 'Sent competitive comparison doc'],
      },
      {
        initials: 'SM',
        date: 'Jun 28',
        steps: ['Discovery call — Jordan outlined September launch deadline', 'Identified SAP integration as key requirement'],
      },
    ],
  },
  contactRoles: [
    { name: 'Jordan Park', email: 'j.park@acme.com', title: 'VP Operations', proposedRole: 'Champion', matchStatus: 'matched' },
    { name: 'Maya Singh', email: 'm.singh@acme.com', title: 'CFO', proposedRole: 'Economic Buyer', matchStatus: 'matched' },
    { name: 'Alex Wong', email: 'a.wong@acme.com', title: 'Sr. IT Architect', proposedRole: 'Technical Evaluator', matchStatus: 'not_found' },
  ],
  stageRecommendation: {
    currentStage: 'Negotiate',
    proposedStage: null,
    evidence: [
      'Pricing discussion active — CFO requested 2-year lock-in terms',
      'Legal review not yet initiated — Paper Process exit criteria not met',
      'Champion confirmed next step is proposal submission, not contract negotiation',
    ],
  },
  forecastRecommendation: {
    currentCategory: 'Best Case',
    proposedCategory: 'Best Case',
    reason: 'Default for Negotiate stage per playbook. Champion actively engaged, budget confirmed. No evidence to deviate.',
  },
  closeDateRecommendation: {
    currentDate: '2026-08-15',
    proposedDate: null,
    reason: 'Customer timeline aligns. Jordan confirmed September deployment requires contract by mid-August.',
    crossesQuarter: false,
  },
}

// ── VERTEX FINANCIAL — CLOSED LOST PACKAGE ───────────────────────────────────

export const VERTEX_CLOSED_LOST: ScribePayload = {
  callId: 'gong-29102',
  callDate: '2026-07-25',
  callDuration: '18 min',
  callSource: 'gong',
  participants: ['James Whitmore', 'Priya Mehta'],
  accountName: 'Vertex Financial Group',
  accountId: 'vertex-financial',
  opportunityName: 'eSign + CLM Bundle',
  opportunityId: 'deal-4',
  matchConfidence: 'high',
  meddpiccFields: [
    {
      key: 'identified_pain',
      label: 'Identified Pain',
      current: 'SEC compliance requirements',
      proposed: 'SEC compliance requirements remain, but Vertex determined Adobe Sign meets their minimum audit trail requirements at lower cost. Pain was real but not differentiated enough for premium pricing.',
      source: 'Gong — Jul 25 call',
      sourceDate: '2026-07-25',
    },
    {
      key: 'champion',
      label: 'Champion',
      current: 'Priya Mehta, VP Operations',
      proposed: 'Priya Mehta lost internal sponsorship. COO overrode her recommendation after 14 days of budget review. She was unable to build executive consensus for the premium tier.',
      source: 'Gong — Jul 25 call',
      sourceDate: '2026-07-25',
    },
    {
      key: 'competition',
      label: 'Competition',
      current: 'Adobe Sign in evaluation',
      proposed: 'Adobe Sign selected. COO Whitmore: "Adobe is 30% cheaper and does what we need for the SEC audit." Decision was price-driven — our SAP integration advantage was irrelevant (Vertex uses Salesforce, not SAP).',
      source: 'Gong — Jul 25 call',
      sourceDate: '2026-07-25',
    },
  ],
  nextSteps: {
    proposed: {
      initials: 'SM',
      date: 'Jul 25',
      steps: [
        'Send professional close-out email to Priya and James',
        'Log loss details and schedule 6-month re-engagement',
        'Flag for renewal watch — Vertex Adobe Sign contract likely 1-year term',
      ],
    },
    existingLog: [
      {
        initials: 'SM',
        date: 'Jul 10',
        steps: ['Sent competitive response to Adobe pricing', 'Requested exec sponsor call — declined by COO'],
      },
      {
        initials: 'SM',
        date: 'Jun 25',
        steps: ['Followed up on stalled evaluation', 'Left VM for Priya — no response'],
      },
    ],
  },
  contactRoles: [
    { name: 'James Whitmore', email: 'j.whitmore@vertexfin.com', title: 'COO', proposedRole: 'Economic Buyer', matchStatus: 'matched' },
    { name: 'Priya Mehta', email: 'p.mehta@vertexfin.com', title: 'VP Operations', proposedRole: 'Champion', matchStatus: 'matched' },
  ],
  stageRecommendation: {
    currentStage: 'Evaluate',
    proposedStage: 'Closed Lost',
    evidence: [
      'COO confirmed Adobe Sign selected in Jul 25 call',
      'Champion acknowledged internal decision is final',
      'Budget reallocated to Adobe Sign — no path to reversal this cycle',
    ],
  },
  forecastRecommendation: {
    currentCategory: 'Pipeline',
    proposedCategory: 'Omitted',
    reason: 'Deal moving to Closed Lost. Remove from active forecast.',
  },
  closeDateRecommendation: {
    currentDate: '2026-08-30',
    proposedDate: '2026-07-25',
    reason: 'Deal concluded. Closing on decision date.',
    crossesQuarter: false,
  },
  closedLostPackage: {
    reasonLost: 'Competitor Won — Price',
    churnTheme: 'Price / Competitive Loss',
    lossNotes: 'Adobe Sign selected by COO James Whitmore. Pricing was 30% lower than our proposal. Champion Priya Mehta supported Docusign but could not build executive consensus for the premium tier. Vertex does not use SAP, so our integration advantage was not relevant. SEC compliance was the original driver, but Adobe Sign met their minimum audit trail requirements. Recommended: 6-month re-engagement when Adobe Sign contract approaches renewal.',
    confidence: 92,
    evidence: 'Gong Jul 25 — COO: "We are going with Adobe. It is 30% cheaper and does what we need."',
  },
}
