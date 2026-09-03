import { useState, useRef, useEffect } from 'react'
import { FileText, Play, CheckCircle, BarChart2, Calendar, Building2, TrendingUp, Mail, Lightbulb, ArrowRight, CheckCircle2, Clock, Copy, ChevronDown, ChevronUp, Home, MessageSquare, Bell, Plus, Hash, Bold, Italic, Underline, Strikethrough, Link, ListOrdered, List, Indent, Code, MoreHorizontal, Smile, Mic, ArrowUp, AlertCircle } from 'lucide-react'
import { cn, formatCurrency, formatDate, formatPrice } from '../lib/utils'
import { deals } from '../data/deals'
import { accounts } from '../data/accounts'
import { accountIntel } from '../data/accountIntel'
import { ACME_POST_CALL, VERTEX_CLOSED_LOST, type ScribePayload } from '../data/scribeData'
import { meetingPreps } from '../data/actions'
import type { MeetingPrep } from '../types'
import { ChatDeckPreview, type QuotePayload } from '../components/ChatDeckPreview'
import { OpportunityScribeCard } from '../components/OpportunityScribe'
import { MeetingPrepCard } from '../components/MeetingPrepCard'
import { BKCard, BKSection, BKDivider, BKContext, BKActions, BKButton, BKHeader, BKFields, BKTag } from '../components/bk'

// ── QUOTE DATA ─────────────────────────────────────────────────────────────────

