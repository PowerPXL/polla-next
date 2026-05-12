'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Settings, Save, LogOut, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setEmail(session.user.email ?? '');

      const { data: profile } = await supabase
        .from('users')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUsername(profile.username ?? '');
      }

      setLoading(false);
    }

    loadUser();
  }, [supabase, router]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', session.user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Något gick fel. Försök igen.' });
    } else {
      setMessage({ type: 'success', text: 'Inställningar sparade!' });
    }

    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-gray-300" />
        <h1 className="text-2xl font-semibold text-white">Inställningar</h1>
      </div>

      <div className="space-y-6 rounded-xl bg-[#374151] p-6">
        {/* Username */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Användarnamn
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-gray-700 px-4 py-2.5 text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Ditt användarnamn"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            E-postadress
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-lg bg-gray-700/50 px-4 py-2.5 text-gray-400 border border-gray-600 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            E-postadressen kan inte ändras här.
          </p>
        </div>

        {/* Feedback message */}
        {message && (
          <p
            className={`text-sm ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Spara ändringar
        </button>
      </div>

      {/* Sign out */}
      <div className="mt-6 rounded-xl bg-[#374151] p-6">
        <h2 className="mb-1 text-sm font-medium text-gray-300">Logga ut</h2>
        <p className="mb-4 text-xs text-gray-500">
          Du loggas ut från alla enheter.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30 transition-colors border border-red-600/30"
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </button>
      </div>
    </div>
  );
}
