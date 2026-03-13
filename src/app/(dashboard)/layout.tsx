import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import type { Accountant } from '@/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: accountant } = await supabase
    .from('accountants')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no accountant record, redirect to onboarding
  if (!accountant) redirect('/onboarding')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar accountant={accountant as Accountant} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