const ACCOUNT_QUOTES: Record<string, QuotePayload> = {
  'acme-corp': {
    accountName: 'Acme Corporation',
    lineItems: [
      { name: 'IAM Enterprise', sku: 'DSI-0004568', qty: 200, unitPrice: 1320, discount: 12, includes: ['Standard Sends: Unlimited', 'Multi-Channel Delivery: Unlimited', 'Workflow Definitions: 1,900', 'Navigator Agreements: 190,000', 'Agreements Processed: 285,000'], reasoning: '200 seats = 8% penetration for 2,400-employee enterprise.' },
      { name: 'Navigator Add-on', sku: 'DSI-0007821', qty: 200, unitPrice: 180, discount: 12, includes: ['AI Contract Repository', 'Smart Search', 'Obligation Tracking', 'Third-Party Contract Import'], reasoning: 'AI-powered contract repository for 400+ existing agreements.' },
      { name: 'Platinum Support', sku: 'DSI-0000758', qty: 1, unitPrice: 6000, discount: 0, includes: ['Dedicated CSM', '1-hour Response SLA', '24/7 Phone Support', 'Quarterly Business Reviews'], reasoning: 'Platinum required for SLA commitments discussed with VP Ops.' },
    ],
  },
  'novatech': {
    accountName: 'NovaTech Solutions',
    lineItems: [
      { name: 'eSign Business API', sku: 'DSI-0002144', qty: 50, unitPrice: 480, discount: 8, includes: ['API Access', 'Developer Sandbox', 'Webhooks', '500 envelopes/month', 'CI/CD Integration'], reasoning: 'API-first approach for developer team scaling from 50 to 200 engineers.' },
      { name: 'Navigator Add-on', sku: 'DSI-0007821', qty: 50, unitPrice: 180, discount: 8, includes: ['AI Contract Repository', 'Smart Search', 'Obligation Tracking'], reasoning: 'Vendor contract governance as NovaTech scales.' },
    ],
  },
  'meridian-health': {
    accountName: 'Meridian Health Systems',
    lineItems: [
      { name: 'IAM Enterprise', sku: 'DSI-0004568', qty: 300, unitPrice: 1320, discount: 15, includes: ['HIPAA BAA Included', 'Standard Sends: Unlimited', 'SSO/SAML', 'Audit Trails', 'Workflow Runs: 285,000'], reasoning: 'HIPAA compliance upgrade from eSign Business. 300 seats for clinical + administrative staff.' },
      { name: 'Maestro Add-on', sku: 'DSI-0009210', qty: 50, unitPrice: 1620, discount: 10, includes: ['Visual Workflow Builder', 'Patient Intake Automation', 'Conditional Logic', 'EHR Integration'], reasoning: 'Digital patient intake workflow automation required for HIPAA audit compliance.' },
      { name: 'Platinum Support', sku: 'DSI-0000758', qty: 1, unitPrice: 6000, discount: 0, includes: ['Dedicated CSM', 'HIPAA Compliance Support', '24/7 Critical Response', 'Quarterly Reviews'], reasoning: 'Healthcare SLA and HIPAA compliance support required.' },
    ],
  },
  'vertex-financial': {
    accountName: 'Vertex Financial Group',
    lineItems: [
      { name: 'IAM Professional', sku: 'DSI-0003892', qty: 100, unitPrice: 660, discount: 10, includes: ['eSign + CLM', 'Audit Trails', 'SEC-compliant Reporting', 'Version Control'], reasoning: 'SEC audit requirements tightening Q1 2027.' },
      { name: 'Navigator Add-on', sku: 'DSI-0007821', qty: 100, unitPrice: 180, discount: 10, includes: ['AI Contract Repository', 'Obligation Tracking', 'Compliance Dashboard'], reasoning: 'Contract obligation tracking for SEC documentation.' },
    ],
  },
  'brightpath-edu': {
    accountName: 'BrightPath Education',
    lineItems: [
      { name: 'eSign Business', sku: 'DSI-0001022', qty: 50, unitPrice: 480, discount: 5, includes: ['eSignature', 'Template Library', 'Bulk Send', 'Audit Trail'], reasoning: '400+ vendor contracts managed manually. Entry-point product.' },
      { name: 'CLM Standard', sku: 'DSI-0006341', qty: 1, unitPrice: 15000, discount: 5, includes: ['Contract Drafting', 'Approval Workflows', 'Clause Library', 'Repository'], reasoning: 'Central contract management for vendor and partner agreements.' },
    ],
  },
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

type ResponseType = 'text' | 'pipeline' | 'account-intel' | 'priorities' | 'approval' | 'email-draft' | 'opportunity-scribe' | 'meeting-prep'

interface PriorityItem {
  urgency: 'high' | 'medium' | 'low'
  accountName: string
  dealName: string
  value: number
  reason: string
  cta: string
  ctaQuery: string
}

interface PipelineStats {
  totalDeals: number
  totalValue: number
  healthy: number
  caution: number
  stalled: number
  healthyPct: number
  cautionPct: number
  stalledPct: number
  topDeals: Array<{ id: string; accountName: string; value: number; stage: string; healthScore: number }>
}

interface AccountIntelPayload {
  accountName: string
  isExisting: boolean
  revenue: string
  employees: string
  industry: string
  hq: string
  deals: Array<{ name: string; stage: string; healthScore: number; value: number; nextStep?: string; riskFlags?: string[] }>
  totalDealValue: number
  signal?: string
  initiative?: string
  whyNow?: string
}

interface ApprovalPayload {
  accountName: string
  totalAmount: number
  approvalLevel: string
  approverName: string
  discountPct: number
}

interface EmailDraftPayload {
  accountName: string
  subject: string
  body: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  responseType?: ResponseType
  pipelineData?: PipelineStats
  prioritiesData?: PriorityItem[]
  accountIntelData?: AccountIntelPayload
  approvalData?: ApprovalPayload
  emailDraftData?: EmailDraftPayload
  quotePayload?: QuotePayload
  scribePayload?: ScribePayload
  meetingPrepData?: MeetingPrep
  suggestions?: string[]
}

// ── AI RESPONSE ENGINE ────────────────────────────────────────────────────────

function inferAccount(input: string, history: Message[]): typeof accounts[number] | null {
  const q = input.toLowerCase()
  const inCurrent = accounts.find(a => q.includes(a.name.toLowerCase()) || q.includes(a.id.replace(/-/g, ' ')))
  if (inCurrent) return inCurrent
  const recent = [...history].reverse()
  for (const msg of recent) {
    const text = (msg.content + ' ' + (msg.quotePayload?.accountName ?? '')).toLowerCase()
    const found = accounts.find(a => text.includes(a.name.toLowerCase()) || text.includes(a.id.replace(/-/g, ' ')))
    if (found) return found
  }
  return null
}

function getQuotePayload(input: string, history: Message[]): QuotePayload | null {
  const q = input.toLowerCase()
  if (!/quote|pricing|estimate|proposal|create a quote|build a quote|generate a quote|draft a quote/.test(q)) return null
  const account = inferAccount(input, history)
  const id = account?.id ?? 'acme-corp'
  return ACCOUNT_QUOTES[id] ?? ACCOUNT_QUOTES['acme-corp']
}

function getResponse(input: string, history: Message[]): string {
  const q = input.toLowerCase()
  const contextAccount = inferAccount(input, history)

  if (/submit.*approval|request.*approval|send.*approval|approval/i.test(q) && !/create|build|generate|draft/.test(q)) {
    const accountName = contextAccount?.name ?? 'this account'
    return `The quote for ${accountName} has been submitted and is now routed for L2 approval.\n\nApproval level: L2 — AVP\nReason: Discount threshold exceeded (≥10% on multi-product deal requires L2 sign-off per deal desk policy)\n\nYour manager, David Park, has been notified and will review within 4 business hours. You will receive a Slack notification once the decision is made.\n\nWhile you wait, I'd recommend sending the champion a heads-up that the quote is in internal review and you'll have a final number confirmed by end of day.`
  }

  if (/quote|pricing|estimate|proposal/.test(q) && /create|build|generate|draft|make/.test(q)) {
    const target = contextAccount ?? accounts[0]
    return `Here is a recommended quote for ${target.name} based on your opportunity data and account history. The configuration reflects their current usage patterns and the expansion potential we've discussed.`
  }

  const matchedAccountEarly = accounts.find(a => q.includes(a.name.toLowerCase()) || q.includes(a.id.replace(/-/g, ' ')))
  if (matchedAccountEarly) {
    const intel = accountIntel[matchedAccountEarly.id]
    const accountDeals = deals.filter(d => d.accountId === matchedAccountEarly.id)
    const totalDealValue = accountDeals.reduce((s, d) => s + d.value, 0)
    return `Here is what I know about ${matchedAccountEarly.name}:\n\n${intel?.companyDescription ?? 'No description available.'}\n\nCurrent relationship: ${matchedAccountEarly.isExisting ? 'Existing customer' : 'New logo opportunity'}. ${accountDeals.length > 0 ? `${accountDeals.length} active deal${accountDeals.length > 1 ? 's' : ''} totaling ${formatCurrency(totalDealValue)}.` : 'No active deals.'}\n\n${accountDeals.length > 0 ? `Latest deal — ${accountDeals[0].name}: currently in ${accountDeals[0].stage} stage, health score ${accountDeals[0].healthScore}. Next step: ${accountDeals[0].nextStep ?? 'not set'}.` : ''}\n\n${intel?.conversationSignals && intel.conversationSignals.length > 0 ? `Key signal from recent conversations: "${intel.conversationSignals[0].text}"` : ''}\n\n${intel?.strategicInitiatives && intel.strategicInitiatives.length > 0 ? `Top strategic initiative: ${intel.strategicInitiatives[0]}` : ''}\n\n${matchedAccountEarly.whyNow && matchedAccountEarly.whyNow.length > 0 ? `Why now: ${matchedAccountEarly.whyNow[0]}` : ''}`
  }

  if (/pipeline|deals|my health|forecast|quarter|stalled|caution|funnel/.test(q)) {
    const active = deals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won')
    const totalVal = active.reduce((s, d) => s + d.value, 0)
    const healthy = active.filter(d => d.healthScore >= 75)
    const caution = active.filter(d => d.healthScore >= 50 && d.healthScore < 75)
    const stalled = active.filter(d => d.healthScore < 50)
    const healthyPct = Math.round((healthy.length / active.length) * 100)
    const stalledPct = Math.round((stalled.length / active.length) * 100)
    const top3 = [...active].sort((a, b) => b.value - a.value).slice(0, 3)
    const atRisk = stalled.map(d => `${d.accountName} (${formatCurrency(d.value)}, ${d.stage})`).join(', ')
    return `Your pipeline has ${active.length} active deals worth ${formatCurrency(totalVal)}.\n\nHealth breakdown: ${healthyPct}% healthy (${healthy.length} deals), ${Math.round((caution.length / active.length) * 100)}% caution (${caution.length} deals), and ${stalledPct}% stalled (${stalled.length} deals).\n\nTop deals by value: ${top3.map(d => `${d.accountName} at ${formatCurrency(d.value)} (${d.stage})`).join('; ')}.\n\n${stalled.length > 0 ? `Deals needing immediate attention: ${atRisk}. I'd recommend reviewing these before end of week — a few of them have been stalled for over two weeks with no champion engagement.` : 'No deals are critically stalled right now — solid pipeline health across the board.'}`
  }

  if (/today|priorities|priority|focus|urgent|what should|morning|start|begin/.test(q)) {
    const atRisk = deals.filter(d => d.healthScore < 60 && d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    const closingSoon = deals.filter(d => {
      const close = new Date(d.closeDate)
      const now = new Date('2026-07-28')
      const diff = (close.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 14 && diff >= 0 && d.stage !== 'closed_won'
    })
    const stale = deals.filter(d => {
      const last = new Date(d.lastActivity)
      const now = new Date('2026-07-28')
      const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      return diff > 10 && d.stage !== 'closed_won' && d.stage !== 'closed_lost'
    })
    return `Good morning, Sarah. Here are your top priorities for today:\n\n${closingSoon.length > 0 ? `Closing within 14 days: ${closingSoon.map(d => `${d.accountName} (${formatCurrency(d.value)}, ${formatDate(d.closeDate)})`).join('; ')}. Make sure POs and contracts are moving.` : ''}\n\n${atRisk.length > 0 ? `At-risk deals that need your attention: ${atRisk.slice(0, 3).map(d => `${d.accountName} — ${d.riskFlags?.[0] ?? 'low health score'}`).join('; ')}.` : ''}\n\n${stale.length > 0 ? `${stale.length} deal${stale.length > 1 ? 's have' : ' has'} had no activity in over 10 days: ${stale.slice(0, 2).map(d => d.accountName).join(', ')}. Consider a touchpoint today.` : ''}\n\nI'd start with ${atRisk[0]?.accountName ?? closingSoon[0]?.accountName ?? 'your top at-risk deal'} — that one has the most urgency given the current engagement level.`
  }

  if (/quota|attainment|performance|tracking|metrics|target|goal|revenue/.test(q)) {
    const quota = 1200000
    const closedWon = deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + d.value, 0)
    const commitPipeline = deals.filter(d => d.stage === 'commit').reduce((s, d) => s + d.value, 0)
    const attainment = Math.round((closedWon / quota) * 100)
    const withCommit = Math.round(((closedWon + commitPipeline) / quota) * 100)
    return `Here is your performance snapshot for Q2 FY27:\n\nQuota: ${formatCurrency(quota)}\nClosed won: ${formatCurrency(closedWon)} (${attainment}% of quota)\nCommit pipeline: ${formatCurrency(commitPipeline)} — if this closes as expected, you reach ${withCommit}% attainment.\n\n${withCommit >= 100 ? 'You are on track to hit quota this quarter. The commit deals are in good shape — focus on protecting those rather than chasing new logos.' : `You need ${formatCurrency(quota - closedWon - commitPipeline)} more to close the gap. The most realistic path is accelerating your negotiate-stage deals and re-engaging the stalled evaluate deals.`}\n\nWin rate is trending at 67% based on recent closed opportunities.`
  }

  if (/draft|email|outreach|write|compose|send|message/.test(q)) {
    const target = contextAccount ?? accounts.find(a => a.id === 'novatech') ?? accounts[0]
    const intel = accountIntel[target.id]
    const deal = deals.find(d => d.accountId === target.id)
    return `Here is a draft outreach for ${target.name}:\n\nSubject: Following up — ${deal?.name ?? 'partnership opportunity'} with Docusign\n\nHi [Champion name],\n\nHope you are having a good week. I wanted to follow up on our recent conversations about ${intel?.useCases?.[0]?.toLowerCase() ?? 'streamlining your contract workflows'}.\n\n${intel?.companyDescription ? `Given ${target.name}'s focus on ${intel.companyDescription.split('.')[0].toLowerCase()}, ` : ''}I believe there is a clear opportunity to reduce friction in your agreement process — particularly around ${intel?.useCases?.[1]?.toLowerCase() ?? 'cross-team collaboration on contracts'}.\n\nA few customers in your space have seen ${deal?.stage === 'discover' || deal?.stage === 'evaluate' ? 'significant time savings in the first 60 days' : 'strong ROI within one quarter of deployment'}.\n\nWould you have 20 minutes this week to dig into the specifics? Happy to work around your schedule.\n\nBest,\nSarah Mitchell\nDocusign | Enterprise Sales\n\n---\nFeel free to adjust the tone or specifics — I can revise if you want to emphasize a different angle.`
  }

  const matchedDeal = deals.find(d => q.includes(d.accountName.toLowerCase()) || q.includes(d.name.toLowerCase()))
  if (matchedDeal) {
    return `Here is the latest on ${matchedDeal.name} (${matchedDeal.accountName}):\n\nStage: ${matchedDeal.stage} — ${matchedDeal.daysInStage} days in this stage\nValue: ${formatCurrency(matchedDeal.value)} at ${matchedDeal.probability}% probability\nHealth: ${matchedDeal.healthScore} / 100 (${matchedDeal.healthScore >= 75 ? 'Healthy' : matchedDeal.healthScore >= 50 ? 'Caution' : 'Stalled'})\nClose date: ${formatDate(matchedDeal.closeDate)}\n\n${matchedDeal.riskFlags && matchedDeal.riskFlags.length > 0 ? `Risk flags: ${matchedDeal.riskFlags.join('; ')}.` : 'No active risk flags.'}\n\n${matchedDeal.nextStep ? `Recommended next step: ${matchedDeal.nextStep}` : ''}`
  }

  if (/help|what can|what do|capabilities|how do/.test(q)) {
    return `I can help you with:\n\n• Pipeline health — overall status, health distribution, forecast by quarter\n• Today's priorities — what needs your attention right now\n• Account intel — signals, initiatives, deal status for any account\n• Deal status — stage, health, risk flags, next steps for any opportunity\n• Performance — quota attainment, win rate, pipeline coverage\n• Drafting outreach — personalized emails for any account\n• Creating quotes — configured pricing proposals with deck previews\n• Post-call MEDDPICC updates — review and approve field-level changes from Gong calls\n• Closed Lost reviews — structured loss package with reason, theme, and notes\n\nJust ask naturally — for example: "Show me the post-call review" or "Closed lost review for Vertex" or "Create a quote for Acme"`
  }

  if (/closed.?lost|loss.?review|mark.*(lost|dead)|deal.*(dead|lost)/i.test(q)) {
    return `Here is the Closed Lost review package for Vertex Financial Group. The deal was lost to Adobe Sign on price. Please review the stage change, reason, and loss notes as a single unit before I write to Salesforce.`
  }

  if (/scribe|post.?call|meddpicc|opportunity.?update|call.?review|gong.?review/i.test(q)) {
    return `Here is the post-call MEDDPICC update for Acme Corporation based on your latest Gong call. I have proposed updates across 8 MEDDPICC fields, next steps, and contact roles. Please review each field and approve or skip before I write to Salesforce.`
  }

  return `I am not sure I have enough context to answer that specifically. I can help with your pipeline health, account intel, deal status, today's priorities, performance tracking, drafting outreach, or creating quotes. What would you like to know?`
}

// ── FOLLOW-UP SUGGESTIONS ─────────────────────────────────────────────────────

function getSuggestions(input: string, quotePayload?: QuotePayload | null): string[] {
  const q = input.toLowerCase()
  if (quotePayload) return [`Preview the deck for ${quotePayload.accountName}`, `Submit for approval`, `Draft a follow-up email to champion`]
  const matchedAccount = accounts.find(a => q.includes(a.name.toLowerCase()) || q.includes(a.id.replace(/-/g, ' ')))
  if (matchedAccount) {
    const deal = deals.find(d => d.accountId === matchedAccount.id)
    return [`Create a quote for ${matchedAccount.name}`, deal ? `What are the risks on the ${deal.name} deal?` : `Do I have any deals with ${matchedAccount.name}?`, `Draft an outreach email for ${matchedAccount.name}`]
  }
  if (/draft|email|outreach|write|compose/.test(q)) {
    const account = accounts.find(a => q.includes(a.name.toLowerCase())) ?? accounts[0]
    return [`What's the latest signal from ${account.name}?`, `Create a quote for ${account.name}`, `What objections should I prepare for?`]
  }
  if (/pipeline|deals|my health|forecast|quarter|stalled|caution|funnel/.test(q)) {
    const stalledDeals = deals.filter(d => d.healthScore < 50 && d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    return [stalledDeals[0] ? `What's happening with ${stalledDeals[0].accountName}?` : `Which deals are closing this month?`, `How am I tracking against quota?`, `Show me today's priorities`]
  }
  if (/today|priorities|priority|focus|urgent|what should|morning|start|begin/.test(q)) {
    const atRisk = deals.filter(d => d.healthScore < 60 && d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    return [atRisk[0] ? `Create a quote for ${atRisk[0].accountName}` : `What's my pipeline health?`, atRisk[0] ? `Draft a follow-up email for ${atRisk[0].accountName}` : `Draft an email for NovaTech`, `How am I tracking against quota?`]
  }
  if (/quota|attainment|performance|tracking|metrics|target|goal|revenue/.test(q)) {
    return [`Which deals should I prioritize to close the gap?`, `Show me all commit-stage deals`, `What's my pipeline health?`]
  }
  const matchedDeal = deals.find(d => q.includes(d.accountName.toLowerCase()) || q.includes(d.name.toLowerCase()))
  if (matchedDeal) return [`Create a quote for ${matchedDeal.accountName}`, `Draft an outreach for ${matchedDeal.accountName}`, `Which other deals are at risk?`]
  return [`What's my pipeline health?`, `Show me today's priorities`, `Closed lost review for Vertex`]
}

function getScribeSuggestions(payload: ScribePayload): string[] {
  if (payload.closedLostPackage) {
    return [
      `Draft a close-out email for ${payload.accountName}`,
      `What's my pipeline health?`,
      `Show me today's priorities`,
    ]
  }
  return [
    `Create a quote for ${payload.accountName}`,
    `Draft a follow-up email for ${payload.accountName}`,
    `What's happening with ${payload.accountName}?`,
  ]
}

// ── STRUCTURED DATA COMPUTATION ───────────────────────────────────────────────

function computePipelineData(): PipelineStats {
  const active = deals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won')
  const totalValue = active.reduce((s, d) => s + d.value, 0)
  const healthy = active.filter(d => d.healthScore >= 75)
  const caution = active.filter(d => d.healthScore >= 50 && d.healthScore < 75)
  const stalled = active.filter(d => d.healthScore < 50)
  const topDeals = [...active].sort((a, b) => b.value - a.value).slice(0, 5)
  return {
    totalDeals: active.length,
    totalValue,
    healthy: healthy.length,
    caution: caution.length,
    stalled: stalled.length,
    healthyPct: Math.round((healthy.length / active.length) * 100),
    cautionPct: Math.round((caution.length / active.length) * 100),
    stalledPct: Math.round((stalled.length / active.length) * 100),
    topDeals: topDeals.map(d => ({ id: d.id, accountName: d.accountName, value: d.value, stage: d.stage, healthScore: d.healthScore })),
  }
}

function computePrioritiesData(): PriorityItem[] {
  const NOW = new Date('2026-07-28')
  const items: PriorityItem[] = []
  const seen = new Set<string>()

  for (const d of deals.filter(d => d.healthScore < 60 && d.stage !== 'closed_won' && d.stage !== 'closed_lost').slice(0, 4)) {
    if (seen.has(d.id)) continue
    seen.add(d.id)
    const daysToClose = (new Date(d.closeDate).getTime() - NOW.getTime()) / (1000 * 60 * 60 * 24)
    items.push({
      urgency: 'high',
      accountName: d.accountName,
      dealName: d.name,
      value: d.value,
      reason: d.riskFlags?.[0] ?? 'Low engagement score',
      cta: daysToClose <= 30 ? 'Create Quote' : 'Draft Email',
      ctaQuery: daysToClose <= 30 ? `Create a quote for ${d.accountName}` : `Draft an outreach for ${d.accountName}`,
    })
  }

  for (const d of deals.filter(d => {
    const diff = (new Date(d.closeDate).getTime() - NOW.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 14 && diff >= 0 && d.stage !== 'closed_won' && d.stage !== 'closed_lost'
  }).slice(0, 2)) {
    if (seen.has(d.id)) continue
    seen.add(d.id)
    items.push({
      urgency: 'medium',
      accountName: d.accountName,
      dealName: d.name,
      value: d.value,
      reason: `Closes ${formatDate(d.closeDate)} — confirm contracts are moving`,
      cta: 'Create Quote',
      ctaQuery: `Create a quote for ${d.accountName}`,
    })
  }

  for (const d of deals.filter(d => {
    const diff = (NOW.getTime() - new Date(d.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    return diff > 10 && d.stage !== 'closed_won' && d.stage !== 'closed_lost'
  }).slice(0, 2)) {
    if (seen.has(d.id)) continue
    seen.add(d.id)
    items.push({
      urgency: 'low',
      accountName: d.accountName,
      dealName: d.name,
      value: d.value,
      reason: 'No activity in 10+ days — time for a touchpoint',
      cta: 'Draft Email',
      ctaQuery: `Draft an outreach for ${d.accountName}`,
    })
  }

  return items.slice(0, 6)
}

function computeAccountIntelData(input: string, history: Message[]): AccountIntelPayload | null {
  const account = inferAccount(input, history)
  if (!account) return null
  const intel = accountIntel[account.id]
  const accountDeals = deals.filter(d => d.accountId === account.id)
  return {
    accountName: account.name,
    isExisting: account.isExisting ?? false,
    revenue: account.revenue ?? 'N/A',
    employees: account.employees ? account.employees.toLocaleString() : 'N/A',
    industry: account.industry ?? 'N/A',
    hq: account.hqCity && account.hqState ? `${account.hqCity}, ${account.hqState}` : 'N/A',
    deals: accountDeals.map(d => ({ name: d.name, stage: d.stage, healthScore: d.healthScore, value: d.value, nextStep: d.nextStep, riskFlags: d.riskFlags })),
    totalDealValue: accountDeals.reduce((s, d) => s + d.value, 0),
    signal: intel?.conversationSignals?.[0]?.text,
    initiative: intel?.strategicInitiatives?.[0],
    whyNow: account.whyNow?.[0],
  }
}

function computeApprovalData(history: Message[]): ApprovalPayload | null {
  const lastQuoteMsg = [...history].reverse().find(m => m.quotePayload)
  if (!lastQuoteMsg?.quotePayload) return null
  const lineItems = lastQuoteMsg.quotePayload.lineItems
  const totalAmount = lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discount / 100), 0)
  const maxDiscount = lineItems.length > 0 ? Math.max(...lineItems.map(i => i.discount)) : 0
  return {
    accountName: lastQuoteMsg.quotePayload.accountName,
    totalAmount,
    approvalLevel: 'L2',
    approverName: 'David Park',
    discountPct: maxDiscount,
  }
}

function computeEmailDraftData(input: string, history: Message[]): EmailDraftPayload {
  const target = inferAccount(input, history) ?? accounts.find(a => a.id === 'novatech') ?? accounts[0]
  const intel = accountIntel[target.id]
  const deal = deals.find(d => d.accountId === target.id)
  const subject = `Following up — ${deal?.name ?? 'partnership opportunity'} with Docusign`
  const industry = target.industry ? target.industry.toLowerCase() : 'your space'
  const body = `Hi [Champion name],

Hope you are having a good week. I wanted to follow up on our recent conversations about ${intel?.useCases?.[0]?.toLowerCase() ?? 'streamlining your contract workflows'}.

For companies in ${industry}, there is usually a clear opportunity to reduce friction in the agreement process — particularly around ${intel?.useCases?.[1]?.toLowerCase() ?? 'cross-team collaboration on contracts'}.

A few customers in your space have seen ${deal?.stage === 'discover' || deal?.stage === 'evaluate' ? 'significant time savings in the first 60 days' : 'strong ROI within one quarter of deployment'}.

Would you have 20 minutes this week to dig into the specifics? Happy to work around your schedule.

Best,
Sarah Mitchell
Docusign | Enterprise Sales`
  return { accountName: target.name, subject, body }
}

function detectResponseType(input: string, history: Message[]): ResponseType {
  const q = input.toLowerCase()
  if (/closed.?lost|loss.?review|mark.*(lost|dead)|deal.*(dead|lost)/i.test(q)) return 'opportunity-scribe'
  if (/scribe|post.?call|meddpicc|opportunity.?update|call.?review|gong.?review/i.test(q)) return 'opportunity-scribe'
  if (/meet(ing)?.?prep|prep.*call|before.*(my|the).*(call|meeting)|novatech.*prep|prep.*novatech/i.test(q)) return 'meeting-prep'
  if (/submit.*approval|request.*approval|send.*approval/i.test(q) && !/create|build|generate|draft/.test(q)) return 'approval'
  if (/draft|outreach|write.*email|compose.*email/.test(q)) return 'email-draft'
  if (accounts.find(a => q.includes(a.name.toLowerCase()) || q.includes(a.id.replace(/-/g, ' ')))) return 'account-intel'
  if (/pipeline|deals|my health|forecast|quarter|stalled|caution|funnel/.test(q)) return 'pipeline'
  if (/today|priorities|priority|focus|urgent|what should|morning|start|begin/.test(q)) return 'priorities'
  return 'text'
}

function computeMeetingPrepData(input: string): MeetingPrep | undefined {
  const q = input.toLowerCase()
  return meetingPreps.find(mp =>
    q.includes(mp.accountName.toLowerCase()) || q.includes(mp.accountId.replace(/-/g, ' '))
  ) ?? meetingPreps[0]
}

// ── INLINE LINK PARSER ────────────────────────────────────────────────────────

type Segment = { type: 'text'; content: string } | { type: 'link'; content: string; query: string }

function buildEntityList() {
  const entities: Array<{ name: string; query: string }> = []
  for (const a of accounts) {
    entities.push({ name: a.name, query: `What's happening with ${a.name}?` })
    for (const c of (a.contacts ?? [])) {
      entities.push({ name: c.name, query: `Tell me about ${c.name} at ${a.name}` })
    }
  }
  for (const d of deals) {
    entities.push({ name: d.name, query: `Tell me about the ${d.name} deal` })
  }
  entities.sort((a, b) => b.name.length - a.name.length)
  return entities
}

const ENTITIES = buildEntityList()

function parseLinks(text: string): Segment[] {
  if (!ENTITIES.length) return [{ type: 'text', content: text }]
  const escaped = ENTITIES.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const segments: Segment[] = []
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) segments.push({ type: 'text', content: text.slice(last, match.index) })
    const entity = ENTITIES.find(e => e.name.toLowerCase() === match![0].toLowerCase())
    segments.push({ type: 'link', content: match[0], query: entity?.query ?? `What's happening with ${match[0]}?` })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ type: 'text', content: text.slice(last) })
  return segments
}

function RichText({ content, onLinkClick }: { content: string; onLinkClick: (q: string) => void }) {
  const segments = parseLinks(content)
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'link'
          ? <button key={i} onClick={() => onLinkClick(seg.query)} className="text-bk-link underline underline-offset-2 font-medium hover:opacity-75 transition-opacity font-lato">{seg.content}</button>
          : <span key={i}>{seg.content}</span>
      )}
    </>
  )
}

