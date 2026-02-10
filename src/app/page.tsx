'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import scooterAnimation from '../../public/assets/scooter-lottie.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Helpers ─────────────────────────────────────────────
function formatINR(n: number) {
  return Math.round(n).toLocaleString('en-IN')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/* ═══════════════════════════════════════════════════════════
   REUSABLE COMPONENTS — Ola Design System
   ═══════════════════════════════════════════════════════════ */

// ── Pill ──
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white/90 px-3 py-1.5 text-md font-medium text-[var(--color-text-muted)]">
      {children}
    </span>
  )
}

// ── Stat Card ──
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 sm:p-6">
      <div className="text-md font-medium text-[var(--color-text-muted)]">{label}</div>
      <div className="mt-2 text-[28px] sm:text-[32px] font-semibold tracking-tight text-[var(--color-text-primary)]">{value}</div>
      {sub && <div className="mt-1 text-md text-[var(--color-text-muted)]">{sub}</div>}
    </div>
  )
}

// ── Bento Card ──
function BentoItem({ title, desc, tag, image }: { title: string; desc: string; tag: string; image: string }) {
  return (
    <div className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white overflow-hidden">
      <div className="h-64 bg-gray-50 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="text-base font-medium px-2.5 py-1 rounded-[var(--radius-pill)] bg-white backdrop-blur-sm text-[var(--color-text-primary)]">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="text-2xl font-semibold text-[var(--color-text-primary)]">{title}</div>
        <div className="mt-1.5 text-md leading-relaxed text-[var(--color-text-muted)]">{desc}</div>
      </div>
    </div>
  )
}

