'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Settings, CreditCard, HelpCircle,
  User, LogOut, FileText, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { Accountant } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/account', label: 'Account', icon: User },
  { href: '/dashboard/help', label: 'Help & Guide', icon: HelpCircle },
]

interface SidebarProps {
  accountant: Accountant | null
}

export function Sidebar({ accountant }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out',
        'bg-[var(--sidebar-bg)] text-[var(--sidebar-text)]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-slate-700/50',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-xl tracking-tight">Figuri</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
              isActive(href, exact)
                ? 'bg-primary text-white'
                : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-accent)] hover:text-white',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className={cn(
        'p-3 border-t border-slate-700/50',
        collapsed ? 'flex flex-col items-center gap-2' : ''
      )}>
        {!collapsed && accountant && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--sidebar-accent)] transition-colors mb-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={accountant.logo_url || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(accountant.business_name || accountant.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {accountant.business_name || 'My Practice'}
              </p>
              <p className="text-xs text-slate-400 truncate">{accountant.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-[var(--sidebar-accent)] transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--sidebar-bg)] border border-slate-600 text-slate-400 hover:text-white transition-colors shadow-md"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
