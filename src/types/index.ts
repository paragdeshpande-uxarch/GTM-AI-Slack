export type AgentStatus = 'running' | 'complete' | 'waiting_approval' | 'idle'

export interface AgentActivity {
  id: string
  agentName: string
  action: string
  status: AgentStatus
  timestamp: string
  account?: string
  detail?: string
}

export type ActionPriority = 'critical' | 'high' | 'medium' | 'suggested'
export type ActionType = 'response' | 'call' | 'review' | 'prepare' | 'alert' | 'expansion'

export interface NextAction {
  id: string
  type: ActionType
  priority: ActionPriority
  title: string
  subtitle: string
  dueLabel?: string
  accountId: string
  accountName: string
  timeAgo?: string
}

export interface Account {
  id: string
  name: string
  industry: string
  employees: number
  revenue: string
  hqCity: string
  hqState: string
  logoInitials: string
  logoColor: string
  score: number
  scoreDelta: number
  hypothesis: string
  whyNow: string[]
  techStack: string[]
  isExisting: boolean
  currentProducts?: string[]
  healthScore?: number
  renewalDate?: string
  whitespace: string
  contacts: Contact[]
  recentActivity: ActivityItem[]
}

export interface Contact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  role: 'champion' | 'economic_buyer' | 'tech_evaluator' | 'blocker' | 'coach' | 'unknown'
  engagementLevel: 'active' | 'met_once' | 'identified' | 'gap'
  linkedIn?: string
}

export interface ActivityItem {
  id: string
  type: 'email_opened' | 'support_case' | 'gong_call' | 'usage_spike' | 'signal_change' | 'meeting'
  date: string
  summary: string
  detail?: string
}

export interface Deal {
  id: string
  accountId: string
  accountName: string
  name: string
  stage: 'discover' | 'evaluate' | 'negotiate' | 'commit' | 'closed_won' | 'closed_lost'
  value: number
  healthScore: number
  healthTrend: 'up' | 'down' | 'stable'
  probability: number
  closeDate: string
  daysInStage: number
  owner: string
  ownerInitials: string
  ownerColor: string
  lastActivity: string
  riskFlags?: string[]
  nextStep?: string
}

export interface OutreachDraft {
  id: string
  accountId: string
  accountName: string
  contactName: string
  contactTitle: string
  contactRole: Contact['role']
  channel: 'email' | 'linkedin' | 'phone'
  subject?: string
  body: string
  reasoning: string
  sequenceStep: string
  similarSentWinRate?: string
  score: number
  status: 'pending' | 'approved' | 'edited' | 'skipped'
}

export interface MeetingPrep {
  id: string
  accountId: string
  accountName: string
  meetingType: 'discovery' | 'demo' | 'negotiation' | 'check_in'
  dateTime: string
  duration: string
  attendees: { name: string; title: string; company: 'us' | 'them'; note?: string }[]
  hypothesis: string
  validateQuestions: string[]
  meddpiccGaps: string[]
  accountSnapshot: { label: string; value: string }[]
  competitiveContext?: string
  lastInteraction?: string
}

export interface QuoteConfig {
  accountId: string
  accountName: string
  products: { name: string; quantity: number; unitPrice: number; total: number; reasoning: string }[]
  discount: number
  discountReason: string
  approvalNeeded: boolean
  approvalLevel?: string
  term: number
  startDate: string
  autoRenew: boolean
  billTo: string
  adminContact: string
  earlyRenewalCredit?: number
  validationIssues: string[]
}

export interface HandoffBrief {
  accountId: string
  accountName: string
  whatWasSold: string[]
  whyTheyBought: string
  keyStakeholders: { name: string; role: string; cares: string }[]
  successCriteria: string[]
  implementationNotes: string[]
  gongMoments: { timestamp: string; quote: string }[]
  assignedCSM: string
  kickoffDate: string
}