// ── Period Toggle (Monthly / Yearly) ──
function PeriodToggle({
  value,
  onChange,
}: {
  value: 'monthly' | 'yearly'
  onChange: (v: 'monthly' | 'yearly') => void
}) {
  return (
    <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white p-0.5">
      <button
        onClick={() => onChange('monthly')}
        className={`focus-ring px-3 py-1 text-[11px] font-medium rounded-[var(--radius-pill)] transition-all duration-150 ${
          value === 'monthly'
            ? 'bg-[var(--color-accent-green)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('yearly')}
        className={`focus-ring px-3 py-1 text-[11px] font-medium rounded-[var(--radius-pill)] transition-all duration-150 ${
          value === 'yearly'
            ? 'bg-[var(--color-accent-green)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        }`}
      >
        Yearly
      </button>
    </div>
  )
}

// ── Segmented Control ──
function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`focus-ring px-4 py-2 text-lg font-medium rounded-[var(--radius-pill)] transition-all duration-150 ${
              active
                ? 'bg-[var(--color-accent-green)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Primary Button ──
function PrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center gap-2 h-12 px-6 rounded-sm bg-[var(--color-cta-black)] text-white text-lg font-semibold hover:bg-[#1F1F1F] active:bg-black transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  )
}

// ── Secondary Button ──
function SecondaryButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center gap-2 h-12 px-6 rounded-sm bg-white text-[var(--color-text-primary)] text-lg font-semibold border border-[var(--color-border)] hover:bg-[#F9FAFB] active:bg-[#F3F4F6] transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  )
}

// ── Icon Button (carousel arrows etc.) ──
function IconButton({
  children,
  onClick,
  label,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`focus-ring inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] active:bg-[#D1D5DB] hover:scale-110 transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Page() {
  // ── Constants ──
  const PETROL_COST_PER_KM = 2.8
  const EV_COST_PER_KM = 0.35
  const PETROL_KM_PER_100 = 45
  const EV_KM_PER_UNIT = 37
  const UNITS_PER_100 = 5

  // ── State ──
  const [monthlyKm, setMonthlyKm] = useState(800)
  const [costPeriod, setCostPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [budget, setBudget] = useState<'100' | '500' | '1000'>('100')

  // ── Hero Carousel ──
  const heroSlides = [
    {
      pills: ['Upfront savings', 'More distance per rupee', 'Lower running cost'],
      headingDark: 'Switch to electric. Save every ride.',
      description: 'Minimal maintenance. More distance per rupee. Save up to ₹25,000 every year on fuel alone.',
      primaryCta: 'Calculate savings',
      secondaryCta: 'Compare costs',
      primaryLink: 'savings',
      secondaryLink: 'range',
      image: '/assets/savings.png',
      darkText: false,
    },
    {
      pills: ['151 km range', 'True range tested', 'Go further'],
      headingDark: 'Go the distance. Every single day.',
      description: 'Up to 151 km on a single charge. Built for your daily commute and beyond — rain or shine.',
      primaryCta: 'Compare Range',
      secondaryCta: 'View models',
      primaryLink: 'range',
      secondaryLink: 'cta',
      image: '/assets/range.png',
      darkText: true,
    },
    {
      pills: ['500+ service points', '1-day delivery', 'Hyper convenient'],
      headingDark: 'Service reimagined. Hyper convenient.',
      description: 'Doorstep service, 500+ touchpoints, and next-day delivery. Ownership made effortless.',
      primaryCta: 'Explore service',
      secondaryCta: 'Find a center',
      primaryLink: 'service',
      secondaryLink: 'cta',
      image: '/assets/hyperservice.png',
      darkText: true,
    },
  ]

  const [heroSlide, setHeroSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setHeroSlide((prev) => (prev + 1) % heroSlides.length)
  }, [heroSlides.length])

  const prevSlide = useCallback(() => {
    setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [heroSlides.length])

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [nextSlide])

  // ── Derived calculations ──
  const yearlyKm = monthlyKm * 12
  const yearlyPetrol = yearlyKm * PETROL_COST_PER_KM
  const yearlyEV = yearlyKm * EV_COST_PER_KM
  const yearlySavings = Math.max(0, yearlyPetrol - yearlyEV)

  const budgetNum = useMemo(() => parseInt(budget, 10), [budget])
  const petrolKm = (budgetNum / 100) * PETROL_KM_PER_100
  const evKm = (budgetNum / 100) * UNITS_PER_100 * EV_KM_PER_UNIT
  const xMore = Math.max(1, Math.round(evKm / Math.max(1, petrolKm)))

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── GSAP Scroll Animations ──
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each section on scroll
      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      })

      // Animate cards staggered
      gsap.utils.toArray<HTMLElement>('.gsap-stagger').forEach((container) => {
        const children = container.children
        gsap.from(children, {
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        })
      })

      // Stat cards in hero — subtle slide up
      gsap.from('.gsap-stat-cards', {
        scrollTrigger: {
          trigger: '.gsap-stat-cards',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">

      {/* ── Floating CTA ── */}
      <PrimaryButton
        onClick={() => scrollTo('cta')}
        className="!fixed bottom-8 right-8 z-[60] shadow-lg hover:scale-110 transition-transform duration-150 !text-xl !font-regular !pl-2 !pr-8 !gap-1 !rounded-sm !bg-black !text-white hover:!bg-[#1a1a1a] active:!bg-[#333]"
      >
        <span className="w-[60px] h-[60px] flex items-center justify-center">
          <Lottie animationData={scooterAnimation} loop autoplay style={{ width: 60, height: 60 }} />
        </span>
        Book a test ride
      </PrimaryButton>

      {/* ══════════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20">
        <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dark_black_logo.svg" alt="Ola Electric" width={60} height={24} />
          <div className="flex items-center gap-2">
            {['Savings', 'Range', 'Hyper Service'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item === 'Hyper Service' ? 'service' : item.toLowerCase())}
                className="focus-ring hidden sm:inline-flex px-3 py-2 rounded-sm text-lg font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[#F3F4F6] transition-colors duration-150"
              >
                {item}
              </button>
            ))}
            <PrimaryButton onClick={() => scrollTo('cta')} className="!h-10 !px-5 text-lg ml-1">
              Book a test ride
            </PrimaryButton>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO CAROUSEL
          ══════════════════════════════════════════════════════ */}
      <section>
        <div className="relative w-full min-h-[90vh] overflow-hidden">

          {/* Background image with blur crossfade */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`bg-${heroSlide}`}
              initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 z-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroSlides[heroSlide].image}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 mx-auto max-w-6xl px-6 min-h-[90vh] flex flex-col items-center justify-center sm:pb-48 -mt-[15vh]"
            >
              {(() => {
                const dark = heroSlides[heroSlide].darkText
                return (
                  <div className="flex flex-col items-center gap-6">
                    {/* Pills */}
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 } }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
                      className="flex flex-wrap gap-2 justify-center"
                    >
                      {heroSlides[heroSlide].pills.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white backdrop-blur-sm px-3 py-1.5 text-md font-medium text-[var(--color-text-primary)]"
                        >
                          {p}
                        </span>
                      ))}
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                      variants={{ hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 } }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
                      className={`hero-heading text-center ${dark ? 'text-[var(--color-text-primary)]' : 'text-white'}`}
                    >
                      <span>{heroSlides[heroSlide].headingDark}</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                      variants={{ hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 } }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.16 }}
                      className={`text-lg text-center max-w-lg leading-relaxed ${dark ? 'text-[var(--color-text-primary)]' : 'text-white/80'}`}
                    >
                      {heroSlides[heroSlide].description}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                      variants={{ hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 } }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.24 }}
                      className="flex flex-wrap gap-3 justify-center"
                    >
                      <PrimaryButton onClick={() => scrollTo(heroSlides[heroSlide].primaryLink)}>
                        {heroSlides[heroSlide].primaryCta}
                      </PrimaryButton>
                      <SecondaryButton onClick={() => scrollTo(heroSlides[heroSlide].secondaryLink)}>
                        {heroSlides[heroSlide].secondaryCta}
                      </SecondaryButton>
                    </motion.div>
                  </div>
                )
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Fixed progress indicators */}
          <div className="absolute bottom-[200px] sm:bottom-[240px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className="focus-ring relative h-1.5 w-10 rounded-full bg-white/30 overflow-hidden"
                aria-label={`Go to slide ${i + 1}`}
              >
                {i < heroSlide && (
                  <span className="absolute inset-0 rounded-full bg-white" />
                )}
                {i === heroSlide && (
                  <motion.span
                    key={`progress-${heroSlide}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 8, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Left arrow */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <IconButton onClick={prevSlide} label="Previous slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </IconButton>
          </div>

          {/* Right arrow */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
            <IconButton onClick={nextSlide} label="Next slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </IconButton>
          </div>

          {/* Stat cards — absolute on sm+ */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 px-6 pb-10 z-10">
            <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-4">
              <StatCard label="Est. savings / year" value="₹25,000+" sub="avg. for daily commuters" />
              <StatCard label="Cost per km" value="₹0.15" sub="vs ₹2.80 for petrol" />
              <StatCard label="Range per charge" value="151 km" sub="Ola S1 Pro certified range" />
            </div>
          </div>
        </div>

        {/* Stat cards — below hero on mobile */}
        <div className="sm:hidden px-4 py-5 flex flex-col gap-3 gsap-stat-cards">
          <StatCard label="Est. savings / year" value="₹25,000+" sub="avg. for daily commuters" />
          <StatCard label="Cost per km" value="₹0.15" sub="vs ₹2.80 for petrol" />
          <StatCard label="Range per charge" value="151 km" sub="Ola S1 Pro certified range" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SAVINGS
          ══════════════════════════════════════════════════════ */}
      <section id="savings" className="gsap-section">
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-10 pb-8 sm:pb-10">
          {/* Section header */}
          <div className="mb-8 sm:mb-10">
            <div className="section-label">Savings</div>
            <h2 className="section-heading mt-2">Spend less. Ride more.</h2>
            <p className="mt-3 text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Petrol costs add up daily. Electric keeps running costs predictable, so savings show up ride after ride.
            </p>
          </div>

          {/* Savings content card */}
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left visual */}
              <div className="flex-1 min-h-[280px] sm:min-h-[340px] relative bg-gradient-to-br from-gray-50 via-white to-gray-100" />

              {/* Right content */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center gap-5">
                {/* Compact calculator */}
                <div id="calc" className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-between items-end gap-2">
                    <div>
                      <div className="text-md font-medium text-[var(--color-text-muted)]">Monthly distance</div>
                      <div className="mt-1 text-2xl font-semibold text-[var(--color-text-primary)]">{formatINR(monthlyKm)} km</div>
                    </div>
                    <div className="text-right">
                      <div className="text-md font-medium text-[var(--color-text-muted)]">Savings / year</div>
                      <div className="mt-1 text-2xl font-semibold text-[var(--color-accent-green)]">₹{formatINR(yearlySavings)}</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    step={50}
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(parseInt(e.target.value, 10))}
                    className="w-full"
                    aria-label="Monthly distance slider"
                  />
                </div>

                {/* Petrol vs Electric cost */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-card)] bg-[#FAFAFA] p-4 sm:p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-md font-medium text-[var(--color-text-muted)]">Petrol cost</span>
                      <PeriodToggle value={costPeriod} onChange={setCostPeriod} />
                    </div>
                    <div className="mt-3 text-[24px] font-semibold text-[var(--color-text-primary)]">
                      ₹{formatINR(costPeriod === 'yearly' ? yearlyPetrol : monthlyKm * PETROL_COST_PER_KM)}
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-card)] bg-[#FAFAFA] p-4 sm:p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-md font-medium text-[var(--color-text-muted)]">Electric cost</span>
                      <PeriodToggle value={costPeriod} onChange={setCostPeriod} />
                    </div>
                    <div className="mt-3 text-[24px] font-semibold text-[var(--color-accent-green)]">
                      ₹{formatINR(costPeriod === 'yearly' ? yearlyEV : monthlyKm * EV_COST_PER_KM)}
                    </div>
                  </div>
                </div>

                {/* Estimated savings */}
                <div className="rounded-[var(--radius-card)] bg-[var(--color-accent-green-tint)] p-4 sm:p-5">
                  <div className="text-md font-medium text-[var(--color-accent-green)]">Your estimated savings</div>
                  <div className="mt-2 text-5xl font-semibold italic text-[var(--color-text-primary)]">₹{formatINR(yearlySavings)}/year</div>
                  <div className="mt-1 text-md text-[var(--color-text-muted)]">
                    Based on ₹{PETROL_COST_PER_KM}/km petrol and ₹{EV_COST_PER_KM}/km electric assumptions.
                  </div>
                </div>

                {/* Pills */}
                <div className="flex flex-wrap gap-2">
                  <Pill>No oil changes</Pill>
                  <Pill>Minimal maintenance</Pill>
                  <Pill>Charge at home</Pill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          RANGE
          ══════════════════════════════════════════════════════ */}
      <section id="range" className="gsap-section">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-8 sm:pb-10">
          {/* Section header */}
          <div className="mb-8 sm:mb-10">
            <div className="section-label">Range</div>
            <h2 className="section-heading mt-2">Go farther on every rupee.</h2>
            <p className="mt-3 text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              See how far petrol and electric two-wheelers take you for the same spend. Toggle your budget and compare instantly.
            </p>
          </div>

          {/* Range comparison card */}
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold text-[var(--color-text-primary)]">Budget comparison</div>
                <div className="mt-1 text-lg text-[var(--color-text-muted)]">Pick a spend amount to see the distance difference.</div>
              </div>
              <Segmented
                value={budget}
                options={[
                  { label: '₹100', value: '100' },
                  { label: '₹500', value: '500' },
                  { label: '₹1,000', value: '1000' },
                ]}
                onChange={setBudget}
              />
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-card)] bg-zinc-100 p-5 sm:p-6">
                <div className="text-md font-medium text-[var(--color-text-muted)]">Petrol 2 Wheeler</div>
                <div className="mt-2 text-5xl sm:text-4xl font-semibold italic text-[var(--color-text-primary)]">{Math.round(petrolKm)} km</div>
                <div className="mt-2 text-lg text-[var(--color-text-primary)]">≈ {PETROL_KM_PER_100} km per ₹100</div>
              </div>
              <div className="rounded-[var(--radius-card)] bg-zinc-100 p-5 sm:p-6">
                <div className="text-md font-medium text-[var(--color-text-muted)]">Electric 2 Wheeler</div>
                <div className="mt-2 text-5xl sm:text-4xl font-semibold italic text-[var(--color-accent-green)]">{Math.round(evKm)} km</div>
                <div className="mt-2 text-lg text-[var(--color-text-primary)]">≈ {UNITS_PER_100} units per ₹100 → {EV_KM_PER_UNIT} km/unit</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${clamp((petrolKm / Math.max(1, evKm)) * 100, 0, 100)}%` }}
                  transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                  className="h-full bg-[var(--color-accent-green)] rounded-full"
                />
              </div>
              <div className="mt-2 flex justify-between text-md text-[var(--color-text-muted)]">
                <span>Petrol 2-wheeler</span>
                <span className="font-medium text-[var(--color-accent-green)]">Ola Electric ({xMore}× farther)</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-[var(--color-text-muted)]">
              Based on average petrol 2-wheeler mileage of {PETROL_KM_PER_100} km/₹100 and Ola Electric at {EV_KM_PER_UNIT} km per unit.
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HYPER SERVICE
          ══════════════════════════════════════════════════════ */}
      <section id="service" className="gsap-section">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-8 sm:pb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="section-label">Hyper Service</div>
              <h2 className="section-heading mt-2">Service, upgraded.</h2>
              <p className="mt-3 text-[15px] text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
                Wider network, convenience, transparency, and a fully digital journey. Built to feel effortless.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gsap-stagger">
            <BentoItem tag="Network" title="Wider Service Network" desc="Servicing your Ola is now easier and closer than ever." image="/assets/wider-service.png" />
            <BentoItem tag="Parts" title="Convenience" desc="Just a click away. Order Ola parts online on app and website." image="/assets/comvenience.png" />
            <BentoItem tag="MRP" title="Transparency you can trust" desc="Genuine Ola parts at verified MRP." image="/assets/transparaency.png" />
            <BentoItem tag="Same-day" title="Same-Day Service Guarantee" desc="Your Ola gets serviced the very same day. No extra cost, no delays. Now live in Bengaluru." image="/assets/same-day-service.png" />
            <BentoItem tag="Tracking" title="Fully Digital & Transparent Journey" desc="Track your service end to end with real-time updates and complete visibility." image="/assets/fully-digital.png" />
            <BentoItem tag="Comfort" title="Designed for You" desc="Relax in a dedicated customer lounge with free Wi‑Fi while we take care of your ride." image="/assets/designed-for-you.png" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════════ */}
      <section id="cta" className="gsap-section">
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:pb-12">
          <div className="rounded-[var(--radius-card)] bg-[var(--color-cta-black)] text-white overflow-hidden p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-[13px] font-medium tracking-wide uppercase text-white/50">Ready to switch?</div>
                <h2 className="section-heading !text-white mt-3">
                  Calculate savings. Book a test ride.
                </h2>
                <p className="mt-3 text-[15px] text-white/60 leading-relaxed">
                  A minimal decision: set your distance, see the number.
                </p>
              </div>
              <button
                onClick={() => scrollTo('savings')}
                className="focus-ring shrink-0 inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius-button)] bg-white text-[var(--color-text-primary)] text-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
              >
                Book a test ride
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between items-center gap-2 text-[12px] text-[var(--color-text-muted)]">
            <span>© {new Date().getFullYear()} Ola Electric campaign landing page</span>
          </div>
        </div>
      </section>
    </div>
  )
}
