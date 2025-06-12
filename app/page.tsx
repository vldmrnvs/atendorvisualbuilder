import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { AnimatedHero } from '@/components/AnimatedHero'

export const metadata = {
  title: 'Atendor – AI Visual Builder',
  description: 'Build and manage AI flows with a visual editor.',
  openGraph: {
    title: 'Atendor – AI Visual Builder',
    description: 'Build and manage AI flows with a visual editor.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atendor – AI Visual Builder',
    description: 'Build and manage AI flows with a visual editor.',
    images: ['/og.png'],
  },
}

export default function Home() {
  return (
    <main className="space-y-24">
      <PublicHeader />
      {/* Hero */}
      <AnimatedHero />

      {/* How It Works */}
      <section className="px-4 py-16 mx-auto max-w-5xl space-y-12">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>
        <ol className="grid gap-8 md:grid-cols-4 text-left">
          <li className="space-y-2">
            <div className="text-2xl font-bold">1. Sign up</div>
            <p>Create your account in seconds.</p>
          </li>
          <li className="space-y-2">
            <div className="text-2xl font-bold">2. Drag & drop</div>
            <p>Use nodes to create logic flows.</p>
          </li>
          <li className="space-y-2">
            <div className="text-2xl font-bold">3. Connect</div>
            <p>Integrate WhatsApp, Discord or your APIs.</p>
          </li>
          <li className="space-y-2">
            <div className="text-2xl font-bold">4. Deploy</div>
            <p>Test and launch instantly.</p>
          </li>
        </ol>
      </section>

      {/* Key Features */}
      <section id="features" className="px-4 py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl space-y-12">
          <h2 className="text-3xl font-semibold text-center">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div
              className="space-y-2 text-center opacity-0 animate-in fade-in zoom-in-90 duration-400"
            >
              <div className="text-xl font-bold">Visual Builder</div>
              <p>No code, flexible and intuitive.</p>
            </div>
            <div
              className="space-y-2 text-center opacity-0 animate-in fade-in zoom-in-90 duration-400"
              style={{ animationDelay: '100ms' }}
            >
              <div className="text-xl font-bold">WhatsApp/Discord</div>
              <p>Reach users where they are.</p>
            </div>
            <div
              className="space-y-2 text-center opacity-0 animate-in fade-in zoom-in-90 duration-400"
              style={{ animationDelay: '200ms' }}
            >
              <div className="text-xl font-bold">Role-based Access</div>
              <p>Control who edits flows.</p>
            </div>
            <div
              className="space-y-2 text-center opacity-0 animate-in fade-in zoom-in-90 duration-400"
              style={{ animationDelay: '300ms' }}
            >
              <div className="text-xl font-bold">Supabase Backend</div>
              <p>Built for performance and scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Placeholder */}
      <section className="px-4 py-16 mx-auto max-w-5xl text-center space-y-6">
        <h2 className="text-3xl font-semibold">See it in action</h2>
        <div className="w-full h-64 bg-slate-200 rounded-md" />
        <Link href="/signup" className="inline-block px-6 py-3 mt-4 text-white bg-black rounded-md hover:bg-slate-800 transition-colors">
          Try the builder
        </Link>
      </section>

      {/* Who it's for */}
      <section className="px-4 py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl space-y-12">
          <h2 className="text-3xl font-semibold text-center">Who It&apos;s For</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2 text-center">
              <div className="text-xl font-bold">Solo Creators</div>
              <p>Launch assistants without coding.</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-xl font-bold">Agencies</div>
              <p>Manage client flows in one place.</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-xl font-bold">Small Teams</div>
              <p>Collaborate and iterate quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="px-4 py-16 mx-auto max-w-5xl space-y-6 text-center">
        <h2 className="text-3xl font-semibold">Security & Privacy</h2>
        <p className="mx-auto max-w-2xl text-gray-700">
          User roles keep data safe. All information is stored securely with no tracking.
        </p>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl space-y-8 text-center">
          <h2 className="text-3xl font-semibold">What Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-4 bg-white rounded shadow">&quot;Amazing tool!&quot;</div>
            <div className="p-4 bg-white rounded shadow">&quot;Built my bot in a day.&quot;</div>
            <div className="p-4 bg-white rounded shadow">&quot;Our team loves it.&quot;</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-semibold">Ready to build your first AI assistant?</h2>
        <Link href="/signup" className="px-8 py-4 text-white bg-black rounded-md hover:bg-slate-800 transition-colors">
          Create Your Free Account
        </Link>
        <p className="text-sm text-gray-600">No credit card required</p>
      </section>

      <PublicFooter />
    </main>
  )
}
