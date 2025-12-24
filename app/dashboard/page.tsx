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
        router.push(`/dashboard/report/${response.data.snapshot_id}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[1200px] px-4 py-24">
        <div className="space-y-24">

          {/* CREATE REPORT */}
          <Card className="border border-black/10 shadow-sm rounded-none">
            <CardHeader className="space-y-6 pb-12">
              <CardTitle className="font-serif text-[clamp(36px,6vw,48px)] tracking-tight leading-tight">
                Create Report
              </CardTitle>
              <CardDescription className="max-w-[680px] text-base leading-relaxed ">
                Enter a business, product, or website to generate a
                comprehensive SEO analysis.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4">

                  {/* INPUT */}
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Business / Product / Website"
                      disabled={isLoading}
                      className="
                        h-12 pl-10
                        border border-black/30
                        rounded-none
                        text-base
                        focus:border-black focus:ring-0
                      "
                    />
                  </div>

                  <CountrySelector
                    value={country}
                    onValueChange={setCountry}
                    disabled={isLoading}
                  />

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="
                      h-12 px-6
                      bg-black text-white
                      rounded-none
                      uppercase tracking-[0.15em] text-sm
                      hover:bg-white hover:text-black hover:border hover:border-black
                      transition-all duration-300
                    "
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Generate
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
                <CardTitle className="text-2xl font-serif">
                  Recent Reports
                </CardTitle>
              </div>
              <CardDescription className="">
                Track generated SEO analyses
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Authenticated>
                <ReportsTable />
              </Authenticated>

              <AuthLoading>
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin " />
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
