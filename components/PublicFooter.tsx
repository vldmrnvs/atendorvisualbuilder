import Image from 'next/image'
import logo from '../assets/atendor-logo.svg'

export default function PublicFooter() {
  return (
    <footer className="bg-slate-100" role="contentinfo">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <Image src={logo} alt="Atendor logo" width={24} height={24} />
          <span className="font-bold">Atendor</span>
        </div>
        <div className="flex space-x-4" aria-label="Social media">
          <span className="w-5 h-5 bg-gray-300 rounded" />
          <span className="w-5 h-5 bg-gray-300 rounded" />
          <span className="w-5 h-5 bg-gray-300 rounded" />
        </div>
        <address className="not-italic space-y-1" id="contact">
          <div>contact@example.com</div>
          <div>123 Business Road, City</div>
        </address>
        <p className="text-xs text-gray-500">© 2025 Atendor. All rights reserved.</p>
      </div>
    </footer>
  )
}
