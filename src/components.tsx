import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown, Info } from 'lucide-react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function Field({ label, hint, error, unit, children }: { label: string; hint?: string; error?: string; unit?: string; children: ReactNode }) {
  return <label className={`field ${error ? 'has-error' : ''}`}>
    <span className="field-label">{label}</span>
    {hint && <span className="field-hint">{hint}</span>}
    <span className="control-wrap">{children}{unit && <span className="unit">{unit}</span>}</span>
    {error && <span className="field-error" role="alert">{error}</span>}
  </label>
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" inputMode="decimal" {...props} />
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <span className="select-wrap"><select {...props}>{children}</select><ChevronDown size={16} aria-hidden /></span>
}

export function Notice({ children }: { children: ReactNode }) {
  return <div className="notice"><Info size={17} aria-hidden /><span>{children}</span></div>
}

export function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return <label className="toggle-row"><button type="button" role="switch" aria-checked={checked} className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}><span /></button><span>{children}</span></label>
}

export function Metric({ eyebrow, value, note, tone = 'green' }: { eyebrow: string; value: string; note: string; tone?: 'green' | 'blue' | 'neutral' }) {
  return <article className={`metric metric-${tone}`}><p>{eyebrow}</p><strong>{value}</strong><span>{note}</span></article>
}

export function MoneyBar({ label, value, max, formatted, variant }: { label: string; value: number; max: number; formatted: string; variant: 'current' | 'offer' }) {
  return <div className="bar-row"><div className="bar-meta"><span>{label}</span><strong>{formatted}</strong></div><div className="bar-track"><span className={variant} style={{ width: `${Math.max(2, value / max * 100)}%` }} /></div></div>
}
