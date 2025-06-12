'use client'
import { useState, useEffect } from 'react'

const NODE_TYPES = [
  ['start', 'Start'],
  ['send', 'Send Message'],
  ['wait', 'Wait'],
  ['input', 'Receive Input'],
  ['file', 'File Lookup'],
  ['file-search', 'File Search'],
  ['textNode', 'Text'],
  ['webhook', 'Webhook'],
  ['http', 'HTTP Request'],
  ['decision', 'Decision'],
  ['end', 'End'],
] as const

export default function NodePalette({ onAdd }: { onAdd: (type: string) => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(window.innerWidth >= 768)
  }, [])
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }
  return (
    <>
      {open && (
        <div className="fixed top-16 left-4 z-50 w-40 bg-white rounded shadow p-2 space-y-2 md:block">
          {NODE_TYPES.map(([type, label]) => (
            <div
              key={type}
              className="p-2 bg-white rounded shadow cursor-grab"
              onDragStart={(e) => onDragStart(e, type)}
              onClick={() => onAdd(type)}
              draggable
            >
              {label}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed top-16 left-4 z-50 md:hidden bg-white rounded shadow px-2 py-1"
      >
        {open ? 'Close' : 'Nodes'}
      </button>
    </>
  )
}
