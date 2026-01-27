import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser';
import { convexToJson } from 'convex/values';
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
   // ✅ Check if user has paid plan
  const paidUser = has?.({ plan: "monthly" })
  const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!
  );
  // ✅ Get user's usage info (accumulative limits)
  const usageInfo = await convex.query(
    api.subscriptions.canCreateReport,
    { userId, isPaidUser: paidUser || false }
  )

  // ✅ Block if limit reached
  if (!usageInfo.canCreate) {
    redirect("/search/billing")
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default Layout