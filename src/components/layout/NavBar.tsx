// File location: /src/components/layout/NavBar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { BookOpen, Menu, X, User, LogOut, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // NavLinks for authenticated users
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/modules', label: 'Module', icon: BookOpen },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 shadow-sm sticky top-0 z-40">
      <div className="container-wide py-3">
        <div className="flex items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-500" />
              <span className="text-xl font-bold text-secondary-900 dark:text-white">NotesWithFriends</span>
            </Link>

            {/* Desktop navigation */}
            {status === 'authenticated' && (
              <div className="hidden md:flex gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors
                        ${isActive(link.href)
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800/70'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auth buttons or user menu */}
          <div className="flex items-center gap-2">
            {status === 'loading' ? (
              <div className="h-9 w-24 bg-secondary-100 dark:bg-secondary-800 animate-pulse rounded-md"></div>
            ) : status === 'authenticated' ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {session.user?.name}
                </div>
                <div className="relative group">
                  <button className="h-9 w-9 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Einstellungen
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Abmelden
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Abmelden
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Registrieren
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 hover:bg-secondary-100 dark:hover:text-white dark:hover:bg-secondary-800 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Menü öffnen</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {status === 'authenticated' ? (
            <>
              <div className="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 border-b border-secondary-200 dark:border-secondary-800 mb-2 pb-2">
                {session.user?.name}
              </div>
              
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2
                      ${isActive(link.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800/70'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800/70 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Profil
              </Link>
              
              <Link
                href="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800/70 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Einstellungen
              </Link>
              
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800/70"
                onClick={() => setMobileMenuOpen(false)}
              >
                Anmelden
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;