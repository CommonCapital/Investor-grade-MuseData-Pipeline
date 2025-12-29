import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-24 lg:pt-32 pb-16 lg:pb-24">
          <div className="max-w-[680px]">
            <h2 
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6"
              style={{ fontFamily: 'Garamond, Georgia, serif' }}
            >
              Join Subscription
            </h2>
            <p 
              className="text-lg sm:text-xl font-light leading-relaxed opacity-70"
              style={{ 
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                letterSpacing: '0.02em' 
              }}
            >
              Choose the plan that transforms your workflow. 
              Simple pricing, extraordinary results.
            </p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="pb-24 lg:pb-32">
          <PricingTable />
        </div>
      </div>
    </div>
  )
}

export default Billing