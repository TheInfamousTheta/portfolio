'use client';

import { useState } from 'react';
import { Menu, X, Terminal, Cpu } from 'lucide-react';
import { personalDetails } from '../data/portfolio';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Projects', href: '#projects' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/75 backdrop-blur-md dark:border-zinc-800 dark:bg-black/75">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-500" />
            <a href="#" className="font-mono text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              {personalDetails.name}
              <span className="text-emerald-500">.sh</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-mono text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Cpu className="h-3.5 w-3.5" />
                Initialize Connection
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-zinc-200 bg-white px-2 pt-2 pb-4 dark:border-zinc-800 dark:bg-black md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 font-mono text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-emerald-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-2.5 font-mono text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950"
            >
              <Cpu className="h-4 w-4" />
              Initialize Connection
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
