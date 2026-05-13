'use client'
import { useForm, ValidationError } from '@formspree/react'

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mjggwqag")

  return (
    <main>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 py-20 text-center">
        <p className="text-gray-800">Vi är öppna för att ta emot feedback och frågor. Samarbeten är välkomna!</p>
        <p className="text-gray-800">Skriv ett mail till support@pavent.se, nå oss via våra sociala medier</p>
        <p className="text-gray-800">eller använd kontaktformuläret</p>

        {state.succeeded ? (
          <p className="mt-6 text-green-600">Tack för ditt meddelande!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md space-y-4">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Din e-post"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />

            <textarea
              id="message"
              name="message"
              placeholder="Ditt meddelande"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />

            <button
              type="submit"
              disabled={state.submitting}
              className="w-full bg-[#374151] text-white py-3 rounded-lg text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Skicka
            </button>
          </form>
        )}
      </div>
    </main>
  )
}