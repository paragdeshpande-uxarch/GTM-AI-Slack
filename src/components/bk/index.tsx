import { cn } from '../../lib/utils'

// ── BKCard — 520px white modal-style card ────────────────────────────────────
export function BKCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-bk border border-bk-low-contrast w-full', className)}>
      {children}
    </div>
  )
}

// ── BKSection — body block with optional right accessory ─────────────────────
export function BKSection({
  children,
  accessory,
  className,
}: {
  children: React.ReactNode
  accessory?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-7 py-3', className)}>
      <div className="flex-1 min-w-0 text-bk-body text-bk-black font-lato">{children}</div>
      {accessory && <div className="flex-shrink-0">{accessory}</div>}
    </div>
  )
}

// ── BKDivider ────────────────────────────────────────────────────────────────
export function BKDivider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-bk-low-contrast mx-0', className)} />
}

// ── BKContext — small gray helper row ────────────────────────────────────────
export function BKContext({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-7 py-2 text-bk-caption text-bk-dark-gray font-lato', className)}>
      {children}
    </div>
  )
}

// ── BKHeader — title bar inside a card ───────────────────────────────────────
export function BKHeader({
  icon,
  title,
  meta,
}: {
  icon?: React.ReactNode
  title: string
  meta?: string
}) {
  return (
    <div className="flex items-center gap-3 px-7 py-4 border-b border-bk-low-contrast">
      {icon && (
        <div className="w-9 h-9 rounded-bk bg-bk-surface flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold leading-[22px] text-bk-black font-lato truncate">{title}</p>
        {meta && <p className="text-bk-caption text-bk-dark-gray font-lato">{meta}</p>}
      </div>
    </div>
  )
}

// ── BKActions — 1 or 2-column button row ─────────────────────────────────────
export function BKActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-7 py-3 flex flex-wrap gap-2', className)}>
      {children}
    </div>
  )
}

// ── BKButton ─────────────────────────────────────────────────────────────────
type BKButtonVariant = 'primary' | 'outline' | 'danger'
type BKButtonSize = 'default' | 'sm'

export function BKButton({
  children,
  variant = 'outline',
  size = 'default',
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode
  variant?: BKButtonVariant
  size?: BKButtonSize
  onClick?: () => void
  className?: string
  disabled?: boolean
}) {
  const base = 'inline-flex items-center justify-center rounded-bk font-bold font-lato transition-colors select-none whitespace-nowrap'
  const sizes: Record<BKButtonSize, string> = {
    default: 'h-7 px-3 text-bk-caption',
    sm:      'h-6 px-2.5 text-[12px]',
  }
  const variants: Record<BKButtonVariant, string> = {
    primary: 'bg-bk-primary text-white hover:bg-bk-primary-hover',
    outline: 'bg-white border border-bk-low-contrast text-bk-black hover:bg-bk-surface hover:border-bk-dark-gray',
    danger:  'bg-bk-danger text-white hover:opacity-90',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      {children}
    </button>
  )
}

// ── BKFields — 2-column label/value grid ─────────────────────────────────────
export function BKFields({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="px-7 py-3 grid grid-cols-2 gap-x-6 gap-y-2">
      {rows.map((r, i) => (
        <div key={i}>
          <p className="text-bk-caption font-bold text-bk-dark-gray font-lato uppercase tracking-wide">{r.label}</p>
          <p className="text-bk-body text-bk-black font-lato mt-0.5">{r.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── BKTag — small status pill ────────────────────────────────────────────────
export function BKTag({ children, color = 'default' }: { children: React.ReactNode; color?: 'green' | 'red' | 'blue' | 'amber' | 'default' }) {
  const colors = {
    green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:     'bg-red-50 text-red-700 border-red-200',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    default: 'bg-bk-surface text-bk-dark-gray border-bk-low-contrast',
  }
  return (
    <span className={cn('inline-flex items-center px-2 h-5 text-[11px] font-bold font-lato rounded border', colors[color])}>
      {children}
    </span>
  )
}
