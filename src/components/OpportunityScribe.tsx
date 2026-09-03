import { useState } from 'react'
import { Mic, GitCompare, CheckCircle2, Users, UserPlus, ChevronDown, Shield, Target, TrendingUp, Calendar } from 'lucide-react'
import { cn } from '../lib/utils'
import { BKDivider, BKButton, BKTag } from './bk'
import type { ScribePayload } from '../data/scribeData'

const SOURCE_LABELS: Record<string, string> = { gong: 'Gong', zoom: 'Zoom', manual: 'Manual', email_sweep: 'Email Sweep' }
const STAGES = ['Qualify', 'Discover', 'Evaluate', 'Propose', 'Negotiate', 'Closed Won', 'Closed Lost']
const FORECAST_CATS = ['Pipeline', 'Best Case', 'Commit', 'Omitted', 'Closed']
const ROLE_OPTIONS = ['Economic Buyer', 'Champion', 'Technical Evaluator', 'Decision Maker', 'End User', 'Influencer', 'Other']

// ── Form primitives ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-bk-dark-gray">{icon}</span>
      <span className="text-[11px] font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] font-bold text-bk-dark-gray font-lato bg-bk-surface border border-bk-low-contrast rounded px-1.5 py-0.5 leading-none">{count}</span>
      )}
    </div>
  )
}

function FieldLabel({ children, isNew }: { children: React.ReactNode; isNew?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-[11px] font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{children}</span>
      {isNew && <BKTag color="green">New</BKTag>}
    </div>
  )
}

const BASE = 'w-full rounded-bk border border-bk-low-contrast px-3 py-2 text-bk-body text-bk-black font-lato bg-white focus:border-[rgba(29,28,29,0.6)] focus:outline-none transition-colors'

// ── 2-column MEDDPICC row: read-only current | editable proposed ───────────────

function MeddpiccRow({
  field,
  value,
  onChange,
}: {
  field: { key: string; label: string; current: string | null; proposed: string; source: string }
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="border border-bk-low-contrast rounded-bk overflow-hidden">
      {/* Row header */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-bk-surface border-b border-bk-low-contrast">
        <span className="text-[11px] font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{field.label}</span>
        {!field.current && <BKTag color="green">New</BKTag>}
      </div>
      {/* Columns */}
      <div className="grid grid-cols-2 divide-x divide-bk-low-contrast">
        {/* Left — previous (read-only) */}
        <div className="px-3 py-2.5 bg-[#f8f8f8]">
          <p className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato mb-1.5">Previous</p>
          {field.current
            ? <p className="text-bk-caption text-bk-dark-gray font-lato leading-[20px] whitespace-pre-wrap">{field.current}</p>
            : <p className="text-[11px] text-bk-dark-gray/40 font-lato italic">Not previously set</p>
          }
        </div>
        {/* Right — AI extracted (editable) */}
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-bold text-bk-primary uppercase tracking-wider font-lato mb-1.5">AI Extracted</p>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={field.current ? 4 : 3}
            className="w-full rounded-bk border border-bk-low-contrast px-2.5 py-2 text-bk-caption text-bk-black font-lato bg-white focus:border-[rgba(29,28,29,0.6)] focus:outline-none transition-colors resize-y leading-[20px]"
          />
          <p className="text-[10px] text-bk-dark-gray/55 font-lato mt-1">{field.source}</p>
        </div>
      </div>
    </div>
  )
}

function FTextarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className={cn(BASE, 'resize-y leading-[22px]')}
    />
  )
}

function FSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(BASE, 'appearance-none pr-8 cursor-pointer')}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bk-dark-gray pointer-events-none" />
    </div>
  )
}

function FInput({ value, onChange, type = 'text' }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={BASE}
    />
  )
}

function SourceNote({ text }: { text: string }) {
  return <p className="text-[10px] text-bk-dark-gray/55 font-lato mt-1">{text}</p>
}

// ── Submitted state ────────────────────────────────────────────────────────────

