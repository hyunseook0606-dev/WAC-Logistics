import { useMemo, useState } from 'react'
import {
  Plane,
  Box,
  ArrowRight,
  Copy,
  CheckCircle2,
  Ship,
  Truck,
  Warehouse,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Loader2,
} from 'lucide-react'

type Cargo = {
  length: number
  width: number
  height: number
  weight: number
}

const NAV = [
  { label: 'About WAC', href: '#about' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Instant Quote', href: '#quote' },
  { label: 'Network', href: '#network' },
  { label: 'Contact', href: '#contact' },
]

const SOLUTIONS = [
  {
    icon: Plane,
    title: 'Air Freight',
    desc: 'Time-critical Asia corridor uplift with airline allotments and real-time desk quoting.',
    iconWrap: 'bg-orange-50 text-wac-orange',
    href: '#quote',
  },
  {
    icon: Ship,
    title: 'Ocean Freight',
    desc: 'FCL & LCL programs across major Asian ports with reliable schedule integrity.',
    iconWrap: 'bg-sky-50 text-sky-700',
    href: 'http://www.waclogistics.com/',
  },
  {
    icon: Truck,
    title: 'Road Freight',
    desc: 'Cross-border trucking and last-mile connectivity linked to air and ocean lanes.',
    iconWrap: 'bg-emerald-50 text-emerald-700',
    href: 'http://www.waclogistics.com/',
  },
  {
    icon: Warehouse,
    title: 'Warehousing',
    desc: 'Bonded and non-bonded inventory control close to key gateway airports.',
    iconWrap: 'bg-slate-100 text-wac-navy',
    href: 'http://www.waclogistics.com/',
  },
  {
    icon: ShoppingBag,
    title: 'E-Commerce',
    desc: 'Cross-border fulfillment built for speed, visibility, and scalable peak seasons.',
    iconWrap: 'bg-rose-50 text-rose-600',
    href: 'https://www.favvyhk.com/',
  },
] as const

const NETWORK = [
  { city: 'Korea', focus: 'Seoul · Incheon · Busan' },
  { city: 'Hong Kong', focus: 'HKG Hub · Pearl River Delta' },
  { city: 'China', focus: 'Shanghai · Shenzhen · Guangzhou' },
  { city: 'Asia', focus: 'Singapore · Vietnam · ASEAN' },
]

/** From https://wexpresshk.com/home.html — W Networks */
const W_NETWORKS = [
  {
    name: 'WAC LOGISTICS',
    desc: 'GLOBAL FORWARDER',
    url: 'https://www.waclogistics.com/',
    logo: '/network-1.jpg',
  },
  {
    name: 'W EXPRESS KOREA',
    desc: 'W NETWORKS KOREA',
    url: 'https://www.wexpresskr.com/',
    logo: '/network-2.jpg',
  },
  {
    name: 'W MOBILITY',
    desc: 'INTERNATIONAL MOVES',
    url: 'https://www.wmobility.global/',
    logo: '/network-3.jpg',
  },
  {
    name: 'W CLUB',
    desc: 'E-COMMERCE',
    url: 'https://www.conceptwhk.com/',
    logo: '/network-4.jpg',
  },
  {
    name: 'FAVVY',
    desc: 'ONLINE FASHION',
    url: 'https://www.favvyhk.com/',
    logo: '/network-5.jpg',
  },
]

/**
 * ex-HKG major carriers from:
 * 홍콩 항공수출업무 2026JULY.docx
 * RH/SQ weight breaks from WAC customer quote email (mock until CargoAI/DB).
 */
const CARRIERS = [
  {
    code: 'CX',
    prefix: '160',
    name: 'Cathay Pacific',
    hub: 'HKG',
    schedule: 'SIN/HKG daily freighter & belly',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.85, 1.35, 1.15, 1.0, 0.9],
    fuelPerKg: 0.14,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 8,
    color: '#006564',
  },
  {
    code: 'KE',
    prefix: '180',
    name: 'Korean Air',
    hub: 'ICN',
    schedule: 'Daily Asia corridor',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.75, 1.28, 1.1, 0.98, 0.88],
    fuelPerKg: 0.13,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 7,
    color: '#05184D',
  },
  {
    code: 'OZ',
    prefix: '988',
    name: 'Asiana Airlines',
    hub: 'ICN',
    schedule: 'Daily / multi-freq',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.7, 1.22, 1.05, 0.95, 0.85],
    fuelPerKg: 0.12,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 7,
    color: '#6B2D5B',
  },
  {
    code: 'RH',
    prefix: '828',
    name: 'Hong Kong Air Cargo',
    hub: 'HKG',
    schedule: 'SIN/HKG daily except day 1',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.65, 1.15, 0.95, 0.85, 0.8],
    fuelPerKg: 0.12,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 5,
    color: '#C8102E',
    logoSrc: '/airline-rh.svg',
  },
  {
    code: 'LD',
    prefix: '288',
    name: 'Air Hong Kong',
    hub: 'HKG',
    schedule: 'DHL network freighter',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.6, 1.18, 1.0, 0.9, 0.82],
    fuelPerKg: 0.11,
    extraPerKg: 0.05,
    extraLabel: 'XBC',
    cgFee: 6,
    color: '#D40511',
  },
  {
    code: 'CZ',
    prefix: '784',
    name: 'China Southern',
    hub: 'CAN',
    schedule: 'China gateway uplift',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.55, 1.1, 0.95, 0.85, 0.78],
    fuelPerKg: 0.11,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 6,
    color: '#0055A5',
  },
  {
    code: 'MU',
    prefix: '781',
    name: 'China Eastern',
    hub: 'PVG',
    schedule: 'SHA/PVG connection',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.55, 1.12, 0.98, 0.88, 0.8],
    fuelPerKg: 0.11,
    extraPerKg: 0,
    extraLabel: '',
    cgFee: 6,
    color: '#E4002B',
  },
  {
    code: 'SQ',
    prefix: '618',
    name: 'Singapore Airlines',
    hub: 'SIN',
    schedule: 'SIN/HKG daily',
    breaks: [45, 100, 250, 500, 1000],
    rates: [1.7, 1.25, 1.15, 1.0, 0.85],
    fuelPerKg: 0.1,
    extraPerKg: 0.2,
    extraLabel: 'XBC',
    cgFee: 6,
    color: '#00266B',
    logoSrc: '/airline-sq.svg',
  },
  {
    code: 'EK',
    prefix: '176',
    name: 'Emirates SkyCargo',
    hub: 'DXB',
    schedule: 'Widebody freighter',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.95, 1.45, 1.25, 1.1, 0.98],
    fuelPerKg: 0.15,
    extraPerKg: 0.08,
    extraLabel: 'XBC',
    cgFee: 10,
    color: '#D71921',
  },
  {
    code: 'QR',
    prefix: '157',
    name: 'Qatar Airways',
    hub: 'DOH',
    schedule: 'Freighter & belly',
    breaks: [45, 100, 300, 500, 1000],
    rates: [1.9, 1.42, 1.22, 1.08, 0.95],
    fuelPerKg: 0.14,
    extraPerKg: 0.08,
    extraLabel: 'XBC',
    cgFee: 9,
    color: '#5C0632',
  },
  {
    code: 'LH',
    prefix: '020',
    name: 'Lufthansa Cargo',
    hub: 'FRA',
    schedule: 'Europe gateway',
    breaks: [45, 100, 300, 500, 1000],
    rates: [2.05, 1.55, 1.35, 1.2, 1.05],
    fuelPerKg: 0.16,
    extraPerKg: 0.1,
    extraLabel: 'XBC',
    cgFee: 12,
    color: '#05164D',
  },
  {
    code: 'CV',
    prefix: '172',
    name: 'Cargolux',
    hub: 'LUX',
    schedule: 'Main-deck freighter',
    breaks: [45, 100, 300, 500, 1000],
    rates: [2.0, 1.5, 1.3, 1.15, 1.0],
    fuelPerKg: 0.15,
    extraPerKg: 0.1,
    extraLabel: 'XBC',
    cgFee: 11,
    color: '#FFCC00',
  },
] as const

