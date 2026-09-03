import { useState } from 'react'
import { Calendar, ExternalLink, Mic, Lightbulb, ChevronDown, ChevronRight, Mail } from 'lucide-react'
import { cn } from '../lib/utils'
import type { MeetingPrep } from '../types'
import { BKDivider, BKHeader, BKSection, BKActions, BKButton, BKTag, BKFields } from './bk'

// ── Circle avatar for attendees ───────────────────────────────────────────────

const THEM_COLORS = ['#0F766E', '#1D4ED8', '#7C3AED', '#B45309', '#BE123C']

function AttendeeAvatar({ initials, company, index }: { initials: string; company: 'us' | 'them'; index: number }) {
  const bg = company === 'us' ? '#4F0CD6' : THEM_COLORS[index % THEM_COLORS.length]
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold font-lato"
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}

// ── Hypothesis callout ────────────────────────────────────────────────────────

function HypothesisCallout({ text }: { text: string }) {
  return (
    <div className="mx-7 my-3 rounded-bk bg-blue-50 border border-blue-200 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span className="text-[11px] font-bold text-blue-700 font-lato uppercase tracking-wide">Sales Hypothesis</span>
      </div>
      <p className="text-bk-body text-bk-black font-lato leading-[22px]">{text}</p>
    </div>
  )
}

// ── Expandable attendee row ───────────────────────────────────────────────────

function AttendeeRow({ attendee, index }: { attendee: MeetingPrep['attendees'][0]; index: number }) {
  const [open, setOpen] = useState(false)
  const initials = attendee.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const hasNote = Boolean(attendee.note)

  return (
    <div className="border-b border-bk-low-contrast last:border-b-0">
      <button
        onClick={() => hasNote && setOpen(v => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-7 py-2.5 text-left transition-colors',
          hasNote && 'hover:bg-bk-surface cursor-pointer',
          !hasNote && 'cursor-default',
          open && 'bg-bk-surface'
        )}
      >
        <AttendeeAvatar initials={initials} company={attendee.company} index={index} />
        <div className="flex-1 min-w-0">
          <p className="text-bk-caption font-bold text-bk-black font-lato">{attendee.name}</p>
          <p className="text-[11px] text-bk-dark-gray font-lato">{attendee.title}</p>
        </div>
        <BKTag color={attendee.company === 'us' ? 'blue' : 'default'}>
          {attendee.company === 'us' ? 'Docusign' : 'Prospect'}
        </BKTag>
        {hasNote && (
          open
            ? <ChevronDown className="w-3.5 h-3.5 text-bk-dark-gray flex-shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-bk-dark-gray flex-shrink-0" />
        )}
      </button>
      {open && attendee.note && (
        <div className="px-7 pb-3 ml-11">
          <p className="text-bk-caption text-bk-dark-gray font-lato leading-[20px]">{attendee.note}</p>
        </div>
      )}
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-bk-caption font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] font-bold text-bk-dark-gray font-lato bg-bk-surface border border-bk-low-contrast rounded px-1.5 py-0.5 leading-none">{count}</span>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const MEETING_TYPE_LABELS: Record<MeetingPrep['meetingType'], string> = {
  discovery: 'Discovery',
  demo: 'Demo',
  negotiation: 'Negotiation',
  check_in: 'Check-in',
}

const MEETING_TYPE_COLORS: Record<MeetingPrep['meetingType'], string> = {
  discovery: 'blue',
  demo: 'green',
  negotiation: 'amber',
  check_in: 'default',
}

