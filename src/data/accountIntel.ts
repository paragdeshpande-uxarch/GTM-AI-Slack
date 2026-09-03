export interface ConvSignal {
  type: 'risk' | 'competitor' | 'pricing' | 'use_case' | 'objection'
  text: string
  source: string
  date: string
}

export interface IntentSignal {
  label: string
  strength: 'High' | 'Medium' | 'Low'
  source: string
  trend: 'rising' | 'stable' | 'falling'
}

export interface ProductPenetration {
  name: string
  pct: number
}

export interface CorporateEvent {
  date: string
  type: 'acquisition' | 'leadership' | 'funding' | 'contract' | 'expansion'
  title: string
  detail: string
}

export interface NewsItem {
  date: string
  sentiment: 'positive' | 'neutral' | 'negative'
  title: string
  source: string
}

export interface CrossSellTrigger {
  product: string
  signal: string
  confidence: 'High' | 'Medium' | 'Low'
}

export interface AccountIntel {
  companyDescription: string
  conversationSignals: ConvSignal[]
  useCases: string[]
  market: {
    ticker: string
    exchange: string
    price: number
    priceChangePct: number
    marketCap: string
    revenue: string
    revenueHistory: { year: string; value: number }[]
    grossMarginPct: number
    operatingIncomePct: number
    fiscalYearEnd: string
  } | null
  strategicInitiatives: string[]
  keyRisks: string[]
  intentSignals: IntentSignal[]
  productPenetration: ProductPenetration[]
  usageConsumption: {
    activeContracts?: number
    monthlyEnvelopes?: number
    adminFTEs?: number
    avgCycleDays?: string
    contractValueAtRisk?: string
  } | null
  corporateEvents: CorporateEvent[]
  recentNews: NewsItem[]
  crossSellTriggers: CrossSellTrigger[]
}

