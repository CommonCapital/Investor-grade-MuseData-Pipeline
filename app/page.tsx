"use client";

import { useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Menu,
  X,
  CheckCircle,
  Mail,
  TrendingUp,
  Globe,
  Users,
  BarChart3,
  DollarSign,
  FileText
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";


export default function MuseDataLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Script 
        src="https://www.buildmyagent.io/widget/69706ea5e966c51847e406ff/widget-professional.js?widgetId=69706ea5e966c51847e406ff"
        strategy="lazyOnload"
      />

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/background.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/60" />
        
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                <Globe className="w-4 h-4" />
                Growth Equity · US Market Access
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                The Growth Equity Platform Built to Get You Raise-Ready
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-6">
                MUSEDATA is a <span className="font-semibold text-white">growth equity fund and consulting platform</span> focused on VC-backed enterprise software and AI companies in the $3M–$7M ARR band.
              </p>
              <p className="text-base text-gray-200 mb-10">
                We invest in and prepare companies for capital raises and acquisitions by tightening the numbers, the reporting, and the cadence — so your business is easy to diligence. We also give international LPs structured access to the US market.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/funding">
                    <Button size="lg" className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300 shadow-xl">
                      Apply for Investment
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <a href="/funding">
                    <Button size="lg" className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300 shadow-xl">
                      Apply for Investment
                    </Button>
                  </a>
                </Authenticated>
                
                <a href="/sample-report">
                  <Button size="lg" variant="outline" className="h-14 px-8 bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1C4E64] transition-all duration-300">
                    View Evidence Pack
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex justify-center animate-fade-in-up delay-100">
              <div className="bg-gradient-to-br from-[#2D5F73] to-[#1C4E64] p-8 sm:p-12 rounded-lg shadow-2xl max-w-md w-full">
                <div className="text-white space-y-6">
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Target ARR Band</div>
                    <div className="text-2xl font-bold">$3M – $7M ARR</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Capital Deployed Per Deal</div>
                    <div className="text-2xl font-bold">$5M – $25M</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Raise-Readiness Sprint</div>
                    <div className="text-2xl font-bold">72 Hours</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Portfolio Scale Target</div>
                    <div className="text-2xl font-bold">$5M to $100M ARR</div>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-4">
                    <div className="text-sm opacity-90">LP Offering</div>
                    <div className="text-lg font-bold">Structured US Market Access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section id="what-we-do" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Two Ways We Create Value
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            MUSEDATA operates at the intersection of <span className="font-semibold">growth equity investing</span> and <span className="font-semibold">fundraising consulting</span> — we back the right companies and then make them undeniable to the next investor.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-t-4 border-[#1C4E64] shadow-lg bg-[#1C4E64]">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                  <h3 className="text-xl font-semibold text-white">Growth Equity Fund</h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  We deploy $5M–$25M checks into VC-backed enterprise software and AI companies. We take concentrated positions where we can add hands-on operational value alongside capital.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-blue-300 shadow-lg bg-[#1C4E64]">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                  <h3 className="text-xl font-semibold text-white">Fundraising Consulting</h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  For companies not yet in our portfolio, we provide elite fundraising advisory — from financial model rectification and QoE preparation to investor narrative and diligence-readiness — led by seasoned finance professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Our Services
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Whether you're raising your next round, preparing for an acquisition, or building the finance function from scratch — we have the team and the tools.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* QoE Sprint */}
            <Card className="shadow-lg border-l-4 border-[#1C4E64] bg-[#1C4E64]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-white" />
                  <CardTitle className="text-xl text-white">72-Hour QoE Evidence Sprint</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  {[
                    "Full reconciliation of ARR, churn, and unit economics",
                    "Investor-ready financial narrative and packaging",
                    "Audit-ready documentation trail",
                    "30-day full evidence pack delivery",
                    "Tailored for Series A / B and M&A due diligence"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70 italic">For companies 60–90 days out from a capital raise or acquisition process</p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Model Consulting */}
            <Card className="shadow-lg border-l-4 border-blue-300 bg-[#1C4E64]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                  <CardTitle className="text-xl text-white">Financial Model Rectification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  {[
                    "End-to-end model rebuild or audit by senior finance professionals",
                    "SaaS metrics standardization (NRR, CAC, LTV, payback)",
                    "Scenario and sensitivity analysis for investor conversations",
                    "3-statement integration and cash flow modeling",
                    "Stress-tested assumptions aligned to market benchmarks"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70 italic">Led by CFOs and finance operators with direct VC and PE diligence experience</p>
                </div>
              </CardContent>
            </Card>

            {/* Board Layer */}
            <Card className="shadow-lg border-l-4 border-[#3A7A94] bg-[#1C4E64]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-white" />
                  <CardTitle className="text-xl text-white">Board Layer & Ongoing Governance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  {[
                    "Monthly KPI dashboards and automated board pack generation",
                    "Cash forecasting and runway management",
                    "Repeatable reporting cadence that builds investor confidence",
                    "Escalation triggers and anomaly flags for leadership",
                    "LP and board-ready narrative updates"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70 italic">For post-raise companies building the discipline to reach the next round</p>
                </div>
              </CardContent>
            </Card>

            {/* LP Access */}
            <Card className="shadow-lg border-l-4 border-[#245167] bg-[#1C4E64]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-white" />
                  <CardTitle className="text-xl text-white">LP US Market Access Program</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  {[
                    "Structured co-investment rights alongside MUSEDATA fund",
                    "Curated deal flow in enterprise software and AI",
                    "Full diligence memos and evidence packs per deal",
                    "Quarterly fund performance and portfolio reporting",
                    "Dedicated onboarding for international LPs entering the US market"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70 italic">Enabling international family offices and institutional LPs to access US growth equity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why MUSEDATA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Why MUSEDATA
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Most funds write checks. We tighten the business before, during, and after the raise — making every dollar of capital work harder.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#1C4E64] mb-2">$3–7M</div>
              <div className="text-gray-700 font-medium mb-1">ARR Focus Zone</div>
              <p className="text-sm text-gray-500">We specialize in the band where finance operations make or break a raise</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#1C4E64] mb-2">72 hrs</div>
              <div className="text-gray-700 font-medium mb-1">Evidence Sprint</div>
              <p className="text-sm text-gray-500">Initial investor pack delivered faster than any diligence firm in the market</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#1C4E64] mb-2">Dual</div>
              <div className="text-gray-700 font-medium mb-1">Fund + Consulting</div>
              <p className="text-sm text-gray-500">Aligned incentives: we invest in what we advise, and advise what we invest in</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-[#1C4E64] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Become Raise-Ready?
            </h2>
            <p className="text-lg text-white/90 mb-2 max-w-2xl mx-auto">
              Whether you're seeking growth equity capital, fundraising consulting, or US market access as an LP — start the conversation.
            </p>
            <p className="text-sm text-white/70 mb-8">
              Focused on VC-backed enterprise software and AI · $3M–$100M ARR
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/schedule-sprint">
                  <Button size="lg" className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300">
                    Schedule a 72-Hour Sprint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <a href="/schedule-sprint">
                  <Button size="lg" className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300">
                    Schedule a 72-Hour Sprint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
              
              <a href="/sample-report">
                <Button size="lg" variant="outline" className="h-14 px-8 bg-[#1C4E64] text-white border-2 border-white hover:bg-white hover:text-[#1C4E64] transition-all duration-300">
                  View Sample Evidence Pack
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C4E64] text-white py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">MUSEDATA</h3>
              <p className="text-sm opacity-90 mb-2">Growth Equity + Fundraising Consulting</p>
              <p className="text-xs opacity-60 mb-4">Enterprise Software & AI · $3M–$7M ARR</p>
              <a href="mailto:partners@musedata.ai" className="text-sm opacity-75 hover:underline inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                partners@musedata.ai
              </a>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide opacity-60">For Companies</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="/funding" className="hover:underline">Apply for Investment</a></li>
                <li><a href="/schedule-sprint" className="hover:underline">QoE Evidence Sprint</a></li>
                <li><a href="/services" className="hover:underline">Financial Model Review</a></li>
                <li><a href="/services" className="hover:underline">Board Layer Governance</a></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide opacity-60">For LPs</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="/lp" className="hover:underline">US Market Access Program</a></li>
                <li><a href="/lp" className="hover:underline">Co-Investment Rights</a></li>
                <li><a href="/sample-report" className="hover:underline">View Evidence Pack</a></li>
                <li><a href="/lp" className="hover:underline">Become an LP</a></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-sm opacity-90 mb-4">Insights on growth equity and SaaS fundraising</p>
              <a href="/news-letters">
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-[#1C4E64] rounded-md hover:bg-gray-100 font-medium transition-colors inline-flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <div className="mt-4">
                <a href="/apply">
                  <button className="w-full sm:w-auto px-6 py-3 border border-white/40 text-white rounded-md hover:bg-white/10 font-medium transition-colors inline-flex items-center justify-center gap-2 text-sm">
                    Join the Team
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-75">
              © 2026 MUSEDATA. All rights reserved. · Growth Equity Fund & Fundraising Advisory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}