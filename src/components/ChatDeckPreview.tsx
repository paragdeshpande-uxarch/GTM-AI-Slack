import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { cn, formatPrice } from '../lib/utils'

export interface QuoteLineItem {
  name: string
  sku: string
  qty: number
  unitPrice: number
  discount: number
  includes: string[]
  reasoning: string
}

export interface QuotePayload {
  accountName: string
  lineItems: QuoteLineItem[]
}

interface DeckPreviewProps {
  payload: QuotePayload
  onClose: () => void
}

// ── Shared ───────────────────────────────────────────────────────

function DSLogo({ light = false }: { light?: boolean }) {
  return (
    <div className={cn('flex items-center gap-1.5', light ? 'text-white' : 'text-[#1B0A4E]')}>
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect width="24" height="24" rx="4" fill={light ? 'rgba(255,255,255,0.15)' : '#F0EBF8'} />
        <path d="M7 5h5.5A4.5 4.5 0 0 1 17 9.5v5A4.5 4.5 0 0 1 12.5 19H7V5Z" fill={light ? 'white' : '#5C35C2'} />
      </svg>
      <span className={cn('text-sm font-bold tracking-tight', light ? 'text-white' : 'text-[#1B0A4E]')}>docusign</span>
    </div>
  )
}

// ── Slide renderers ───────────────────────────────────────────────

function SlideTitle({ payload }: { payload: QuotePayload }) {
  const contractTotal = payload.lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discount / 100), 0)
  return (
    <div className="relative w-full h-full bg-[#1B0A4E] flex flex-col justify-between p-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#5C35C2]/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5C35C2]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
      <DSLogo light />
      <div className="relative z-10">
        <p className="text-[#A78BFA] text-xs font-semibold uppercase tracking-widest mb-3">Prepared for</p>
        <h1 className="text-white text-4xl font-bold mb-2 leading-tight">Docusign Solution Review</h1>
        <p className="text-[#C4B5FD] text-lg mt-2">{payload.accountName}</p>
      </div>
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <p className="text-[#C4B5FD] text-xs">Prepared July 28, 2026</p>
          <p className="text-white/60 text-xs mt-0.5">36 months contract · Confidential</p>
        </div>
        <div className="text-right">
          <p className="text-[#A78BFA] text-xs uppercase tracking-wider">Total Contract Value</p>
          <p className="text-white text-2xl font-bold">{formatPrice(contractTotal)}<span className="text-sm font-normal text-white/60">/yr</span></p>
        </div>
      </div>
    </div>
  )
}

