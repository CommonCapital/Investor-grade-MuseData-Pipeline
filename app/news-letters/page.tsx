"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";

export default function MusedataQuarterlyPerspective() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .container {
          max-width: 850px;
          margin: 0 auto;
          background: white;
        }

        .header {
          background: #0f2942;
          color: white;
          padding: 40px 50px;
          text-align: center;
        }

        .logo-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
        }

        .company-name {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }

        .tagline {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 5px;
        }

        .date {
          font-size: 14px;
          opacity: 0.8;
        }

        .content {
          padding: 50px;
        }

        .quote-block {
          border-left: 4px solid #0f2942;
          padding-left: 25px;
          margin-bottom: 40px;
        }

        .quote-text {
          font-size: 22px;
          font-weight: 600;
          line-height: 1.5;
          color: #1a1a1a;
        }

        .intro-paragraph {
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 40px;
          color: #2a2a2a;
        }

        .intro-paragraph strong {
          font-weight: 600;
        }

        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .column-box {
          padding: 0;
        }

        .column-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #0f2942;
          margin-bottom: 15px;
          text-transform: uppercase;
        }

        .column-text {
          font-size: 14px;
          line-height: 1.7;
          color: #2a2a2a;
        }

        .black-banner {
          background: #000000;
          color: white;
          padding: 25px 40px;
          margin: 40px -50px;
          text-align: center;
        }

        .banner-text {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .three-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin-bottom: 50px;
        }

        .column-card {
          padding: 30px 25px;
          color: white;
        }

        .column-card:nth-child(1) {
          background: #2d5f6f;
        }

        .column-card:nth-child(2) {
          background: #1a3d4d;
        }

        .column-card:nth-child(3) {
          background: #0f2942;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 15px;
          text-transform: uppercase;
        }

        .card-text {
          font-size: 14px;
          line-height: 1.6;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-align: center;
          margin-bottom: 40px;
          text-transform: uppercase;
          color: #1a1a1a;
        }

        .capability {
          margin-bottom: 35px;
        }

        .capability-name {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #0f2942;
        }

        .capability-description {
          font-size: 14px;
          line-height: 1.7;
          color: #2a2a2a;
        }

        .expertise-section {
          padding: 25px 0;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 40px;
        }

        .expertise-text {
          font-size: 13px;
          line-height: 1.7;
          text-align: center;
          color: #2a2a2a;
        }

        .expertise-text strong {
          font-weight: 600;
        }

        .cta-section {
          background: #0f2942;
          color: white;
          padding: 50px;
          margin: 0 -50px -50px -50px;
          text-align: center;
        }

        .cta-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }

        .cta-description {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-website {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .cta-email {
          font-size: 16px;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .two-columns {
            grid-template-columns: 1fr;
          }
          
          .three-columns {
            grid-template-columns: 1fr;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .company-name {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo-icon">
            <Image
              src="/logo.png"
              alt="MUSEDATA Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="company-name">MUSEDATA</h1>
          <p className="tagline">Boardroom Intelligence for Enterprise Software</p>
          <p className="date">Quarterly Perspective | February 2026</p>
        </div>

        {/* Main Content */}
        <div className="content">
          {/* Quote Block */}
          <div className="quote-block">
            <p className="quote-text">
              In the 2024 to 2026 capital cycle, founder led finance is no longer credible.
            </p>
          </div>

          {/* Intro Paragraph */}
          <p className="intro-paragraph">
            Spreadsheets, intuition, and &ldquo;close enough&rdquo; reporting do not survive institutional 
            underwriting. To scale from $5M to $100M ARR, companies must evolve into{" "}
            <strong>institutional-grade financial infrastructure</strong>. The market has hardened.{" "}
            <strong>Uncertainty is priced as risk. Risk is priced as discount.</strong>
          </p>

          {/* Two Columns */}
          <div className="two-columns">
            <div className="column-box">
              <h3 className="column-title">The 72-Hour Reality</h3>
              <p className="column-text">
                EBITDA visibility, revenue integrity, retention truth, and cash conversion can be surfaced 
                in 72 hours when data is properly extracted, normalized, and reconciled.
              </p>
              <p className="column-text" style={{ marginTop: '15px', fontWeight: 600 }}>
                That is the MUSEDATA Evidence Sprint.
              </p>
            </div>
            <div className="column-box">
              <h3 className="column-title">The Boardroom Gap</h3>
              <p className="column-text">
                There is always a gap between raw operating reality and what boards require to underwrite 
                conviction. At $5M ARR, narrative bridges that gap. At $100M ARR, narrative without evidence 
                becomes a liability.
              </p>
              <p className="column-text" style={{ marginTop: '15px', fontWeight: 600 }}>
                MUSEDATA closes that gap.
              </p>
            </div>
          </div>

          {/* Black Banner */}
          <div className="black-banner">
            <p className="banner-text">
              Messy data is not a presentation issue. It is a valuation issue.
            </p>
          </div>

          {/* Three Columns */}
          <div className="three-columns">
            <div className="column-card">
              <h3 className="card-title">For Founders</h3>
              <p className="card-text">
                Investor readiness compresses timelines and protects terms. Raise faster, negotiate from 
                strength, avoid diligence driven retrades.
              </p>
            </div>
            <div className="column-card">
              <h3 className="card-title">For Investors</h3>
              <p className="card-text">
                Standardized reporting creates real portfolio control. Surface risks earlier, enable faster 
                capital allocation. Manage in real time, not hindsight.
              </p>
            </div>
            <div className="column-card">
              <h3 className="card-title">For Bankers</h3>
              <p className="card-text">
                Diligence ready reporting increases deal velocity. Reduce clarification loops, prevent metric 
                disputes. Clean data is transaction acceleration.
              </p>
            </div>
          </div>

          {/* Strategic Capabilities */}
          <h2 className="section-title">Strategic Capabilities</h2>

          <div className="capability">
            <h3 className="capability-name">72 Hour Evidence Sprint</h3>
            <p className="capability-description">
              Rapid execution of Quality of Earnings (QoE) sprints to deliver EBITDA clarity, revenue integrity 
              verification, and investor ready data packages within 72 hours.
            </p>
          </div>

          <div className="capability">
            <h3 className="capability-name">Boardroom Intelligence Platform</h3>
            <p className="capability-description">
              Proprietary infrastructure automating forecasting, KPI governance, and multi entity consolidation. 
              Built for institutional oversight and ongoing board level reporting.
            </p>
          </div>

          <div className="capability">
            <h3 className="capability-name">Capital Formation Advisory</h3>
            <p className="capability-description">
              Strategic support for minority growth capital ($5M to $25M), M&A readiness preparation, and 
              institutional diligence positioning.
            </p>
          </div>

          {/* Institutional Expertise */}
          <div className="expertise-section">
            <p className="expertise-text">
              Led by operators from <strong>Arrowroot Capital</strong> | <strong>ROTH Capital</strong> |{" "}
              <strong>Deutsche Bank</strong> | <strong>J.P. Morgan</strong> | <strong>Deloitte</strong> |{" "}
              <strong>McKinsey & Company</strong> | <strong>Alvarez & Marsal</strong> |{" "}
              <strong>Bridgewater Associates</strong>
            </p>
          </div>
        </div>

        {/* CTA Section */}
  
      </div>
          
<section className="bg-[#1C4E64] text-white py-20 px-6">
  <div className="max-w-4xl mx-auto">
    {/* Main CTA Content */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Prepare for Your Next Inflection
      </h2>
      <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
        Transform from founder-led finance to investor-ready operations. 
        Start with a 72-hour QoE Evidence Sprint.
      </p>
      
      <a href="/schedule-sprint">
        <Button
          size="lg"
          className="h-14 px-8 bg-white text-[#1C4E64] hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          Schedule a 72-hour QoE Evidence Sprint
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </a>
      
      <p className="text-sm text-white/70 mt-4">
        Trusted by VC-backed software companies from $3M to $100M ARR
      </p>
    </div>

    {/* Divider */}
    <div className="border-t border-white/20 my-10" />

    {/* Company Info Footer */}
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-3">MUSEDATA</h3>
      <p className="text-sm opacity-90 mb-4">
        Institutional-Grade Finance Infrastructure
      </p>
      <a 
        href="mailto:partners@musedata.ai" 
        className="text-sm opacity-90 hover:opacity-100 inline-flex items-center gap-2 transition-opacity"
      >
        <Mail className="w-4 h-4" />
        partners@musedata.ai
      </a>
    </div>
  </div>
</section>
    </div>
  );
}