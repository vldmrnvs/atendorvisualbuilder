import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing – Atendor',
  description: 'Choose the plan that fits your needs.'
}

export default function PricingPage() {
  return (
    <main className="space-y-12">
      <PublicHeader />
      <section className="px-4 py-16 mx-auto max-w-5xl space-y-8">
        <h1 className="text-3xl font-semibold text-center">Pricing</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="card border p-6 space-y-4">
            <h2 className="text-xl font-bold">Starter</h2>
            <p className="text-2xl">€9 <span className="text-base">/ mes</span></p>
            <ul className="space-y-1 text-sm">
              <li>1 bot</li>
              <li>3 files</li>
              <li>Fast responses</li>
            </ul>
            <button className="btn btn-primary w-full">Choose Starter</button>
          </div>
          <div className="card border p-6 space-y-4">
            <h2 className="text-xl font-bold">Pro</h2>
            <p className="text-2xl">€29 <span className="text-base">/ mes</span></p>
            <ul className="space-y-1 text-sm">
              <li>5 bots</li>
              <li>20 files</li>
              <li>Advanced answers</li>
            </ul>
            <button className="btn btn-primary w-full">Choose Pro</button>
          </div>
          <div className="card border p-6 space-y-4">
            <h2 className="text-xl font-bold">Enterprise</h2>
            <p className="text-2xl">Custom</p>
            <ul className="space-y-1 text-sm">
              <li>Unlimited bots</li>
              <li>Team collaboration</li>
              <li>Custom integrations</li>
              <li>Priority support</li>
            </ul>
            <Link href="mailto:contact@example.com" className="btn btn-primary w-full">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  )
}
