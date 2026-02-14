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
  Mail
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";


export default function MuseDataLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50">
       <Script 
        src="https://www.buildmyagent.io/widget/69706ea5e966c51847e406ff/widget-professional.js?widgetId=69706ea5e966c51847e406ff"
        strategy="lazyOnload"
      />

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

  

      {/* Hero Section with Background Image */}
      <section className="relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/background.png")',
          }}
        />
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left animate-fade-in-up">
              <div className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wide">
                Global Focus
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Institutional-Grade Finance Infrastructure for VC-Backed Software Companies
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-6">
                We help CFOs at $3–7M ARR transition from founder-led finance to{" "}
                <span className="font-semibold text-white">investor-ready</span> operations.
              </p>
              <p className="text-base text-gray-200 mb-10">
                Our platform unifies financials, enforces growth discipline, and produces audit-ready 
                reporting, backed by seasoned CFOs and operators.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/funding">
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300 shadow-xl"
                    >
                     Apply for funding 
                    </Button>
                  </SignInButton>
                </Unauthenticated>

                <Authenticated>
                  <a href="/funding">
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300 shadow-xl"
                    >
                      Apply for funding
                    </Button>
                  </a>
                </Authenticated>
                
                <a href="/sample-report">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1C4E64] transition-all duration-300"
                  >
                    View Evidence Pack
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex justify-center animate-fade-in-up delay-100">
              <div className="bg-gradient-to-br from-[#2D5F73] to-[#1C4E64] p-8 sm:p-12 rounded-lg shadow-2xl max-w-md w-full backdrop-blur-sm bg-opacity-95">
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

      

      {/* Footer */}
   {/* Enhanced Footer with Newsletter and Apply */}
      <footer className="bg-[#1C4E64] text-white py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">MUSEDATA</h3>
              <p className="text-sm opacity-90 mb-4">
                Institutional-Grade Finance Infrastructure
              </p>
              <p className="text-sm opacity-75">
                <a href="mailto:partners@musedata.ai" className="hover:underline inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  partners@musedata.ai
                </a>
              </p>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-sm opacity-90 mb-4">
                Stay updated with the latest insights in institutional finance
              </p>
               <a href="/news-letters">
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-[#1C4E64] rounded-md hover:bg-gray-100 font-medium transition-colors inline-flex items-center justify-center gap-2">
                  Join
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>

            {/* Apply Section */}
            <div className="text-center md:text-left ">
              <h3 className="text-lg font-semibold mb-4">Join Us</h3>
              <p className="text-sm opacity-90 mb-4">
                Ready to transform your finance operations?
              </p>
          <div className="flex flex-col sm:flex-row gap-4">
  <a href="/apply">
    <button className="w-full sm:w-auto px-6 py-3 bg-white text-[#1C4E64] rounded-md hover:bg-gray-100 font-medium transition-colors inline-flex items-center justify-center gap-2">
      Apply for Position
      <ArrowRight className="w-4 h-4" />
    </button>
  </a>

  <a href="/funding">
    <button className="w-full sm:w-auto px-6 py-3 bg-white text-[#1C4E64] rounded-md hover:bg-gray-100 font-medium transition-colors inline-flex items-center justify-center gap-2">
      Apply your Startup
      <ArrowRight className="w-4 h-4" />
    </button>
  </a>
</div>

              <p className="text-xs opacity-75 mt-3">
                For become a team member of MuseData
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-75">
              © 2026 MUSEDATA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}