/** Local origin charges from WAC quote email (ex-work) */
const EX_WORK_CHARGES = [
  { label: 'Export Permit', value: '$50.00 per set' },
  { label: 'Doc Fee', value: '$50.00 per set' },
  { label: 'Export Transfer Fee', value: '$0.08/kg or Minimum $20.00/shipment' },
  { label: 'Wt. Verification', value: '$2.00/shipment' },
  { label: 'Screening fee', value: '$0.03/kg or Minimum $20.00' },
  { label: 'AWB fee', value: '$10.00/set' },
  { label: 'Fuel Surcharge', value: '$15.00 per trip' },
  { label: 'TRUCKING CHG', value: '$200.00 (Collect & delivery to FTZ)' },
]

type Carrier = (typeof CARRIERS)[number]

function pickBreakRate(breaks: readonly number[], rates: readonly number[], cw: number) {
  let rate = rates[0]
  for (let i = 0; i < breaks.length; i++) {
    if (cw >= breaks[i]) rate = rates[i]
  }
  return rate
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function pad(str: string, len: number) {
  return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length)
}

/** Build WAC-style quote for Outlook: HTML table + clean plain fallback */
function buildCarrierEmailDraft(opts: {
  origin: string
  destination: string
  length: number
  width: number
  height: number
  weight: number
  cw: number
  carrier: Carrier & {
    ratePerKg: number
    base: number
    surcharge: number
    total: number
  }
  validUntil: string
}): { html: string; plain: string } {
  const {
    origin,
    destination,
    length,
    width,
    height,
    weight,
    cw,
    carrier,
    validUntil,
  } = opts

  const destName =
    destination === 'HKG'
      ? 'Hong Kong'
      : destination === 'SIN'
        ? 'Singapore'
        : destination

  const headers = ['Destination', 'AIRPORT', ...carrier.breaks.map(String)]
  const values = [
    destName,
    destination,
    ...carrier.rates.map((r) => `$${r.toFixed(2)}`),
  ]

  const plainTable = [
    headers.join('\t'),
    values.join('\t'),
  ].join('\n')

  const htmlTable = `
<table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#94a3b8;font-family:Calibri,Arial,sans-serif;font-size:12pt;">
  <thead>
    <tr style="background:#f1f5f9;">
      ${headers.map((h) => `<th style="text-align:left;padding:6px 10px;">${escapeHtml(h)}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    <tr>
      ${values.map((v) => `<td style="padding:6px 10px;">${escapeHtml(v)}</td>`).join('')}
    </tr>
  </tbody>
</table>`.trim()

  const extraPlain =
    carrier.extraPerKg > 0
      ? `${carrier.extraLabel || 'Extra'} at $${carrier.extraPerKg.toFixed(2)}/kg on C.W.\n`
      : ''
  const extraHtml =
    carrier.extraPerKg > 0
      ? `<div>${escapeHtml(carrier.extraLabel || 'Extra')} at $${carrier.extraPerKg.toFixed(2)}/kg on C.W.</div>`
      : ''

  const exWorkPlain = EX_WORK_CHARGES.map(
    (c) => `${pad(c.label + ':', 22)} ${c.value}`,
  ).join('\n')

  const exWorkHtml = `
<table cellpadding="4" cellspacing="0" border="0" style="font-family:Calibri,Arial,sans-serif;font-size:12pt;">
  ${EX_WORK_CHARGES.map(
    (c) =>
      `<tr><td style="padding:2px 24px 2px 0;white-space:nowrap;">${escapeHtml(c.label)}</td><td style="padding:2px 0;">${escapeHtml(c.value)}</td></tr>`,
  ).join('')}
</table>`.trim()

  const plain = `Dear Customer,

Please see below for the air freight cost from ${origin} to ${destination}.

${length} x ${width} x ${height}cm / 1PTL, ${weight.toFixed(1)}KGS
Chargeable Weight (C.W.): ${cw.toFixed(1)} KGS
Quote valid until: ${validUntil}

Kindly find the rate as below (All in USD)

${carrier.code} — ${carrier.name} (AWB Prefix ${carrier.prefix})
${plainTable}
MYC at $${carrier.fuelPerKg.toFixed(2)}/kg on C.W.
${extraPlain}CG fee at $${carrier.cgFee.toFixed(2)}/MAWB
Schedule: ${carrier.schedule}

Estimated airfreight total (based on C.W. ${cw.toFixed(1)} kg @ $${carrier.ratePerKg.toFixed(2)}/kg):
USD ${carrier.total.toFixed(2)}

Ex-work charges:-
${exWorkPlain}

* Subject to final capacity, equipment availability and WAC confirmation.
Best regards,
WAC Logistics — Digital Freight Desk`

  const html = `<!DOCTYPE html>
<html><body style="font-family:Calibri,Arial,sans-serif;font-size:12pt;color:#1A2A3A;line-height:1.45;">
<div>Dear Customer,</div>
<br/>
<div>Please see below for the air freight cost from <b>${escapeHtml(origin)}</b> to <b>${escapeHtml(destination)}</b>.</div>
<br/>
<div>${length} x ${width} x ${height}cm / 1PTL, ${weight.toFixed(1)}KGS</div>
<div>Chargeable Weight (C.W.): <b>${cw.toFixed(1)} KGS</b></div>
<div>Quote valid until: ${escapeHtml(validUntil)}</div>
<br/>
<div>Kindly find the rate as below (All in USD)</div>
<br/>
<div><u><b>${escapeHtml(carrier.code)}</b></u> — ${escapeHtml(carrier.name)} (AWB Prefix ${escapeHtml(carrier.prefix)})</div>
<br/>
${htmlTable}
<br/>
<div>MYC at $${carrier.fuelPerKg.toFixed(2)}/kg on C.W.</div>
${extraHtml}
<div>CG fee at $${carrier.cgFee.toFixed(2)}/MAWB</div>
<div>Schedule: ${escapeHtml(carrier.schedule)}</div>
<br/>
<div>Estimated airfreight total (based on C.W. ${cw.toFixed(1)} kg @ $${carrier.ratePerKg.toFixed(2)}/kg):</div>
<div style="font-size:14pt;"><b>USD ${carrier.total.toFixed(2)}</b></div>
<br/>
<div><u><b>Ex-work charges:-</b></u></div>
${exWorkHtml}
<br/>
<div style="color:#64748b;font-size:10pt;">* Subject to final capacity, equipment availability and WAC confirmation.</div>
<br/>
<div>Best regards,<br/>WAC Logistics — Digital Freight Desk</div>
</body></html>`

  return { html, plain }
}

function AirlineLogo({
  code,
  name,
  color,
  logoSrc,
}: {
  code: string
  name: string
  color: string
  logoSrc?: string
}) {
  const remote = `https://pics.avs.io/120/80/${code}.png`
  // Prefer local asset for cargo-only codes (e.g. RH) that passenger logo CDNs miss
  const [src, setSrc] = useState<string>(logoSrc || remote)
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-1.5 shadow-sm">
      {!failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          onError={() => {
            if (!logoSrc && src === remote) {
              setFailed(true)
              return
            }
            if (logoSrc && src !== logoSrc) {
              setSrc(logoSrc)
              return
            }
            setFailed(true)
          }}
        />
      ) : (
        <span
          className="font-display text-[13px] font-black tracking-wide text-white"
          style={{
            background: color,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}
        >
          {code}
        </span>
      )}
    </div>
  )
}

