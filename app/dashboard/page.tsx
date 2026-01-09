'use client'

import { initiateLLM } from '@/actions/initialeLLM'
import CountrySelector from '@/components/CountrySelector/CountrySelector'
import ReportsTable from '@/components/ReportsTable/ReportsTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Authenticated, AuthLoading } from 'convex/react'
import { BarChart3, FileText, Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Dashboard = () => {
  const [prompt, setPrompt] = useState('')
  const [country, setCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt || isLoading) return
    setIsLoading(true)

    try {
      const response = await initiateLLM(prompt, undefined, country)
      
      if (response.ok) {
        console.log(`Job created: ${response?.data?.jobId}`)
        console.log(`Snapshot ID: ${response?.data?.snapshot_id}`)
        
        // ✅ Use snapshot_id for URL
        router.push(`/dashboard/report/${response?.data?.snapshot_id}`)
      } else {
        console.error('Failed to create job:', response.error)
        alert(`Error: ${response.error}`) // ✅ Show error on mobile
      }
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Error creating report. Please try again.') // ✅ Show error on mobile
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ✅ FIXED: Better mobile padding and max-width */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
        <div className="space-y-12 sm:space-y-24">

          {/* CREATE REPORT */}
          <Card className="border border-black/10 shadow-sm rounded-none">
            <CardHeader className="space-y-4 sm:space-y-6 pb-8 sm:pb-12">
              {/* ✅ FIXED: Better mobile font sizes */}
              <CardTitle className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Create Report
              </CardTitle>
              <CardDescription className="max-w-[680px] text-sm sm:text-base leading-relaxed">
                Enter a business to generate a comprehensive MuseData analysis.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-12">
                {/* ✅ FIXED: Stack on mobile, grid on desktop */}
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4">

                  {/* INPUT - ✅ Better touch target size */}
                  <div className="relative w-full">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50 pointer-events-none" />
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Business / Product / Website"
                      disabled={isLoading}
                      className="
                        h-12 sm:h-12 pl-10
                        border border-black/30
                        rounded-none
                        text-base
                        focus:border-black focus:ring-0
                        w-full
                      "
                    />
                  </div>

                  {/* COUNTRY SELECTOR - ✅ Full width on mobile */}
                  <div className="w-full sm:w-auto">
                    <CountrySelector
                      value={country}
                      onValueChange={setCountry}
                      disabled={isLoading}
                    />
                  </div>

                  {/* BUTTON - ✅ Full width on mobile, better touch target */}
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="
                      h-12 sm:h-12 px-6
                      bg-black text-white
                      rounded-none
                      uppercase tracking-[0.15em] text-xs sm:text-sm
                      hover:bg-white hover:text-black hover:border hover:border-black
                      transition-all duration-300
                      w-full sm:w-auto
                      touch-manipulation
                    "
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Generate</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* REPORTS */}
          <Card className="border border-black/10 shadow-sm rounded-none">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <CardTitle className="text-xl sm:text-2xl font-serif">
                  Recent Reports
                </CardTitle>
              </div>
              <CardDescription className="text-sm">
                Track generated SEO analyses
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Authenticated>
                {/* ✅ ReportsTable should handle its own mobile responsive */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <ReportsTable />
                </div>
              </Authenticated>

              <AuthLoading>
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              </AuthLoading>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Dashboard