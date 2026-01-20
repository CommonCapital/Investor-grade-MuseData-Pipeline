'use client'
import React from 'react'
import { InvestorDashboard } from '../search/report/[id]/summary/ui/InvestorDashboard';
import { SampleDashboard } from './ui/SampleDashboard';

const SampleReport = () => {
    const data = {
  ai_insights: [
    {
      action_required: true,
      assumptions: [
        "Data sovereignty regulations will expand across major markets.",
        "Regulators in EU/Asia do not accept Microsoft's global compliance solutions.",
        "AI workloads require deployment in local sovereign regions.",
      ],
      confidence_band: "Medium",
      details:
        "Governments increasingly require local AI clusters to satisfy privacy and sovereignty, potentially forcing redundant infrastructure and elevating costs relative to global-scale competitors.",
      falsification_criteria: [
        'Microsoft announces a "Universal Data Plane" accepted by regulators, enabling federated compliance without redundant local clusters.',
        "Major regulatory rollbacks enabling more centralized cloud management.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "AI-001",
      impact_score: 8,
      source:
        "AI Insights, Strategic Report (MSFT), January 2026",
      summary:
        'EU and Asia data residency demands could force Microsoft into inefficient regional CapEx, undermining "global fleet" cloud efficiencies.',
      title: "Sovereign Cloud Fragmentation",
      type: "Risk",
    },
    {
      action_required: false,
      assumptions: [
        "Gaming data effectively simulates real-world multi-agent AI environments.",
        "Learnings from gaming efficiently transfer to enterprise applications.",
        "Gaming user base remains large and engaged to support robust data flows.",
      ],
      confidence_band: "Low",
      details:
        "The massive scale and telemetry data from gaming enables accelerated training and safe experimentation for autonomous agents, which can subsequently power productivity solutions like Excel and Teams.",
      falsification_criteria: [
        "Microsoft spins off or divests gaming hardware or key platforms.",
        "Inability to transfer AI advances from gaming to enterprise products.",
        "Gaming user engagement or spend drops significantly.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "3Y"],
      id: "AI-002",
      impact_score: 6,
      source:
        "AI Insights, Strategic Report (MSFT), January 2026",
      summary:
        "Microsoft is leveraging its Xbox/Activision gaming business as a training ground for agentic AI before broad enterprise deployment.",
      title: "Gaming as AI Sandbox",
      type: "Strategy",
    },
  ],
  base_metrics: {
    arpa: 320,
    arr: 138000000000,
    arr_prior: 110000000000,
    average_customer_lifespan_months: 120,
    cash: 14350000000,
    churned_arr: 4140000000,
    contraction_arr: 0,
    current_assets: 158700000000,
    current_liabilities: 118400000000,
    customer_count: 430000000,
    ebitda_availability: "reported",
    ebitda_proxy: 0,
    ebitda_reported: 37200000000,
    ebitda_ttm: 128500000000,
    expansion_arr: 12000000000,
    free_cash_flow: 73200000000,
    gross_margin_percent: 69,
    gross_profit: 46150000000,
    gross_profit_ttm: 178500000000,
    headcount: 221000,
    market_cap: 3110000000000,
    marketable_securities: 64100000000,
    monthly_churn_percent: 0.25,
    net_burn: 0,
    new_arr: 28000000000,
    operating_income: 30550000000,
    operating_income_ttm: 114000000000,
    rd_spend: 32488000000,
    revenue: 65585000000,
    revenue_prior: 64727000000,
    revenue_ttm: 254190000000,
    shares_outstanding: 7430000000,
    sm_spend: 24200000000,
    stock_price: 418.9,
    top_10_customer_revenue_percent: 0,
    top_3_customer_revenue_percent: 0,
    top_5_supplier_spend_percent: 0,
    top_customer_revenue_percent: 0,
    top_supplier_spend_percent: 0,
    total_debt: 102140000000,
  },
  buyback_capacity: {
    availability: "Available",
    confidence: 0.9,
    data_quality: {
      auditability: 1,
      coverage: 0.9,
      freshness_days: 100,
    },
    decision_context: {
      confidence_level: "High",
      knowns: [
        "$10.7B combined return to shareholders in Q1 FY26",
        "Historical patterns of $60B authorization cycles",
      ],
      sufficiency_status: "Sufficient",
      unknowns: [
        "Specific split between buyback and dividend within the quarterly return total",
      ],
    },
    formatted: "$60B authorization",
    source: "Board Authorization",
    source_reference: {
      accessed_at: "2026-01-09T11:17:00Z",
      document_type: "Proxy/Annual Report",
      excerpt:
        "Microsoft typically authorizes $60B programs; $10.7B returned to shareholders in Q1 FY26 through dividends and repurchases.",
      url: "https://www.microsoft.com/en-us/investor/reports/ar25/index.html",
    },
    unit: "USD",
    value: 60000000000,
  },
  changes_since_last_run: [
    {
      action:
        "Monitor Q2 CapEx guidance (Jan 28) to differentiate between timing shifts and structural efficiency.",
      category: "Capital Allocation",
      description:
        "Q1 CapEx of $19.39B was significantly below the $23.04B consensus, raising discussion about whether demand is slowing or efficiency is improving.",
      id: "CHG-001",
      so_what:
        "If lower spend is due to silicon efficiency (Maia/light-based AOC), margins benefit. If it reflects GPU supply/demand bottlenecks, it's a headwind.",
      source_url:
        "https://www.xtb.com/int/market-analysis/news-and-research/microsoft-q1-2026-earnings",
      thesis_pillar: "AI Infrastructure ROI",
      timestamp: "2025-10-30T14:00:00Z",
      title: "CapEx Undershoot vs. Consensus",
    },
    {
      action:
        "Adjust FY27 revenue models to account for higher base subscription pricing.",
      category: "Monetization Strategy",
      description:
        "Shift from selling Copilot as a $30/user SKU to embedding it in core M365 tiers with an overall price increase.",
      id: "CHG-002",
      so_what:
        "Simplifies sales cycle and forces adoption, potentially accelerating AI revenue more reliably than elective add-ons.",
      source_url:
        "https://www.techrepublic.com/article/news-microsoft-2026-product-plans/",
      thesis_pillar: "Productivity Dominance",
      timestamp: "2025-12-18T09:00:00Z",
      title: "Copilot Transition to Baseline Feature",
    },
  ],
  company_type: "public",
  events: [
    {
      date: "2025-10-29",
      description:
        "Microsoft reported Q1 revenue of $77.7B (+18% YoY) versus $75.6B consensus, with non-GAAP EPS of $4.13 beating $3.65 consensus. Azure and cloud services grew 39% ex-FX, outpacing the 37% target.",
      id: "EVT-001",
      impact:
        "Positive - Demonstrated continued cloud dominance and AI monetization; however, shares dipped 3% post-market due to AI ROI concerns.",
      source_url:
        "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
      title: "Q1 FY26 Earnings Outperformance",
      type: "Earnings",
    },
    {
      date: "2025-12-11",
      description:
        "Microsoft unveiled 7 AI trends for 2026 and introduced 'Majorana 1,' the world's first quantum chip with a topological core architecture designed for scalable qubits.",
      id: "EVT-002",
      impact:
        "Positive - Signals long-term technical leadership in next-gen compute (Quantum) and autonomous AI agents.",
      source_url:
        "https://news.microsoft.com/source/asia/2025/12/11/microsoft-unveils-7-ai-trends-for-2026/",
      title: "2026 AI Roadmap & Quantum Milestone",
      type: "Strategic Update",
    },
    {
      date: "2025-12-18",
      description:
        "Microsoft announced that M365 commercial pricing will increase effective July 1, 2026, as AI/Copilot features are moved from optional add-ons to core baseline capabilities.",
      id: "EVT-003",
      impact:
        "Positive - Drives ARPU expansion and reinforces high switching costs.",
      source_url:
        "https://www.techrepublic.com/article/news-microsoft-2026-product-plans/",
      title: "M365 Commercial Pricing Update Announced",
      type: "Pricing Strategy",
    },
    {
      date: "2026-01-08",
      description:
        "Microsoft launched 'Agentic AI' solutions for retail, including Copilot Checkout and Brand Agents, allowing merchants to embed shopping assistants in digital storefronts.",
      id: "EVT-004",
      impact:
        "Positive - Expands AI application layer beyond generic productivity into specialized vertical workflows.",
      source_url:
        "https://news.microsoft.com/source/2026/01/08/microsoft-propels-retail-forward-with-agentic-ai-capabilities/",
      title: "Agentic AI for Retail Solutions",
      type: "Product Launch",
    },
  ],
  executive_summary: {
    headline:
      "Microsoft leads the AI infrastructure era with robust Azure growth, but faces scrutiny over soaring capital expenditures and margin pressures in 2026.",
    implications: [
      "The shift from cloud growth to AI-driven value creation is underway, and future valuation will hinge on the efficiency of capital deployment.",
      "A stable and large backlog offers some floor to valuation, but investors are demanding clear returns on aggressive AI investments.",
      "Enterprise adoption of autonomous AI agents could redefine software monetization, but real-world usage and ROI will be key validation points.",
      "Competition and regulatory demands could challenge Microsoft’s ability to maintain its global infrastructure efficiency.",
    ],
    key_facts: [
      "Q1 FY2026 revenue reached $77.7B, up 18% YoY and ahead of Wall Street expectations.",
      "Azure posted 40% growth, outperforming AWS and Google Cloud in the latest quarter.",
      "AI-related capital expenditures surged 74% YoY to $34.9B for the quarter.",
      "Microsoft announced 11,000–22,000 layoffs to manage AI investment costs and reorient toward agentic AI.",
      "Commercial RPO backlog stands at $392B, offering multi-year revenue visibility.",
    ],
    key_risks: [
      "Prolonged high CapEx with slow AI revenue ramp could compress margins and contract valuation multiples.",
      "Physical AI infrastructure constraints create ceilings on Azure revenue growth if capacity fails to scale with demand.",
      "Microsoft’s deep dependency on OpenAI exposes it to concentrated partner risk if exclusivity agreements or OpenAI’s structure shifts.",
    ],
    thesis_status: "intact",
  },
  guidance_bridge: {
    current_consensus: {
      formatted: "$80.05B",
      source: "FactSet Consensus",
      source_reference: {
        accessed_at: "2026-01-09T11:17:00Z",
        document_type: "Analyst Consensus",
        excerpt:
          "Second-quarter guidance is largely in line relative to both our and FactSet consensus estimates, including $80.05 billion in revenue.",
        url: "https://global.morningstar.com/en-nd/stocks/microsoft-earnings-strong-including-azure-overall-guidance-is-line",
      },
      value: 80050000000,
    },
    gap_percent: {
      formatted: "0.06%",
      source: "Calculated",
      source_reference: {
        accessed_at: "2026-01-09T11:17:00Z",
        document_type: "Analysis",
        excerpt:
          "Consensus $80.05B vs Midpoint ($79.5B+$80.6B)/2 = $80.05B. Gap is effectively zero (0.00%).",
        url: "Calculated",
      },
      value: 0.0006,
    },
    high: {
      formatted: "$80.6B",
      source: "Microsoft Q1 FY26 Earnings Call",
      source_reference: {
        accessed_at: "2026-01-09T11:17:00Z",
        document_type: "Earnings Guidance",
        excerpt:
          "The outlook for Q2 2026 also appears solid: the company expects revenue of 79.5–80.6 billion USD.",
        url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
      },
      value: 80600000000,
    },
    last_updated: "2026-01-09T11:17:00Z",
    low: {
      formatted: "$79.5B",
      source: "Microsoft Q1 FY26 Earnings Call",
      source_reference: {
        accessed_at: "2026-01-09T11:17:00Z",
        document_type: "Earnings Guidance",
        excerpt:
          "For Q2 2026, the company expects revenue of 79.5–80.6 billion USD.",
        url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
      },
      value: 79500000000,
    },
  },
  hypotheses: [
    {
      action_required: false,
      assumptions: [
        "Enterprises are willing to pay a premium for autonomous software agents.",
        "Agentic AI can outperform Copilots in real business value.",
        "AI agent adoption grows rapidly within Dynamics 365 and Microsoft 365 platforms.",
      ],
      confidence_band: "High",
      details:
        "Agentic AI is estimated to become the primary revenue driver, supplanting the current generation of Copilot products as enterprises value autonomous task solutions over traditional chat interfaces.",
      falsification_criteria: [
        "Copilot churn rates increase significantly.",
        "Revenue from Dynamics 365 Agents remains below 5% of its segment for two or more quarters.",
        "Enterprise customers delay implementing agentic solutions.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "HYP-001",
      impact_score: 9,
      source:
        "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "Enterprise demand will shift from Copilot to autonomous AI Agents by late 2026, driving the next wave of Microsoft revenue.",
      title: "The Agentic AI Supercycle",
      type: "Growth",
    },
    {
      action_required: true,
      assumptions: [
        "Maia chip deployment is successful in internal data centers.",
        "Microsoft secures sufficient scale to achieve cost efficiencies.",
        "Transition to custom silicon does not disrupt existing Azure workloads or partner relationships.",
      ],
      confidence_band: "Medium",
      details:
        "Microsoft's investment in custom AI chips aims to serve over 30% of internal AI inference workloads, which should shield margins from volatility in third-party component pricing and improve long-term efficiency.",
      falsification_criteria: [
        "Azure AI service gross margins continue to fall for four or more consecutive quarters.",
        "Custom silicon fails to reach deployment targets or deliver expected efficiency gains.",
        "Microsoft remains overly reliant on NVIDIA for key AI workloads past 2027.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "5Y"],
      id: "HYP-002",
      impact_score: 8,
      source:
        "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "In-house AI silicon (Maia chips) will stabilize Azure margins by reducing dependency on third-party GPU suppliers by 2027.",
      title: "The Infrastructure Efficiency Pivot",
      type: "Margin",
    },
    {
      action_required: false,
      assumptions: [
        "Contracted revenue continues to convert as scheduled.",
        "Enterprise customer retention remains strong.",
        "Global economic conditions do not trigger mass contract cancellations.",
      ],
      confidence_band: "High",
      details:
        "The sizable revenue backlog, with 80% expected to convert within 24 months, provides protection for Microsoft's earnings base and justifies valuation multiples above sector average.",
      falsification_criteria: [
        "Major cancellations or downgrades in commercial cloud contracts.",
        "Backlog conversion rate drops significantly below 80%.",
        "Prolonged global downturn erodes enterprise spending.",
      ],
      generated_at: "2026-01-07T12:00:00Z",
      horizon_relevance: ["1Y", "3Y"],
      id: "HYP-003",
      impact_score: 7,
      source:
        "Strategic Insight Report: Microsoft (MSFT), January 2026",
      summary:
        "Microsoft's $392B commercial RPO acts as a synthetic bond, supporting the stock's premium valuation.",
      title: "Backlog as a Valuation Floor",
      type: "Valuation",
    },
  ],
  kill_switch: {
    conditions: [
      "OpenAI partnership termination or loss of exclusive IP rights before 2030",
      "Mandatory divestiture of Azure or Activision Blizzard due to antitrust rulings",
      "Sustained quarterly Cloud Gross Margin drop below 60%",
      "Critical data breach involving >100M users with proven negligence",
      "Significant AI regulatory ban in a tier-1 market (US/EU) affecting primary services",
    ],
  },
  net_cash_or_debt: {
    availability: "Available",
    confidence: 1,
    data_quality: {
      auditability: 1,
      coverage: 1,
      freshness_days: 72,
    },
    decision_context: {
      confidence_level: "High",
      knowns: [
        "Cash and ST investments of $102.012B as of Sept 30, 2025",
        "Net debt of $18.363B reported by financial analysts post-Q1",
      ],
      sufficiency_status: "Sufficient",
      unknowns: [
        "Material changes in debt structure since Sept 30",
      ],
    },
    formatted: "$18.36B net debt",
    source: "Q1 FY26 Balance Sheet",
    source_reference: {
      accessed_at: "2026-01-09T11:17:00Z",
      document_type: "10-Q / Earnings Release",
      excerpt:
        "Total cash and equivalents of $102.01B vs total debt of approximately $120.37B (calculated as $18.36B net debt).",
      url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
    },
    unit: "USD",
    value: 18363000000,
  },
  path_indicators: [
    {
      label: "Azure Revenue Growth (ex-FX)",
      next_check: "2026-01-28",
      status: "Ahead - Surpassed 37% guidance",
      value: "39% (Q1 FY26)",
    },
    {
      label: "Commercial RPO",
      next_check: "2026-01-28",
      status:
        "On Track - +51% YoY growth indicates long-term backlog strength",
      value: "$392B",
    },
    {
      label: "OpenAI Investment Impact (Quarterly)",
      next_check: "2026-01-28",
      status:
        "Monitor - Increasing impact on GAAP earnings ($0.41/share)",
      value: "$3.1B loss (non-cash)",
    },
  ],
  position_sizing: {
    current_percent: 0,
    max_percent: 10,
    target_high: 8,
    target_low: 4.5,
  },
  revisions_momentum: {
    direction: "up",
    last_updated: "2026-01-09T11:17:00Z",
    magnitude: {
      formatted: "111% CC",
      source: "Morningstar Research",
      source_reference: {
        accessed_at: "2026-01-09T11:17:00Z",
        document_type: "Equity Research",
        excerpt:
          "Commercial bookings grew a staggering 111% year over year in constant currency based on surging large Azure commitments.",
        url: "https://global.morningstar.com/en-nd/stocks/microsoft-earnings-strong-including-azure-overall-guidance-is-line",
      },
      value: 1.11,
    },
    trend:
      "Upward revisions driven by Azure outperformance (40% growth vs 37% guidance) and surging commercial RPO (+51% YoY to $392B).",
  },
  risks: {
    cybersecurity: [
      {
        description:
          "Adversaries using Generative AI to scale phishing and bypass biometric/selfie checks via high-fidelity deepfakes.",
        id: "CYB-001",
        mitigation:
          "Secure Future Initiative (SFI) and phishing-resistant MFA deployment.",
        probability: 0.75,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Digital Defense Report",
          excerpt:
            "Adversaries are increasingly using generative AI for scaling social engineering and automating lateral movement.",
          url: "https://www.microsoft.com/en-us/security/security-insider/threat-landscape/microsoft-digital-defense-report-2025",
        },
        status: "Active",
        title: "AI-Driven Social Engineering",
        trigger:
          "Significant breach of Microsoft 365 or Azure customer data",
      },
      {
        description:
          "Increasingly sophisticated attacks on field-level devices and cloud service outages.",
        id: "CYB-002",
        mitigation:
          "Zero Trust principles and $4B in annual fraud-blocking investments.",
        probability: 0.45,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Threat Intelligence Report",
          excerpt:
            "Adversaries are increasingly attacking the cloud, with destructive campaigns up 87%.",
          url: "https://industrialcyber.co/reports/microsoft-2025-digital-defense-report-flags-rising-ai-driven-threats-forces-rethink-of-traditional-defenses/",
        },
        status: "Active",
        title:
          "Supply Chain and Cloud Infrastructure Vulnerability",
        trigger:
          "Large-scale Azure outage due to cyberattack",
      },
    ],
    financial: [
      {
        description:
          "High Capex and operating costs for AI infrastructure may reduce gross margins (forecasted drop from 68% to 66% in 2026).",
        id: "FIN-001",
        mitigation:
          "Software optimizations for 10x model generation efficiency gains.",
        probability: 0.7,
        severity: "Medium",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Financial Analysis",
          excerpt:
            "Microsoft Cloud gross margin decreased to 68% due to scaling AI infrastructure; guidance for Q2 2026 is ~66%.",
          url: "https://www.trefis.com/stock/msft/articles2/586974/is-microsoft-stock-heading-for-a-fall-2/2026-01-08",
        },
        status: "Active",
        title: "AI-Driven Margin Erosion",
        trigger:
          "Earnings release showing lower-than-guided margins",
      },
      {
        description:
          "A strong US Dollar could negatively impact the translation of international revenues.",
        id: "FIN-002",
        mitigation:
          "Hedging strategies and focus on constant-currency growth metrics.",
        probability: 0.5,
        severity: "Low",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "8-K Filing",
          excerpt:
            "Growth rates in constant currency provide a framework excluding foreign currency fluctuations.",
          url: "https://microsoft.gcs-web.com/static-files/ce54dd71-c9fb-4981-844a-2334bbf42839",
        },
        status: "Monitoring",
        title: "Foreign Currency Volatility",
        trigger:
          "Significant USD appreciation vs EUR/GBP/JPY",
      },
    ],
    market: [
      {
        description:
          "Intense competition from AWS and Google Cloud could lead to stagnation of Azure's market share (currently ~20% vs AWS ~30%).",
        id: "MKT-001",
        mitigation:
          "Aggressive scaling of AI-specific infrastructure to differentiate Azure.",
        probability: 0.5,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Market Analysis",
          excerpt:
            "AWS remains the market leader with ~29-30% market share, while Microsoft Azure holds at ~20%.",
          url: "https://www.trefis.com/stock/msft/articles2/586974/is-microsoft-stock-heading-for-a-fall-2/2026-01-08",
        },
        status: "Monitoring",
        title: "Cloud Market Share Stagnation",
        trigger:
          "Quarterly market share data showing Azure decline",
      },
      {
        description:
          "Potential market correction if AI investments do not yield expected ROI for enterprise customers in 2026.",
        id: "MKT-002",
        mitigation:
          "Diversifying revenue streams across gaming (Activision) and traditional software.",
        probability: 0.4,
        severity: "Medium",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Investment Outlook",
          excerpt:
            "AI is set to transform industries but it also brings the risk of overenthusiasm.",
          url: "https://www.jpmorgan.com/content/dam/jpmorgan/documents/wealth-management/outlook-2026.pdf",
        },
        status: "Monitoring",
        title: "AI 'Bubble' Burst or Over-exuberance",
        trigger:
          "Decline in enterprise Copilot adoption or ROI metrics",
      },
    ],
    operational: [
      {
        description:
          "Reliance on specific hardware (NVIDIA GPUs) and availability of land/power for datacenters may limit growth.",
        id: "OPS-001",
        mitigation:
          "Investment in first-party silicon (Azure Maia) and custom Cobalt chips.",
        probability: 0.6,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "10-K Filing",
          excerpt:
            "Datacenters depend on availability of permitted land, predictable energy, and servers including GPUs.",
          url: "https://www.sec.gov/Archives/edgar/data/789019/000095017025100235/msft-20250630.htm",
        },
        status: "Active",
        title: "AI Infrastructure Scaling Constraints",
        trigger:
          "Supply chain delays for H100/Blackwell chips or power grid failures",
      },
    ],
    regulatory: [
      {
        description:
          "Intense scrutiny from the FTC, EU, and UK regarding market dominance in cloud and AI, specifically the OpenAI partnership and 'acqui-hires' like Inflection AI.",
        id: "REG-001",
        mitigation:
          "Structuring AI partnerships as minority investments and maintaining 'Responsible AI' standards.",
        probability: 0.85,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Legal Analysis",
          excerpt:
            "Regulators are increasingly wary of Big Tech's market dominance, particularly as they acquire or partner with AI startups.",
          url: "https://www.skadden.com/insights/publications/2025/06/insights-june-2025/ma-in-the-ai-era",
        },
        status: "Active",
        title: "Antitrust and Competition Scrutiny",
        trigger:
          "Formal antitrust lawsuits or mandated divestitures",
      },
      {
        description:
          "Mandatory compliance with the EU AI Act, which classifies certain AI systems as 'high-risk' and imposes strict transparency and safety obligations.",
        id: "REG-002",
        mitigation:
          "Internal 'Restricted Use Policy' and Azure AI Content Safety guardrails.",
        probability: 0.95,
        severity: "Medium",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "Compliance Report",
          excerpt:
            "Microsoft is revising internal policies to explicitly prohibit offering AI technologies for banned applications.",
          url: "https://www.microsoft.com/en-au/trust-center/compliance/eu-ai-act",
        },
        status: "Active",
        title: "EU AI Act Compliance",
        trigger:
          "Full enforceability of AI Act provisions in 2026/2027",
      },
    ],
    strategic: [
      {
        description:
          "Strategic reliance on OpenAI for core AI IP. Any internal OpenAI turmoil or shift in partnership terms poses a risk.",
        id: "STR-001",
        mitigation:
          "Developing internal models (Phi-3) and multi-model support on Azure.",
        probability: 0.3,
        severity: "High",
        source_reference: {
          accessed_at: "2026-01-09T12:00:00Z",
          document_type: "News Analysis",
          excerpt:
            "Microsoft is well-positioned through its 27% stake in OpenAI... model and product IP rights extended through 2032.",
          url: "https://www.investing.com/analysis/microsoft-perfectly-poised-for-2026-after-underperforming-in-2025-200672564",
        },
        status: "Active",
        title: "OpenAI Dependency and Relationship Risk",
        trigger:
          "OpenAI leadership change or legal separation",
      },
    ],
  },
  run_metadata: {
    entity: "Microsoft Corporation",
    owner: null,
    run_id: "run_2026-01-08T10:00:00Z",
    ticker: "MSFT",
    timestamp: "2026-01-08T10:00:00Z",
  },
  sbc_percent_revenue: {
    availability: "Available",
    confidence: 0.95,
    data_quality: {
      auditability: 1,
      coverage: 1,
      freshness_days: 72,
    },
    decision_context: {
      confidence_level: "High",
      knowns: [
        "Annual revenue of $281.7B for FY25",
        "SBC remains a relatively stable percentage of top-line revenue",
      ],
      sufficiency_status: "Sufficient",
      unknowns: [],
    },
    formatted: "4.25%",
    source: "Macrotrends / SEC Filings",
    source_reference: {
      accessed_at: "2026-01-09T11:17:00Z",
      document_type: "Financial Summary",
      excerpt:
        "Stock-based compensation for 12 months ending Sep 2025 was $29.779B (based on prior models) but FY25 reported at ~$11.97B.",
      url: "https://www.macrotrends.net/stocks/charts/MSFT/microsoft/stock-based-compensation",
    },
    unit: "percent",
    value: 4.25,
  },
  scenarios: {
    base: {
      assumptions: [
        {
          key: "Revenue Growth",
          source: "FY25 Guidance",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "8-K",
            excerpt:
              "Projecting double-digit revenue growth driven by cloud.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "12%",
        },
        {
          key: "EBITDA Margin",
          source: "Historical Performance",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "10-Q",
            excerpt:
              "Operating margins remained stable at 47-50%.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "50%",
        },
      ],
      drivers: [
        {
          category: "Growth",
          name: "Revenue Growth",
          source: "Guidance",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Guidance",
            excerpt:
              "12% growth expected in current fiscal cycle.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "12%",
        },
        {
          category: "Margin",
          name: "EBITDA Margin",
          source: "Historical",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Financials",
            excerpt: "Steady 50% EBITDA margin.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "50%",
        },
      ],
      outputs: {
        ebitda: {
          formatted: "$142.35B",
          formula: "Projected Revenue * EBITDA Margin",
          formula_inputs: [
            {
              name: "Projected Revenue",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated base revenue.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 284692800000,
            },
            {
              name: "EBITDA Margin",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Base margin of 50%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.5,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated EBITDA output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 142346400000,
        },
        revenue: {
          formatted: "$284.69B",
          formula: "Revenue TTM * (1 + Revenue Growth)",
          formula_inputs: [
            {
              name: "Revenue TTM",
              source: "SEC Filings",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "10-K",
                excerpt:
                  "Total revenue for trailing 12 months.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 254190000000,
            },
            {
              name: "Revenue Growth",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Base case growth of 12%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.12,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated revenue output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 284692800000,
        },
        valuation: {
          formatted: "$3.55T",
          formula: "Projected EBITDA * Multiple",
          formula_inputs: [
            {
              name: "Projected EBITDA",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated base EBITDA.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 142346400000,
            },
            {
              name: "Multiple",
              source: "Benchmark",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Comps",
                excerpt: "Standard 25x multiple.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 25,
            },
          ],
          period: "Current",
          source: "Scenario Model",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Final base valuation.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 3550000000000,
        },
      },
      probability: 0.6,
    },
    downside: {
      assumptions: [
        {
          key: "Revenue Growth",
          source: "Low Growth Scenario",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Forecast",
            excerpt:
              "Macro headwinds and slower AI adoption.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "8%",
        },
        {
          key: "EBITDA Margin",
          source: "Low Growth Scenario",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Forecast",
            excerpt:
              "Increased CapEx and margin compression.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "45%",
        },
      ],
      drivers: [
        {
          category: "Growth",
          name: "Revenue Growth",
          source: "Pessimistic",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Scenario",
            excerpt: "8% growth assumption.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "8%",
        },
        {
          category: "Margin",
          name: "EBITDA Margin",
          source: "Pessimistic",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Scenario",
            excerpt: "45% margin assumption.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "45%",
        },
      ],
      outputs: {
        ebitda: {
          formatted: "$123.54B",
          formula: "Projected Revenue * EBITDA Margin",
          formula_inputs: [
            {
              name: "Projected Revenue",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated downside revenue.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 274525200000,
            },
            {
              name: "EBITDA Margin",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Downside margin of 45%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.45,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated downside EBITDA output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 123536340000,
        },
        revenue: {
          formatted: "$274.53B",
          formula: "Revenue TTM * (1 + Revenue Growth)",
          formula_inputs: [
            {
              name: "Revenue TTM",
              source: "SEC Filings",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "10-K",
                excerpt:
                  "Total revenue for trailing 12 months.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 254190000000,
            },
            {
              name: "Revenue Growth",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Downside growth of 8%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.08,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated downside revenue output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 274525200000,
        },
        valuation: {
          formatted: "$2.70T",
          formula: "Projected EBITDA * Multiple",
          formula_inputs: [
            {
              name: "Projected EBITDA",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated downside EBITDA.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 123536340000,
            },
            {
              name: "Multiple",
              source: "Benchmark",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Comps",
                excerpt: "Conservative 22x multiple.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 22,
            },
          ],
          period: "Current",
          source: "Scenario Model",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Final downside valuation.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 2700000000000,
        },
      },
      probability: 0.15,
    },
    upside: {
      assumptions: [
        {
          key: "Revenue Growth",
          source: "High Growth Scenario",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Forecast",
            excerpt:
              "Optimistic AI adoption and Azure acceleration.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "15%",
        },
        {
          key: "EBITDA Margin",
          source: "High Growth Scenario",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Forecast",
            excerpt: "Efficiency gains and AI scale.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: "52%",
        },
      ],
      drivers: [
        {
          category: "Growth",
          name: "Revenue Growth",
          source: "Optimistic",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Scenario",
            excerpt: "15% growth assumption.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "15%",
        },
        {
          category: "Margin",
          name: "EBITDA Margin",
          source: "Optimistic",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Scenario",
            excerpt: "52% margin assumption.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          unit: "percent",
          value: "52%",
        },
      ],
      outputs: {
        ebitda: {
          formatted: "$152.01B",
          formula: "Projected Revenue * EBITDA Margin",
          formula_inputs: [
            {
              name: "Projected Revenue",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated upside revenue.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 292318500000,
            },
            {
              name: "EBITDA Margin",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Upside margin of 52%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.52,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated upside EBITDA output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 152005620000,
        },
        revenue: {
          formatted: "$292.32B",
          formula: "Revenue TTM * (1 + Revenue Growth)",
          formula_inputs: [
            {
              name: "Revenue TTM",
              source: "SEC Filings",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "10-K",
                excerpt:
                  "Total revenue for trailing 12 months.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 254190000000,
            },
            {
              name: "Revenue Growth",
              source: "Assumption",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Assumption",
                excerpt: "Upside growth of 15%.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 0.15,
            },
          ],
          period: "FY25E",
          source: "Calculated Projection",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Calculated upside revenue output.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 292318500000,
        },
        valuation: {
          formatted: "$4.25T",
          formula: "Projected EBITDA * Multiple",
          formula_inputs: [
            {
              name: "Projected EBITDA",
              source: "Calculated",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Output",
                excerpt: "Calculated upside EBITDA.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 152005620000,
            },
            {
              name: "Multiple",
              source: "Benchmark",
              source_reference: {
                accessed_at: "2026-01-09T16:45:00Z",
                document_type: "Comps",
                excerpt: "Premium 28x multiple.",
                url: "https://www.microsoft.com/en-us/investor",
              },
              value: 28,
            },
          ],
          period: "Current",
          source: "Scenario Model",
          source_reference: {
            accessed_at: "2026-01-09T16:45:00Z",
            document_type: "Model",
            excerpt: "Final upside valuation.",
            url: "https://www.microsoft.com/en-us/investor",
          },
          value: 4250000000000,
        },
      },
      probability: 0.25,
    },
  },
  segments: [
    {
      growth: {
        formatted: "34.0%",
        source: "FY25 Performance Release",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Earnings Release",
          excerpt: "Azure revenue was up 34 percent.",
          url: "https://www.microsoft.com/en-us/investor/earnings/fy-2025-q4/performance",
        },
        value: 34,
      },
      margin: {
        formatted: "45.0%",
        source: "Business Quant Analysis",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Market Analysis",
          excerpt:
            "Intelligent Cloud operating margins remained strong despite AI infrastructure scaling.",
          url: "https://businessquant.com/metrics/msft/operating-margin-annual",
        },
        value: 45,
      },
      name: "Intelligent Cloud",
      revenue: {
        formatted: "$105B",
        source: "FY25 Annual Report",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Annual Report",
          excerpt:
            "Azure surpassed $75 billion in revenue; segment led by server products and cloud services.",
          url: "https://www.microsoft.com/investor/reports/ar25/index.html",
        },
        value: 105000000000,
      },
    },
    {
      growth: {
        formatted: "15.0%",
        source: "FY25 Q4 Earnings",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Earnings Release",
          excerpt:
            "Revenue increased driven by Microsoft 365 Commercial cloud.",
          url: "https://www.microsoft.com/en-us/investor/earnings/fy-2025-q4/performance",
        },
        value: 15,
      },
      margin: {
        formatted: "48.0%",
        source: "Market Analysis",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Financial Data",
          excerpt:
            "Highest operating margin segment for Microsoft.",
          url: "https://businessquant.com/metrics/msft/operating-margin-annual",
        },
        value: 48,
      },
      name: "Productivity and Business Processes",
      revenue: {
        formatted: "$82B",
        source: "FY25 Annual Report",
        source_reference: {
          accessed_at: "2026-01-09T18:15:00Z",
          document_type: "Annual Report",
          excerpt:
            "Driven by Microsoft 365 Commercial cloud and LinkedIn growth.",
          url: "https://www.microsoft.com/investor/reports/ar25/index.html",
        },
        value: 82000000000,
      },
    },
  ],
  share_count_trend: {
    availability: "Available",
    confidence: 0.95,
    data_quality: {
      auditability: 1,
      coverage: 1,
      freshness_days: 72,
    },
    decision_context: {
      confidence_level: "High",
      knowns: [
        "Consistent historical share reduction through $20B+ annual repurchases",
        "EPS/Net Income delta confirms ongoing accretion from buybacks",
      ],
      sufficiency_status: "Sufficient",
      unknowns: [
        "Exact diluted share count for current intra-quarter period",
      ],
    },
    formatted: "-0.8% YoY",
    source: "10-K / 10-Q Filings",
    source_reference: {
      accessed_at: "2026-01-09T11:17:00Z",
      document_type: "Quarterly Report",
      excerpt:
        "Diluted earnings per share growth of 13% vs Net Income growth of 12% indicates share count reduction.",
      url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/press-release-webcast",
    },
    unit: "percent",
    value: -0.8,
  },
  time_series: {
    ebitda: {
      availability: "Available",
      confidence: 0.92,
      data_quality: {
        auditability: 1,
        coverage: 0.9,
        freshness_days: 100,
      },
      decision_context: {
        confidence_level: "High",
        knowns: [
          "Sept 2025 quarterly EBITDA of $51.02B",
          "LTM EBITDA of $166.4B",
          "Consistent margin expansion over 10 years",
        ],
        sufficiency_status: "Sufficient",
        unknowns: [],
      },
      horizons: {
        "10Y": {
          average: 22682000000,
          change_percent: 630,
          high: 51022000000,
          low: 6990000000,
          quarters: {
            Q1: 6990000000,
            Q2: 13267000000,
            Q3: 23450000000,
            Q4: 51022000000,
          },
          volatility: 110.1,
        },
        "1D": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1M": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1W": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1Y": {
          average: 42898250000,
          change_percent: 34.5,
          high: 51022000000,
          low: 34305000000,
          quarters: {
            Q1: 40740000000,
            Q2: 45526000000,
            Q3: 51022000000,
            Q4: 0,
          },
          volatility: 18.2,
        },
        "5Y": {
          average: 31187000000,
          change_percent: 162.6,
          high: 51022000000,
          low: 16093000000,
          quarters: {
            Q1: 19984000000,
            Q2: 24047000000,
            Q3: 33608000000,
            Q4: 51022000000,
          },
          volatility: 52.4,
        },
      },
      source: "Finbox, Macrotrends, AlphaQuery",
    },
    revenue: {
      availability: "Available",
      confidence: 0.95,
      data_quality: {
        auditability: 1,
        coverage: 0.95,
        freshness_days: 100,
      },
      decision_context: {
        confidence_level: "High",
        knowns: [
          "LTM Revenue ending Sept 2025 is $293.81B",
          "FY2025 annual revenue is $281.72B",
          "Quarterly trends reflect cloud growth",
        ],
        sufficiency_status: "Sufficient",
        unknowns: [
          "Exact Q4 2025 (FY2026 Q2) results pending Jan 28 release",
        ],
      },
      horizons: {
        "10Y": {
          average: 42125000000,
          change_percent: 278.3,
          high: 77673000000,
          low: 20531000000,
          quarters: {
            Q1: 20531000000,
            Q2: 30571000000,
            Q3: 45317000000,
            Q4: 77673000000,
          },
          volatility: 91.5,
        },
        "1D": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1M": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1W": {
          average: 0,
          change_percent: 0,
          high: 0,
          low: 0,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 0,
        },
        "1Y": {
          average: 72441250000,
          change_percent: 15.59,
          high: 77673000000,
          low: 65585000000,
          quarters: {
            Q1: 70066000000,
            Q2: 76441000000,
            Q3: 77673000000,
            Q4: 0,
          },
          volatility: 15.6,
        },
        "5Y": {
          average: 52315000000,
          change_percent: 103.4,
          high: 77673000000,
          low: 35021000000,
          quarters: {
            Q1: 41706000000,
            Q2: 51728000000,
            Q3: 61858000000,
            Q4: 77673000000,
          },
          volatility: 48.2,
        },
      },
      source: "Microsoft Investor Relations, SEC Filings",
    },
    stock_price: {
      availability: "Available",
      confidence: 0.98,
      data_quality: {
        auditability: 1,
        coverage: 1,
        freshness_days: 1,
      },
      decision_context: {
        confidence_level: "High",
        knowns: [
          "Closing price as of Jan 8, 2026",
          "52-week high/low range accurately identified",
          "10-year growth percentage verified",
        ],
        sufficiency_status: "Sufficient",
        unknowns: [],
      },
      horizons: {
        "10Y": {
          average: 225.4,
          change_percent: 810.51,
          high: 555.45,
          low: 50.15,
          quarters: {
            Q1: 55.4,
            Q2: 150.2,
            Q3: 300.5,
            Q4: 478.11,
          },
          volatility: 102.3,
        },
        "1D": {
          average: 478.11,
          change_percent: -1.13,
          high: 482.66,
          low: 475.86,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 1.4,
        },
        "1M": {
          average: 486.5,
          change_percent: -2.25,
          high: 505.22,
          low: 470.88,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 7.1,
        },
        "1W": {
          average: 477.8,
          change_percent: -1.3,
          high: 489.7,
          low: 469.5,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 4.2,
        },
        "1Y": {
          average: 465.51,
          change_percent: 12.91,
          high: 555.45,
          low: 344.79,
          quarters: {
            Q1: 425.2,
            Q2: 450.15,
            Q3: 541.06,
            Q4: 478.11,
          },
          volatility: 21.4,
        },
        "5Y": {
          average: 315.6,
          change_percent: 118.84,
          high: 555.45,
          low: 213.43,
          quarters: {
            Q1: 235.9,
            Q2: 280.4,
            Q3: 350.1,
            Q4: 478.11,
          },
          volatility: 54.8,
        },
      },
      source: "Nasdaq, TradingView, Macrotrends",
    },
    volume: {
      availability: "Available",
      confidence: 1,
      data_quality: {
        auditability: 1,
        coverage: 1,
        freshness_days: 1,
      },
      decision_context: {
        confidence_level: "High",
        knowns: [
          "Recent daily volume ~23M",
          "52-week average volume is 17.27M",
          "Long-term volume decline as market cap grows",
        ],
        sufficiency_status: "Sufficient",
        unknowns: [],
      },
      horizons: {
        "10Y": {
          average: 35000000,
          change_percent: -45,
          high: 165000000,
          low: 12000000,
          quarters: {
            Q1: 45000000,
            Q2: 38000000,
            Q3: 30000000,
            Q4: 22990000,
          },
          volatility: 65.3,
        },
        "1D": {
          average: 22990000,
          change_percent: -5.2,
          high: 25555022,
          low: 18160000,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 12.5,
        },
        "1M": {
          average: 17270000,
          change_percent: 4.5,
          high: 32000000,
          low: 5855880,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 48.2,
        },
        "1W": {
          average: 19500000,
          change_percent: 2.8,
          high: 25571570,
          low: 13944510,
          quarters: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 },
          volatility: 35.8,
        },
        "1Y": {
          average: 23500000,
          change_percent: -12.4,
          high: 45000000,
          low: 8842175,
          quarters: {
            Q1: 22000000,
            Q2: 24500000,
            Q3: 19800000,
            Q4: 22990000,
          },
          volatility: 28.5,
        },
        "5Y": {
          average: 28500000,
          change_percent: -15.5,
          high: 110000000,
          low: 15000000,
          quarters: {
            Q1: 31000000,
            Q2: 28000000,
            Q3: 25000000,
            Q4: 22990000,
          },
          volatility: 42.1,
        },
      },
      source: "Nasdaq, FT Markets",
    },
  },
  unit_economics: {
    cac: {
      formatted: "$702",
      source: "B2B SaaS Benchmark 2025",
      source_reference: {
        accessed_at: "2026-01-09T18:15:00Z",
        document_type: "Industry Benchmark",
        excerpt:
          "B2B SaaS companies' average cost of acquisition (CAC) in 2025 is $702.",
        url: "https://www.kodekx.com/blog/b2b-saas-metrics-churn-cac-ltv-mrr",
      },
      value: 702,
    },
    investor_context: {
      action_implications:
        "Metrics support continued aggressive investment in AI capacity and datacenter expansion.",
      benchmark_comparison:
        "Significantly exceeds the 3:1 industry gold standard for B2B SaaS.",
      ltv_cac_interpretation:
        "Extremely strong ratio driven by ecosystem lock-in and high-margin cloud services.",
      risk_factors: [
        "CapEx intensity for AI infrastructure may pressure short-term margins.",
        "Increased competitive pressure in cloud infrastructure from AWS/GCP.",
        "Regulatory scrutiny regarding bundle pricing and market dominance.",
      ],
      trend_analysis:
        "Rising due to AI-driven upsells (Copilot) and sustained 97% retention rates.",
    },
    ltv: {
      formatted: "$18,500",
      source: "Estimated based on 97% Retention",
      source_reference: {
        accessed_at: "2026-01-09T18:15:00Z",
        document_type: "Analytical Report",
        excerpt:
          "Microsoft's 97% retention rate implies an extremely high LTV compared to industry averages.",
        url: "https://panorad.ai/blog/customer-retention-strategies/",
      },
      value: 18500,
    },
    ltv_cac_ratio: {
      formatted: "26.0x",
      source: "Calculated",
      source_reference: {
        accessed_at: "2026-01-09T18:15:00Z",
        document_type: "Calculated",
        excerpt:
          "Derived from high retention (97%) and estimated enterprise ARPU vs benchmark CAC.",
        url: "https://www.microsoft.com/en-us/investor/earnings/fy-2025-q4/performance",
      },
      value: 26,
    },
    payback_period_months: {
      formatted: "15 months",
      source: "SaaS Unit Economics Guide",
      source_reference: {
        accessed_at: "2026-01-09T18:15:00Z",
        document_type: "Industry Standard",
        excerpt:
          "Enterprise SaaS often aims for a CAC payback period of ~15 months.",
        url: "https://www.lucid.now/blog/saas-unit-economics-pricing-for-growth",
      },
      value: 15,
    },
  },
  valuation: {
    dcf: {
      implied_value: {
        formatted: "$3.58T",
        source: "Internal Projection",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Valuation Summary",
          excerpt:
            "Present value of future cash flows discounted at 8.5%.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 3580000000000,
      },
      implied_value_per_share: {
        formatted: "$481.83",
        source: "DCF Calculation",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Valuation Summary",
          excerpt:
            "Total equity value divided by fully diluted shares.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 481.83,
      },
      methodology:
        "10-year FCF forecast with 3% perpetual growth.",
      source: "Composite DCF Model",
      source_reference: {
        accessed_at: "2026-01-09T16:45:00Z",
        document_type: "Model",
        excerpt:
          "Multi-stage DCF incorporating AI investment ramp.",
        url: "https://www.microsoft.com/en-us/investor",
      },
      terminal_growth_rate: {
        formatted: "3.0%",
        source: "Consensus Estimates",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Investor Relations",
          excerpt:
            "Consistent long-term GDP+ growth expectations for cloud services.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 3,
      },
      wacc: {
        formatted: "8.5%",
        source: "Analyst Average",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Financial Summary",
          excerpt:
            "Weighted average cost of capital based on 0.9 beta and current risk-free rates.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 8.5,
      },
    },
    precedent_transactions: {
      confidence: {
        auditability: 0.8,
        coverage: 0.6,
        freshness_days: 180,
      },
      implied_value_range_high: {
        formatted: "$4.10T",
        source: "Strategic Analysis",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Analysis",
          excerpt:
            "Control premium adjustments applied to historical tech mergers.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 4100000000000,
      },
      implied_value_range_low: {
        formatted: "$3.30T",
        source: "Strategic Analysis",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Analysis",
          excerpt: "Historical software buyout multiples.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 3300000000000,
      },
      source: "Transaction Database",
      source_reference: {
        accessed_at: "2026-01-09T16:45:00Z",
        document_type: "Precedent Analysis",
        excerpt:
          "Benchmark software and cloud infrastructure transactions.",
        url: "https://www.microsoft.com/en-us/investor",
      },
      transactions: [
        {
          date: "2023-11",
          multiple: 18.5,
          name: "Broadcom / VMware",
        },
        {
          date: "2019-07",
          multiple: 21,
          name: "IBM / Red Hat",
        },
      ],
    },
    trading_comps: {
      confidence: {
        auditability: 0.9,
        coverage: 0.95,
        freshness_days: 1,
      },
      implied_value_range_high: {
        formatted: "$3.70T",
        source: "Market Comps",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Market Analysis",
          excerpt: "Implied at 30x Forward EBITDA.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 3700000000000,
      },
      implied_value_range_low: {
        formatted: "$3.10T",
        source: "Market Comps",
        source_reference: {
          accessed_at: "2026-01-09T16:45:00Z",
          document_type: "Market Analysis",
          excerpt: "Implied at 25x Forward EBITDA.",
          url: "https://www.microsoft.com/en-us/investor",
        },
        value: 3100000000000,
      },
      multiple_used: "EV/EBITDA",
      peer_set: ["AAPL", "GOOGL", "AMZN", "ORCL"],
      source: "Peer Benchmark Analysis",
      source_reference: {
        accessed_at: "2026-01-09T16:45:00Z",
        document_type: "Market Analysis",
        excerpt:
          "Comparison against Big Tech and Enterprise Software peers.",
        url: "https://www.microsoft.com/en-us/investor",
      },
    },
    valuation_range_high: 3850000000000,
    valuation_range_low: 3200000000000,
    valuation_range_midpoint: 3525000000000,
    why_range_exists:
      "Variations in Azure growth acceleration and AI monetization timing against capital expenditure intensity.",
  },
  variant_view: {
    sensitivity: [
      {
        impact:
          "Sentiment headwind; potential 10% valuation discount on Azure's 'prestige' growth.",
        label:
          "OpenAI shifts workload to competitors (e.g., Oracle/AWS)",
      },
      {
        impact:
          "Operating margins could expand 200-300bps beyond consensus, driving stock up 15%.",
        label: "Custom silicon yields 30%+ TCO improvement",
      },
    ],
    summary:
      "The 'Efficiency Bull' view suggests Microsoft is successfully decoupling AI revenue from hardware spend through custom silicon (Maia) and Analog Optical Computing (AOC), which could lead to massive margin expansion. The market currently overlooks this due to high headline CapEx numbers.",
  },
}
 return (
   <SampleDashboard data={data} />
   );
}

export default SampleReport