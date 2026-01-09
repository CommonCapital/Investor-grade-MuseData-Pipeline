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
  Clock
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
              <Link href="#methodology" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Methodology</Link>
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
            <div className="px-6 py-8 space-y-6">
              <Link 
                href="#reports" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
              >
                Reports
              </Link>
              <Link 
                href="#methodology" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
              >
                Methodology
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
            <div className="mb-6">
              <Badge className="bg-black text-white hover:bg-black/90 text-xs tracking-widest uppercase border-0">
                MuseData for Investors
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-8 text-black/70">
              Decision-Grade Reports on Public Companies
            </h1>

            <p className="text-xl sm:text-2xl font-light leading-relaxed text-black/70 mb-12 max-w-3xl">
              Generate a full diligence snapshot with valuation, key drivers, risks, and "what changed." 
              Every claim links back to source evidence.
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
                  <div className="text-3xl font-light mb-1 text-black/70">2 Min</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Full Report</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-1 text-black/70">5K+</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Public Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-1 text-black/70">100%</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Sourced</div>
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
              Due Diligence Shouldn't Take Days
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              Get the complete picture—thesis, valuation range, key drivers, and recent changes—in minutes, not days.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/70">3-5 Days</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Traditional DD</div>
              <p className="text-sm font-light text-black/70">
                Manual research across multiple sources
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/60">8+ Tools</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Fragmented Data</div>
              <p className="text-sm font-light text-black/70">
                Bloomberg, CapIQ, transcripts, filings, news
              </p>
            </div>
            
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="text-4xl font-light mb-3 text-black/60">Hours</div>
              <div className="text-xs tracking-wider uppercase text-black/60 mb-3">Citation Work</div>
              <p className="text-sm font-light text-black/70">
                Tracking sources for every data point
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="methodology" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Comprehensive Investment Intelligence
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              AI-powered reports that give you everything you need to make informed decisions—with full source attribution.
            </p>
          </div>

          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Sourced Investment Thesis */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Sourced Investment Thesis
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Clear bull and bear cases with every claim linked to its source—filings, transcripts, 
                  news, or analyst reports. Know exactly where each insight comes from.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Bull and bear case with source citations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Key investment drivers and catalysts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Strategic positioning and competitive moats</span>
                  </div>
                </div>
              </div>
              
              <Card className="border-2 border-black/10 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-black/60 font-normal">
                    Sample Thesis Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-light">
                    <div className="p-3 bg-black/[0.02] border-l-2 border-black/20">
                      <div className="font-normal mb-1">Bull Case</div>
                      <div className="text-black/70 text-xs mb-2">Market leadership in cloud infrastructure with 32% YoY growth</div>
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <Link2 className="w-3 h-3" />
                        <span>Q3 2024 Earnings Call</span>
                      </div>
                    </div>
                    <div className="p-3 bg-black/[0.02] border-l-2 border-black/20">
                      <div className="font-normal mb-1">Bear Case</div>
                      <div className="text-black/70 text-xs mb-2">Margin pressure from increased capex and competitive pricing</div>
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <Link2 className="w-3 h-3" />
                        <span>10-Q Filing, Sep 2024</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Valuation Range */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Card className="border-2 border-black/10 shadow-none lg:order-1">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-black/60 font-normal">
                    Valuation Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-light">
                    <div className="flex justify-between items-center py-3 border-b border-black/5">
                      <span>DCF Fair Value</span>
                      <span className="text-black/60">$185 - $215</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-black/5">
                      <span>Comparable Multiples</span>
                      <span className="text-black/60">$175 - $205</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-black/5">
                      <span>Street Consensus</span>
                      <span className="text-black/60">$190</span>
                    </div>
                    <div className="flex justify-between items-center py-3 pt-4 border-t-2 border-black/20">
                      <span className="font-normal">Implied Range</span>
                      <span className="text-black/70 font-normal">$180 - $210</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/60 pt-2">
                      <Link2 className="w-3 h-3" />
                      <span>Based on 10-K, earnings transcripts, consensus estimates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:order-2">
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Valuation Range with Methodology
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Get a principled valuation range using multiple approaches—DCF, comparables, and 
                  consensus estimates. All assumptions and sources clearly documented.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">DCF with transparent assumptions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Peer comparable multiples analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Implied valuation range with confidence levels</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Drivers & Risks */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  Key Drivers & Risk Factors
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Understand what moves the stock and what could go wrong. Each driver and risk 
                  is quantified where possible and linked to supporting evidence.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Revenue and margin drivers with sensitivities</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Operational, financial, and market risks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Regulatory and competitive dynamics</span>
                  </div>
                </div>
              </div>
              
              <Card className="border-2 border-black/10 shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-black/60 font-normal">
                    Sample Key Drivers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-light">
                    <div className="flex items-start gap-3 py-2">
                      <Target className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                      <div>
                        <div className="font-normal mb-1">Cloud Revenue Growth</div>
                        <div className="text-black/70 text-xs mb-1">32% YoY, driving 65% of incremental revenue</div>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <Link2 className="w-3 h-3" />
                          <span>Q3 Earnings</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                      <div>
                        <div className="font-normal mb-1">Margin Pressure Risk</div>
                        <div className="text-black/70 text-xs mb-1">Capex up 40% YoY, could compress EBITDA 2-3%</div>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <Link2 className="w-3 h-3" />
                          <span>CFO Commentary</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* What Changed */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Card className="border-2 border-black/10 shadow-none lg:order-1">
                <CardHeader>
                  <CardTitle className="text-sm tracking-wider uppercase text-black/60 font-normal">
                    Recent Developments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm font-light">
                    <div className="flex items-start gap-3 py-2">
                      <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                      <div>
                        <div className="font-normal mb-1">Q3 Earnings Beat</div>
                        <div className="text-black/70 text-xs mb-1">EPS $2.15 vs $2.02 est, revenue +28% YoY</div>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <Link2 className="w-3 h-3" />
                          <span>3 days ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                      <div>
                        <div className="font-normal mb-1">Strategic Acquisition</div>
                        <div className="text-black/70 text-xs mb-1">$2.4B deal for AI infrastructure company announced</div>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <Link2 className="w-3 h-3" />
                          <span>1 week ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                      <div>
                        <div className="font-normal mb-1">Analyst Upgrades</div>
                        <div className="text-black/70 text-xs mb-1">3 upgrades, avg PT raised to $195 from $180</div>
                        <div className="flex items-center gap-2 text-xs text-black/60">
                          <Link2 className="w-3 h-3" />
                          <span>Last 2 weeks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:order-2">
                <h3 className="text-2xl font-light mb-6 tracking-tight text-black/70">
                  What Changed Since Last Run
                </h3>
                <p className="text-base font-light text-black/70 leading-relaxed mb-6">
                  Track material updates since your last report—earnings, guidance changes, 
                  M&A activity, analyst revisions, and regulatory developments.
                </p>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Earnings results and guidance updates</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">M&A announcements and strategic moves</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-black/70" />
                    <span className="text-black/70">Analyst rating and estimate changes</span>
                  </div>
                </div>
              </div>
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
              Fast, comprehensive diligence for informed investment decisions.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Equity Research</div>
                <p className="text-sm font-light text-white/60">
                  Initiate coverage and update models with sourced insights
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Portfolio Management</div>
                <p className="text-sm font-light text-white/60">
                  Monitor holdings and track material developments
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Investment Banking</div>
                <p className="text-sm font-light text-white/60">
                  Quick diligence for M&A mandates and pitch books
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Private Equity</div>
                <p className="text-sm font-light text-white/60">
                  Screen public comps and market sizing for deals
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Hedge Funds</div>
                <p className="text-sm font-light text-white/60">
                  Generate long/short ideas with thesis documentation
                </p>
              </div>
              <div className="p-8 border border-white/20 bg-white/5">
                <div className="text-2xl font-light mb-2">Corp Dev</div>
                <p className="text-sm font-light text-white/60">
                  Evaluate strategic acquisition targets and partners
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
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Professional, Sourced Reports
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              Investment-grade documentation with full source attribution and export options.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <Link2 className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/70">Full Citations</h3>
              <p className="text-sm font-light text-black/70">
                Every claim links to source—filings, transcripts, news, or research
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <FileText className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/70">PDF Export</h3>
              <p className="text-sm font-light text-black/70">
                Professional reports formatted for investment committees
              </p>
            </div>

            <div className="text-center p-8 bg-white border border-black/10">
              <div className="inline-flex p-4 mb-4">
                <Shield className="w-8 h-8 text-black/60" />
              </div>
              <h3 className="text-xl font-light mb-3 text-black/70">API Access</h3>
              <p className="text-sm font-light text-black/70">
                Integrate research data into your investment workflow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-black p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight text-black/70">
              Start Generating Reports Today
            </h2>
            <p className="text-lg font-light text-black/70 mb-2 max-w-2xl mx-auto">
              Get decision-grade diligence on any public company—thesis, valuation, drivers, and sources.
            </p>
            <p className="text-sm font-light text-black/60 mb-8">
              Complete investment intelligence in minutes.
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
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-widest uppercase"
              >
                View Sample Report
              </Button>
            </div>
            
            <p className="mt-6 text-xs tracking-wider uppercase text-black/60">
              Sourced Thesis • Valuation Range • Key Drivers • What Changed
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
            © 2025 MuseData. Decision-grade investment intelligence for professionals.
          </div>
        </div>
      </footer>
    </div>
  );
}