// ── QUOTE CONTENT (inline, no outer card) ─────────────────────────────────────

function QuoteContent({ payload, onPreview, onApprove }: { payload: QuotePayload; onPreview: () => void; onApprove: () => void }) {
  const contractTotal = payload.lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discount / 100), 0)
  const totalSavings = payload.lineItems.reduce((s, i) => s + i.qty * i.unitPrice * (i.discount / 100), 0)
  return (
    <>
      <BKDivider />
      <BKHeader
        icon={<FileText className="w-4 h-4 text-bk-primary" />}
        title={`Quote · ${payload.accountName}`}
        meta="AI-configured · 36-month contract"
      />
      <div className="grid grid-cols-[1fr_44px_80px_44px_80px] gap-x-3 px-7 pt-3 pb-1.5">
        {['Product', 'Qty', 'Unit Price', 'Disc', 'Net'].map((h, i) => (
          <span key={h} className={cn('text-[11px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato', i > 0 ? 'text-right' : '')}>
            {h}
          </span>
        ))}
      </div>
      <BKDivider />
      <div className="divide-y divide-bk-low-contrast">
        {payload.lineItems.map((item) => {
          const net = item.qty * item.unitPrice * (1 - item.discount / 100)
          return (
            <div key={item.sku} className="grid grid-cols-[1fr_44px_80px_44px_80px] gap-x-3 px-7 py-2.5 items-center">
              <div>
                <p className="text-bk-body font-bold text-bk-black font-lato leading-tight">{item.name}</p>
                <p className="text-bk-caption text-bk-dark-gray font-mono">{item.sku}</p>
              </div>
              <span className="text-bk-body text-bk-dark-gray text-right font-lato">{item.qty}</span>
              <span className="text-bk-body text-bk-dark-gray text-right font-lato">{formatPrice(item.unitPrice)}</span>
              <div className="flex justify-end">
                {item.discount > 0 ? (
                  <BKTag color={item.discount >= 15 ? 'red' : item.discount >= 10 ? 'amber' : 'green'}>{item.discount}%</BKTag>
                ) : (
                  <span className="text-bk-caption text-bk-low-contrast">—</span>
                )}
              </div>
              <span className="text-bk-body font-bold text-bk-black text-right font-lato">{formatPrice(net)}</span>
            </div>
          )
        })}
      </div>
      <BKDivider />
      <div className="px-7 py-3 bg-bk-surface space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-bk-body font-bold text-bk-black font-lato">Contract Total</span>
          <span className="text-[18px] font-bold text-bk-primary font-lato leading-none">{formatPrice(contractTotal)}<span className="text-bk-caption font-normal text-bk-dark-gray">/yr</span></span>
        </div>
        {totalSavings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-bk-caption text-bk-dark-gray font-lato">Discount savings</span>
            <span className="text-bk-caption font-bold text-bk-primary font-lato">{formatPrice(totalSavings)}/yr vs. list</span>
          </div>
        )}
      </div>
      <BKDivider />
      <BKActions>
        <BKButton variant="primary" onClick={onPreview}>
          <Play className="w-3 h-3 mr-1.5" fill="currentColor" /> Preview Deck
        </BKButton>
        <BKButton variant="outline" onClick={onApprove}>
          <CheckCircle className="w-3 h-3 mr-1.5" /> Request Approval
        </BKButton>
      </BKActions>
    </>
  )
}

