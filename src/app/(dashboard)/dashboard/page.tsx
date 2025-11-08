import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect SuperAdmin to admin panel
  if (session.user?.isSuperAdmin) {
    redirect('/dashboard/admin')
  }

  // Regular users go to store page (main dashboard)
  redirect('/dashboard/store')
}
