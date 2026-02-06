'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// ── Helpers ─────────────────────────────────────────────
function formatINR(n: number) {
  return Math.round(n).toLocaleString('en-IN')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

// ── Small reusable bits ─────────────────────────────────
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs text-zinc-600">
      {children}
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-400">{sub}</div>}
    </div>
  )
}

function BentoItem({ title, desc, tag }: { title: string; desc: string; tag: string }) {
  return (
    <div className="rounded-[26px] border border-zinc-200 bg-white overflow-hidden">
      <div className="h-36 bg-zinc-100 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-white to-zinc-200" />
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] px-2 py-1 rounded-full bg-white/80 border border-zinc-200 text-zinc-600">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="mt-1 text-sm text-zinc-600">{desc}</div>
      </div>
    </div>
  )
}

function PeriodToggle({
  value,
  onChange,
}: {
  value: 'monthly' | 'yearly'
  onChange: (v: 'monthly' | 'yearly') => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
      <button
        onClick={() => onChange('monthly')}
        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition ${
          value === 'monthly'
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-500 hover:bg-zinc-200'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('yearly')}
        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition ${
          value === 'yearly'
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-500 hover:bg-zinc-200'
        }`}
      >
        Yearly
      </button>
    </div>
  )
}

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
    <div className="inline-flex rounded-2xl border border-zinc-200 bg-white p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-2 text-sm rounded-xl transition ${
              active
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Page Component ──────────────────────────────────────
export default function Page() {
  const PETROL_COST_PER_KM = 2.8
  const EV_COST_PER_KM = 0.35
  const PETROL_KM_PER_100 = 45
  const EV_KM_PER_UNIT = 37
  const UNITS_PER_100 = 5

  const [monthlyKm, setMonthlyKm] = useState(800)
  const [costPeriod, setCostPeriod] = useState<'monthly' | 'yearly'>('yearly')
  const [budget, setBudget] = useState<'100' | '500' | '1000'>('100')

  const yearlyKm = monthlyKm * 12
  const yearlyPetrol = yearlyKm * PETROL_COST_PER_KM
  const yearlyEV = yearlyKm * EV_COST_PER_KM
  const yearlySavings = Math.max(0, yearlyPetrol - yearlyEV)

  const budgetNum = useMemo(() => parseInt(budget, 10), [budget])
  const petrolKm = (budgetNum / 100) * PETROL_KM_PER_100
  const evKm = (budgetNum / 100) * UNITS_PER_100 * EV_KM_PER_UNIT
  const xMore = Math.max(1, Math.round(evKm / Math.max(1, petrolKm)))

  const costPerKmDelta = Math.max(0, PETROL_COST_PER_KM - EV_COST_PER_KM)
  const savePerMonth = Math.max(0, monthlyKm * PETROL_COST_PER_KM - monthlyKm * EV_COST_PER_KM)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Floating CTA */}
      <button
        onClick={() => scrollTo('cta')}
        className="fixed bottom-5 right-5 z-[60] px-4 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition"
      >
        Book a test ride
      </button>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dark_black_logo.svg" alt="Ola Electric" width={60} height={24} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('savings')}
              className="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              Savings
            </button>
            <button
              onClick={() => scrollTo('range')}
              className="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              Range
            </button>
            <button
              onClick={() => scrollTo('service')}
              className="hidden sm:inline-flex px-3 py-2 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              Hyper Service
            </button>
            <button
              onClick={() => scrollTo('cta')}
              className="inline-flex px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Book a test ride
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section>
        <div className="relative w-full min-h-[90vh] bg-zinc-100">
          {/* Content */}
          <div className="relative mx-auto max-w-6xl px-6 min-h-[90vh] flex flex-col items-center justify-center sm:pb-40">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Pill>Upfront savings</Pill>
                <Pill>More distance per rupee</Pill>
                <Pill>Hyper Service</Pill>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="hero-heading font-semibold tracking-tight">
                  <span className="text-zinc-900">Switch to electric. </span>
                  <span className="text-zinc-500">Save every ride.</span>
                </h1>
              </motion.div>

              <p className="text-base text-zinc-500 text-center max-w-xl">
                Minimal maintenance. More distance per rupee. Service designed for convenience.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => scrollTo('savings')}
                  className="px-5 py-3 rounded-2xl bg-zinc-900 text-white font-semibold hover:opacity-90 transition"
                >
                  Calculate savings
                </button>
                <button
                  onClick={() => scrollTo('range')}
                  className="px-5 py-3 rounded-2xl border border-zinc-200 bg-white font-semibold text-zinc-800 hover:bg-zinc-50 transition"
                >
                  Compare Range
                </button>
              </div>
            </div>
          </div>

          {/* Stat cards — absolute on sm+, normal flow on mobile */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="mx-auto max-w-6xl grid sm:grid-cols-3 gap-4">
              <StatCard
                label="Est. savings / year"
                value="₹25,000+"
                sub="avg. for daily commuters"
              />
              <StatCard
                label="Cost per km"
                value="₹0.15"
                sub="vs ₹2.80 for petrol"
              />
              <StatCard
                label="Range per charge"
                value="151 km"
                sub="Ola S1 Pro certified range"
              />
            </div>
          </div>
        </div>

        {/* Stat cards — below hero on mobile */}
        <div className="sm:hidden px-4 py-6 flex flex-col gap-4">
          <StatCard
            label="Est. savings / year"
            value="₹25,000+"
            sub="avg. for daily commuters"
          />
          <StatCard
            label="Cost per km"
            value="₹0.15"
            sub="vs ₹2.80 for petrol"
          />
          <StatCard
            label="Range per charge"
            value="151 km"
            sub="Ola S1 Pro certified range"
          />
        </div>
        <div className="h-12" />
      </section>

      {/* ── SAVINGS ── */}
      <section id="savings">
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
          {/* Section header */}
          <div className="mb-10">
            <div className="section-label">Savings</div>
            <h2 className="section-heading font-semibold tracking-tight text-zinc-900 mt-2">
              Spend less. Ride more.
            </h2>
            <p className="mt-3 text-base text-zinc-500 max-w-xl">
              Petrol costs add up daily. Electric keeps running costs predictable, so savings show up ride after ride.
            </p>
          </div>

          {/* Savings content card */}
          <div className="rounded-[32px] border border-zinc-200 bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left image */}
              <div className="flex-1 min-h-[340px] relative bg-gradient-to-br from-zinc-100 via-white to-zinc-200">
                <span className="absolute bottom-4 left-4 text-[11px] px-2 py-1 rounded-full bg-white/80 border border-zinc-200 text-zinc-600">
                  Savings visual placeholder
                </span>
              </div>

              {/* Right content */}
              <div className="flex-1 p-6 flex flex-col justify-center gap-5">
                {/* Compact calculator */}
                <div id="calc" className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-between items-end gap-2">
                    <div>
                      <div className="text-xs text-zinc-500">Monthly distance</div>
                      <div className="mt-1 text-xl font-semibold text-zinc-900">{formatINR(monthlyKm)} km</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">Savings / year</div>
                      <div className="mt-1 text-xl font-semibold text-zinc-900">₹{formatINR(yearlySavings)}</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    step={50}
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(parseInt(e.target.value, 10))}
                    className="w-full accent-zinc-900"
                    aria-label="Monthly distance slider"
                  />
                </div>

                {/* Petrol vs Electric cost */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Petrol cost</span>
                      <PeriodToggle value={costPeriod} onChange={setCostPeriod} />
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-zinc-900">
                      ₹{formatINR(costPeriod === 'yearly' ? yearlyPetrol : monthlyKm * PETROL_COST_PER_KM)}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Electric cost</span>
                      <PeriodToggle value={costPeriod} onChange={setCostPeriod} />
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-zinc-900">
                      ₹{formatINR(costPeriod === 'yearly' ? yearlyEV : monthlyKm * EV_COST_PER_KM)}
                    </div>
                  </div>
                </div>

                {/* Estimated savings */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-5">
                  <div className="text-xs text-zinc-500">Your estimated savings</div>
                  <div className="mt-2 text-3xl font-semibold text-zinc-900">₹{formatINR(yearlySavings)} / year</div>
                  <div className="mt-1 text-xs text-zinc-400">
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

      {/* ── RANGE ── */}
      <section id="range">
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
          {/* Section header */}
          <div className="mb-10">
            <div className="section-label">Range</div>
            <h2 className="section-heading font-semibold tracking-tight text-zinc-900 mt-2">
              Go farther on every rupee.
            </h2>
            <p className="mt-3 text-base text-zinc-500 max-w-xl">
              See how far petrol and electric two-wheelers take you for the same spend. Toggle your budget and compare instantly.
            </p>
          </div>

          {/* Range comparison card */}
          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Budget comparison</div>
                <div className="mt-1 text-sm text-zinc-500">Pick a spend amount to see the distance difference.</div>
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

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="text-xs text-zinc-500">Petrol 2-wheeler</div>
                <div className="mt-2 text-3xl font-semibold">{Math.round(petrolKm)} km</div>
                <div className="mt-2 text-xs text-zinc-400">≈ {PETROL_KM_PER_100} km per ₹100</div>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="text-xs text-zinc-500">Ola Electric</div>
                <div className="mt-2 text-3xl font-semibold">{Math.round(evKm)} km</div>
                <div className="mt-2 text-xs text-zinc-400">≈ {UNITS_PER_100} units per ₹100 → {EV_KM_PER_UNIT} km/unit</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${clamp((petrolKm / Math.max(1, evKm)) * 100, 0, 100)}%` }}
                  transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                  className="h-full bg-zinc-900 rounded-full"
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-400">
                <span>Petrol 2-wheeler</span>
                <span>Ola Electric ({xMore}× farther)</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-zinc-400">
              Based on average petrol 2-wheeler mileage of {PETROL_KM_PER_100} km/₹100 and Ola Electric at {EV_KM_PER_UNIT} km per unit.
            </div>
          </div>
        </div>
      </section>

      {/* ── HYPER SERVICE ── */}
      <section id="service">
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="section-label">Hyper Service</div>
              <h2 className="section-heading font-semibold tracking-tight text-zinc-900 mt-2">
                Service, upgraded.
              </h2>
              <p className="mt-3 text-base text-zinc-500 max-w-2xl">
                Wider network, convenience, transparency, and a fully digital journey. Built to feel effortless.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <BentoItem tag="Network" title="Wider Service Network" desc="Servicing your Ola is now easier and closer than ever." />
            <BentoItem tag="Parts" title="Convenience" desc="Just a click away. Order Ola parts online on app and website." />
            <BentoItem tag="MRP" title="Transparency you can trust" desc="Genuine Ola parts at verified MRP." />
            <BentoItem tag="Same-day" title="Same-Day Service Guarantee" desc="Your Ola gets serviced the very same day. No extra cost, no delays. Now live in Bengaluru." />
            <BentoItem tag="Tracking" title="Fully Digital & Transparent Journey" desc="Track your service end to end with real-time updates and complete visibility." />
            <BentoItem tag="Comfort" title="Designed for You" desc="Relax in a dedicated customer lounge with free Wi‑Fi while we take care of your ride." />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta">
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <div className="rounded-[32px] bg-zinc-900 text-white overflow-hidden p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="section-label !text-white/50">Ready to switch?</div>
                <h2 className="section-heading font-semibold tracking-tight text-white mt-3">
                  Calculate savings. Book a test ride.
                </h2>
                <p className="mt-3 text-base text-white/60">
                  A minimal decision: set your distance, see the number.
                </p>
              </div>
              <button
                onClick={() => scrollTo('savings')}
                className="shrink-0 px-5 py-3 rounded-2xl bg-white text-zinc-900 font-semibold hover:opacity-90 transition"
              >
                Book a test ride
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between items-center gap-2 text-xs text-zinc-400">
            <span>© {new Date().getFullYear()} Ola Electric campaign landing page</span>
          </div>
        </div>
      </section>
    </div>
  )
}
