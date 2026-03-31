import { useEffect, useRef, useState } from 'react'

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder: string
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
          selected.length > 0
            ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300'
            : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
        }`}
      >
        <span className="truncate">{label}</span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">No options available.</p>
          ) : (
            options.map((opt) => {
              const checked = selected.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt.value)}
                    className="accent-indigo-600"
                  />
                  <span className={checked ? 'text-indigo-700 font-medium dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}>
                    {opt.label}
                  </span>
                </label>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