// ── PRIORITIES CONTENT — Block Kit TODO list pattern ─────────────────────────

function OverflowIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="4"  r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="16" r="1.5" />
    </svg>
  )
}

function BKCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="flex-shrink-0 cursor-pointer select-none" onClick={onChange}>
      <div className={cn(
        'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
        checked
          ? 'bg-bk-primary border-bk-primary'
          : 'border-bk-dark-gray/40 hover:border-bk-primary bg-white'
      )}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </label>
  )
}

function PrioritiesContent({ items, onAction }: { items: PriorityItem[]; onAction: (q: string) => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = (i: number) => setChecked(prev => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i); else next.add(i)
    return next
  })

  // Group items: Today = high + medium; This Week = low
  const todayItems    = items.map((it, i) => ({ it, i })).filter(({ it }) => it.urgency === 'high' || it.urgency === 'medium')
  const thisWeekItems = items.map((it, i) => ({ it, i })).filter(({ it }) => it.urgency === 'low')

  const groups = [
    { label: 'Today',     entries: todayItems },
    { label: 'This Week', entries: thisWeekItems },
  ].filter(g => g.entries.length > 0)

  return (
    <>
      {/* Header row: title + Create New List / Help buttons */}
      <div className="flex items-center justify-between px-7 py-3 border-b border-bk-low-contrast">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-bk bg-bk-surface flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-bk-primary" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-bk-black font-lato">Today's Priorities</p>
            <p className="text-bk-caption text-bk-dark-gray font-lato">
              {items.filter((_, i) => !checked.has(i)).length} open · {checked.size} done
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BKButton variant="primary" size="sm">+ New List</BKButton>
          <BKButton variant="outline" size="sm">Help</BKButton>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && <BKDivider />}

          {/* Group header with overflow menu */}
          <div className="flex items-center justify-between px-7 pt-3 pb-2">
            <span className="text-bk-body font-bold text-bk-black font-lato">{group.label}</span>
            <button className="w-6 h-6 flex items-center justify-center text-bk-dark-gray hover:text-bk-black transition-colors rounded hover:bg-bk-surface">
              <OverflowIcon />
            </button>
          </div>

          {/* Checkbox items */}
          <div className="px-7 space-y-0.5 pb-2">
            {group.entries.map(({ it, i }) => {
              const done = checked.has(i)
              return (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <BKCheckbox checked={done} onChange={() => toggle(i)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-bk-body font-bold font-lato leading-tight transition-colors',
                      done ? 'line-through text-bk-dark-gray' : 'text-bk-black'
                    )}>
                      {it.accountName}
                    </p>
                    {!done && (
                      <p className="text-bk-caption text-bk-dark-gray font-lato leading-tight mt-0.5 line-clamp-1">
                        {it.reason}
                      </p>
                    )}
                  </div>
                  <span className="text-bk-caption font-bold text-bk-dark-gray font-lato flex-shrink-0 hidden sm:block">
                    {formatCurrency(it.value)}
                  </span>
                  {!done && (
                    <BKButton variant="outline" size="sm" onClick={() => onAction(it.ctaQuery)} className="flex-shrink-0">
                      {it.cta}
                    </BKButton>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add item row */}
          <div className="px-7 pb-3">
            <BKButton variant="primary" size="sm">+ Add Item</BKButton>
          </div>
        </div>
      ))}
    </>
  )
}

