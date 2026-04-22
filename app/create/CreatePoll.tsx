'use client'
import { useState } from 'react'
import { createPoll } from './actions'

export default function CreatePoll({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [options, setOptions] = useState(['', ''])

  const addOption = () => {
    if (options.length < 15) setOptions([...options, ''])
  }

  const removeOption = (i: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, idx) => idx !== i))
  }

  const updateOption = (i: number, value: string) => {
    setOptions(options.map((o, idx) => idx === i ? value : o))
  }

  return (
    <form action={createPoll} className="space-y-6 max-w-xl">

      {!isLoggedIn && (
        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          Du skapar som gäst. <a href="/login" className="text-blue-600 hover:underline">Logga in</a> för att hantera dina polls.
        </div>
      )}

      {/* Titel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fråga / Titel
        </label>
        <input
          name="title"
          required
          maxLength={200}
          placeholder="Vad vill du fråga?"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Svarsalternativ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Svarsalternativ <span className="text-gray-400">({options.length}/15)</span>
        </label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                name="options"
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                required
                maxLength={200}
                placeholder={`Alternativ ${i + 1}`}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                disabled={options.length <= 2}
                className="text-gray-400 hover:text-red-500 disabled:opacity-20 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {options.length < 15 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            + Lägg till alternativ
          </button>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Skapa poll
      </button>
    </form>
  )
}