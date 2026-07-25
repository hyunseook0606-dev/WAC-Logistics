import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

type HeroProps = {
  /** reserved for future desk deep-link from hero */
  onOpenDesk?: () => void
}

/**
 * Full-bleed hero + copy ON the image = standard for DHL / Maersk / WAC.
 * Brand headline first; Instant Quote is the primary CTA (product depth below).
 */
export function Hero(_props: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(rect.height, 1)),
      )
      setOffset(progress * 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[90vh] min-h-[580px] max-h-[880px] overflow-hidden bg-wac-navy"
    >
      {/* Full-bleed photo — plane is the hero visual */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${offset * 0.4}px, 0)` }}
      >
        <img
          src="/hero-cargo-takeoff.png"
          alt="WAC cargo freighter takeoff"
          className={`hero-pan h-[112%] w-full object-cover object-[center_30%] transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Soft left veil only — keep freighter readable (not a solid navy slab) */}
        <div className="absolute inset-0 bg-gradient-to-r from-wac-navy/85 via-wac-navy/45 to-wac-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-wac-navy/70 via-transparent to-wac-navy/25" />
      </div>

      <div
        className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-center px-6 lg:px-8"
        style={{ transform: `translate3d(0, ${offset * -0.12}px, 0)` }}
      >
        <p
          className={`mb-4 text-[12px] font-bold tracking-[0.28em] text-wac-orange uppercase transition duration-700 ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Delivering Asia, Delivering Trust
        </p>
        <h1
          className={`font-display max-w-3xl text-4xl leading-[1.1] font-extrabold text-white drop-shadow-sm transition duration-700 delay-100 sm:text-5xl lg:text-[56px] ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          What WAC delivers
          <br />
          is trust and value.
        </h1>
        <p
          className={`mt-5 max-w-xl text-[16px] leading-relaxed text-white/80 transition duration-700 delay-200 ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          Asia logistics under one brand — and Instant Air Quote when you need
          rates in seconds.
        </p>
        <div
          className={`mt-8 flex flex-wrap gap-3 transition duration-700 delay-300 ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <a
            href="#quote"
            className="inline-flex items-center gap-2 rounded bg-wac-orange px-5 py-3.5 text-[13px] font-bold text-white shadow-lg shadow-[#F05023]/30 transition hover:bg-[#d9441c]"
          >
            Instant Air Quote
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#solutions"
            className="inline-flex items-center gap-2 rounded border border-white/45 bg-white/10 px-5 py-3.5 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/15"
          >
            Our Solutions
          </a>
        </div>
      </div>
    </section>
  )
}
