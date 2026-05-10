'use client';

import Link from 'next/link';
import { Vote, BookHeart, Settings } from 'lucide-react';

export default function ProfileBar() {
  return (
    <div className="w-full bg-[#374151] border-b border-gray-600">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-2">
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-sm text-gray-200 hover:text-white transition-colors"
          >
            <Vote className="w-4 h-4 inline mr-1" />
            Mina polls
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-200 hover:text-white transition-colors"
          >
            <BookHeart className="w-4 h-4 inline mr-1" />
            Favoriter
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-200 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 inline mr-1" />
            Inställningar
          </Link>
        </div>
      </div>
    </div>
  );
}