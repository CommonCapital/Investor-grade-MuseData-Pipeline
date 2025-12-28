import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, has} = await auth()
  
  if (!userId) {
    redirect('/')
  }

  // Check if user has the monthly plan from session claims
   const paidUser = has?.({ plan: "monthly" })
  
  if (!paidUser) {
    redirect("/dashboard/billing")
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default Layout