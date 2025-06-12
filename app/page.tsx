import Image from 'next/image'
import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { motion } from 'framer-motion'

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
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Build AI Chat Assistants Visually
          </h1>
          <p className="mx-auto max-w-xl text-gray-600 md:text-xl">
            No code. No complexity. Just powerful conversations connected to your tools.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="px-6 py-3 text-white bg-black rounded-md hover:bg-slate-800 transition-colors">
              Get Started
            </Link>
            <Link href="/login" className="px-6 py-3 border rounded-md hover:bg-slate-100 transition-colors">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

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
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="space-y-2 text-center"
            >
              <div className="text-xl font-bold">Visual Builder</div>
              <p>No code, flexible and intuitive.</p>
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-2 text-center"
            >
              <div className="text-xl font-bold">WhatsApp/Discord</div>
              <p>Reach users where they are.</p>
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-2 text-center"
            >
              <div className="text-xl font-bold">Role-based Access</div>
              <p>Control who edits flows.</p>
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-2 text-center"
            >
              <div className="text-xl font-bold">Supabase Backend</div>
              <p>Built for performance and scale.</p>
            </motion.div>
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
          <h2 className="text-3xl font-semibold text-center">Who It's For</h2>
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
            <div className="p-4 bg-white rounded shadow">"Amazing tool!"</div>
            <div className="p-4 bg-white rounded shadow">"Built my bot in a day."</div>
            <div className="p-4 bg-white rounded shadow">"Our team loves it."</div>
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
