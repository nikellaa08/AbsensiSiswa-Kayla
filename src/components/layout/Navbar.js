'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { cn } from '@/utils/helpers';
import Logo from '@/components/ui/Logo';

const LINKS = [
  { href: '#tentang', label: 'Tentang Sekolah' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'border-b border-gray-200/70 bg-white/85 shadow-sm backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="Beranda SMK 8 Jakarta Barat">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link href="/dashboard" className={buttonClasses('primary', 'md')}>
              Buka Dashboard
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/login" className={buttonClasses('primary', 'md')}>
              Login
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          aria-label="Buka menu"
        >
          {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 border-t border-gray-100 pt-3">
              <Link href="/login" className={buttonClasses('primary', 'md', 'w-full')}>
                {user ? 'Buka Dashboard' : 'Login'}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
