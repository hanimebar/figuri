'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email || '')
    }
    load()
  }, [])

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setEmailSuccess(false)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ email: newEmail })
      if (err) throw err
      setEmailSuccess(true)
      setNewEmail('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError(null)
    setPasswordSuccess(false)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password: newPassword })
      if (err) throw err
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // Delete accountant data (cascades to clients, figures, narratives via FK)
      await supabase.from('accountants').delete().eq('id', user.id)
      await supabase.auth.signOut()
      router.push('/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete account')
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Account" description="Manage your account credentials and data" />
      <div className="p-6 max-w-2xl space-y-6">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>Current: {email}</CardDescription>
          </CardHeader>
          <CardContent>
            {emailSuccess && (
              <Alert variant="success" className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Check your new email for a confirmation link.</AlertDescription>
              </Alert>
            )}
            <form onSubmit={updateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                />
              </div>
              <Button type="submit" disabled={loading || !newEmail} size="sm">
                Update Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Use a strong password of at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            {passwordSuccess && (
              <Alert variant="success" className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Password updated successfully.</AlertDescription>
              </Alert>
            )}
            <form onSubmit={updatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>
              <Button type="submit" disabled={loading || !newPassword} size="sm">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Linked accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Linked Accounts</CardTitle>
            <CardDescription>OAuth providers connected to your account.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>To link or unlink Google/GitHub, sign out and sign in with the desired provider. Supabase handles identity linking automatically.</p>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions are irreversible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently deletes your account, all clients, figures, and narratives. Cannot be undone.
                </p>
              </div>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your Figuri account, all client data, all monthly figures,
                      and all generated narratives. This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>All data will be permanently deleted. This cannot be reversed.</AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label>Type <strong>DELETE</strong> to confirm</Label>
                      <Input
                        value={deleteConfirm}
                        onChange={e => setDeleteConfirm(e.target.value)}
                        placeholder="DELETE"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={deleteAccount}
                      disabled={deleteConfirm !== 'DELETE'}
                    >
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