function WacLogoMark({ className = 'h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 48"
      className={className}
      role="img"
      aria-label="WAC Logistics"
    >
      <g transform="translate(2,6)">
        <path d="M2 34 L10 2 L16 2 L8 34 Z" fill="#1A2A3A" />
        <path d="M14 34 L22 2 L28 2 L20 34 Z" fill="#1A2A3A" />
        <path d="M26 34 L34 2 L40 2 L32 34 Z" fill="#F05023" />
        <path d="M38 34 L46 2 L52 2 L44 34 Z" fill="#1A2A3A" />
        <path
          d="M78 18 A16 16 0 1 0 78 22"
          fill="none"
          stroke="#1A2A3A"
          strokeWidth="8"
          strokeLinecap="butt"
        />
        <path
          d="M78 22 A16 16 0 0 0 70 32"
          fill="none"
          stroke="#F05023"
          strokeWidth="8"
          strokeLinecap="butt"
        />
      </g>
      <text
        x="100"
        y="22"
        fill="#1A2A3A"
        fontFamily="Barlow, IBM Plex Sans, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="1.5"
      >
        WAC
      </text>
      <text
        x="100"
        y="38"
        fill="#1A2A3A"
        fontFamily="Barlow, IBM Plex Sans, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="3.2"
      >
        LOGISTICS
      </text>
    </svg>
  )
}

