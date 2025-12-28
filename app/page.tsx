"use client";

import { useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Search,
  CheckCircle, 
  TrendingUp, 
  Shield,
  FileText,
  BarChart3,
  Menu,
  X,
  Building2,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function SEOIntelligenceLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-light tracking-tight text-black">MUSEDATA</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#reports" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Reports</Link>
              <Link href="#insights" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Insights</Link>
              <Link href="/dashboard/billing" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Pricing</Link>
              
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase"
                  >
                    Dashboard
                  </Button>
                </a>
                <UserButton  />
              </Authenticated>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 bg-white">
            <div className="px-4 py-4 space-y-3">
                <Link href="#reports" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Reports</Link>
              <Link href="#insights" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Insights</Link>
              <Link href="/dashboard/billing" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Pricing</Link>
             
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase">
                    Get Started
                  </Button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <a href="/dashboard" className="block">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase">
                    Dashboard
                  </Button>
                </a>
              </Authenticated>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Badge className="bg-black text-white hover:bg-black/90 text-xs tracking-widest uppercase border-0">
                SEO Intelligence for Investors
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-8 text-black/70">
              Instant SEO Reports on Any Public Company
            </h1>

            <p className="text-xl sm:text-2xl font-light leading-relaxed text-black/70 mb-12 max-w-3xl">
              AI-powered competitive intelligence for investors. 
              Search visibility, keyword rankings, and digital presence analysis in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Generate Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-widest uppercase"
              >
                View Sample Report
              </Button>
            </div>

            {/* Metrics */}
            <div className="mt-16 pt-8 border-t border-black/10">
              <div className="grid grid-cols-3 gap-8 max-w-2xl">
                <div>
                  <div className="text-3xl font-light mb-1 text-black/70">30 Sec</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Report Generation</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-1 text-black/70">50K+</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Companies Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-1 text-black/70">Real-Time</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Data Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="reports" className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Due Diligence Shouldn't Take Weeks
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              Investors waste time manually researching digital presence. 
              Get comprehensive SEO intelligence instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/70">5-7 Days</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Manual Research</div>
              <p className="text-sm font-light text-black/70">
                Traditional competitive analysis timelines
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/60">12+ Tools</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Fragmented Data</div>
              <p className="text-sm font-light text-black/70">
                Multiple subscriptions for incomplete insights
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/60">$15K+</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Monthly Cost</div>
              <p className="text-sm font-light text-black/70">
                Spent on SEO tools and analyst time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="insights" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Comprehensive SEO Intelligence
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              AI-powered reports that give you complete visibility into any public company's digital presence and competitive positioning.
            </p>
          </div>

          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Search Visibility Analysis */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Search Visibility Analysis
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Understand how any company appears in search results. Track keyword rankings, 
                  organic traffic estimates, and SERP features across all major search engines.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Keyword ranking positions and trends</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Organic traffic estimates and projections</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">SERP feature analysis (featured snippets, knowledge panels)</span>
                  </div>
                </div>
              </div>
              
              <Card className="border-2 border-black/10 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-white/60 font-normal">
                    Sample Visibility Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm font-light">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Keyword Rankings</span>
                      <span className="text-white/60 ">15,420 tracked</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Organic Traffic Est.</span>
                      <span className="text-white/60 ">2.4M monthly</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Domain Authority</span>
                      <span className="text-white/60 ">78/100</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>SERP Features</span>
                      <span className="text-white/60 ">342 owned</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Intelligence */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Card className="border-2 border-black/10 shadow-none lg:order-1">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-white/60  font-normal">
                    Competitive Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-light">
                    <div className="flex items-start gap-3 py-2">
                      <Building2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-normal mb-1">Direct Competitors</div>
                        <div className="text-white/60  text-xs">Ranked by keyword overlap and traffic share</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-normal mb-1">Market Share Analysis</div>
                        <div className="text-white/60  text-xs">Search visibility vs. competitors over time</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <Eye className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-normal mb-1">Content Gap Analysis</div>
                        <div className="text-white/60  text-xs">Keywords competitors rank for but target doesn't</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <BarChart3 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-normal mb-1">Growth Trajectories</div>
                        <div className="text-white/60  text-xs">Historical trends and future projections</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:order-2">
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Competitive Positioning
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Benchmark any company against their competitors. Identify market leaders, 
                  emerging threats, and strategic opportunities in their digital landscape.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Competitor ranking and traffic benchmarks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Market share of voice analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Strategic content opportunities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical & Content Analysis */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Technical & Content Analysis
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Deep dive into website architecture, backlink profiles, and content strategy. 
                  Understand the technical foundation behind their search performance.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span>Backlink profile and authority distribution</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Content strategy and topic coverage</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Site speed and technical health metrics</span>
                  </div>
                </div>
              </div>
              
              <Card className="border-2 border-black/10 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-white/60 font-normal">
                    Technical Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm font-light">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Total Backlinks</span>
                      <span className="text-white/60">847K</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Referring Domains</span>
                      <span className="text-white/60">12.3K</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span>Indexed Pages</span>
                      <span className="text-white/60">45,280</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Core Web Vitals</span>
                      <span className="text-white/60">Good</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight">
              Built for Investment Professionals
            </h2>
            <p className="text-lg font-light text-white/70 leading-relaxed mb-12">
              Fast, comprehensive SEO intelligence for informed investment decisions.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Venture Capital</div>
                <p className="text-sm font-light text-white/60">
                  Assess digital traction and growth potential of portfolio targets
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Private Equity</div>
                <p className="text-sm font-light text-white/60">
                  Due diligence on digital assets and market positioning
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Hedge Funds</div>
                <p className="text-sm font-light text-white/60">
                  Real-time competitive intelligence for trading strategies
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Investment Banks</div>
                <p className="text-sm font-light text-white/60">
                  Market analysis for M&A and advisory engagements
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Research Analysts</div>
                <p className="text-sm font-light text-white/60">
                  Quantitative digital presence metrics for equity research
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Corp Dev Teams</div>
                <p className="text-sm font-light text-white/60">
                  Strategic acquisition targets and partnership opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Features */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight bg-black">
              Export-Ready Reports
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed bg-black">
              Professional reports formatted for investment committees and board presentations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <FileText className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/60">PDF Export</h3>
              <p className="text-sm font-light text-black/70">
                Investor-grade reports with charts, tables, and executive summaries
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <BarChart3 className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/60">Excel Data</h3>
              <p className="text-sm font-light text-black/70">
                Raw data exports for custom analysis and modeling
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <Shield className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/60">API Access</h3>
              <p className="text-sm font-light text-black/70">
                Integrate SEO data directly into your investment workflows
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-black p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight text-black/60">
              Start Generating Reports Today
            </h2>
            <p className="text-lg font-light text-black/70 mb-2 max-w-2xl mx-auto">
              Get instant access to comprehensive SEO intelligence on any public company.
            </p>
            <p className="text-sm font-light text-black/60 mb-8">
              Professional reports in seconds, not weeks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Generate Your First Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
            </div>
            
            <p className="mt-6 text-xs tracking-wider uppercase text-black/60">
              Real-Time Data • Export to PDF/Excel • API Access Available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-light tracking-tight">MUSEDATA</div>
            <div className="flex gap-8 text-xs tracking-wider uppercase text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-white/40">
            © 2025 MuseData. SEO intelligence platform for investment professionals.
          </div>
        </div>
      </footer>
    </div>
  );
}