function SlideCompanyOverview({ payload }: { payload: QuotePayload }) {
  const accountMeta: Record<string, { employees: string; revenue: string; industry: string; hq: string; existing: string[]; tech: string[]; renewal: string }> = {
    'Acme Corporation': { employees: '2,400', revenue: '$180M', industry: 'Manufacturing', hq: 'San Francisco, CA', existing: ['eSign Enterprise', 'CLM Standard'], tech: ['SAP S/4HANA', 'Oracle ERP', 'Microsoft Teams', 'SharePoint'], renewal: 'Feb 15, 2027' },
    'NovaTech Solutions': { employees: '180', revenue: '$45M', industry: 'Developer Tools', hq: 'Austin, TX', existing: [], tech: ['GitHub', 'AWS', 'Slack', 'Jira'], renewal: 'New logo' },
    'Meridian Health Systems': { employees: '5,200', revenue: '$420M', industry: 'Healthcare', hq: 'Nashville, TN', existing: ['eSign Business'], tech: ['Epic', 'Salesforce Health Cloud', 'Azure'], renewal: 'Sep 30, 2026' },
    'Vertex Financial Group': { employees: '890', revenue: '$95M', industry: 'Financial Services', hq: 'Chicago, IL', existing: [], tech: ['Bloomberg Terminal', 'Salesforce', 'Workday'], renewal: 'New logo' },
    'BrightPath Education': { employees: '320', revenue: '$28M', industry: 'Education Technology', hq: 'Boston, MA', existing: [], tech: ['Canvas LMS', 'Salesforce', 'Google Workspace'], renewal: 'New logo' },
  }
  const meta = accountMeta[payload.accountName] ?? accountMeta['Acme Corporation']
  const stats = [
    { label: 'Employees', value: meta.employees },
    { label: 'Revenue', value: meta.revenue },
    { label: 'Industry', value: meta.industry },
    { label: 'HQ', value: meta.hq },
  ]
  return (
    <div className="w-full h-full bg-white flex flex-col p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-[#5C35C2] uppercase tracking-widest mb-1">Company Overview</p>
          <h2 className="text-2xl font-bold text-gray-900">{payload.accountName}</h2>
        </div>
        <DSLogo />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#F8F5FF] rounded-xl p-4">
            <p className="text-[10px] font-bold text-[#5C35C2] uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-sm font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            {meta.existing.length > 0 ? 'Existing Docusign Products' : 'New Logo Opportunity'}
          </p>
          {meta.existing.length > 0 ? (
            <div className="space-y-2">
              {meta.existing.map(p => (
                <div key={p} className="flex items-center gap-2 p-3 bg-[#F8F5FF] rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5C35C2]" />
                  <span className="text-sm font-medium text-gray-800">{p}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-sm font-semibold text-emerald-800">No prior Docusign products</p>
              <p className="text-xs text-emerald-600 mt-1">Full expansion opportunity</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {meta.tech.map(t => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{t}</span>
            ))}
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Renewal / Timing</p>
            <p className="text-sm font-semibold text-amber-800">{meta.renewal}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideChallenges({ payload }: { payload: QuotePayload }) {
  const challengesByAccount: Record<string, Array<{ icon: string; title: string; detail: string }>> = {
    'Acme Corporation': [
      { icon: '⏱', title: 'Workflow Timeout Errors', detail: '3 open support cases this month. Agreement cycles averaging 14 days, causing delays ahead of September product launch.' },
      { icon: '📁', title: 'Manual Contract Management', detail: '400+ agreements managed across shared drives and email. No central repository or obligation tracking.' },
      { icon: '🔗', title: 'SAP Integration Gaps', detail: 'SAP S/4HANA is the system of record but not connected to signing workflows — every agreement requires manual hand-off.' },
    ],
    'NovaTech Solutions': [
      { icon: '📈', title: 'Scaling Contract Volume', detail: 'Growing from 50 to 200 developers requires automated signing. Current email-based process won\'t survive the volume.' },
      { icon: '🔧', title: 'Developer Workflow Friction', detail: 'Engineers waste cycles on manual contract processes. An API-first approach would eliminate the bottleneck.' },
      { icon: '⚖️', title: 'Vendor Contract Risk', detail: 'Series C growth requires tight vendor governance. No current system for contract lifecycle or obligation tracking.' },
    ],
    'Meridian Health Systems': [
      { icon: '🏥', title: 'HIPAA Audit Deadline', detail: 'Compliance audit in 90 days. Current eSign Business lacks the audit trail and BAA documentation required.' },
      { icon: '📋', title: 'Patient Intake Bottlenecks', detail: 'Board mandate for digital patient intake. Manual routing delays create care gaps and compliance risk.' },
      { icon: '🔄', title: 'Contract Expiry Risk', detail: 'Competitor contract expiring Q4. Epic and Azure integration gaps mean manual touchpoints at every step.' },
    ],
    'Vertex Financial Group': [
      { icon: '📊', title: 'SEC Audit Requirements', detail: 'SEC documentation requirements tightening Q1 2027. Current contract process can\'t generate required audit trails.' },
      { icon: '🔍', title: 'No Contract Visibility', detail: 'Vendor contracts spread across Bloomberg Terminal and email. No single source of truth for obligation tracking.' },
      { icon: '⚡', title: 'Competitive Evaluation', detail: 'Adobe Sign active in evaluation. Need to demonstrate compliance automation advantage before Q4 decision.' },
    ],
    'BrightPath Education': [
      { icon: '📑', title: '400+ Manual Vendor Contracts', detail: 'All vendor contracts managed via email and shared drives. No approval workflow, no tracking, no templates.' },
      { icon: '💡', title: 'New CTO Ready to Act', detail: 'New CTO from a Docusign customer. Has seen IAM in action and understands the operational ROI.' },
      { icon: '⏰', title: 'Board Efficiency Mandate', detail: 'Board pushing for operational efficiency. Contract automation is the highest-impact low-effort win.' },
    ],
  }
  const challenges = challengesByAccount[payload.accountName] ?? challengesByAccount['Acme Corporation']
  const gongQuotes: Record<string, string> = {
    'Acme Corporation': '"We need this fixed before September launch — that\'s non-negotiable." — Jordan Park, VP Operations',
    'NovaTech Solutions': '"If the API-first approach works the way Tom described, this is a no-brainer for us." — Lisa Chen, VP Engineering',
    'Meridian Health Systems': '"The HIPAA audit is in 90 days. We cannot go into that without a full audit trail." — Robert Chen, VP Compliance',
    'Vertex Financial Group': '"SEC documentation is keeping me up at night. We need a defensible contract process." — James Whitmore, COO',
    'BrightPath Education': '"I\'ve seen what Docusign can do. 400 manual contracts is not a strategy, it\'s a liability." — David Park, CTO',
  }
  return (
    <div className="w-full h-full bg-white flex flex-col p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-[#5C35C2] uppercase tracking-widest mb-1">Where We Heard Pain</p>
          <h2 className="text-2xl font-bold text-gray-900">Key Challenges</h2>
        </div>
        <DSLogo />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-5">
        {challenges.map((c, i) => (
          <div key={i} className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-3xl mb-3">{c.icon}</span>
            <p className="text-sm font-bold text-gray-900 mb-2">{c.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed flex-1">{c.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 p-4 bg-[#1B0A4E] rounded-xl">
        <p className="text-white text-xs font-medium leading-relaxed">
          <span className="text-[#A78BFA] font-bold">"{gongQuotes[payload.accountName] ?? gongQuotes['Acme Corporation']}"</span>
        </p>
      </div>
    </div>
  )
}

function SlidePlatform() {
  const capabilities = [
    { name: 'eSignature', desc: 'Industry-leading electronic signatures' },
    { name: 'IAM', desc: 'Intelligent agreement management' },
    { name: 'Navigator', desc: 'AI contract repository & search' },
    { name: 'Maestro', desc: 'No-code workflow automation' },
    { name: 'CLM', desc: 'Contract lifecycle management' },
    { name: 'Payments', desc: 'Embedded payment collection' },
  ]
  return (
    <div className="w-full h-full bg-[#1B0A4E] flex flex-col p-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5C35C2]/15 rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <p className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest mb-1">Solution Overview</p>
          <h2 className="text-2xl font-bold text-white">The Docusign Intelligent Agreement Platform</h2>
        </div>
        <DSLogo light />
      </div>
      <p className="text-[#C4B5FD] text-sm leading-relaxed mb-6 relative z-10 max-w-xl">
        One platform to create, commit, and manage agreements — connecting every step of the agreement lifecycle into a single, intelligent system.
      </p>
      <div className="grid grid-cols-3 gap-3 flex-1 relative z-10">
        {capabilities.map(c => (
          <div key={c.name} className="p-4 bg-white/8 border border-white/10 rounded-xl">
            <p className="text-white text-sm font-bold mb-1">{c.name}</p>
            <p className="text-white/50 text-xs">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideProduct({ item, accountName }: { item: QuoteLineItem; accountName: string }) {
  const netPrice = item.unitPrice * item.qty * (1 - item.discount / 100)
  const savings = item.unitPrice * item.qty * (item.discount / 100)
  const isSupport = item.sku.startsWith('DSI-0000758') || item.name.toLowerCase().includes('support')
  return (
    <div className="w-full h-full bg-white flex flex-col p-8 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block text-[10px] font-bold text-[#5C35C2] bg-[#F0EBF8] px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
            {isSupport ? 'Support & Services' : item.includes.length > 2 ? 'Core Product' : 'Add-on'}
          </span>
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.sku}</p>
        </div>
        <DSLogo />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Why this for {accountName}</p>
            <p className="text-xs text-gray-700 leading-relaxed bg-[#F8F5FF] rounded-xl p-3">{item.reasoning}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{item.qty > 1 ? 'Seats' : 'Unit'}</p>
              <p className="text-lg font-bold text-gray-900">{item.qty.toLocaleString()}</p>
            </div>
            {item.discount > 0 ? (
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Savings</p>
                <p className="text-base font-bold text-emerald-700">{formatPrice(savings)}</p>
                <p className="text-[10px] text-emerald-600">{item.discount}% off list</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Discount</p>
                <p className="text-base font-bold text-gray-500">List price</p>
              </div>
            )}
          </div>
          <div className="p-3 bg-[#1B0A4E] rounded-xl mt-auto">
            <p className="text-[10px] text-[#A78BFA] uppercase font-bold mb-0.5">Annual Net Price</p>
            <p className="text-xl font-bold text-white">{formatPrice(netPrice)}</p>
            <p className="text-white/40 text-[10px] mt-0.5">List: {formatPrice(item.unitPrice * item.qty)}{item.discount > 0 ? ` · ${item.discount}% off` : ''}</p>
          </div>
        </div>
        <div className="flex flex-col min-h-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">What's included</p>
          <div className="space-y-1.5">
            {item.includes.slice(0, 6).map((inc, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C35C2] flex-shrink-0" />
                <span className="text-xs text-gray-700">{inc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideROI({ payload }: { payload: QuotePayload }) {
  const contractTotal = payload.lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discount / 100), 0)
  const totalSavings = payload.lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (i.discount / 100), 0)
  const outcomesByAccount: Record<string, Array<{ icon: string; label: string; value: string; sub: string }>> = {
    'Acme Corporation': [
      { icon: '⚡', label: 'Agreement cycle time reduction', value: '11 days', sub: 'from 14 days to ~3 days' },
      { icon: '🔧', label: 'Support errors eliminated', value: '36+/yr', sub: '3+ cases/month resolved' },
      { icon: '👤', label: 'FTE equivalent time saved', value: '2.4', sub: 'through automation' },
    ],
    'NovaTech Solutions': [
      { icon: '🚀', label: 'Developer hours reclaimed', value: '400+/yr', sub: 'contract process automation' },
      { icon: '📋', label: 'Contracts automated', value: '100%', sub: 'vs. current manual rate' },
      { icon: '⏱', label: 'Time to sign', value: '-80%', sub: 'API vs. email-based signing' },
    ],
    'Meridian Health Systems': [
      { icon: '✅', label: 'HIPAA audit readiness', value: '45 days', sub: 'compliance deployment timeline' },
      { icon: '🏥', label: 'Patient intake workflows', value: '100%', sub: 'digitized vs. current manual' },
      { icon: '📄', label: 'Audit trail coverage', value: '100%', sub: 'vs. 0% today' },
    ],
    'Vertex Financial Group': [
      { icon: '🔒', label: 'SEC audit documentation', value: '100%', sub: 'automated trail coverage' },
      { icon: '📊', label: 'Contract visibility', value: 'Full', sub: 'vs. fragmented today' },
      { icon: '⏱', label: 'Compliance reporting time', value: '-70%', sub: 'automated vs. manual export' },
    ],
    'BrightPath Education': [
      { icon: '📑', label: 'Vendor contracts automated', value: '400+', sub: 'from manual to digital' },
      { icon: '⏰', label: 'Contract cycle time', value: '-85%', sub: 'same-day vs. 7-day avg' },
      { icon: '💡', label: 'Operational FTE savings', value: '1.5', sub: 'redirected from admin work' },
    ],
  }
  const outcomes = outcomesByAccount[payload.accountName] ?? outcomesByAccount['Acme Corporation']
  return (
    <div className="w-full h-full bg-white flex flex-col p-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-[#5C35C2] uppercase tracking-widest mb-1">Business Impact</p>
          <h2 className="text-2xl font-bold text-gray-900">Estimated ROI</h2>
        </div>
        <DSLogo />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-[#F8F5FF] rounded-xl border border-[#DDD6FE]">
            <p className="text-xs font-bold text-[#5C35C2] uppercase tracking-wider mb-3">Contract Summary</p>
            {payload.lineItems.map(item => {
              const net = item.unitPrice * item.qty * (1 - item.discount / 100)
              return (
                <div key={item.sku} className="flex items-center justify-between py-1.5 border-b border-[#DDD6FE]/50 last:border-0">
                  <span className="text-xs text-gray-700">{item.name} ({item.qty > 1 ? `${item.qty}×` : '1 unit'})</span>
                  <span className="text-xs font-bold text-gray-900">{formatPrice(net)}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#5C35C2]/20">
              <span className="text-xs font-bold text-gray-900">Total ACV</span>
              <span className="text-sm font-bold text-[#5C35C2]">{formatPrice(contractTotal)}</span>
            </div>
          </div>
          {totalSavings > 0 && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Discount Savings vs. List</p>
              <p className="text-2xl font-bold text-emerald-700">{formatPrice(totalSavings)}</p>
              <p className="text-xs text-emerald-600 mt-0.5">per year</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected Business Outcomes</p>
          {outcomes.map((m, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">{m.label}</p>
                <p className="text-base font-bold text-gray-900">{m.value}</p>
                <p className="text-[10px] text-gray-400">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideNextSteps({ payload }: { payload: QuotePayload }) {
  const stepsByAccount: Record<string, Array<{ n: string; title: string; detail: string; timing: string }>> = {
    'Acme Corporation': [
      { n: '01', title: 'Legal & Compliance Review', detail: 'Ryo Ito (General Counsel) reviews data residency docs + DPA', timing: 'This week' },
      { n: '02', title: 'Level 1 Approval', detail: 'Manager sign-off for 12% discount threshold', timing: 'By Aug 1' },
      { n: '03', title: 'Contract Execution', detail: 'Order form sent to Jordan Park for e-signature', timing: 'Aug 1–3' },
      { n: '04', title: 'Kickoff & Onboarding', detail: 'CSM kicks off deployment with Operations team first', timing: 'Aug 5' },
    ],
    'NovaTech Solutions': [
      { n: '01', title: 'Discovery Follow-up', detail: 'Share API sandbox access with Tom Nakamura', timing: 'This week' },
      { n: '02', title: 'Technical Evaluation', detail: 'API integration review with DevOps team', timing: 'Jul 15–21' },
      { n: '03', title: 'Economic Buyer Alignment', detail: 'Business case walkthrough with Lisa Chen (VP Eng)', timing: 'Jul 22' },
      { n: '04', title: 'Contract Execution', detail: 'Order form + SOW for Series C deployment', timing: 'Aug 1' },
    ],
    'Meridian Health Systems': [
      { n: '01', title: 'Multi-thread to Compliance', detail: 'Introduce Robert Chen (VP Compliance) to HIPAA capabilities', timing: 'Urgent' },
      { n: '02', title: 'HIPAA BAA Signing', detail: 'Execute Business Associate Agreement first', timing: 'This week' },
      { n: '03', title: 'Upgrade Execution', detail: 'eSign Business → IAM Enterprise upgrade order', timing: 'Jul 20' },
      { n: '04', title: 'Compliance Deployment', detail: 'Audit trail and patient intake workflow go-live', timing: 'Aug 1' },
    ],
    'Vertex Financial Group': [
      { n: '01', title: 'Re-engage Champion', detail: 'Direct outreach to Priya Mehta or multi-thread to COO', timing: 'Today' },
      { n: '02', title: 'Compliance Demo', detail: 'SEC audit trail and obligation tracking demonstration', timing: 'Jul 15' },
      { n: '03', title: 'Business Case', detail: 'ROI model for compliance cost avoidance', timing: 'Jul 20' },
      { n: '04', title: 'Contract Execution', detail: 'Close before Q4 SEC audit prep begins', timing: 'Aug 15' },
    ],
    'BrightPath Education': [
      { n: '01', title: 'CTO Alignment', detail: 'David Park deep-dive on automation for vendor contracts', timing: 'This week' },
      { n: '02', title: 'Pilot Proposal', detail: 'Start with 10 highest-volume vendor contracts as pilot', timing: 'Jul 15' },
      { n: '03', title: 'Board Presentation', detail: 'Efficiency ROI deck for board operational review', timing: 'Jul 22' },
      { n: '04', title: 'Contract Execution', detail: 'eSign Business + CLM Standard deployment', timing: 'Aug 1' },
    ],
  }
  const steps = stepsByAccount[payload.accountName] ?? stepsByAccount['Acme Corporation']
  return (
    <div className="w-full h-full bg-[#1B0A4E] flex flex-col p-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5C35C2]/20 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <p className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest mb-1">Your Path to Agreement</p>
          <h2 className="text-2xl font-bold text-white">Next Steps</h2>
        </div>
        <DSLogo light />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
        {steps.map(step => (
          <div key={step.n} className="p-4 bg-white/8 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#A78BFA] text-xs font-bold">{step.n}</span>
              <span className="text-white/40 text-[10px] ml-auto">{step.timing}</span>
            </div>
            <p className="text-white text-sm font-bold mb-1">{step.title}</p>
            <p className="text-white/50 text-xs leading-relaxed">{step.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between relative z-10">
        <p className="text-white/40 text-xs">Questions? Contact your Account Executive</p>
        <p className="text-[#A78BFA] text-xs font-medium">{payload.accountName} · Confidential</p>
      </div>
    </div>
  )
}

// ── Slide list builder ────────────────────────────────────────────

function buildSlides(payload: QuotePayload) {
  return [
    { id: 'title', label: 'Title', type: 'title' as const },
    { id: 'overview', label: `About ${payload.accountName.split(' ')[0]}`, type: 'overview' as const },
    { id: 'challenges', label: 'Challenges', type: 'challenges' as const },
    { id: 'platform', label: 'Solution', type: 'platform' as const },
    ...payload.lineItems.map(item => ({ id: item.sku, label: item.name, type: 'product' as const, item })),
    { id: 'roi', label: 'Business Impact', type: 'roi' as const },
    { id: 'nextsteps', label: 'Next Steps', type: 'nextsteps' as const },
  ]
}

// ── Main component ────────────────────────────────────────────────

export function ChatDeckPreview({ payload, onClose }: DeckPreviewProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const slides = buildSlides(payload)
  const total = slides.length

  function renderSlide(slide: ReturnType<typeof buildSlides>[number]) {
    switch (slide.type) {
      case 'title': return <SlideTitle payload={payload} />
      case 'overview': return <SlideCompanyOverview payload={payload} />
      case 'challenges': return <SlideChallenges payload={payload} />
      case 'platform': return <SlidePlatform />
      case 'product': return <SlideProduct item={(slide as { item: QuoteLineItem }).item} accountName={payload.accountName} />
      case 'roi': return <SlideROI payload={payload} />
      case 'nextsteps': return <SlideNextSteps payload={payload} />
      default: return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0F0728] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <DSLogo light />
          <span className="text-white/40 text-sm">|</span>
          <p className="text-white/70 text-sm">{payload.accountName} — Presentation Deck</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg px-3 py-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export PPTX
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Slide list */}
        <div className="w-44 bg-[#0F0728] border-r border-white/10 overflow-y-auto py-3 px-2 flex-shrink-0">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-2 mb-2">SLIDES</p>
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIdx(idx)}
              className={cn(
                'w-full text-left px-2 py-2 rounded-lg mb-1 transition-colors',
                idx === currentIdx ? 'bg-[#5C35C2]/40 border border-[#5C35C2]/60' : 'hover:bg-white/5 border border-transparent'
              )}
            >
              <p className={cn('text-[10px] font-medium truncate', idx === currentIdx ? 'text-white' : 'text-white/50 group-hover:text-white/80')}>
                {slide.label}
              </p>
              <p className="text-[9px] text-white/25 mt-0.5">{idx + 1} of {total}</p>
            </button>
          ))}
        </div>

        {/* Slide stage */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a0e35] p-8 min-h-0">
          <div className="rounded-xl overflow-hidden shadow-2xl" style={{ width: '800px', height: '450px', maxWidth: '100%' }}>
            {renderSlide(slides[currentIdx])}
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/50 text-sm">{currentIdx + 1} / {total}</span>
            <button
              onClick={() => setCurrentIdx(i => Math.min(total - 1, i + 1))}
              disabled={currentIdx === total - 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
