"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail, Clock, CheckCircle, Calendar, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ScheduleSprintPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("collin@musedata.ai");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #1C4E64 0%, #2D5F73 50%, #3A7A94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        
        body, p, span, div {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <svg width="40" height="40" viewBox="0 0 100 100">
                <rect x="10" y="10" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="10" width="22" height="22" fill="#1C4E64"/>
                <rect x="68" y="10" width="22" height="22" fill="#3A7A94"/>
                <rect x="10" y="39" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="39" width="22" height="22" fill="#245167"/>
                <rect x="68" y="39" width="22" height="22" fill="#0F2B3A"/>
                <rect x="10" y="68" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="68" width="22" height="22" fill="#245167"/>
                <circle cx="79" cy="79" r="11" fill="#000000"/>
              </svg>
              <span className="text-2xl font-bold text-[#1C4E64] group-hover:text-[#2D5F73] transition-colors">
                MUSEDATA
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-[#1C4E64] hover:text-[#2D5F73] hover:bg-[#1C4E64]/5">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#1C4E64] uppercase tracking-wider px-4 py-2 bg-[#1C4E64]/10 rounded-full">
              72-Hour Evidence Sprint
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-tight">
            Transform Your<br />Finance Operations
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
            From founder-led spreadsheets to investor-ready reporting in 72 hours.
            Let's build institutional-grade finance infrastructure for your company.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - What You'll Get */}
          <div className="space-y-6 animate-slide-in-right delay-100">
            <Card className="glass-card p-8 shadow-xl border-l-4 border-[#1C4E64]">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What You'll Get
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1C4E64] to-[#2D5F73] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">72-Hour Initial Pack</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Rapid evidence gathering and preliminary financial analysis delivered within 3 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2D5F73] to-[#3A7A94] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Full Reconciliation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Complete audit trail and reconciled financials within 30 days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#3A7A94] to-[#245167] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Investor-Ready Reports</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Board-quality presentations, KPI dashboards, and financial narratives
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#245167] to-[#0F2B3A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">CFO Advisory</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Expert guidance from seasoned operators who've scaled companies through multiple funding rounds
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ideal For Section */}
            <Card className="glass-card p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ideal For:</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1C4E64] rounded-full"></div>
                  <span>Companies with $3–7M ARR preparing for Series A/B</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2D5F73] rounded-full"></div>
                  <span>Post-seed startups entering due diligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#3A7A94] rounded-full"></div>
                  <span>Portfolio companies needing finance infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#245167] rounded-full"></div>
                  <span>CFOs transitioning from spreadsheets to systems</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Contact Card */}
          <div className="animate-fade-in-up delay-200">
            <Card className="glass-card p-10 shadow-2xl sticky top-8 border-2 border-[#1C4E64]/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1C4E64] to-[#2D5F73] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Let's Get Started
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Email us to schedule your 72-hour QoE Evidence Sprint
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Display */}
                <div className="bg-gradient-to-br from-[#1C4E64] to-[#2D5F73] p-6 rounded-2xl text-center shadow-xl relative overflow-hidden group">
                  <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-sm text-white/80 mb-2 font-medium uppercase tracking-wide">Send your inquiry to</p>
                  <a 
                    href="mailto:collin@musedata.ai" 
                    className="text-2xl sm:text-3xl font-bold text-white hover:text-blue-100 transition-colors block break-all relative z-10"
                  >
                    collin@musedata.ai
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCopyEmail}
                    className="w-full h-14 text-lg font-semibold bg-white text-[#1C4E64] border-2 border-[#1C4E64] hover:bg-[#1C4E64] hover:text-white transition-all duration-300 shadow-lg"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Email Copied!
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Copy Email Address
                      </>
                    )}
                  </Button>

                  <a href="mailto:collin@musedata.ai?subject=72-Hour QoE Evidence Sprint Request" className="block">
                    <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#1C4E64] to-[#2D5F73] text-white hover:opacity-90 transition-all duration-300 shadow-xl">
                      Open Email Client
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </div>

                {/* What to Include */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    What to Include in Your Email:
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Company name and current ARR</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Funding stage (seed, pre-A, Series A, etc.)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Primary financial challenges or goals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ideal timeline for sprint completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="animate-fade-in-up delay-300">
          <Card className="glass-card p-8 sm:p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              The Sprint Timeline
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1C4E64] to-[#2D5F73] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">Day 1</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kickoff Call</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We align on scope, gather access to your systems, and establish the sprint timeline
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2D5F73] to-[#3A7A94] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">Day 2-3</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence Gathering</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our team extracts, validates, and structures your financial data into a coherent evidence pack
                </p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3A7A94] to-[#245167] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">Day 4-30</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refinement & Delivery</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Full reconciliation, investor narratives, and board-ready presentations delivered
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in-up delay-400">
          <p className="text-gray-600 mb-6 text-lg">
            Questions before scheduling? We're here to help.
          </p>
          <a href="mailto:collin@musedata.ai">
            <Button className="h-12 px-8 text-base bg-[#1C4E64] hover:bg-[#163B4F] text-white shadow-lg">
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </Button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/50 backdrop-blur-sm py-8 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2026 MUSEDATA. Institutional-Grade Finance Infrastructure.
          </p>
        </div>
      </footer>
    </div>
  );
}