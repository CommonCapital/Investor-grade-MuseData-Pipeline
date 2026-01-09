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
  Eye,
  Link2,
  AlertTriangle,
  Target,
  Clock,
  GitBranch,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function SEOIntelligenceLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-light tracking-tight text-black">MUSEDATA</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#library" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Library</Link>
              <Link href="#packs" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Packs</Link>
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
                <UserButton />
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
            <div className="px-6 py-8 space-y-6">
              <Link 
                href="#library" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
              >
                Library
              </Link>
              <Link 
                href="#packs" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
              >
                Packs
              </Link>
              <Link 
                href="/dashboard/billing" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
              >
                Pricing
              </Link>
              
              <div className="pt-4">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button className="w-full h-12 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase transition-all duration-300">
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                
                <Authenticated>
                  <a href="/dashboard" className="block">
                    <Button className="w-full h-12 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase transition-all duration-300">
                      Dashboard
                    </Button>
                  </a>
                </Authenticated>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 animate-fade-in-up">
              <Badge className="bg-black text-white hover:bg-black/90 text-xs tracking-widest uppercase border-0">
                MuseData for Public Markets
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-8 text-black/70 animate-fade-in-up delay-100">
              Systematic disclosure monitoring with claim level provenance
            </h1>

            <p className="text-xl sm:text-2xl font-light leading-relaxed text-black/70 mb-12 max-w-3xl animate-fade-in-up delay-200">
              Produce memo format research packs from filings, transcripts, and IR materials. Each delta includes a citation ID, source excerpt, retrieval date, and coverage window. Tables export with inputs and formulas preserved for reruns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Produce Pack
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
                    Produce Pack
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
              <a href="/sample-report">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-widest uppercase"
                
              >
                View Sample Pack
              </Button>
              </a>
            </div>

            {/* Trust Line */}
            <div className="mt-16 pt-8 border-t border-black/10 animate-fade-in-up delay-400">
              <div className="text-sm tracking-wider uppercase text-black/60">
                Provenance first. Change log second. Opinion last.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              The bottleneck is lineage, not access
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              Facts are available. Attribution degrades with time. Updates break workflows. MuseData maintains a source linked record so research can be reviewed, rerun, and compared across periods.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="packs" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              What you get
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Provenance */}
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5">
                    <Link2 className="w-6 h-6 text-black/60" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light mb-2 text-white/70">
                      Provenance
                    </CardTitle>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      Claim level citations to the originating document and location, with citation IDs and retrieval dates.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Card 2: Change Log */}
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5">
                    <GitBranch className="w-6 h-6 text-black/60" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light mb-2 text-white/70">
                      Change Log
                    </CardTitle>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      Material deltas since last run across disclosures, with evidence attached and a documented coverage window.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Card 3: Exports */}
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5">
                    <FileText className="w-6 h-6 text-black/60" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light mb-2 text-white/70">
                      Exports
                    </CardTitle>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      Memo format PDF plus model ready tables with stable field names.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Card 4: Methods */}
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5">
                    <Settings className="w-6 h-6 text-black/60" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light mb-2 text-black/70">
                      Methods
                    </CardTitle>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      Calculation rules, inputs, and formulas included so outputs can be audited and rerun.
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What Changed Since Last Run */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Material deltas, attributable to source
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed mb-8">
              Track changes since your last pack as discrete deltas with citations, timestamps, and excerpts.
            </p>
            
            <div className="space-y-3 text-sm font-light">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Earnings and guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Capital allocation and M&A</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Segment disclosures</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Estimate and rating revisions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Regulatory and legal updates</span>
              </div>
            </div>
          </div>

          {/* Recent Developments Module */}
          <Card className="border-2 border-black/10 shadow-none max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="text-sm tracking-wider uppercase text-black/60 font-normal">
                Recent Developments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-light">
                  <thead>
                    <tr className="border-b border-black/10">
                      <th className="text-left py-3 px-4 font-normal text-white/60 text-xs tracking-wider uppercase">Event</th>
                      <th className="text-left py-3 px-4 font-normal text-white/60 text-xs tracking-wider uppercase">Delta</th>
                      <th className="text-left py-3 px-4 font-normal text-white/60 text-xs tracking-wider uppercase">Source</th>
                      <th className="text-left py-3 px-4 font-normal text-white/60 text-xs tracking-wider uppercase">Timestamp</th>
                      <th className="text-left py-3 px-4 font-normal text-white/60 text-xs tracking-wider uppercase">Citation ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/70">Q3 Earnings</td>
                      <td className="py-3 px-4 text-white/70">EPS $2.15 vs $2.02 est, revenue +28% YoY</td>
                      <td className="py-3 px-4 text-white/70">8-K Filing</td>
                      <td className="py-3 px-4 text-white/60">2024-10-24</td>
                      <td className="py-3 px-4 text-white/60 font-mono text-xs">CIT-2024-1024-001</td>
                    </tr>
                    <tr className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/70">Guidance Revision</td>
                      <td className="py-3 px-4 text-white/70">FY24 revenue guidance raised to $48-49B from $46-47B</td>
                      <td className="py-3 px-4 text-white/70">Earnings Call</td>
                      <td className="py-3 px-4 text-white/60">2024-10-24</td>
                      <td className="py-3 px-4 text-white/60 font-mono text-xs">CIT-2024-1024-012</td>
                    </tr>
                    <tr className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/70">M&A Announcement</td>
                      <td className="py-3 px-4 text-white/70">$2.4B acquisition announced</td>
                      <td className="py-3 px-4 text-white/70">Press Release</td>
                      <td className="py-3 px-4 text-white/60">2024-10-17</td>
                      <td className="py-3 px-4 text-white/60 font-mono text-xs">CIT-2024-1017-003</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Packs for Workflows */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Packs for the workflows that matter
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  1. Coverage Refresh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-white/70 leading-relaxed">
                  Refresh a name with an updated change log, claim register, and citation map.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  2. Event Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-white/70 leading-relaxed">
                  Pre and post earnings workflow with guidance diffs, KPI deltas, and transcript citations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  3. Portfolio Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-white/70 leading-relaxed">
                  Watchlist monitoring that surfaces only names with documented deltas and preserves history.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  4. Comps and Valuation Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-light text-white/70 leading-relaxed">
                  Comparable sets and valuation inputs with a documented assumptions log. No opaque outputs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Claim Register */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                Bull and bear cases as a claim register
              </h3>
              <p className="text-base font-light text-black/70 leading-relaxed">
                Drivers, risks, and catalysts expressed as discrete claims with sources, measurement hooks, and sensitivity handles where available.
              </p>
            </div>
            
            <Card className="border-2 border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-sm tracking-wider uppercase text-white/60 font-normal">
                  Sample Claim Register
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm font-light">
                  <div className="p-3 bg-black/[0.02] border-l-2 border-black/20">
                    <div className="font-normal mb-1">Bull Case</div>
                    <div className="text-white/70 text-xs mb-2">Cloud infrastructure revenue grew 32% YoY in Q3 2024.</div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Link2 className="w-3 h-3" />
                      <span>Q3 2024 Earnings Call | CIT-2024-1024-005</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black/[0.02] border-l-2 border-black/20">
                    <div className="font-normal mb-1">Bear Case</div>
                    <div className="text-white/70 text-xs mb-2">Capital expenditures increased 40% YoY, compressing EBITDA margins.</div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Link2 className="w-3 h-3" />
                      <span>10-Q Filing, Sep 2024 | CIT-2024-0930-018</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valuation Inputs */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <Card className="border-2 border-black/10 shadow-none lg:order-1">
              <CardHeader>
                <CardTitle className="text-sm tracking-wider uppercase text-white/60 font-normal">
                  Valuation Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm font-light">
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span>DCF Fair Value Range</span>
                    <span className="text-white/60">$185 - $215</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span>Comparable Multiples</span>
                    <span className="text-white/60">$175 - $205</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/5">
                    <span>Consensus Target</span>
                    <span className="text-white/60">$190</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60 pt-4 border-t-2 border-black/20">
                    <Link2 className="w-3 h-3" />
                    <span>Based on 10-K (CIT-2024-0228-001), earnings transcripts, consensus estimates (retrieved 2024-10-27)</span>
                  </div>
                  <div className="text-xs text-white/60 pt-2">
                    Coverage window: 2024-02-28 to 2024-10-27
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:order-2">
              <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                Valuation inputs with an assumptions log
              </h3>
              <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                DCF inputs, comps context, and consensus references with sources, timestamps, and documented assumptions.
              </p>
              <p className="text-xs font-light text-black/60 italic">
                Research workflow tooling. Not investment advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence and Controls */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Governed output, not generated prose
            </h2>
            
            <div className="space-y-3 text-sm font-light mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Citation IDs and retrieval dates for every claim</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Coverage window and last updated on every page</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Methods include formulas, inputs, and source mapping</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">PDF plus tables export with stable field names</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                <span className="text-black/70">Materiality thresholds documented per pack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Evidence Library */}
      <section id="library" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Public Evidence Library
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              Each ticker maintains a persistent change history. Each update appends to the record. Links remain stable. Comparisons remain consistent.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-8 bg-black/[0.02] border border-black/10 hover-lift">
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Source Linked</div>
              <div className="text-3xl font-light text-black/70">By Default</div>
            </div>
            <div className="text-center p-8 bg-black/[0.02] border border-black/10 hover-lift">
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Generation Time</div>
              <div className="text-3xl font-light text-black/70">Minutes</div>
            </div>
            <div className="text-center p-8 bg-black/[0.02] border border-black/10 hover-lift">
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Coverage</div>
              <div className="text-3xl font-light text-black/70">Broad</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight">
              Start producing research packs
            </h2>
            <p className="text-lg font-light text-white/70 mb-2 max-w-2xl mx-auto">
              Systematic disclosure monitoring with claim level provenance and documented change logs.
            </p>
            <p className="text-sm font-light text-white/60 mb-8">
              Source linked by default. Minutes, not days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Produce Pack
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-widest uppercase"
              >
                View Sample Pack
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-light tracking-tight text-black">MUSEDATA</div>
            <div className="flex gap-8 text-xs tracking-wider uppercase text-black/60">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Security</a>
              <a href="#" className="hover:text-black transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-black/40">
            © 2025 MuseData. Systematic disclosure monitoring with claim level provenance.
          </div>
        </div>
      </footer>
    </div>
  );
}