export const accountIntel: Record<string, AccountIntel> = {
  'acme-corp': {
    companyDescription: 'Acme Corporation is a San Francisco-based industrial manufacturer with $180M in annual revenue. They run SAP S/4HANA for ERP and rely on Docusign eSign Enterprise + CLM Standard for ~340 monthly contracts. A new CTO (ex-Adobe) is driving a digital transformation mandate including tightening contract workflows ahead of a September product launch.',
    conversationSignals: [
      { type: 'risk', text: 'Need this fixed before September or we will miss the launch window due to workflow timeouts.', source: 'Gong - Jun 28, 2026', date: '2026-06-28' },
      { type: 'competitor', text: 'Procurement mentioned they were "also talking to Adobe Sign" for the IAM shortlist.', source: 'Gong - Jun 14, 2026', date: '2026-06-14' },
      { type: 'pricing', text: 'CFO Maya Singh pushed back on the Enterprise tier price and asked for a 2-year lock-in discount.', source: 'Gong - Jun 07, 2026', date: '2026-06-07' },
      { type: 'use_case', text: 'IAM would let us automate PO approvals end-to-end with our SAP workflows. That is the big win.', source: 'Demo - May 22, 2026', date: '2026-05-22' },
      { type: 'objection', text: 'Legal (R. Ito) concerned about data residency in the EU for supplier contracts.', source: 'Meeting - May 10, 2026', date: '2026-05-10' },
    ],
    useCases: [
      'Automate supplier contract approvals tied to SAP S/4HANA PO milestones',
      'Digital audit trail for ISO 9001 compliance on manufacturing agreements',
      'CLM expansion: standardize NDA workflows across 400+ vendor relationships',
      'IAM Enterprise to eliminate 9-12 day manual contract cycle',
      'eSign for field service technician work-orders on mobile devices',
    ],
    market: {
      ticker: 'ACME', exchange: 'NYSE', price: 142.50, priceChangePct: 8.5,
      marketCap: '$2.1B', revenue: '$180M',
      revenueHistory: [{ year: 'FY24', value: 148 }, { year: 'FY25', value: 162 }, { year: 'FY26', value: 180 }],
      grossMarginPct: 38, operatingIncomePct: 11, fiscalYearEnd: 'Dec 31, 2026',
    },
    strategicInitiatives: [
      'Digital transformation mandate led by new CTO — reduce manual processes 40% by Q4',
      'September product launch requiring tightened supplier SLAs and contract traceability',
      'ERP modernization: SAP S/4HANA upgrade in H2 targeting workflow automation',
      'Supplier portal consolidation — 400+ vendors onto a single procurement platform',
    ],
    keyRisks: [
      'Ongoing workflow timeout support cases may delay September launch milestone',
      'Legal blocker (R. Ito) on EU data residency — may require Enterprise data center option',
      'Adobe Sign competitive evaluation still open — procurement has not been closed out',
      'CFO budget approval contingent on 2-year discount — may require VP sign-off',
    ],
    intentSignals: [
      { label: 'IAM Enterprise Expansion', strength: 'High', source: 'Gong + support cases', trend: 'rising' },
      { label: 'CLM Workflow Automation', strength: 'High', source: 'Demo + product usage', trend: 'rising' },
      { label: 'Docusign Payments', strength: 'Medium', source: 'Discovery call', trend: 'stable' },
      { label: 'SAP Contract Integration', strength: 'Medium', source: 'Use case discussion', trend: 'stable' },
    ],
    productPenetration: [
      { name: 'eSign Enterprise', pct: 72 },
      { name: 'CLM Standard', pct: 45 },
      { name: 'IAM (not yet)', pct: 0 },
    ],
    usageConsumption: {
      activeContracts: 340, monthlyEnvelopes: 340, adminFTEs: 2,
      avgCycleDays: '9-12 days', contractValueAtRisk: '$85M',
    },
    corporateEvents: [
      { date: '2026-07-03', type: 'leadership', title: 'New CTO hired — ex-Adobe VP Engineering', detail: 'Heavy Docusign enterprise user; expected to accelerate IAM evaluation timeline.' },
      { date: '2026-04-15', type: 'expansion', title: 'Q1 earnings: "digital transformation" mentioned 7 times', detail: 'CEO publicly committed to 40% reduction in manual processes by end of FY26.' },
      { date: '2026-01-20', type: 'contract', title: 'eSign Enterprise renewal — 2-year term', detail: 'Renewed at $120K/yr. CLM Standard added as expansion. Next renewal Feb 2027.' },
    ],
    recentNews: [
      { date: '2026-07-10', sentiment: 'positive', title: 'Acme Corp announces $85M supplier modernization program', source: 'Manufacturing Today' },
      { date: '2026-06-30', sentiment: 'positive', title: 'Q2 earnings beat: revenue $46M, up 12% YoY', source: 'Bloomberg' },
      { date: '2026-06-01', sentiment: 'neutral', title: 'Acme expands European supplier network to 120 vendors', source: 'PR Newswire' },
    ],
    crossSellTriggers: [
      { product: 'IAM Enterprise', signal: 'New CTO digital mandate + workflow timeout pain + Sep launch deadline', confidence: 'High' },
      { product: 'Docusign Payments', signal: 'PO milestone-triggered payment workflows align with SAP ERP roadmap', confidence: 'Medium' },
      { product: 'SAP Contract Integration', signal: 'End-to-end PO approvals use case discussed twice in demos', confidence: 'Medium' },
    ],
  },

  'novatech': {
    companyDescription: 'NovaTech Solutions is an Austin-based developer tools company ($45M ARR) fresh off a $30M Series C. They are scaling from 50 to 200+ engineers this quarter and their current contract workflow is entirely manual and email-based — a critical bottleneck as they onboard new hires and enterprise customers.',
    conversationSignals: [
      { type: 'use_case', text: 'Every new hire needs to sign 6 documents — right now ops handles it by email. Embarrassing at our scale.', source: 'Discovery - Jul 8, 2026', date: '2026-07-08' },
      { type: 'risk', text: '"We have two enterprise customers waiting on MSAs. The delay is us, not them."', source: 'Discovery - Jul 8, 2026', date: '2026-07-08' },
      { type: 'pricing', text: 'Tom asked whether there is a startup pricing tier — referenced Stripe developer-friendly pricing.', source: 'Gong - Jun 20, 2026', date: '2026-06-20' },
      { type: 'competitor', text: 'Lisa mentioned they "looked at Dropbox Sign for simplicity" but wanted full API access.', source: 'Gong - Jun 20, 2026', date: '2026-06-20' },
    ],
    useCases: [
      'Automate employee onboarding documents at scale (NDA, PIIA, offer letters)',
      'Enterprise customer MSA and SOW signing via API-embedded flow',
      'Vendor contract management as supplier base grows post-Series C',
      'Developer API for in-product signature flows on customer contracts',
    ],
    market: null,
    strategicInitiatives: [
      'Series C deployment: 50+ developer hires in Q3 2026',
      'Enterprise customer expansion — 3 Fortune 500 pilots in flight',
      'Platform API launch targeting developer-first contract automation',
    ],
    keyRisks: [
      'Fast-moving evaluation — Dropbox Sign demo already scheduled',
      'Price sensitivity: startup-stage despite recent funding',
      'Tom (champion) is technical but Lisa (economic buyer) has final sign-off',
    ],
    intentSignals: [
      { label: 'eSign API / Embedded Signing', strength: 'High', source: 'Discovery call', trend: 'rising' },
      { label: 'HR Document Automation', strength: 'High', source: 'Pain expressed directly', trend: 'rising' },
      { label: 'CLM Standard', strength: 'Medium', source: 'Vendor management use case', trend: 'stable' },
    ],
    productPenetration: [],
    usageConsumption: null,
    corporateEvents: [
      { date: '2026-07-01', type: 'funding', title: 'Series C closed — $30M', detail: 'Led by Andreessen Horowitz. Committed to 3x headcount growth by EOY.' },
      { date: '2026-05-15', type: 'expansion', title: 'First Fortune 500 enterprise pilot signed', detail: 'Proof point for MSA automation use case.' },
    ],
    recentNews: [
      { date: '2026-07-01', sentiment: 'positive', title: 'NovaTech raises $30M Series C to expand developer platform', source: 'TechCrunch' },
      { date: '2026-06-12', sentiment: 'positive', title: 'NovaTech named to 50 Startups to Watch', source: 'Forbes' },
    ],
    crossSellTriggers: [
      { product: 'eSign Developer API', signal: 'Tom API-first requirement + in-product contract signing use case', confidence: 'High' },
      { product: 'HR Document Automation', signal: '50+ hires this quarter, 6 docs per hire — clear ROI', confidence: 'High' },
      { product: 'CLM Standard', signal: 'Vendor contract management need emerging with Series C growth', confidence: 'Medium' },
    ],
  },

  'meridian-health': {
    companyDescription: 'Meridian Health Systems is a Nashville-based healthcare network ($420M revenue, 5,200 employees) running Epic for clinical systems. They are a current eSign Business customer facing a HIPAA audit deadline and board mandate for digital patient intake. The deal is at risk — champion Dr. Okafor has gone dark for 14 days.',
    conversationSignals: [
      { type: 'risk', text: '"Our HIPAA audit is in 90 days and we have zero digital audit trail on patient intake forms."', source: 'Meeting - Jun 15, 2026', date: '2026-06-15' },
      { type: 'use_case', text: '"Patients are still signing paper consent forms. The board wants this gone by Q4."', source: 'Meeting - Jun 15, 2026', date: '2026-06-15' },
      { type: 'competitor', text: 'IT Director mentioned they evaluated Veeva Vault for clinical documents.', source: 'Gong - May 30, 2026', date: '2026-05-30' },
      { type: 'objection', text: 'VP Compliance (R. Chen) flagged BAA requirements — needs formal Docusign HIPAA BAA before advancing.', source: 'Email - May 20, 2026', date: '2026-05-20' },
    ],
    useCases: [
      'Digital patient consent forms replacing paper-based intake',
      'HIPAA-compliant audit trail for all clinical document signings',
      'IAM Enterprise for cross-department policy document approvals',
      'Vendor and contractor agreement automation (240+ contracts/yr)',
    ],
    market: {
      ticker: 'MHSY', exchange: 'NASDAQ', price: 38.20, priceChangePct: -2.1,
      marketCap: '$890M', revenue: '$420M',
      revenueHistory: [{ year: 'FY24', value: 385 }, { year: 'FY25', value: 402 }, { year: 'FY26', value: 420 }],
      grossMarginPct: 24, operatingIncomePct: 6, fiscalYearEnd: 'Dec 31, 2026',
    },
    strategicInitiatives: [
      'HIPAA compliance remediation — 90-day audit deadline',
      'Board-mandated digital patient intake replacing paper forms',
      'Epic integration layer for clinical workflow automation',
      'Cost reduction target: $8M operational savings over 2 years',
    ],
    keyRisks: [
      'Champion (Dr. Okafor) unresponsive 14 days — deal may be stalling internally',
      'Formal HIPAA BAA required before procurement can advance',
      'Competitor contract expiring Q4 may recapture the evaluation',
      'Multi-threaded buy: CDO, VP Compliance, and IT Director must all align',
    ],
    intentSignals: [
      { label: 'HIPAA Audit Compliance', strength: 'High', source: 'Direct pain in meeting', trend: 'rising' },
      { label: 'IAM Enterprise', strength: 'High', source: 'Whitespace + board mandate', trend: 'stable' },
      { label: 'Patient Intake Digitization', strength: 'Medium', source: 'Board initiative', trend: 'stable' },
    ],
    productPenetration: [
      { name: 'eSign Business', pct: 38 },
      { name: 'IAM (not yet)', pct: 0 },
    ],
    usageConsumption: {
      activeContracts: 240, monthlyEnvelopes: 180, adminFTEs: 3,
      avgCycleDays: '14-18 days', contractValueAtRisk: '$42M',
    },
    corporateEvents: [
      { date: '2026-07-01', type: 'leadership', title: 'New Chief Compliance Officer appointed', detail: 'Focused on HIPAA and CMS regulatory remediation — potential new champion path.' },
      { date: '2026-03-10', type: 'expansion', title: 'Board approved $12M digital transformation budget', detail: 'Patient intake digitization is line item #2 in the approved budget.' },
    ],
    recentNews: [
      { date: '2026-07-05', sentiment: 'negative', title: 'Meridian Health flagged in HHS audit for paper-based consent gaps', source: 'Healthcare IT News' },
      { date: '2026-06-20', sentiment: 'positive', title: 'Meridian receives $5M CMS grant for patient digital experience program', source: 'Modern Healthcare' },
    ],
    crossSellTriggers: [
      { product: 'IAM Enterprise', signal: 'HIPAA compliance deadline + $200K whitespace + board digital mandate', confidence: 'High' },
      { product: 'eSign HIPAA BAA Package', signal: 'VP Compliance explicitly requested BAA documentation', confidence: 'High' },
      { product: 'Notary on Demand', signal: 'Clinical consent forms may require notarization in certain states', confidence: 'Low' },
    ],
  },

  'vertex-financial': {
    companyDescription: 'Vertex Financial Group is a Chicago-based financial services firm ($95M revenue, 890 employees) with a tightening SEC compliance timeline. The deal has stalled — no buyer engagement in 14+ days and the champion may have lost internal support. Competitive evaluation against Adobe Sign is still open.',
    conversationSignals: [
      { type: 'risk', text: '"SEC is auditing us in Q1 2027 — we need traceable digital signatures on all client agreements by then."', source: 'Gong - Jun 5, 2026', date: '2026-06-05' },
      { type: 'competitor', text: 'James Whitmore mentioned Adobe Sign was "cheaper and simpler for what we need."', source: 'Gong - May 28, 2026', date: '2026-05-28' },
      { type: 'objection', text: '"We already have Salesforce for tracking — why do we need another platform?"', source: 'Meeting - May 15, 2026', date: '2026-05-15' },
    ],
    useCases: [
      'SEC-compliant digital audit trail for all client investment agreements',
      'Salesforce-embedded signing for advisor-to-client contract flows',
      'Automated compliance document routing for regulatory submissions',
    ],
    market: {
      ticker: 'VFG', exchange: 'NYSE', price: 54.10, priceChangePct: -4.8,
      marketCap: '$340M', revenue: '$95M',
      revenueHistory: [{ year: 'FY24', value: 88 }, { year: 'FY25', value: 91 }, { year: 'FY26', value: 95 }],
      grossMarginPct: 52, operatingIncomePct: 18, fiscalYearEnd: 'Dec 31, 2026',
    },
    strategicInitiatives: [
      'SEC audit readiness by Q1 2027 — digital signature trail on all client documents',
      'Salesforce integration consolidation across advisor platforms',
    ],
    keyRisks: [
      'Champion (Priya Mehta) may have lost internal budget support — 14 days dark',
      'COO Whitmore leaning toward Adobe Sign on price',
      'Deal may need to be restarted via compliance officer as new champion',
    ],
    intentSignals: [
      { label: 'SEC Compliance Signing', strength: 'High', source: 'Direct requirement stated', trend: 'falling' },
      { label: 'Salesforce Integration', strength: 'Medium', source: 'Tech stack mention', trend: 'stable' },
    ],
    productPenetration: [],
    usageConsumption: null,
    corporateEvents: [
      { date: '2026-05-01', type: 'expansion', title: 'Vertex expands advisory services to Midwest mid-market', detail: 'More client agreements means higher signing volume going forward.' },
    ],
    recentNews: [
      { date: '2026-07-02', sentiment: 'negative', title: 'SEC tightens e-signature audit requirements for registered advisors', source: 'Wall Street Journal' },
      { date: '2026-06-15', sentiment: 'neutral', title: 'Vertex Financial opens 3rd regional office in Milwaukee', source: 'Chicago Tribune' },
    ],
    crossSellTriggers: [
      { product: 'eSign + Salesforce Integration', signal: 'Salesforce in tech stack + advisor contract use case', confidence: 'High' },
      { product: 'IAM Enterprise', signal: 'SEC audit compliance deadline driving urgency', confidence: 'Medium' },
    ],
  },

  'brightpath-edu': {
    companyDescription: 'BrightPath Education is a Boston-based EdTech company ($28M revenue, 320 employees) managing 400+ vendor contracts manually. A new CTO — hired from a Docusign customer — has flagged contract automation as a top-3 priority. Strong inbound signal with a clear champion path.',
    conversationSignals: [
      { type: 'use_case', text: '"I ran Docusign at my last company — this is exactly what we need. I want it deployed before fall semester."', source: 'Meeting - Jul 5, 2026', date: '2026-07-05' },
      { type: 'risk', text: '"We are renewing 80 vendor contracts in August — right now someone emails PDFs back and forth. Total chaos."', source: 'Meeting - Jul 5, 2026', date: '2026-07-05' },
      { type: 'pricing', text: 'David asked whether there is an education nonprofit pricing tier available.', source: 'Meeting - Jul 5, 2026', date: '2026-07-05' },
    ],
    useCases: [
      'Vendor contract renewals — 400+ agreements with automated approval routing',
      'Faculty and staff employment contracts via HR system integration',
      'Student enrollment agreements and financial aid document signing',
      'Board resolution and governance document workflows',
    ],
    market: null,
    strategicInitiatives: [
      'Operational efficiency mandate from board — target 30% admin cost reduction',
      'August vendor contract renewal cycle — CTO wants automation in place first',
      'Workday HR integration for faculty onboarding documents',
    ],
    keyRisks: [
      'Board approval required for any contract over $25K annually',
      'Education pricing request may require deal desk approval',
      'Single contact (David Park) — need to identify economic buyer before close',
    ],
    intentSignals: [
      { label: 'Vendor Contract Automation', strength: 'High', source: 'CTO stated directly', trend: 'rising' },
      { label: 'HR Document Signing', strength: 'High', source: 'Workday integration mention', trend: 'rising' },
      { label: 'CLM Standard', strength: 'Medium', source: 'Volume of contracts', trend: 'stable' },
    ],
    productPenetration: [],
    usageConsumption: null,
    corporateEvents: [
      { date: '2026-07-08', type: 'leadership', title: 'New CTO David Park hired — ex-Docusign customer', detail: 'Brings direct Docusign Enterprise experience; expected to accelerate evaluation.' },
      { date: '2026-04-01', type: 'expansion', title: 'BrightPath launches new campus — contract volume up 35%', detail: 'New campus adds ~120 new vendor and service agreements annually.' },
    ],
    recentNews: [
      { date: '2026-07-08', sentiment: 'positive', title: 'BrightPath Education named #3 fastest-growing EdTech in New England', source: 'Boston Globe' },
      { date: '2026-06-20', sentiment: 'positive', title: 'BrightPath secures $5M Title IV grant for underserved students', source: 'EdSurge' },
    ],
    crossSellTriggers: [
      { product: 'eSign Business + CLM Standard', signal: 'CTO direct champion + 400 vendor contracts + Aug deadline', confidence: 'High' },
      { product: 'Workday HR Integration', signal: 'Workday in tech stack + faculty onboarding use case', confidence: 'Medium' },
    ],
  },
}
