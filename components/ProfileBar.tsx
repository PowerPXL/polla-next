'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Vote, BookHeart, Settings } from 'lucide-react';

const links = [
  { href: '/profile/myPolls', label: 'Mina polls', icon: Vote },
  { href: '/profile/favorites', label: 'Favoriter', icon: BookHeart },
  { href: '/profile/settings', label: 'Inställningar', icon: Settings },
];

export default function ProfileBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-[#374151] border-b border-gray-600">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-2">
        <div className="flex items-center space-x-3">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors flex items-center gap-1 px-2 py-1 rounded ${
                  isActive
                    ? 'text-white bg-gray-600'
                    : 'text-gray-200 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
