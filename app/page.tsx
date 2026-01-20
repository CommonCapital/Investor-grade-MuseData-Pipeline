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
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function MuseDataLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}</style>

  

      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left animate-fade-in-up">
              <div className="text-sm font-semibold text-[#1C4E64] mb-3 uppercase tracking-wide">
                Global Focus
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                Institutional-Grade Finance Infrastructure for VC-Backed Software Companies
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">
                We help CFOs at $3–7M ARR transition from founder-led finance to{" "}
                <span className="font-semibold">investor-ready</span> operations.
              </p>
              <p className="text-base text-gray-600 mb-10">
                Our platform unifies financials, enforces growth discipline, and produces audit-ready 
                reporting, backed by seasoned CFOs and operators.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300"
                    >
                     Access Search 
                    </Button>
                  </SignInButton>
                </Unauthenticated>

                <Authenticated>
                  <a href="/dashboard">
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300"
                    >
                      Access Search 
                    </Button>
                  </a>
                </Authenticated>
                
                <a href="/sample-report">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 bg-white text-[#1C4E64] border-2 border-[#1C4E64] hover:bg-[#1C4E64] hover:text-white transition-all duration-300"
                  >
                    View Evidence Pack
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex justify-center animate-fade-in-up delay-100">
              <div className="bg-gradient-to-br from-[#2D5F73] to-[#1C4E64] p-8 sm:p-12 rounded-lg shadow-2xl max-w-md w-full">
                <div className="text-white space-y-6">
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Target Market</div>
                    <div className="text-2xl font-bold">$3–7M ARR</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">QoE Evidence Sprint</div>
                    <div className="text-2xl font-bold">72 Hours</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Capital Deployment</div>
                    <div className="text-2xl font-bold">$5–25M</div>
                  </div>
                  <div className="border-l-4 border-white pl-4">
                    <div className="text-sm opacity-90">Portfolio Scale</div>
                    <div className="text-2xl font-bold">$5M to $100M ARR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in-up text-gray-900">
            What We Do
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-100">
            MUSEDATA is a <span className="font-semibold">Boardroom Decision Intelligence</span> platform 
            that automates cash forecasting, board pack generation, and pitch-ready analysis.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-t-4 border-[#1C4E64] shadow-lg animate-fade-in-up bg-[#1C4E64]">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">
                  72-Hour QoE Evidence Sprint
                </h3>
                <p className="text-white">
                  Fully reconciled investor pack delivered within 30 days.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-[#2D5F73] shadow-lg animate-fade-in-up delay-100 bg-[#1C4E64]">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">
                  Board Layer
                </h3>
                <p className="text-white">
                  Monthly KPI governance with repeatable reporting cadence.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-[#3A7A94] shadow-lg animate-fade-in-up delay-200 bg-[#1C4E64]">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">
                  Enterprise Portfolio
                </h3>
                <p className="text-white">
                  Portfolio-wide rollouts for companies from $5M to $100M ARR.
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
            From rapid evidence sprints to ongoing portfolio management, we provide the infrastructure 
            needed for institutional-grade finance operations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg border-l-4 border-[#1C4E64] bg-[#1C4E64]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quality of Earnings (QoE) Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>72-hour turnaround for initial evidence pack</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Full reconciliation within 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Audit-ready documentation and trail</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Investor-ready financial narratives</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-white italic">
                    Ideal for companies preparing for due diligence or Series A/B funding
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-[#2D5F73] bg-[#1C4E64]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Board Layer Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Monthly KPI dashboards and reporting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Automated board pack generation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Cash forecasting and runway analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Repeatable monthly cadence</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-white italic">
                    For post-raise companies needing consistent investor updates
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-[#3A7A94] bg-[#1C4E64]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Enterprise Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Portfolio-wide financial infrastructure</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Scalable from $5M to $100M ARR</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Multi-company consolidation and reporting</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>LP-level reporting and analytics</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-white italic">
                    For VCs managing multiple portfolio companies
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-[#245167] bg-[#1C4E64]">
              <CardHeader>
                <CardTitle className="text-xl text-white">CFO Advisory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Seasoned CFO guidance and best practices</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Financial operations optimization</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Fundraising preparation and support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Strategic financial planning</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-white italic">
                    Expert guidance for scaling finance operations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-[#1C4E64] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Build Institutional-Grade Finance?
            </h2>
            <p className="text-lg text-white/90 mb-2 max-w-2xl mx-auto">
              Transform from founder-led finance to investor-ready operations. 
              Start with a 72-hour QoE Evidence Sprint.
            </p>
            <p className="text-sm text-white/70 mb-8">
              Trusted by VC-backed software companies from $3M to $100M ARR
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/schedule-sprint">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300"
                  >
                    Schedule Evidence Sprint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/schedule-sprint">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300"
                  >
                    Schedule a 72-hour QoE Evidence Sprint
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Authenticated>
              
              <a href="/sample-report">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 bg-[#1C4E64] text-white border-2 border-white hover:bg-white hover:text-[#1C4E64] transition-all duration-300"
                >
                  View Sample Pack
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-30 animate-fade-in-up delay-300">
        <Unauthenticated>
          <SignInButton mode="modal" forceRedirectUrl="/schedule-sprint">
            <Button className="bg-[#1C4E64] hover:bg-[#163B4F] text-white shadow-lg h-12 px-6">
              Schedule Sprint
            </Button>
          </SignInButton>
        </Unauthenticated>
        
        <Authenticated>
          <a href="/schedule-sprint">
            <Button className="bg-[#1C4E64] hover:bg-[#163B4F] text-white shadow-lg h-12 px-6">
              Schedule Sprint
            </Button>
          </a>
        </Authenticated>
      </div>

      {/* Footer */}
      <footer className="bg-[#1C4E64] text-white py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm opacity-90 mb-2">Institutional-Grade Finance Infrastructure</p>
          <p className="text-sm opacity-75">© 2026 MUSEDATA. All rights reserved.</p>
          <p className="text-sm opacity-75 mt-4">
            <a href="mailto:collin@musedata.ai" className="hover:underline">
              partners@musedata.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}