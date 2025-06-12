'use client'
import { useState, useRef, useEffect } from 'react'
import type { NodeProps } from 'react-flow-renderer'
import type { NodeData } from '@/types'

export default function TextNode({ data }: NodeProps<NodeData & { onChange?: (t: string) => void }>) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(data.text || 'Text')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    monospace: 'font-mono',
  } as const
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  } as const

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className={`min-w-24 min-h-8 p-1 ${fontMap[data.fontFamily || 'sans']} ${sizeMap[data.size || 'md']}`}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          className="w-full border rounded p-1 text-black"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            setEditing(false)
            data.onChange?.(text)
          }}
        />
      ) : (
        text
      )}
    </div>
  )
}