// ── PIPELINE CONTENT ──────────────────────────────────────────────────────────

function PipelineContent({ data, onAction }: { data: PipelineStats; onAction: (q: string) => void }) {
  const stats = [
    { label: 'Healthy', count: data.healthy, pct: data.healthyPct, dot: 'bg-bk-primary' },
    { label: 'Caution', count: data.caution, pct: data.cautionPct, dot: 'bg-amber-400' },
    { label: 'Stalled', count: data.stalled, pct: data.stalledPct, dot: 'bg-bk-danger' },
  ]
  return (
    <>
      <BKHeader
        icon={<BarChart2 className="w-4 h-4 text-bk-primary" />}
        title="Pipeline Health"
        meta={`${data.totalDeals} active deals · ${formatCurrency(data.totalValue)}`}
      />
      {/* Health distribution */}
      <div className="grid grid-cols-3 divide-x divide-bk-low-contrast border-b border-bk-low-contrast">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col items-center py-4 gap-1">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', s.dot)} />
              <span className="text-[10px] font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-[26px] font-black text-bk-black font-lato leading-none">{s.count}</p>
            <p className="text-bk-caption text-bk-dark-gray font-lato">{s.pct}%</p>
          </div>
        ))}
      </div>
      {/* Top deals — horizontally scrollable */}
      <div className="overflow-x-auto py-3">
        <p className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wide font-lato mb-2.5 px-7">Top deals by value</p>
        <div className="flex gap-2.5 px-7" style={{ width: 'max-content' }}>
          {data.topDeals.map(deal => (
            <button
              key={deal.id}
              onClick={() => onAction(`What's happening with ${deal.accountName}?`)}
              className="w-44 flex-shrink-0 bg-bk-surface border border-bk-low-contrast rounded-bk p-3 text-left hover:border-bk-dark-gray transition-colors"
            >
              <p className="text-bk-caption font-bold text-bk-black font-lato truncate">{deal.accountName}</p>
              <p className="text-[20px] font-black text-bk-black font-lato leading-tight mt-1.5">{formatCurrency(deal.value)}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-bk-dark-gray font-lato capitalize">{deal.stage}</span>
                <span className={cn('text-[11px] font-bold font-lato',
                  deal.healthScore >= 75 ? 'text-bk-primary' :
                  deal.healthScore >= 50 ? 'text-amber-600' : 'text-bk-danger'
                )}>{deal.healthScore}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ── ACCOUNT INTEL CONTENT ─────────────────────────────────────────────────────

function AccountIntelContent({ data, onAction }: { data: AccountIntelPayload; onAction: (q: string) => void }) {
  const topDeal = data.deals[0]
  return (
    <>
      <BKHeader
        icon={<Building2 className="w-4 h-4 text-bk-primary" />}
        title={data.accountName}
        meta={data.isExisting ? 'Existing customer' : 'New logo opportunity'}
      />
      <BKFields rows={[
        { label: 'Revenue', value: data.revenue },
        { label: 'Employees', value: data.employees },
        { label: 'Industry', value: data.industry },
        { label: 'HQ', value: data.hq },
      ]} />
      {topDeal && (
        <>
          <BKDivider />
          <BKSection>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-bk-body font-bold text-bk-black font-lato leading-tight">{topDeal.name}</p>
                <p className="text-bk-caption text-bk-dark-gray font-lato capitalize mt-0.5">{topDeal.stage} · {formatCurrency(topDeal.value)}</p>
                {topDeal.nextStep && (
                  <p className="text-bk-caption text-bk-dark-gray font-lato mt-2 italic">Next: {topDeal.nextStep}</p>
                )}
              </div>
              <BKTag color={topDeal.healthScore >= 75 ? 'green' : topDeal.healthScore >= 50 ? 'amber' : 'red'}>
                Score {topDeal.healthScore}
              </BKTag>
            </div>
          </BKSection>
        </>
      )}
      {(data.signal || data.initiative || data.whyNow) && (
        <>
          <BKDivider />
          {data.signal && <BKContext>💬 "{data.signal}"</BKContext>}
          {data.initiative && <BKContext>🎯 {data.initiative}</BKContext>}
          {data.whyNow && <BKContext>⚡ {data.whyNow}</BKContext>}
        </>
      )}
      <BKDivider />
      <BKActions>
        <BKButton variant="primary" onClick={() => onAction(`Create a quote for ${data.accountName}`)}>
          Create Quote
        </BKButton>
        <BKButton variant="outline" onClick={() => onAction(`Draft an outreach for ${data.accountName}`)}>
          Draft Email
        </BKButton>
      </BKActions>
    </>
  )
}

// ── APPROVAL CONTENT ──────────────────────────────────────────────────────────

function ApprovalContent({ data, onAction }: { data: ApprovalPayload; onAction: (q: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 px-7 py-4 bg-emerald-50 border-b border-emerald-100">
        <CheckCircle2 className="w-5 h-5 text-bk-primary flex-shrink-0" />
        <div>
          <p className="text-[15px] font-bold leading-[22px] text-bk-black font-lato">
            Submitted for {data.approvalLevel} Approval
          </p>
          <p className="text-bk-caption text-bk-dark-gray font-lato">
            Discount threshold requires additional sign-off
          </p>
        </div>
      </div>
      <BKFields rows={[
        { label: 'Account', value: data.accountName },
        { label: 'Contract Total', value: <span className="font-bold text-bk-primary">{formatCurrency(data.totalAmount)}/yr</span> },
        { label: 'Approver', value: data.approverName },
        { label: 'Discount', value: <span className={cn(data.discountPct >= 15 && 'text-bk-danger font-bold')}>{data.discountPct}%</span> },
      ]} />
      <BKDivider />
      <BKContext>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3 h-3 flex-shrink-0" />
          {data.approverName} will review within 4 business hours. You'll receive a Slack notification when approved.
        </span>
      </BKContext>
      <BKDivider />
      <BKActions>
        <BKButton variant="outline" onClick={() => onAction(`Preview the deck for ${data.accountName}`)}>
          View Quote
        </BKButton>
        <BKButton variant="outline" onClick={() => onAction(`Draft a follow-up email to champion at ${data.accountName}`)}>
          Send champion update
        </BKButton>
      </BKActions>
    </>
  )
}

// ── EMAIL DRAFT CONTENT ───────────────────────────────────────────────────────

function EmailDraftContent({ data }: { data: EmailDraftPayload }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const previewLines = data.body.split('\n').slice(0, 5).join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${data.subject}\n\n${data.body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <BKHeader
        icon={<Mail className="w-4 h-4 text-bk-primary" />}
        title={`Draft Email · ${data.accountName}`}
        meta="AI-generated outreach — review before sending"
      />
      <BKSection>
        <p className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato mb-1">Subject</p>
        <p className="text-bk-body font-bold text-bk-black font-lato">{data.subject}</p>
      </BKSection>
      <BKDivider />
      <BKSection>
        <div>
          <div className="text-bk-body text-bk-black font-lato whitespace-pre-wrap leading-[22px]">
            {expanded ? data.body : previewLines}
            {!expanded && <span className="text-bk-dark-gray"> …</span>}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-bk-caption text-bk-link hover:underline font-lato"
          >
            {expanded
              ? <><ChevronUp className="w-3 h-3" /> Show less</>
              : <><ChevronDown className="w-3 h-3" /> Show full email</>
            }
          </button>
        </div>
      </BKSection>
      <BKDivider />
      <BKActions>
        <BKButton variant="primary" onClick={handleCopy}>
          <Copy className="w-3 h-3 mr-1.5" />
          {copied ? 'Copied!' : 'Copy'}
        </BKButton>
        <BKButton variant="outline">Edit draft</BKButton>
      </BKActions>
    </>
  )
}

// ── BOT ICON ─────────────────────────────────────────────────────────────────

function BotIcon({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-9 h-9'
  const icon = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <div className={cn('rounded-bk bg-[#4F0CD6] flex items-center justify-center flex-shrink-0', dim)}>
      <svg className={cn('text-white', icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  )
}

// ── TYPING INDICATOR ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <BotIcon />
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-bk-caption font-bold text-bk-black font-lato">Docusign GTM AI</span>
        </div>
        <div className="flex items-center gap-1.5 h-7 px-3 bg-white border border-bk-low-contrast rounded-bk">
          <span className="w-1.5 h-1.5 bg-bk-dark-gray rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-bk-dark-gray rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-bk-dark-gray rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// ── SUGGESTED PROMPTS ─────────────────────────────────────────────────────────

const REVIEW_ITEMS = [
  {
    payload: ACME_POST_CALL,
    icon: <Mic className="w-4 h-4 text-[#4F0CD6]" />,
    title: 'Post-Call Update — Acme Corporation',
    meta: 'Gong · 32 min · Jordan Park, Maya Singh, Alex Wong',
    badge: '8 fields',
    color: 'bg-[#4F0CD6]/5 border-[#4F0CD6]/20 hover:border-[#4F0CD6]/40',
  },
  {
    payload: VERTEX_CLOSED_LOST,
    icon: <AlertCircle className="w-4 h-4 text-bk-danger" />,
    title: 'Closed Lost Review — Vertex Financial',
    meta: 'Gong · 18 min · James Whitmore, Priya Mehta',
    badge: 'Loss package',
    color: 'bg-red-50/50 border-red-200/60 hover:border-red-300',
  },
]

const SUGGESTED_PROMPTS = [
  { prompt: "What's my pipeline health?",             icon: <BarChart2  className="w-4 h-4 flex-shrink-0" /> },
  { prompt: "Show me today's priorities",             icon: <Calendar   className="w-4 h-4 flex-shrink-0" /> },
  { prompt: "What's happening with Meridian Health?", icon: <Building2  className="w-4 h-4 flex-shrink-0" /> },
  { prompt: "Create a quote for Acme Corporation",    icon: <FileText   className="w-4 h-4 flex-shrink-0" /> },
  { prompt: "How am I tracking against quota?",       icon: <TrendingUp className="w-4 h-4 flex-shrink-0" /> },
  { prompt: "Draft an outreach for NovaTech",         icon: <Mail       className="w-4 h-4 flex-shrink-0" /> },
]

// ── COMPOSER TOOLBAR BUTTON ───────────────────────────────────────────────────

function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label?: string }) {
  return (
    <button
      title={label}
      className="w-7 h-7 flex items-center justify-center text-[#616061] hover:bg-[#F8F8F8] hover:text-[#1D1C1D] rounded transition-colors"
    >
      {icon}
    </button>
  )
}

// ── SLACK SIDEBAR ─────────────────────────────────────────────────────────────

const SLACK_PURPLE = '#3F0E40'

const DMS = [
  { initials: 'TN', name: 'Tom Nakamura',   color: '#059669', online: true  },
  { initials: 'LC', name: 'Lisa Chen',       color: '#7C3AED', online: true  },
  { initials: 'DP', name: 'David Park',      color: '#F59E0B', online: false },
  { initials: 'RM', name: 'Ravi Murthy',      color: '#DC2626', online: false },
  { initials: 'RC', name: 'Robert Chen',     color: '#2563EB', online: false },
]

function SidebarItem({ icon, label, active = false, badge }: { icon?: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <button className={cn(
      'flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left transition-colors font-lato',
      active ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
    )}>
      {icon && <span className="w-4 flex-shrink-0 flex items-center justify-center">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge ? (
        <span className="ml-auto flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center bg-white/20 text-white text-[10px] font-bold rounded-full px-1">{badge}</span>
      ) : null}
    </button>
  )
}

function SlackSidebar() {
  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-full overflow-hidden" style={{ background: SLACK_PURPLE }}>

      {/* Workspace header */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-white/10 flex-shrink-0">
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0">
          <div className="w-7 h-7 rounded bg-yellow-400 flex items-center justify-center text-[11px] font-black text-gray-900 flex-shrink-0">D</div>
          <span className="text-white font-bold text-[14px] font-lato truncate">Docusign-GTM</span>
          <ChevronDown className="w-3 h-3 text-white/60 flex-shrink-0" />
        </button>
        <button className="relative w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>
      </div>

      {/* User status */}
      <div className="px-3 py-2 flex-shrink-0">
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left">
          <div className="relative flex-shrink-0">
            <div className="w-6 h-6 rounded bg-bk-primary flex items-center justify-center text-white text-[9px] font-bold">SM</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-[#3F0E40]" />
          </div>
          <span className="text-[12px] text-white/70 font-lato truncate">Sarah Mitchell</span>
        </button>
      </div>

      {/* Top nav */}
      <nav className="px-2 space-y-0.5 flex-shrink-0">
        <SidebarItem icon={<Home className="w-4 h-4" />}           label="Home" />
        <SidebarItem icon={<MessageSquare className="w-4 h-4" />} label="DMs" badge={3} />
        <SidebarItem icon={<Bell className="w-4 h-4" />}          label="Activity" />
        <SidebarItem icon={<Clock className="w-4 h-4" />}         label="Later" />
      </nav>

      <div className="h-px bg-white/10 mx-3 my-2 flex-shrink-0" />

      {/* Apps section */}
      <div className="px-3 mb-1 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-lato">Apps</span>
      </div>
      <div className="px-2 space-y-0.5 flex-shrink-0">
        {/* GTM AI — active */}
        <button className="flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left bg-white/20 text-white font-semibold font-lato transition-colors">
          <div className="w-5 h-5 rounded bg-[#4F0CD6] flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="truncate">GTM AI</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors font-lato">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center flex-shrink-0 text-white text-[8px] font-bold">GC</div>
          <span className="truncate">Google Calendar</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors font-lato">
          <div className="w-5 h-5 rounded bg-sky-500 flex items-center justify-center flex-shrink-0 text-white text-[8px] font-bold">SF</div>
          <span className="truncate">Salesforce</span>
        </button>
      </div>

      <div className="h-px bg-white/10 mx-3 my-2 flex-shrink-0" />

      {/* Channels */}
      <div className="px-3 mb-1 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-lato">Channels</span>
        <Plus className="w-3 h-3 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
      </div>
      <div className="px-2 space-y-0.5 flex-shrink-0">
        {['#general', '#sales-team', '#gtm-updates', '#deals-q3-2026'].map(ch => (
          <button key={ch} className="flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors font-lato">
            <Hash className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
            <span className="truncate">{ch.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-white/10 mx-3 my-2 flex-shrink-0" />

      {/* Direct Messages */}
      <div className="px-3 mb-1 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-lato">Direct Messages</span>
        <Plus className="w-3 h-3 text-white/40 hover:text-white/70 cursor-pointer transition-colors" />
      </div>
      <div className="px-2 space-y-0.5 overflow-y-auto flex-1 pb-4">
        {DMS.map(({ initials, name, color, online }) => (
          <button key={name} className="flex items-center gap-2 px-3 py-[5px] rounded text-[13px] w-full text-left text-white/70 hover:bg-white/10 hover:text-white transition-colors font-lato">
            <div className="relative flex-shrink-0">
              <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: color }}>{initials}</div>
              {online && <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-[#3F0E40]" />}
            </div>
            <span className="truncate">{name}</span>
          </button>
        ))}
      </div>

    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeDeck, setActiveDeck] = useState<QuotePayload | null>(null)
  const [openedReviews, setOpenedReviews] = useState<Set<number>>(new Set())
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const remainingReviews = REVIEW_ITEMS.map((item, i) => ({ ...item, index: i })).filter(r => !openedReviews.has(r.index))

  const openReviewItem = (payload: ScribePayload, index: number) => {
    setOpenedReviews(prev => new Set(prev).add(index))
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const label = payload.closedLostPackage ? 'Closed Lost review' : 'post-call MEDDPICC update'
      setMessages(prev => [...prev, {
        id: `push-${Date.now()}`,
        role: 'assistant',
        content: `Here is the ${label} for ${payload.accountName}. Please review each field and approve before I write to Salesforce.`,
        responseType: 'opportunity-scribe' as ResponseType,
        scribePayload: payload,
        suggestions: getScribeSuggestions(payload),
      }])
    }, 800)
  }

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return
    if (/preview.+deck/i.test(text)) {
      const lastQuote = [...messages].reverse().find(m => m.quotePayload)
      if (lastQuote?.quotePayload) { setActiveDeck(lastQuote.quotePayload); return }
    }
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    const delay = 600 + Math.random() * 600
    const historySnapshot = [...messages, userMsg]
    setTimeout(() => {
      const quotePayload = getQuotePayload(text, historySnapshot)

      // Quote uses the quotePayload path — no structured overlay
      if (quotePayload) {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getResponse(text, historySnapshot),
          responseType: 'text',
          quotePayload,
          suggestions: getSuggestions(text, quotePayload),
        }
        setMessages(prev => [...prev, reply])
        setIsTyping(false)
        return
      }

      let responseType = detectResponseType(text, historySnapshot)
      let pipelineData: PipelineStats | undefined
      let prioritiesData: PriorityItem[] | undefined
      let accountIntelData: AccountIntelPayload | undefined
      let approvalData: ApprovalPayload | undefined
      let emailDraftData: EmailDraftPayload | undefined
      let scribePayload: ScribePayload | undefined
      let meetingPrepData: MeetingPrep | undefined

      if (responseType === 'meeting-prep') {
        meetingPrepData = computeMeetingPrepData(text)
      } else if (responseType === 'opportunity-scribe') {
        const isClosedLost = /closed.?lost|loss.?review|mark.*(lost|dead)|deal.*(dead|lost)/i.test(text)
        scribePayload = isClosedLost ? VERTEX_CLOSED_LOST : ACME_POST_CALL
      } else if (responseType === 'pipeline') {
        pipelineData = computePipelineData()
      } else if (responseType === 'priorities') {
        prioritiesData = computePrioritiesData()
      } else if (responseType === 'account-intel') {
        const d = computeAccountIntelData(text, historySnapshot)
        if (d) accountIntelData = d; else responseType = 'text'
      } else if (responseType === 'approval') {
        const d = computeApprovalData(historySnapshot)
        if (d) approvalData = d; else responseType = 'text'
      } else if (responseType === 'email-draft') {
        emailDraftData = computeEmailDraftData(text, historySnapshot)
      }

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: meetingPrepData
          ? `Here's your pre-call brief for ${meetingPrepData.accountName}. I've pulled attendee Intel, your hypothesis, open MEDDPICC gaps, and discovery questions.`
          : scribePayload
            ? `Here is the ${scribePayload.closedLostPackage ? 'Closed Lost review' : 'post-call MEDDPICC update'} for ${scribePayload.accountName}. Please review each field and approve before I write to Salesforce.`
            : getResponse(text, historySnapshot),
        responseType,
        pipelineData,
        prioritiesData,
        accountIntelData,
        approvalData,
        emailDraftData,
        scribePayload,
        meetingPrepData,
        suggestions: meetingPrepData
          ? [`Draft a pre-call email to ${meetingPrepData.attendees.find(a => a.company === 'them')?.name}`, `Show me the ${meetingPrepData.accountName} deal`, 'Start Gong recording']
          : scribePayload ? getScribeSuggestions(scribePayload) : getSuggestions(text, null),
      }
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, delay)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {activeDeck && <ChatDeckPreview payload={activeDeck} onClose={() => setActiveDeck(null)} />}

      <div className="h-screen flex overflow-hidden font-lato">

        {/* ── SLACK SIDEBAR ──────────────────────────────────────────────── */}
        <SlackSidebar />

        {/* ── MAIN AREA ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-white min-w-0">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-bk-low-contrast flex-shrink-0">
          <div className="px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => { setMessages([]); setInput(''); setIsTyping(false) }}
              className="flex items-center gap-2.5 hover:opacity-75 transition-opacity"
            >
              <BotIcon size="sm" />
              <span className="text-[15px] font-bold text-bk-black font-lato">Docusign</span>
              <span className="text-bk-low-contrast">|</span>
              <span className="text-[15px] font-normal text-bk-dark-gray font-lato">GTM AI</span>
            </button>
          </div>
        </header>

        {/* ── CONVERSATION ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">

            {/* Empty state */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center min-h-[52vh] gap-6">
                <div className="text-center">
                  <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-bk bg-[#4F0CD6] opacity-10 scale-[1.6] blur-md" />
                    <div className="relative w-14 h-14 rounded-bk bg-[#4F0CD6] flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-[28px] font-black leading-[34px] text-bk-black font-lato mb-1">Good morning, Sarah.</h1>
                  <p className="text-bk-body text-bk-dark-gray font-lato">What do you need today?</p>
                </div>

                {/* ── Review items (full) ───────────────────────────────────── */}
                <div className="w-full max-w-[520px]">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 rounded-full bg-bk-danger flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-white font-lato">{REVIEW_ITEMS.length}</span>
                    </div>
                    <span className="text-bk-body font-bold text-bk-black font-lato">{REVIEW_ITEMS.length} things for your review</span>
                  </div>
                  <div className="space-y-2">
                    {REVIEW_ITEMS.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => openReviewItem(item.payload, i)}
                        className={cn(
                          'w-full flex items-center gap-3 text-left px-4 py-3 rounded-bk border transition-all group',
                          item.color
                        )}
                      >
                        <div className="w-9 h-9 rounded-bk bg-white border border-bk-low-contrast flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-bk-caption font-bold text-bk-black font-lato leading-tight">{item.title}</p>
                          <p className="text-[11px] text-bk-dark-gray font-lato mt-0.5">{item.meta}</p>
                        </div>
                        <span className="text-[11px] font-bold text-bk-dark-gray font-lato flex-shrink-0 bg-white border border-bk-low-contrast rounded-bk px-2 py-0.5">{item.badge}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-bk-dark-gray/40 group-hover:text-bk-dark-gray transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Meeting Prep card ─────────────────────────────────────── */}
                {meetingPreps.length > 0 && (() => {
                  const mp = meetingPreps[0]
                  const dt = new Date(mp.dateTime)
                  const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                  const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                  const them = mp.attendees.filter(a => a.company === 'them')
                  const AVATAR_COLORS = ['#0F766E', '#1D4ED8', '#7C3AED', '#B45309', '#BE123C']
                  return (
                    <div className="w-full max-w-[520px]">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Calendar className="w-4 h-4 text-bk-dark-gray" />
                        <span className="text-bk-body font-bold text-bk-black font-lato">Upcoming meeting</span>
                      </div>
                      <div className="bg-white border border-bk-low-contrast rounded-bk overflow-hidden">
                        {/* Meeting row */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-bk-low-contrast">
                          <div className="flex-shrink-0 w-9 h-9 rounded-bk bg-bk-surface border border-bk-low-contrast flex flex-col items-center justify-center">
                            <span className="text-[9px] font-bold text-bk-dark-gray font-lato uppercase leading-none">{dateStr.split(',')[0]}</span>
                            <span className="text-[15px] font-black text-bk-black font-lato leading-none">{dt.getDate()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-bk-caption font-bold text-bk-black font-lato leading-tight truncate">{mp.accountName}</p>
                              <span className="flex-shrink-0 text-[10px] font-bold text-bk-primary font-lato bg-bk-primary/10 px-1.5 rounded leading-4">NEXT</span>
                            </div>
                            <p className="text-[11px] text-bk-dark-gray font-lato mt-0.5">{timeStr} · {mp.duration} · {mp.meetingType.replace('_', '-')}</p>
                          </div>
                          {/* Stacked avatars */}
                          <div className="flex items-center flex-shrink-0">
                            {them.slice(0, 3).map((a, i) => {
                              const initials = a.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                              return (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold font-lato flex-shrink-0"
                                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], marginLeft: i > 0 ? '-6px' : '0' }}
                                  title={a.name}
                                >
                                  {initials}
                                </div>
                              )
                            })}
                            {them.length > 3 && (
                              <div className="w-6 h-6 rounded-full border-2 border-white bg-bk-surface flex items-center justify-center text-[9px] font-bold text-bk-dark-gray font-lato flex-shrink-0" style={{ marginLeft: '-6px' }}>
                                +{them.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* MEDDPICC gap pills + CTA */}
                        <div className="flex items-center gap-3 px-4 py-2.5">
                          <div className="flex-1 flex flex-wrap gap-1 min-w-0">
                            {mp.meddpiccGaps.slice(0, 3).map((gap, i) => (
                              <span key={i} className="inline-flex items-center px-2 h-5 text-[11px] font-bold font-lato rounded border bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">{gap}</span>
                            ))}
                            {mp.meddpiccGaps.length > 3 && (
                              <span className="inline-flex items-center px-2 h-5 text-[11px] font-bold font-lato rounded border bg-bk-surface text-bk-dark-gray border-bk-low-contrast">+{mp.meddpiccGaps.length - 3}</span>
                            )}
                          </div>
                          <button
                            onClick={() => sendMessage(`Prep me for my ${mp.accountName} call`)}
                            className="flex-shrink-0 h-7 px-3 text-bk-caption font-bold font-lato rounded-bk bg-bk-primary text-white hover:bg-bk-primary-hover transition-colors inline-flex items-center gap-1.5"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Prep brief
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* ── Suggested prompts ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-2 w-full max-w-[520px]">
                  {SUGGESTED_PROMPTS.map(({ prompt, icon }) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="flex items-center gap-2.5 text-left px-3 py-2.5 bg-white border border-bk-low-contrast rounded-bk text-bk-body text-bk-black font-lato hover:border-bk-dark-gray hover:bg-bk-surface transition-all"
                    >
                      <span className="text-bk-dark-gray">{icon}</span>
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Compact review banner (when messages exist + items remain) ── */}
            {!isEmpty && remainingReviews.length > 0 && openedReviews.size > 0 && (
              <div className="mb-6 border border-bk-low-contrast rounded-bk overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-bk-surface border-b border-bk-low-contrast">
                  <div className="w-4 h-4 rounded-full bg-bk-danger flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-white font-lato">{remainingReviews.length}</span>
                  </div>
                  <span className="text-bk-caption font-bold text-bk-black font-lato">{remainingReviews.length} more for your review</span>
                </div>
                {remainingReviews.map((item) => (
                  <button
                    key={item.index}
                    onClick={() => openReviewItem(item.payload, item.index)}
                    className="w-full flex items-center gap-3 text-left px-4 py-2.5 hover:bg-bk-surface transition-colors border-b last:border-b-0 border-bk-low-contrast group"
                  >
                    <div className="w-7 h-7 rounded-bk bg-white border border-bk-low-contrast flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-bk-caption font-bold text-bk-black font-lato leading-tight">{item.title}</p>
                      <p className="text-[11px] text-bk-dark-gray font-lato">{item.meta}</p>
                    </div>
                    <span className="text-[11px] font-bold text-bk-dark-gray font-lato flex-shrink-0 bg-white border border-bk-low-contrast rounded-bk px-2 py-0.5">{item.badge}</span>
                    <ArrowRight className="w-3 h-3 text-bk-dark-gray/30 group-hover:text-bk-dark-gray transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((msg, idx) => {
                const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1 && !isTyping
                return (
                  <div key={msg.id}>
                    {msg.role === 'user' ? (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bk-primary flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold font-lato mt-0.5">SM</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-bk-body font-bold text-bk-black font-lato">Sarah Mitchell</span>
                            <span className="text-bk-caption text-bk-dark-gray font-lato">10:00 AM</span>
                          </div>
                          <p className="text-bk-body text-bk-black font-lato whitespace-pre-wrap leading-[22px]">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <BotIcon />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-bk-body font-bold text-bk-black font-lato">Docusign GTM AI</span>
                            <span className="text-bk-caption text-bk-dark-gray font-lato">10:00 AM</span>
                          </div>

                          <BKCard>
                            {/* Structured response templates */}
                            {msg.responseType === 'meeting-prep' && msg.meetingPrepData ? (
                              <MeetingPrepCard prep={msg.meetingPrepData} onAction={sendMessage} />
                            ) : msg.responseType === 'opportunity-scribe' && msg.scribePayload ? (
                              <OpportunityScribeCard payload={msg.scribePayload} onAction={sendMessage} />
                            ) : msg.responseType === 'priorities' && msg.prioritiesData ? (
                              <PrioritiesContent items={msg.prioritiesData} onAction={sendMessage} />
                            ) : msg.responseType === 'pipeline' && msg.pipelineData ? (
                              <PipelineContent data={msg.pipelineData} onAction={sendMessage} />
                            ) : msg.responseType === 'account-intel' && msg.accountIntelData ? (
                              <AccountIntelContent data={msg.accountIntelData} onAction={sendMessage} />
                            ) : msg.responseType === 'approval' && msg.approvalData ? (
                              <ApprovalContent data={msg.approvalData} onAction={sendMessage} />
                            ) : msg.responseType === 'email-draft' && msg.emailDraftData ? (
                              <EmailDraftContent data={msg.emailDraftData} />
                            ) : (
                              /* Plain text + optional quote */
                              <>
                                <BKSection>
                                  <div className="text-bk-body text-bk-black font-lato whitespace-pre-wrap leading-[22px]">
                                    <RichText content={msg.content} onLinkClick={sendMessage} />
                                  </div>
                                </BKSection>
                                {msg.quotePayload && (
                                  <QuoteContent
                                    payload={msg.quotePayload}
                                    onPreview={() => setActiveDeck(msg.quotePayload!)}
                                    onApprove={() => sendMessage(`Submit for approval — ${msg.quotePayload!.accountName}`)}
                                  />
                                )}
                              </>
                            )}

                            {/* Suggestions */}
                            {isLastAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                              <>
                                <BKDivider />
                                <BKContext>
                                  <span className="inline-flex items-center gap-1.5">
                                    <Lightbulb className="w-3 h-3" />
                                    Suggested follow-ups
                                  </span>
                                </BKContext>
                                <BKActions>
                                  {msg.suggestions.map(s => (
                                    <BKButton key={s} variant="outline" onClick={() => sendMessage(s)}>
                                      <span className="flex items-center gap-1.5">
                                        {s}
                                        <ArrowRight className="w-3 h-3 opacity-50 flex-shrink-0" />
                                      </span>
                                    </BKButton>
                                  ))}
                                </BKActions>
                              </>
                            )}
                          </BKCard>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        {/* ── INPUT ──────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-t border-bk-low-contrast px-4 py-3">
          <div className={cn(
            'border rounded-lg transition-colors overflow-hidden',
            'border-[rgba(29,28,29,0.3)] focus-within:border-[rgba(29,28,29,0.6)]'
          )}>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-0.5 px-2 pt-1.5 pb-1 border-b border-[rgba(29,28,29,0.13)]">
              <ToolbarBtn icon={<Bold className="w-3.5 h-3.5" />} label="Bold" />
              <ToolbarBtn icon={<Italic className="w-3.5 h-3.5" />} label="Italic" />
              <ToolbarBtn icon={<Underline className="w-3.5 h-3.5" />} label="Underline" />
              <ToolbarBtn icon={<Strikethrough className="w-3.5 h-3.5" />} label="Strikethrough" />
              <div className="w-px h-4 bg-[rgba(29,28,29,0.2)] mx-1" />
              <ToolbarBtn icon={<Link className="w-3.5 h-3.5" />} label="Link" />
              <div className="w-px h-4 bg-[rgba(29,28,29,0.2)] mx-1" />
              <ToolbarBtn icon={<ListOrdered className="w-3.5 h-3.5" />} label="Ordered list" />
              <ToolbarBtn icon={<List className="w-3.5 h-3.5" />} label="Bullet list" />
              <div className="w-px h-4 bg-[rgba(29,28,29,0.2)] mx-1" />
              <ToolbarBtn icon={<Indent className="w-3.5 h-3.5" />} label="Indent" />
              <div className="w-px h-4 bg-[rgba(29,28,29,0.2)] mx-1" />
              <ToolbarBtn icon={<Code className="w-3.5 h-3.5" />} label="Code" />
              <ToolbarBtn icon={<MoreHorizontal className="w-3.5 h-3.5" />} label="More" />
            </div>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything"
              rows={1}
              className="w-full bg-transparent text-bk-body text-bk-black font-lato placeholder:text-[#616061] resize-none outline-none max-h-40 leading-[22px] px-3 py-2"
              style={{ height: 'auto' }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = `${el.scrollHeight}px`
              }}
            />

            {/* Bottom action bar */}
            <div className="flex items-center justify-between px-2 pb-1.5">
              <div className="flex items-center gap-0.5">
                <ToolbarBtn icon={<Plus className="w-3.5 h-3.5" />} label="Attach" />
                <button className="h-7 px-2 flex items-center text-[13px] font-semibold text-[#616061] hover:bg-[#F8F8F8] hover:text-[#1D1C1D] rounded transition-colors font-lato">Aa</button>
                <ToolbarBtn icon={<Smile className="w-3.5 h-3.5" />} label="Emoji" />
                <ToolbarBtn icon={<MoreHorizontal className="w-3.5 h-3.5" />} label="More" />
              </div>
              <div className="flex items-center gap-1.5">
                <ToolbarBtn icon={<Mic className="w-3.5 h-3.5" />} label="Voice message" />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    'w-7 h-7 rounded flex items-center justify-center flex-shrink-0 transition-colors',
                    input.trim() && !isTyping
                      ? 'bg-bk-primary hover:bg-bk-primary-hover text-white'
                      : 'bg-[#F8F8F8] text-[#BCBBBB] cursor-not-allowed'
                  )}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        </div>{/* end main area */}
      </div>
    </>
  )
}
