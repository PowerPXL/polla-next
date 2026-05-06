'use client'
import { useState } from 'react'
import { createPoll } from './actions'
import { Users, GlobeLock } from "lucide-react";

const CATEGORIES = [
  'SAMHÄLLE', 'POLITIK', 'EKONOMI', 'ARBETE', 'UTBILDNING',
  'FAMILJ', 'HÄLSA', 'KULTUR', 'TECH', 'SPORT', 'MILJÖ'
]

export default function CreatePoll({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [options, setOptions] = useState(['', ''])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  const [pollType, setPollType] = useState<'local' | 'global'>('local')

  return (
    <form action={createPoll} className="space-y-6 max-w-xl">

      {!isLoggedIn && (
        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          Du är anonym. <a href="/login" className="text-blue-500 hover:underline">Logga in</a> om du vill redigera polls.
        </div>
      )}

            {/* Poll-typ */}
      <div className="space-y-2">
        <input type="hidden" name="poll_type" value={pollType} />
        
        <label
          onClick={() => setPollType('local')}
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${pollType === 'local' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <input
            type="radio"
            name="poll_type_radio"
            checked={pollType === 'local'}
            onChange={() => setPollType('local')}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Lokal</p>
            <p className="text-xs text-gray-500">Ingen inloggning krävs för att rösta. Perfekt för kollegor och mindre grupper.</p>
          </div>
        </label>

        <label
          onClick={() => setPollType('global')}
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${pollType === 'global' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <input
            type="radio"
            name="poll_type_radio"
            checked={pollType === 'global'}
            onChange={() => setPollType('global')}
            className="mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Global</p>
            <p className="text-xs text-gray-500">Kräver inloggning. Publiceras offentligt. Bra för opinionsundersökningar</p>
          </div>
        </label>
      </div>

      {/* Titel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
        </label>
        <input
          name="title"
          required
          maxLength={200}
          placeholder="Skriv din fråga?"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>



      {/* Svarsalternativ */}
      <div>
        <label className="block text- font-medium text-gray-700 mb-2">
          Svar <span className="text-gray-400"></span>
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
                className="text-gray-400 hover:text-[#EA4335] disabled:opacity-20 transition-colors text-lg leading-none cursor-pointer"
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
            className="mt-3 text-5xl text-[#4285F4] cursor-pointer opacity-60 hover:opacity-100 transition-opacity ml-auto block"
          >
            +
          </button>
        )}
      </div>
            {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <input type="hidden" name="category" value={selectedCategory ?? ''} />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer
  ${selectedCategory === cat
    ? 'bg-gray-700 text-white ring-1 ring-[#FBBC05]'
    : 'bg-gray-500 text-white hover:bg-gray-700'
  }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#374151] text-white py-3 rounded-lg text-sm font-medium opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
      >
        Spara
      </button>
    </form>
  )
}