function SubmittedState({ payload }: { payload: ScribePayload }) {
  const isClosedLost = !!payload.closedLostPackage
  return (
    <>
      <div className={cn(
        'flex items-center gap-3 px-7 py-4',
        isClosedLost ? 'bg-red-50 border-b border-red-100' : 'bg-emerald-50 border-b border-emerald-100'
      )}>
        <CheckCircle2 className={cn('w-5 h-5 flex-shrink-0', isClosedLost ? 'text-bk-danger' : 'text-bk-primary')} />
        <div>
          <p className="text-[15px] font-bold leading-[22px] text-bk-black font-lato">
            {isClosedLost ? 'Closed Lost — Written to Salesforce' : 'Updates Written to Salesforce'}
          </p>
          <p className="text-bk-caption text-bk-dark-gray font-lato">
            {payload.meddpiccFields.length} fields updated · {payload.opportunityName}
          </p>
        </div>
      </div>
      <div className="px-7 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
        {[
          { label: 'Account', value: payload.accountName },
          { label: 'Opportunity', value: payload.opportunityName },
          { label: 'Source', value: `${SOURCE_LABELS[payload.callSource]} · ${payload.callDate}` },
          { label: 'Duration', value: payload.callDuration },
        ].map(r => (
          <div key={r.label}>
            <p className="text-bk-caption font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{r.label}</p>
            <p className="text-bk-body text-bk-black font-lato mt-0.5">{r.value}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function OpportunityScribeCard({ payload, onAction }: {
  payload: ScribePayload; onAction: (q: string) => void
}) {
  const isClosedLost = !!payload.closedLostPackage
  const [submitted, setSubmitted] = useState(false)

  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of payload.meddpiccFields) init[f.key] = f.proposed
    init.stage = payload.stageRecommendation.proposedStage ?? payload.stageRecommendation.currentStage
    init.forecast = payload.forecastRecommendation.proposedCategory
    init.closeDate = payload.closeDateRecommendation.proposedDate ?? payload.closeDateRecommendation.currentDate
    init.nextSteps = payload.nextSteps.proposed.steps.join('\n')
    if (payload.closedLostPackage) {
      init.lossReason = payload.closedLostPackage.reasonLost
      init.lossNotes = payload.closedLostPackage.lossNotes
      init.churnTheme = payload.closedLostPackage.churnTheme
    }
    return init
  })

  const [contactRoles, setContactRoles] = useState<string[]>(
    payload.contactRoles.map(c => c.proposedRole)
  )

  const set = (key: string, value: string) => setFields(p => ({ ...p, [key]: value }))

  if (submitted) return <SubmittedState payload={payload} />

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={cn(
        'px-7 py-4 border-b',
        isClosedLost
          ? 'bg-gradient-to-r from-red-600 to-red-500 border-red-700'
          : 'bg-gradient-to-r from-[#4F0CD6] to-[#7C3AED] border-[#4F0CD6]'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-bk bg-white/20 flex items-center justify-center flex-shrink-0">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold leading-[22px] text-white font-lato">
              {isClosedLost ? 'Closed Lost Review' : 'Post-Call Update'} · {payload.accountName}
            </p>
            <p className="text-[12px] text-white/70 font-lato">
              {SOURCE_LABELS[payload.callSource]} · {payload.callDate} · {payload.callDuration} · {payload.participants.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Match confirmation ──────────────────────────────────────────── */}
      <div className="bg-bk-surface px-7 py-3 border-b border-bk-low-contrast">
        <div className="flex items-center gap-2 mb-2">
          <GitCompare className="w-3.5 h-3.5 text-bk-dark-gray" />
          <span className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato">Matched To</span>
          <BKTag color={payload.matchConfidence === 'high' ? 'green' : payload.matchConfidence === 'medium' ? 'amber' : 'red'}>
            {payload.matchConfidence} confidence
          </BKTag>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato">Account</p>
            <p className="text-bk-caption font-bold text-bk-primary font-lato">{payload.accountName}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-bk-dark-gray uppercase tracking-wider font-lato">Opportunity</p>
            <p className="text-bk-caption font-bold text-bk-primary font-lato">{payload.opportunityName}</p>
          </div>
        </div>
      </div>

      {/* ── MEDDPICC fields ─────────────────────────────────────────────── */}
      <div className="px-7 pt-5 pb-3">
        <SectionLabel
          icon={<Target className="w-3.5 h-3.5" />}
          label="MEDDPICC Updates"
          count={payload.meddpiccFields.length}
        />
        <div className="space-y-3">
          {payload.meddpiccFields.map(f => (
            <MeddpiccRow
              key={f.key}
              field={f}
              value={fields[f.key] ?? ''}
              onChange={v => set(f.key, v)}
            />
          ))}
        </div>
      </div>

      <BKDivider />

      {/* ── Opportunity — Stage / Forecast / Close Date ─────────────────── */}
      <div className="px-7 py-4">
        <SectionLabel icon={<TrendingUp className="w-3.5 h-3.5" />} label="Opportunity" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <FieldLabel>Stage</FieldLabel>
            <FSelect value={fields.stage ?? ''} onChange={v => set('stage', v)} options={STAGES} />
            {!payload.stageRecommendation.proposedStage && (
              <SourceNote text="No change recommended" />
            )}
          </div>
          <div>
            <FieldLabel>Forecast Category</FieldLabel>
            <FSelect value={fields.forecast ?? ''} onChange={v => set('forecast', v)} options={FORECAST_CATS} />
          </div>
          <div>
            <FieldLabel>Close Date</FieldLabel>
            <FInput value={fields.closeDate ?? ''} onChange={v => set('closeDate', v)} type="date" />
            {payload.closeDateRecommendation.crossesQuarter && (
              <SourceNote text="⚠ Crosses quarter boundary" />
            )}
          </div>
        </div>
      </div>

      <BKDivider />

      {/* ── Next Steps ──────────────────────────────────────────────────── */}
      <div className="px-7 py-4">
        <SectionLabel icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Next Steps" />
        <FTextarea value={fields.nextSteps ?? ''} onChange={v => set('nextSteps', v)} rows={4} />
        <SourceNote text={`${payload.nextSteps.proposed.initials} · ${payload.nextSteps.proposed.date}`} />
      </div>

      {/* ── Contact Roles ───────────────────────────────────────────────── */}
      {payload.contactRoles.length > 0 && (
        <>
          <BKDivider />
          <div className="px-7 py-4">
            <SectionLabel icon={<Users className="w-3.5 h-3.5" />} label="Contact Roles" />
            <div className="border border-bk-low-contrast rounded-bk overflow-hidden divide-y divide-bk-low-contrast">
              {payload.contactRoles.map((contact, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-lato',
                    contact.matchStatus === 'not_found' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  )}>
                    {contact.matchStatus === 'not_found'
                      ? <UserPlus className="w-3.5 h-3.5" />
                      : contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-bk-caption font-bold text-bk-black font-lato">{contact.name}</p>
                    <p className="text-[11px] text-bk-dark-gray font-lato">{contact.title}</p>
                  </div>
                  <div className="w-44 flex-shrink-0 relative">
                    <select
                      value={contactRoles[i]}
                      onChange={e => setContactRoles(prev => prev.map((r, j) => j === i ? e.target.value : r))}
                      className="w-full rounded-bk border border-bk-low-contrast px-2.5 py-1.5 text-bk-caption text-bk-black font-lato bg-white focus:border-bk-dark-gray focus:outline-none appearance-none pr-7 cursor-pointer"
                    >
                      {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-bk-dark-gray pointer-events-none" />
                  </div>
                  {contact.matchStatus === 'not_found' && <BKTag color="amber">New</BKTag>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Closed Lost Package ─────────────────────────────────────────── */}
      {isClosedLost && payload.closedLostPackage && (
        <>
          <BKDivider />
          <div className="px-7 py-4">
            <SectionLabel icon={<Shield className="w-3.5 h-3.5 text-bk-danger" />} label="Closed Lost Package" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <FieldLabel>Reason Lost</FieldLabel>
                  <FInput value={fields.lossReason ?? ''} onChange={v => set('lossReason', v)} />
                </div>
                <div>
                  <FieldLabel>Churn Theme</FieldLabel>
                  <FInput value={fields.churnTheme ?? ''} onChange={v => set('churnTheme', v)} />
                </div>
              </div>
              <div>
                <FieldLabel>Loss Notes</FieldLabel>
                <FTextarea value={fields.lossNotes ?? ''} onChange={v => set('lossNotes', v)} rows={4} />
                <SourceNote text={`${payload.closedLostPackage.evidence} · Confidence: ${payload.closedLostPackage.confidence}%`} />
              </div>
            </div>
          </div>
        </>
      )}

      <BKDivider />

      {/* ── Caption + actions ───────────────────────────────────────────── */}
      <div className="px-7 py-4">
        <p className="text-bk-caption text-bk-dark-gray font-lato mb-4">
          Review and edit the AI-extracted fields, then click <span className="font-bold text-bk-black">Confirm Update</span> to write to Salesforce. Sourced from {SOURCE_LABELS[payload.callSource]} on {payload.callDate}.
        </p>
        <div className="flex items-center justify-end gap-2">
          <BKButton variant="outline" onClick={() => onAction('Cancel post-call update')}>
            Cancel
          </BKButton>
          <BKButton variant="primary" onClick={() => setSubmitted(true)}>
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Confirm Update
          </BKButton>
        </div>
      </div>
    </>
  )
}