export function MeetingPrepCard({ prep, onAction }: { prep: MeetingPrep; onAction: (q: string) => void }) {
  const them = prep.attendees.filter(a => a.company === 'them')
  const us = prep.attendees.filter(a => a.company === 'us')

  const dt = new Date(prep.dateTime)
  const dateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const typeColor = MEETING_TYPE_COLORS[prep.meetingType] as 'blue' | 'green' | 'amber' | 'default'

  return (
    <>
      {/* Header */}
      <BKHeader
        icon={<Calendar className="w-4 h-4 text-bk-primary" />}
        title={prep.accountName}
        meta={`${dateStr} · ${timeStr} · ${prep.duration}`}
      />

      {/* Meeting type + match badge */}
      <div className="px-7 py-2.5 flex items-center gap-2 border-b border-bk-low-contrast">
        <BKTag color={typeColor}>{MEETING_TYPE_LABELS[prep.meetingType]}</BKTag>
        <span className="text-[11px] text-bk-dark-gray font-lato">{prep.accountName} · {them.length} attendee{them.length !== 1 ? 's' : ''} from prospect</span>
      </div>

      {/* Hypothesis callout */}
      <HypothesisCallout text={prep.hypothesis} />

      <BKDivider />

      {/* Prospect attendees */}
      <div className="px-7 pt-3 pb-2">
        <SectionLabel label="Prospect" count={them.length} />
      </div>
      {them.map((a, i) => <AttendeeRow key={i} attendee={a} index={i} />)}

      {/* Docusign attendees */}
      <div className="px-7 pt-3 pb-2">
        <SectionLabel label="Docusign" count={us.length} />
      </div>
      {us.map((a, i) => <AttendeeRow key={i} attendee={a} index={i} />)}

      <BKDivider />

      {/* MEDDPICC Gaps */}
      <BKSection>
        <div className="w-full">
          <SectionLabel label="MEDDPICC Gaps to Validate" />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {prep.meddpiccGaps.map((gap, i) => (
              <BKTag key={i} color="amber">{gap}</BKTag>
            ))}
          </div>
        </div>
      </BKSection>

      <BKDivider />

      {/* Discovery questions */}
      <BKSection>
        <div className="w-full">
          <SectionLabel label="Discovery Questions" count={prep.validateQuestions.length} />
          <div className="space-y-2.5 mt-2.5">
            {prep.validateQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-bk-surface border border-bk-low-contrast flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-bk-dark-gray font-lato mt-0.5">
                  {i + 1}
                </span>
                <p className="text-bk-body text-bk-black font-lato leading-[22px]">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </BKSection>

      <BKDivider />

      {/* Account snapshot */}
      <BKFields rows={prep.accountSnapshot} />

      {/* Competitive context */}
      {(prep.competitiveContext || prep.lastInteraction) && (
        <>
          <BKDivider />
          <BKSection>
            <div className="w-full space-y-2">
              {prep.competitiveContext && (
                <div>
                  <SectionLabel label="Competitive Context" />
                  <p className="text-bk-body text-bk-black font-lato leading-[22px] mt-1">{prep.competitiveContext}</p>
                </div>
              )}
              {prep.lastInteraction && (
                <p className="text-bk-caption text-bk-dark-gray font-lato leading-[20px] pt-1 border-t border-bk-low-contrast">
                  <span className="font-bold">Last interaction: </span>{prep.lastInteraction}
                </p>
              )}
            </div>
          </BKSection>
        </>
      )}

      {/* Actions */}
      <BKDivider />
      <BKActions>
        <BKButton variant="primary" onClick={() => onAction(`Open ${prep.accountName} in Salesforce`)}>
          <ExternalLink className="w-3 h-3 mr-1.5" />
          Open in Salesforce
        </BKButton>
        <BKButton variant="outline" onClick={() => onAction(`Start Gong recording for ${prep.accountName}`)}>
          <Mic className="w-3 h-3 mr-1.5" />
          Start Gong
        </BKButton>
        <BKButton variant="outline" onClick={() => onAction(`Draft a pre-call primer email to the ${prep.accountName} attendees`)}>
          <Mail className="w-3 h-3 mr-1.5" />
          Pre-call email
        </BKButton>
      </BKActions>
    </>
  )
}