function WacLogo({
  variant = 'color',
  className = 'h-9',
}: {
  variant?: 'color' | 'white'
  className?: string
}) {
  const [imgFailed, setImgFailed] = useState(false)

  if (variant === 'color') {
    if (imgFailed) return <WacLogoMark className={className} />
    return (
      <img
        src="/wac-logo.png"
        alt="WAC Logistics"
        className={`${className} w-auto object-contain`}
        onError={() => setImgFailed(true)}
      />
    )
  }

  if (imgFailed) {
    return (
      <span className={`inline-flex items-baseline gap-2 ${className}`}>
        <span className="font-display text-xl leading-none font-extrabold tracking-widest text-white">
          WAC
        </span>
        <span className="text-[10px] font-semibold tracking-[0.22em] text-white/65">
          LOGISTICS
        </span>
      </span>
    )
  }

  return (
    <img
      src="/wac-logo-white.png"
      alt="WAC Logistics"
      className={`${className} w-auto object-contain opacity-90`}
      onError={() => setImgFailed(true)}
    />
  )
}

function CostBreakdownBar({
  baseAmount,
  surchargeAmount,
}: {
  baseAmount: number
  surchargeAmount: number
}) {
  const total = baseAmount + surchargeAmount
  const basePct = total > 0 ? (baseAmount / total) * 100 : 0
  const surchargePct = total > 0 ? (surchargeAmount / total) * 100 : 0

  return (
    <div className="mt-3 w-full">
      <div className="flex h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-wac-navy transition-all duration-500"
          style={{ width: `${basePct}%` }}
        />
        <div
          className="h-full bg-wac-orange transition-all duration-500"
          style={{ width: `${surchargePct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-wac-navy" />
          Base {basePct.toFixed(0)}%
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-wac-orange" />
          Surcharge {surchargePct.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

function formatValidUntil(daysAhead = 7) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function App() {
  const [origin, setOrigin] = useState('SIN')
  const [destination, setDestination] = useState('HKG')
  const [cargo, setCargo] = useState<Cargo>({
    length: 120,
    width: 100,
    height: 60,
    weight: 83.6,
  })
  const [copied, setCopied] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [formError, setFormError] = useState('')

  const volWeight = (cargo.length * cargo.width * cargo.height) / 6000
  const cw = Math.max(Number(cargo.weight) || 0, volWeight || 0)

  const quotes = useMemo(() => {
    return CARRIERS.map((c) => {
      const ratePerKg = pickBreakRate(c.breaks, c.rates, cw)
      const base = ratePerKg * cw
      const surcharge = c.fuelPerKg * cw + c.extraPerKg * cw + c.cgFee
      const total = base + surcharge
      return { ...c, ratePerKg, base, surcharge, total }
    }).sort((a, b) => a.total - b.total)
  }, [cw])

  const quoteValidUntil = useMemo(() => formatValidUntil(7), [showResult])

  const updateCargo = (key: keyof Cargo, value: string) => {
    setCargo({ ...cargo, [key]: Number(value) })
  }

  const handleCalculate = () => {
    const o = origin.trim().toUpperCase()
    const d = destination.trim().toUpperCase()
    if (!o || !d) {
      setFormError('출발지와 도착지 공항 코드(예: SIN, HKG)를 입력해 주세요.')
      return
    }
    if (
      ![cargo.length, cargo.width, cargo.height, cargo.weight].every(
        (n) => Number.isFinite(n) && n > 0,
      )
    ) {
      setFormError('치수와 실중량을 올바르게 입력해 주세요.')
      return
    }
    setFormError('')
    setOrigin(o)
    setDestination(d)
    setShowResult(false)
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setShowResult(true)
    }, 1500)
  }

  const copyRichEmail = async (html: string, plain: string) => {
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' }),
          }),
        ])
        return
      }
    } catch {
      // fall through to plain
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(plain)
      return
    }
    const ta = document.createElement('textarea')
    ta.value = plain
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    if (!ok) throw new Error('copy failed')
  }

  const handleCopyEmailDraft = async (
    carrier: (typeof quotes)[number],
  ) => {
    const { html, plain } = buildCarrierEmailDraft({
      origin,
      destination,
      length: cargo.length,
      width: cargo.width,
      height: cargo.height,
      weight: Number(cargo.weight),
      cw,
      carrier,
      validUntil: quoteValidUntil,
    })
    try {
      await copyRichEmail(html, plain)
      setCopied(carrier.code)
      setToast('표 형식 이메일 초안 복사됨 — Outlook에 붙여넣기')
      window.setTimeout(() => {
        setCopied('')
        setToast('')
      }, 2200)
    } catch {
      setToast('클립보드 복사에 실패했습니다.')
      window.setTimeout(() => setToast(''), 2200)
    }
  }

  /** Shipper CTA: open mail to WAC with inquiry (not desk paste) */
  const handleRequestQuote = (carrier: (typeof quotes)[number]) => {
    const subject = encodeURIComponent(
      `[Quote Request] ${origin}-${destination} / ${carrier.code} / ${cw.toFixed(1)}KGS`,
    )
    const body = encodeURIComponent(
      `Hello WAC Logistics,\n\nI would like an official quote for the below shipment.\n\nLane: ${origin} → ${destination}\nDims: ${cargo.length} x ${cargo.width} x ${cargo.height} cm\nGross: ${Number(cargo.weight).toFixed(1)} KGS\nC.W.: ${cw.toFixed(1)} KGS\nPreferred carrier: ${carrier.code} (${carrier.name})\nIndicative total (web): USD ${carrier.total.toFixed(2)}\n\nPlease confirm allotment, final rate and transit.\n\nThank you.`,
    )
    window.location.href = `mailto:service@waclogistics.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-white font-sans text-wac-navy">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6 lg:px-8">
          <a href="#top" className="shrink-0" aria-label="WAC Logistics home">
            <WacLogo variant="color" className="h-8 sm:h-9" />
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-wac-navy lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition hover:text-wac-orange"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#quote"
            className="inline-flex items-center gap-1 rounded bg-wac-orange px-3.5 py-2 text-[12px] font-bold text-white transition hover:bg-[#d9441c]"
          >
            Get Quote
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* HERO — full-bleed cargo freighter */}
      <section
        id="top"
        className="relative h-[92vh] min-h-[600px] max-h-[900px] overflow-hidden bg-wac-navy"
      >
        <div className="absolute inset-0">
          <img
            src="/hero-cargo-takeoff.png"
            alt="WAC cargo freighter takeoff"
            className="hero-pan h-full w-full object-cover object-[center_35%]"
          />
          {/* Keep plane visible: lighter overlay on right, readable copy on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-wac-navy/92 via-wac-navy/55 to-wac-navy/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-wac-navy/75 via-transparent to-wac-navy/25" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F05023]/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-center px-6 lg:px-8">
          <p className="fade-up mb-4 text-[12px] font-bold tracking-[0.28em] text-wac-orange uppercase">
            Delivering Asia, Delivering Trust
          </p>
          <h1 className="fade-up-d1 font-display max-w-3xl text-4xl leading-[1.1] font-extrabold text-white drop-shadow-sm sm:text-5xl lg:text-[56px]">
            What WAC delivers
            <br />
            is trust and value.
          </h1>
          <p className="fade-up-d2 mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
            We build trust to deliver value to customers throughout Asia —
            with a Digital Freight Desk that quotes air rates in seconds.
          </p>
          <div className="fade-up-d2 mt-8 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="inline-flex items-center gap-2 rounded bg-wac-orange px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-[#F05023]/30 transition hover:bg-[#d9441c]"
            >
              Instant Air Quote
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#solutions"
              className="inline-flex items-center gap-2 rounded border border-white/35 bg-white/5 px-5 py-3 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>

      {/* SOLUTIONS — enterprise SaaS cards */}
      <section
        id="solutions"
        className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-wac-orange uppercase">
              Solutions
            </p>
            <h2 className="font-display mb-4 text-3xl font-black tracking-tight text-wac-navy sm:text-4xl">
              End-to-end freight across Asia
            </h2>
            <p className="text-[16px] leading-relaxed text-slate-500 sm:text-lg">
              Air, ocean, road, warehousing and e-commerce — one network, one
              operating standard, one trusted partner.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {SOLUTIONS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                {...(item.href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-wac-orange hover:shadow-xl hover:shadow-[#F05023]/10 sm:p-7"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent transition-all duration-300 group-hover:from-wac-orange group-hover:to-orange-400" />

                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-wac-orange group-hover:text-white sm:mb-6 sm:h-14 sm:w-14 ${item.iconWrap}`}
                >
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
                </div>

                <h3 className="mb-2 text-lg font-bold text-wac-navy transition-colors group-hover:text-wac-orange sm:mb-3 sm:text-xl">
                  {item.title}
                </h3>
                <p className="flex-grow text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                  {item.desc}
                </p>

                <div className="mt-6 flex items-center text-sm font-bold text-wac-orange opacity-0 transition-all duration-300 -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 sm:mt-8">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* INSTANT QUOTE */}
      <section id="quote" className="bg-[#F4F7F9] py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mb-10">
            <p className="mb-2 text-[11px] font-bold tracking-[0.22em] text-wac-orange uppercase">
              Digital Freight Desk
            </p>
            <h2 className="font-display text-3xl font-extrabold text-wac-navy sm:text-4xl">
              Instant Air Freight Quote
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-slate-500">
              Editable lane · Chargeable weight engine · WAC major carriers
              (CX / KE / OZ / RH / LD / CZ / MU / SQ / EK / QR / LH / CV)
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Box className="h-5 w-5 text-wac-orange" />
                  <h3 className="text-lg font-bold text-wac-navy">
                    Cargo Details
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-[45%]">
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Origin
                      </label>
                      <input
                        type="text"
                        value={origin}
                        maxLength={3}
                        onChange={(e) =>
                          setOrigin(e.target.value.toUpperCase())
                        }
                        placeholder="SIN"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold uppercase tracking-wider text-slate-700 outline-none transition focus:border-wac-orange focus:ring-1 focus:ring-wac-orange"
                      />
                    </div>
                    <ArrowRight className="mt-5 h-4 w-4 shrink-0 text-slate-300" />
                    <div className="w-[45%]">
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Destination
                      </label>
                      <input
                        type="text"
                        value={destination}
                        maxLength={3}
                        onChange={(e) =>
                          setDestination(e.target.value.toUpperCase())
                        }
                        placeholder="HKG"
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold uppercase tracking-wider text-slate-700 outline-none transition focus:border-wac-orange focus:ring-1 focus:ring-wac-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        ['length', 'L (cm)'],
                        ['width', 'W (cm)'],
                        ['height', 'H (cm)'],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                          {label}
                        </label>
                        <input
                          type="number"
                          value={cargo[key]}
                          onChange={(e) => updateCargo(key, e.target.value)}
                          className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none transition focus:border-wac-orange focus:ring-1 focus:ring-wac-orange"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Gross Weight (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={cargo.weight}
                        onChange={(e) => updateCargo('weight', e.target.value)}
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm font-medium outline-none transition focus:border-wac-orange focus:ring-1 focus:ring-wac-orange"
                      />
                      <span className="absolute top-3 right-3 text-sm font-medium text-slate-400">
                        KG
                      </span>
                    </div>
                  </div>

                  {formError && (
                    <p className="rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-600">
                      {formError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-wac-orange text-sm font-bold text-white shadow-lg shadow-[#F05023]/25 transition hover:bg-[#d9441c] disabled:cursor-wait disabled:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="spinner h-4 w-4" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Calculate Quote
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              {isLoading ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
                  <Loader2 className="spinner mb-4 h-10 w-10 text-wac-orange" />
                  <h4 className="mb-1 text-lg font-bold text-slate-700">
                    Fetching live rates from carriers...
                  </h4>
                  <p className="max-w-sm text-center text-sm text-slate-500">
                    Querying WAC major airlines for {origin} → {destination}
                    (mock rates until CargoAI / rate DB).
                  </p>
                </div>
              ) : !showResult ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 p-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Plane className="h-8 w-8 text-slate-300" />
                  </div>
                  <h4 className="mb-1 text-lg font-bold text-slate-700">
                    Ready for Quote
                  </h4>
                  <p className="max-w-sm text-center text-sm text-slate-500">
                    Enter origin, destination, dimensions and weight to compare
                    12 WAC major carriers instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="mb-1 text-[11px] font-bold tracking-wider text-blue-500">
                          APPLIED CHARGEABLE WEIGHT
                        </p>
                        <p className="text-2xl font-black text-blue-900">
                          {cw.toFixed(1)} KGS
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                          {origin}
                          <Plane className="h-3 w-3" />
                          {destination}
                          <span className="font-medium text-blue-500">
                            · {quotes.length} options
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-end gap-6 text-right">
                        <div>
                          <p className="mb-0.5 text-[10px] font-bold text-slate-400 uppercase">
                            Gross
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {Number(cargo.weight).toFixed(1)} kg
                          </p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[10px] font-bold text-slate-400 uppercase">
                            Volumetric
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {volWeight.toFixed(1)} kg
                          </p>
                        </div>
                        <div>
                          <p className="mb-0.5 text-[10px] font-bold text-slate-400 uppercase">
                            Quote Valid Until
                          </p>
                          <p className="text-sm font-bold text-blue-800">
                            {quoteValidUntil}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
                    {quotes.map((q, index) => (
                      <div
                        key={q.code}
                        className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-lg"
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <AirlineLogo
                              code={q.code}
                              name={q.name}
                              color={q.color}
                              logoSrc={'logoSrc' in q ? q.logoSrc : undefined}
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-[16px] font-extrabold text-wac-navy">
                                  {q.name}
                                </h4>
                                <span className="rounded bg-wac-navy px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                                  {q.code}
                                </span>
                                <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                                  AWB {q.prefix}
                                </span>
                                {index === 0 && (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    BEST VALUE
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="font-bold text-slate-700">
                                  {origin}
                                </span>
                                <Plane className="h-3 w-3 text-slate-400" />
                                <span className="font-bold text-slate-700">
                                  {destination}
                                </span>
                                <span className="text-slate-300">|</span>
                                Hub {q.hub}
                                <span className="text-slate-300">|</span>
                                {q.schedule}
                              </p>
                            </div>
                          </div>
                          <div className="min-w-[150px] text-right">
                            <p className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                              Estimated Total
                            </p>
                            <p
                              className={`font-display text-2xl font-black ${
                                index === 0 ? 'text-wac-orange' : 'text-wac-navy'
                              }`}
                            >
                              <span className="mr-1 text-sm font-semibold text-slate-400">
                                USD
                              </span>
                              {q.total.toFixed(2)}
                            </p>
                            <CostBreakdownBar
                              baseAmount={q.base}
                              surchargeAmount={q.surcharge}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                          <div className="flex flex-wrap gap-5 text-[12px]">
                            <span className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Rate
                              </span>
                              <span className="font-semibold text-slate-700">
                                ${q.ratePerKg.toFixed(2)}/kg
                              </span>
                            </span>
                            <span className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                MYC
                              </span>
                              <span className="font-semibold text-slate-700">
                                ${q.fuelPerKg.toFixed(2)}/kg
                              </span>
                            </span>
                            {q.extraPerKg > 0 && (
                              <span className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  {q.extraLabel || 'Extra'}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  ${q.extraPerKg.toFixed(2)}/kg
                                </span>
                              </span>
                            )}
                            <span className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                CG Fee
                              </span>
                              <span className="font-semibold text-slate-700">
                                ${q.cgFee.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRequestQuote(q)}
                              className="flex items-center gap-1.5 rounded-lg bg-wac-navy px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#24384c]"
                            >
                              Request Quote
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyEmailDraft(q)}
                              className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-wac-orange hover:text-wac-orange"
                              title="WAC desk: copy table-format email draft"
                            >
                              {copied === q.code ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                              {copied === q.code
                                ? 'Copied!'
                                : 'Copy Email Draft'}
                            </button>
                          </div>
                        </div>
                        <p className="mt-2.5 text-[10px] text-slate-400">
                          * Indicative web rate. Shippers: use Request Quote.
                          WAC desk: Copy Email Draft pastes table format like
                          Outlook quotes.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NETWORK & OFFICES */}
      <section id="network" className="border-y border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="mb-2 text-[11px] font-bold tracking-[0.22em] text-wac-orange uppercase">
            Network & Offices
          </p>
          <h2 className="font-display mb-3 text-3xl font-extrabold text-wac-navy sm:text-4xl">
            Asia coverage that moves with you
          </h2>
          <p className="mb-12 max-w-2xl text-[15px] text-slate-500">
            Local desks, shared operating cadence, and gateway strength across
            Korea, Hong Kong, China and the wider Asian corridor.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NETWORK.map((n) => (
              <div
                key={n.city}
                className="border-l-2 border-wac-orange bg-wac-slate px-5 py-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-wac-orange" />
                  <h3 className="text-[16px] font-bold text-wac-navy">
                    {n.city}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-500">{n.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative overflow-hidden bg-wac-navy py-24">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/hero-cargo-takeoff.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-wac-navy/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="mb-4 text-[11px] font-bold tracking-[0.22em] text-wac-orange uppercase">
            About WAC
          </p>
          <h2 className="font-display max-w-3xl text-3xl leading-tight font-extrabold text-white sm:text-4xl">
            Building trust to deliver value
            <br />
            throughout Asia — and beyond.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70">
            WAC Int&apos;l Logistics connects shippers, airlines and destination
            partners with disciplined execution. Instant Quote digitizes the
            desk workflow that used to live in spreadsheets and email threads.
          </p>
          <a
            href="http://www.waclogistics.com/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-white transition hover:text-wac-orange"
          >
            Visit waclogistics.com
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* W NETWORKS — only addition */}
      <section id="w-networks" className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-black tracking-wider text-wac-navy">
              W NETWORKS
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-slate-300" />
              <Truck className="h-5 w-5 text-wac-orange" />
              <div className="h-px w-16 bg-slate-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {W_NETWORKS.map((net) => (
              <a
                key={net.name}
                href={net.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-28 w-full items-center justify-center overflow-hidden rounded-t-sm border-b-4 border-wac-navy bg-[#F4F7F9] transition-colors group-hover:border-wac-orange">
                  <img
                    src={net.logo}
                    alt={net.name}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <h4 className="mb-1 text-sm font-bold text-wac-navy transition-colors group-hover:text-wac-orange">
                  {net.name}
                </h4>
                <p className="text-[10px] font-bold tracking-wide text-slate-400">
                  {net.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-wac-navy">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <WacLogo variant="white" className="h-7" />
            <p className="mt-4 text-[12px] leading-relaxed text-white/50">
              WAC Int&apos;l Logistics Co., Ltd.
              <br />
              Delivering Asia, Delivering Trust.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-[12px] font-bold tracking-wider text-white uppercase">
              Solutions
            </h4>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>Air Freight</li>
              <li>Ocean Freight</li>
              <li>Road Freight</li>
              <li>Warehousing</li>
              <li>E-Commerce</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-[12px] font-bold tracking-wider text-white uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>About Us</li>
              <li>History</li>
              <li>Newsroom</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-[12px] font-bold tracking-wider text-white uppercase">
              Contact
            </h4>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>Service Inquiries</li>
              <li>Become a Partner</li>
              <li>
                <a
                  href="#quote"
                  className="font-semibold text-wac-orange hover:underline"
                >
                  Instant Quote Desk
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-8">
            <p className="text-[11px] text-white/40">
              © WAC Int&apos;l Logistics Co., Ltd. All Rights Reserved.
            </p>
            <p className="text-[11px] text-white/35">
              Digital Freight Desk · Prototype
            </p>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="toast-in fixed bottom-5 left-1/2 z-50 rounded-lg bg-wac-navy px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
