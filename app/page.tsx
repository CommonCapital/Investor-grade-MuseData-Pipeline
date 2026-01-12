"use client";

import {  useState } from "react";
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
  Settings,
  GitCompare,
  Activity,
  AlertCircle,
  Database
} from "lucide-react";
import Link from "next/link";

export default function SEOIntelligenceLanding() {
  const[mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<number | null>(null);
  
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
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(59, 130, 246, 0.5); }
          50% { border-color: rgba(59, 130, 246, 1); }
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
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        
        .evidence-row {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .evidence-row:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        .evidence-row.selected {
          background-color: rgba(59, 130, 246, 0.1);
          border-left: 3px solid rgb(59, 130, 246);
        }
        
        .diff-increase {
          background-color: rgba(34, 197, 94, 0.1);
          border-left: 3px solid rgb(34, 197, 94);
        }
        
        .diff-decrease {
          background-color: rgba(239, 68, 68, 0.1);
          border-left: 3px solid rgb(239, 68, 68);
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-light tracking-tight text-black">MUSEDATA</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#evidence-ledger" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Evidence Ledger</Link>
              <Link href="#monitoring" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Monitoring</Link>
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
                href="#evidence-ledger" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                Evidence Ledger
              </Link>
              <Link 
                href="#monitoring" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                Monitoring
              </Link>
              <Link 
                href="/dashboard/billing" 
                className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
                onClick={() => setMobileMenuOpen(false)}
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

      {/* Hero Section - REVISED */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 animate-fade-in-up">
              <Badge className="bg-black text-white hover:bg-black/90 text-xs tracking-widest uppercase border-0">
                Deterministic Evidence Engine
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight mb-8 text-black/90 animate-fade-in-up delay-100">
              Every claim has a source.<br/>
              Every change has a timestamp.<br/>
              Every number has a tie-out.
            </h1>

            <p className="text-xl sm:text-2xl font-light leading-relaxed text-black/70 mb-12 max-w-3xl animate-fade-in-up delay-200">
              MuseData maintains a deterministic evidence ledger for public market disclosures. 
              Subscribe to watchlist monitoring with citation IDs, source excerpts, and documented change logs. 
              Compare runs. Audit outputs. Trust the numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Start Monitoring
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
                    Start Monitoring
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
                  View Evidence Pack
                </Button>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="mt-16 pt-8 border-t border-black/10 animate-fade-in-up delay-400">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-light text-black/90 mb-1">100%</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Source Linked</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-black/90 mb-1">&lt; 5min</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Update Time</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-black/90 mb-1">Deterministic</div>
                  <div className="text-xs tracking-wider uppercase text-black/60">Reruns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              The bottleneck is lineage, not access
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed mb-8">
              Bloomberg gives you data. PitchBook gives you comps. Neither gives you an evidence ledger with claim-level provenance, deterministic reruns, and version-controlled change logs.
            </p>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              MuseData maintains a source-linked record so research can be audited, rerun, and compared across periods. No hallucinations. No attribution decay. No broken workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Evidence Ledger - NEW */}
      <section id="evidence-ledger" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              The Evidence Ledger
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed mb-4">
              Every claim is backed by a ledger entry with citation ID, source excerpt, retrieval timestamp, 
              confidence score, and tie-out status. Click any row to see the full provenance chain.
            </p>
            <p className="text-sm font-light text-black/60 italic">
              This is the foundation that makes everything else possible.
            </p>
          </div>

          {/* Evidence Ledger Table */}
          <Card className="border-2 border-black/10 shadow-none max-w-6xl mx-auto mb-6">
            <CardHeader className="bg-black/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm tracking-wider uppercase text-white/60 font-normal">
                  Evidence Ledger - Live Example
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Database className="w-4 h-4" />
                  <span>Interactive: Click any row</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-light">
                  <thead>
                    <tr className="border-b-2 border-black/10">
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Claim ID</th>
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Metric</th>
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Value</th>
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Source</th>
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Retrieved</th>
                      <th className="text-left py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Confidence</th>
                      <th className="text-center py-3 px-3 font-normal text-white/60 text-xs tracking-wider uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      className={`border-b border-black/5 evidence-row ${selectedEvidence === 1 ? 'selected' : ''}`}
                      onClick={() => setSelectedEvidence(selectedEvidence === 1 ? null : 1)}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-blue-600">CIT-2024-1024-001</td>
                      <td className="py-3 px-3 text-white/70">Q3 EPS</td>
                      <td className="py-3 px-3 text-white/90 font-semibold">$2.15</td>
                      <td className="py-3 px-3">
                        <a href="#" className="text-blue-600 hover:underline text-xs">8-K Filing</a>
                      </td>
                      <td className="py-3 px-3 text-white/60 text-xs">2024-10-24 16:05:23 UTC</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          98%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <CheckCircle className="w-4 h-4 text-green-600 inline-block" />
                      </td>
                    </tr>
                    
                    <tr 
                      className={`border-b border-black/5 evidence-row ${selectedEvidence === 2 ? 'selected' : ''}`}
                      onClick={() => setSelectedEvidence(selectedEvidence === 2 ? null : 2)}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-blue-600">CIT-2024-1024-002</td>
                      <td className="py-3 px-3 text-white/70">Revenue</td>
                      <td className="py-3 px-3 text-white/90 font-semibold">$12.4B</td>
                      <td className="py-3 px-3">
                        <a href="#" className="text-blue-600 hover:underline text-xs">10-Q Sec 1.2</a>
                      </td>
                      <td className="py-3 px-3 text-white/60 text-xs">2024-10-24 16:05:45 UTC</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          95%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <CheckCircle className="w-4 h-4 text-green-600 inline-block" />
                      </td>
                    </tr>
                    
                    <tr 
                      className={`border-b border-black/5 evidence-row ${selectedEvidence === 3 ? 'selected' : ''}`}
                      onClick={() => setSelectedEvidence(selectedEvidence === 3 ? null : 3)}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-blue-600">CIT-2024-1024-003</td>
                      <td className="py-3 px-3 text-white/70">Operating Margin</td>
                      <td className="py-3 px-3 text-white/90 font-semibold">18.5%</td>
                      <td className="py-3 px-3">
                        <a href="#" className="text-blue-600 hover:underline text-xs">Transcript P.12</a>
                      </td>
                      <td className="py-3 px-3 text-white/60 text-xs">2024-10-24 18:22:11 UTC</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          87%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <AlertCircle className="w-4 h-4 text-amber-600 inline-block" />
                      </td>
                    </tr>
                    
                    <tr 
                      className={`border-b border-black/5 evidence-row ${selectedEvidence === 4 ? 'selected' : ''}`}
                      onClick={() => setSelectedEvidence(selectedEvidence === 4 ? null : 4)}
                    >
                      <td className="py-3 px-3 font-mono text-xs text-blue-600">CIT-2024-1024-012</td>
                      <td className="py-3 px-3 text-white/70">FY24 Guidance</td>
                      <td className="py-3 px-3 text-white/90 font-semibold">$48-49B</td>
                      <td className="py-3 px-3">
                        <a href="#" className="text-blue-600 hover:underline text-xs">Earnings Call</a>
                      </td>
                      <td className="py-3 px-3 text-white/60 text-xs">2024-10-24 18:33:02 UTC</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          92%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <CheckCircle className="w-4 h-4 text-green-600 inline-block" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Detail Panel */}
          {selectedEvidence && (
            <Card className="border-l-4 border-blue-600 bg-blue-50/50 max-w-6xl mx-auto animate-fade-in">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-xs uppercase tracking-wide text-blue-900 font-semibold">Source Excerpt</span>
                    </div>
                    <div className="p-4 bg-white border border-blue-200 rounded text-sm leading-relaxed">
                      {selectedEvidence === 1 && (
                        <p className="text-gray-800">
                          "Net income attributable to common stockholders was $5.2 billion, or <mark className="bg-yellow-200 font-semibold">$2.15 per diluted share</mark>, compared to $4.8 billion, or $2.02 per diluted share, in the same quarter last year."
                        </p>
                      )}
                      {selectedEvidence === 2 && (
                        <p className="text-gray-800">
                          "Total revenue for the quarter was <mark className="bg-yellow-200 font-semibold">$12.4 billion</mark>, representing an increase of 28% year-over-year from $9.7 billion in Q3 2023."
                        </p>
                      )}
                      {selectedEvidence === 3 && (
                        <p className="text-gray-800">
                          "Operating margin for the quarter was approximately <mark className="bg-yellow-200 font-semibold">18.5%</mark>, as we continue to invest heavily in infrastructure and R&D."
                        </p>
                      )}
                      {selectedEvidence === 4 && (
                        <p className="text-gray-800">
                          "We are raising our full-year revenue guidance to a range of <mark className="bg-yellow-200 font-semibold">$48 billion to $49 billion</mark>, up from our previous guidance of $46 billion to $47 billion."
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">Document</div>
                      <p className="text-sm text-gray-700">
                        {selectedEvidence === 1 && "Form 8-K filed 2024-10-24"}
                        {selectedEvidence === 2 && "Form 10-Q Q3 2024"}
                        {selectedEvidence === 3 && "Earnings Transcript"}
                        {selectedEvidence === 4 && "Earnings Call Transcript"}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">Location</div>
                      <p className="text-sm text-gray-700">
                        {selectedEvidence === 1 && "Financial Results, P.3, L.42"}
                        {selectedEvidence === 2 && "Section 1.2, Table 2"}
                        {selectedEvidence === 3 && "Page 12, Line 8"}
                        {selectedEvidence === 4 && "Management Remarks, Min 14:32"}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">Parser</div>
                      <p className="text-sm text-gray-700 font-mono">
                        {selectedEvidence === 1 && "v2.4.1-sec"}
                        {selectedEvidence === 2 && "v2.4.1-sec"}
                        {selectedEvidence === 3 && "v2.3.8-transcript"}
                        {selectedEvidence === 4 && "v2.3.8-transcript"}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <div className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-1">Method</div>
                      <p className="text-sm text-gray-700">
                        {selectedEvidence === 1 && "Regex + LLM verify"}
                        {selectedEvidence === 2 && "Table extraction"}
                        {selectedEvidence === 3 && "NER + context"}
                        {selectedEvidence === 4 && "Speech-to-text + NER"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-blue-200">
                    <div className="text-xs uppercase tracking-wide text-blue-900 font-semibold mb-2">Provenance Chain</div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Source retrieval → Parser v{selectedEvidence === 3 || selectedEvidence === 4 ? '2.3.8' : '2.4.1'} → Entity extraction → Confidence scoring → Ledger commit → Tie-out verification</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Why This Matters */}
          <div className="max-w-4xl mx-auto mt-16">
            <Card className="border-2 border-black/10 shadow-none">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-white/90 mb-4">Why the Evidence Ledger matters</h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span><strong>Auditability:</strong> Every number can be traced back to its source document, location, and extraction method</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span><strong>Reproducibility:</strong> Deterministic reruns produce identical results from the same source snapshot</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span><strong>Transparency:</strong> Confidence scores and tie-out status expose uncertainty rather than hiding it</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span><strong>Versioning:</strong> Citation IDs and timestamps enable historical comparison and change tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diff View - NEW */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Diff View: See What Changed
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed mb-4">
              Every refresh shows exactly what changed since your last run, with before/after comparison, 
              materiality scoring, and full provenance. This is your moat—Bloomberg doesn't have this.
            </p>
            <p className="text-sm font-light text-black/60 italic">
              Changes are tracked at the claim level with documented evidence for each delta.
            </p>
          </div>

          {/* Side-by-side Diff */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
            {/* Previous Run */}
            <Card className="border-2 border-gray-400">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm uppercase tracking-wide text-gray-700 font-semibold">
                    Previous Run
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>2024-10-17</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 px-3 rounded">
                    <span className="text-white">FY24 Revenue Guidance</span>
                    <span className="font-mono font-semibold text-gray-900">$46-47B</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded">
                    <span className="text-white">Q3 EPS</span>
                    <span className="font-mono font-semibold text-gray-900">$2.02 est</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded">
                    <span className="text-white">Cloud Revenue Growth</span>
                    <span className="font-mono font-semibold text-gray-900">28% YoY</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded">
                    <span className="text-white">Operating Margin</span>
                    <span className="font-mono font-semibold text-gray-900">17.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Run */}
            <Card className="border-2 border-green-600 shadow-lg">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm uppercase tracking-wide text-green-900 font-semibold">
                    Current Run
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <Activity className="w-3 h-3" />
                    <span>2024-10-24</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 px-3 rounded diff-increase">
                    <span className="text-white">FY24 Revenue Guidance</span>
                    <span className="font-mono font-semibold text-green-900">
                      $48-49B <TrendingUp className="w-4 h-4 inline-block ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded diff-increase">
                    <span className="text-white">Q3 EPS</span>
                    <span className="font-mono font-semibold text-green-900">
                      $2.15 (beat) <TrendingUp className="w-4 h-4 inline-block ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded diff-increase">
                    <span className="text-white">Cloud Revenue Growth</span>
                    <span className="font-mono font-semibold text-green-900">
                      32% YoY <TrendingUp className="w-4 h-4 inline-block ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded diff-increase">
                    <span className="text-white">Operating Margin</span>
                    <span className="font-mono font-semibold text-green-900">
                      18.5% <TrendingUp className="w-4 h-4 inline-block ml-1" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delta Summary */}
          <Card className="border-l-4 border-green-600 bg-green-50/50 max-w-6xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <GitCompare className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-3">4 Material Changes Detected</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="p-3 bg-white rounded border border-green-200">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold">FY24 guidance raised by $2B</span>
                        <span className="text-xs text-green-700 font-mono">+4.3%</span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        <span>Source: CIT-2024-1024-012 | Materiality: HIGH</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-green-200">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold">Q3 EPS beat consensus by $0.13</span>
                        <span className="text-xs text-green-700 font-mono">+6.4%</span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        <span>Source: CIT-2024-1024-001 | Materiality: HIGH</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-green-200">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold">Cloud growth accelerated by 400bps QoQ</span>
                        <span className="text-xs text-green-700 font-mono">+14.3%</span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        <span>Source: CIT-2024-1024-005 | Materiality: MEDIUM</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border border-green-200">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold">Operating margin expanded by 130bps</span>
                        <span className="text-xs text-green-700 font-mono">+7.6%</span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        <span>Source: CIT-2024-1024-003 | Materiality: MEDIUM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Subscribe to Monitoring, Not Reports - REVISED */}
      <section id="monitoring" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Subscribe to Coverage, Not Reports
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed mb-4">
              Watchlist-based monitoring with scheduled updates. Each refresh shows only what changed, 
              with full provenance. Build institutional memory over time.
            </p>
            <p className="text-sm font-light text-black/60 italic">
              This is not a report generator. This is a monitoring engine with version control for financial data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  Daily Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Earnings & guidance updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Material event alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Same-day diff delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Slack/email digest</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-black/10 text-xs text-white/60">
                  For active positions and earnings season
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  Weekly Deep Dive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Full coverage refresh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Segment & product trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>KPI progression tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Competitive positioning</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-black/10 text-xs text-white/60">
                  For watchlist and research pipeline
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-light mb-2 text-white/70">
                  Ad Hoc Research
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>On-demand pack generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Custom query builder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Historical comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Evidence pack export</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-black/10 text-xs text-white/60">
                  For diligence and deep research
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Governance and Controls */}
      <section className="py-20 sm:py-32 bg-black/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-light mb-6 tracking-tight text-black/70">
              Governed Output, Not Generated Prose
            </h2>
            <p className="text-lg font-light text-black/70 leading-relaxed">
              No black boxes. No hallucinations. No attribution decay. Every output includes the controls 
              needed for institutional acceptance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-light text-white/70">Provenance Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Citation IDs and retrieval timestamps for every claim</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Source excerpts with highlighting and context</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Coverage window and last updated on every page</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Parser version and extraction method documented</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-light text-white/70">Reproducibility Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Deterministic reruns with identical outputs from same snapshot</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Methods include formulas, inputs, and source mapping</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Tables export with stable field names and preserved formulas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Run IDs and snapshot semantics for version control</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-light text-white/70">Quality Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Confidence scores with reasoning for every claim</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Tie-out verification with pass/warn/fail status</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Materiality thresholds documented per pack</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Quality gates that block completion when checks fail</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-light text-white/70">Change Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Diff engine shows before/after with evidence</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Material delta detection with documented thresholds</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Historical comparison across runs and periods</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span className="text-white/70">Persistent change history with stable links</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 tracking-tight">
              Build Institutional Memory with Evidence
            </h2>
            <p className="text-lg font-light text-white/80 mb-2 max-w-2xl mx-auto">
              Deterministic monitoring with claim-level provenance. Every number has a source. 
              Every change has a timestamp. Every pack can be audited.
            </p>
            <p className="text-sm font-light text-white/60 mb-8">
              Minutes to audited update. Not days to debatable report.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Start Monitoring
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
              
              <a href="/sample-report">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-widest uppercase"
                >
                  View Evidence Pack
                </Button>
              </a>
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
            © 2026 MuseData. Deterministic evidence engine for public market monitoring.
          </div>
        </div>
      </footer>
    </div>
  );
}