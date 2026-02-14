"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { FileUpload } from "../apply/components/ui/file-upload-component";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  Briefcase,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
  Code,
  BarChart3,
  Rocket,
  CheckCircle,
  AlertCircle,
  FileText,
  Linkedin,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface StartupFormData {
  // Founder Information
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  founderLinkedin: string;
  coFounders: string;

  // Company Information
  companyName: string;
  companyWebsite: string;
  companyLocation: string;
  incorporationStatus: "incorporated" | "in_progress" | "not_yet" | "";
  incorporationCountry: string;
  foundedDate: string;

  // Business Details
  industry: string;
  stage: "idea" | "prototype" | "mvp" | "early_revenue" | "growth" | "";
  businessModel: string;
  problemStatement: string;
  solution: string;
  uniqueValueProposition: string;
  targetMarket: string;
  marketSize: string;
  competitors: string;
  competitiveAdvantage: string;

  // Traction & Metrics
  currentRevenue: string;
  revenueGrowth: string;
  numberOfCustomers: string;
  userMetrics: string;
  keyMilestones: string;

  // Funding
  fundingStage: "pre_seed" | "seed" | "series_a" | "series_b" | "series_c_plus" | "";
  fundingAmount: string;
  previousFunding: string;
  currentInvestors: string;
  useOfFunds: string;
  valuation: string;

  // Team
  teamSize: string;
  keyTeamMembers: string;
  advisors: string;
  hiringPlans: string;

  // Product & Technology
  productDescription: string;
  technologyStack: string;
  intellectualProperty: string;
  productRoadmap: string;

  // Go-to-Market
  customerAcquisition: string;
  salesStrategy: string;
  marketingStrategy: string;
  partnershipStrategy: string;

  // Financial Projections
  projectedRevenue: string;
  burnRate: string;
  runway: string;
  breakEvenTimeline: string;

  // Documents
  pitchDeck: File | null;
  financialModel: File | null;
  businessPlan: File | null;
  productDemo: File | null;

  // Additional
  whyUs: string;
  referralSource: string;
  exitStrategy: string;
  challenges: string;

  terms: boolean;
}

export default function StartupApplicationPage() {
  const submitApplication = useMutation(api.startupApplications.submitStartupApplication);
  const generateUploadUrl = useMutation(api.startupApplications.generateUploadUrl);

  const [formData, setFormData] = useState<StartupFormData>({
    founderName: "",
    founderEmail: "",
    founderPhone: "",
    founderLinkedin: "",
    coFounders: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    incorporationStatus: "",
    incorporationCountry: "",
    foundedDate: "",
    industry: "",
    stage: "",
    businessModel: "",
    problemStatement: "",
    solution: "",
    uniqueValueProposition: "",
    targetMarket: "",
    marketSize: "",
    competitors: "",
    competitiveAdvantage: "",
    currentRevenue: "",
    revenueGrowth: "",
    numberOfCustomers: "",
    userMetrics: "",
    keyMilestones: "",
    fundingStage: "",
    fundingAmount: "",
    previousFunding: "",
    currentInvestors: "",
    useOfFunds: "",
    valuation: "",
    teamSize: "",
    keyTeamMembers: "",
    advisors: "",
    hiringPlans: "",
    productDescription: "",
    technologyStack: "",
    intellectualProperty: "",
    productRoadmap: "",
    customerAcquisition: "",
    salesStrategy: "",
    marketingStrategy: "",
    partnershipStrategy: "",
    projectedRevenue: "",
    burnRate: "",
    runway: "",
    breakEvenTimeline: "",
    pitchDeck: null,
    financialModel: null,
    businessPlan: null,
    productDemo: null,
    whyUs: "",
    referralSource: "",
    exitStrategy: "",
    challenges: "",
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (
    field: "pitchDeck" | "financialModel" | "businessPlan" | "productDemo",
    file: File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const resetForm = () => {
    setFormData({
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      founderLinkedin: "",
      coFounders: "",
      companyName: "",
      companyWebsite: "",
      companyLocation: "",
      incorporationStatus: "",
      incorporationCountry: "",
      foundedDate: "",
      industry: "",
      stage: "",
      businessModel: "",
      problemStatement: "",
      solution: "",
      uniqueValueProposition: "",
      targetMarket: "",
      marketSize: "",
      competitors: "",
      competitiveAdvantage: "",
      currentRevenue: "",
      revenueGrowth: "",
      numberOfCustomers: "",
      userMetrics: "",
      keyMilestones: "",
      fundingStage: "",
      fundingAmount: "",
      previousFunding: "",
      currentInvestors: "",
      useOfFunds: "",
      valuation: "",
      teamSize: "",
      keyTeamMembers: "",
      advisors: "",
      hiringPlans: "",
      productDescription: "",
      technologyStack: "",
      intellectualProperty: "",
      productRoadmap: "",
      customerAcquisition: "",
      salesStrategy: "",
      marketingStrategy: "",
      partnershipStrategy: "",
      projectedRevenue: "",
      burnRate: "",
      runway: "",
      breakEvenTimeline: "",
      pitchDeck: null,
      financialModel: null,
      businessPlan: null,
      productDemo: null,
      whyUs: "",
      referralSource: "",
      exitStrategy: "",
      challenges: "",
      terms: false,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Validate required fields
      if (!formData.pitchDeck) {
        throw new Error("Pitch deck is required");
      }

      if (!formData.terms) {
        throw new Error("You must accept the terms and conditions");
      }

      // Upload pitch deck (required)
      const pitchDeckUploadUrl = await generateUploadUrl();
      const pitchDeckResponse = await fetch(pitchDeckUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.pitchDeck.type },
        body: formData.pitchDeck,
      });

      if (!pitchDeckResponse.ok) {
        throw new Error("Failed to upload pitch deck");
      }

      const { storageId: pitchDeckStorageId } = await pitchDeckResponse.json();

      // Upload optional documents
      let financialModelStorageId: Id<"_storage"> | undefined;
      if (formData.financialModel) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.financialModel.type },
          body: formData.financialModel,
        });
        if (response.ok) {
          const result = await response.json();
          financialModelStorageId = result.storageId;
        }
      }

      let businessPlanStorageId: Id<"_storage"> | undefined;
      if (formData.businessPlan) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.businessPlan.type },
          body: formData.businessPlan,
        });
        if (response.ok) {
          const result = await response.json();
          businessPlanStorageId = result.storageId;
        }
      }

      let productDemoStorageId: Id<"_storage"> | undefined;
      if (formData.productDemo) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.productDemo.type },
          body: formData.productDemo,
        });
        if (response.ok) {
          const result = await response.json();
          productDemoStorageId = result.storageId;
        }
      }

      // Submit application
      const result = await submitApplication({
        founderName: formData.founderName,
        founderEmail: formData.founderEmail,
        founderPhone: formData.founderPhone || undefined,
        founderLinkedin: formData.founderLinkedin || undefined,
        coFounders: formData.coFounders || undefined,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite || undefined,
        companyLocation: formData.companyLocation,
        incorporationStatus: formData.incorporationStatus as any,
        incorporationCountry: formData.incorporationCountry || undefined,
        foundedDate: formData.foundedDate || undefined,
        industry: formData.industry,
        stage: formData.stage as any,
        businessModel: formData.businessModel,
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        uniqueValueProposition: formData.uniqueValueProposition,
        targetMarket: formData.targetMarket,
        marketSize: formData.marketSize || undefined,
        competitors: formData.competitors || undefined,
        competitiveAdvantage: formData.competitiveAdvantage || undefined,
        currentRevenue: formData.currentRevenue || undefined,
        revenueGrowth: formData.revenueGrowth || undefined,
        numberOfCustomers: formData.numberOfCustomers || undefined,
        userMetrics: formData.userMetrics || undefined,
        keyMilestones: formData.keyMilestones,
        fundingStage: formData.fundingStage as any,
        fundingAmount: formData.fundingAmount,
        previousFunding: formData.previousFunding || undefined,
        currentInvestors: formData.currentInvestors || undefined,
        useOfFunds: formData.useOfFunds,
        valuation: formData.valuation || undefined,
        teamSize: formData.teamSize,
        keyTeamMembers: formData.keyTeamMembers,
        advisors: formData.advisors || undefined,
        hiringPlans: formData.hiringPlans || undefined,
        productDescription: formData.productDescription,
        technologyStack: formData.technologyStack || undefined,
        intellectualProperty: formData.intellectualProperty || undefined,
        productRoadmap: formData.productRoadmap || undefined,
        customerAcquisition: formData.customerAcquisition,
        salesStrategy: formData.salesStrategy,
        marketingStrategy: formData.marketingStrategy || undefined,
        partnershipStrategy: formData.partnershipStrategy || undefined,
        projectedRevenue: formData.projectedRevenue || undefined,
        burnRate: formData.burnRate || undefined,
        runway: formData.runway || undefined,
        breakEvenTimeline: formData.breakEvenTimeline || undefined,
        pitchDeckStorageId,
        financialModelStorageId,
        businessPlanStorageId,
        productDemoStorageId,
        whyUs: formData.whyUs,
        referralSource: formData.referralSource || undefined,
        exitStrategy: formData.exitStrategy || undefined,
        challenges: formData.challenges || undefined,
        termsAccepted: formData.terms,
      });

      setSubmitStatus("success");
      setApplicationId(result.applicationId);
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error.message || "There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-[#1C4E64] tracking-tight">MUSEDATA</div>
            <div className="hidden md:block text-xs text-gray-500 font-medium tracking-wider uppercase px-3 py-1 bg-gray-100 rounded-full">
              Growth Equity
            </div>
          </div>
          <nav className="flex gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors">
              Home
            </Link>
            <Link href="/portfolio" className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors">
              Portfolio
            </Link>
            <Link href="/apply" className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors">
              Careers
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1C4E64] to-[#0f2942] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 Apply for Funding
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Partner with MUSEDATA
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            We back exceptional founders building the next generation of transformative companies.
            Tell us about your vision.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Application Submitted Successfully!</h3>
                <p className="text-green-700 mb-3">
                  Thank you for your application. Our investment team will review your submission and reach out
                  within 2 weeks.
                </p>
                <p className="text-sm text-green-600">
                  Application ID: <span className="font-mono font-semibold">{applicationId}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Submission Error</h3>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Founder Information */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1C4E64] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Founder Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Founder Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="founderEmail"
                      value={formData.founderEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="john@startup.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="founderPhone"
                      value={formData.founderPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="founderLinkedin"
                      value={formData.founderLinkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Co-Founders (if applicable)
                  </label>
                  <textarea
                    name="coFounders"
                    value={formData.coFounders}
                    onChange={handleInputChange}
                    placeholder="List co-founder names, roles, and backgrounds..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#2D5F73] rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Startup Inc."
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="https://startup.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyLocation"
                      value={formData.companyLocation}
                      onChange={handleInputChange}
                      required
                      placeholder="San Francisco, CA"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Incorporation Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="incorporationStatus"
                    value={formData.incorporationStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] transition-all cursor-pointer"
                  >
                    <option value="">Select status</option>
                    <option value="incorporated">Incorporated</option>
                    <option value="in_progress">In Progress</option>
                    <option value="not_yet">Not Yet Incorporated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Incorporation Country
                  </label>
                  <input
                    type="text"
                    name="incorporationCountry"
                    value={formData.incorporationCountry}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Founded Date</label>
                  <input
                    type="text"
                    name="foundedDate"
                    value={formData.foundedDate}
                    onChange={handleInputChange}
                    placeholder="January 2024"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#3A7A94] rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select industry</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="SaaS">SaaS</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="EdTech">EdTech</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="PropTech">PropTech</option>
                      <option value="Marketplace">Marketplace</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Stage <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select stage</option>
                      <option value="idea">Idea</option>
                      <option value="prototype">Prototype</option>
                      <option value="mvp">MVP</option>
                      <option value="early_revenue">Early Revenue</option>
                      <option value="growth">Growth</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Model <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="businessModel"
                    value={formData.businessModel}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe how your company makes money (e.g., subscription, marketplace fees, licensing)..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Problem Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="problemStatement"
                    value={formData.problemStatement}
                    onChange={handleInputChange}
                    required
                    placeholder="What problem are you solving? Why does it matter?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Solution <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    required
                    placeholder="How does your product/service solve this problem?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unique Value Proposition <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="uniqueValueProposition"
                    value={formData.uniqueValueProposition}
                    onChange={handleInputChange}
                    required
                    placeholder="What makes you different from competitors? What's your unfair advantage?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Market <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleInputChange}
                    required
                    placeholder="Who are your customers? Demographics, psychographics, use cases..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Market Size (TAM/SAM/SOM)</label>
                  <input
                    type="text"
                    name="marketSize"
                    value={formData.marketSize}
                    onChange={handleInputChange}
                    placeholder="TAM: $10B, SAM: $2B, SOM: $200M"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Competitors</label>
                  <textarea
                    name="competitors"
                    value={formData.competitors}
                    onChange={handleInputChange}
                    placeholder="Who are your main competitors? What's the competitive landscape?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Competitive Advantage / Moat</label>
                  <textarea
                    name="competitiveAdvantage"
                    value={formData.competitiveAdvantage}
                    onChange={handleInputChange}
                    placeholder="What's your defensibility? Network effects, proprietary data, patents, switching costs?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Traction & Metrics */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#245167] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Traction & Metrics</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Revenue (MRR/ARR)</label>
                  <input
                    type="text"
                    name="currentRevenue"
                    value={formData.currentRevenue}
                    onChange={handleInputChange}
                    placeholder="$50K MRR / $600K ARR"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Revenue Growth</label>
                  <input
                    type="text"
                    name="revenueGrowth"
                    value={formData.revenueGrowth}
                    onChange={handleInputChange}
                    placeholder="20% MoM or 300% YoY"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Customers</label>
                  <input
                    type="text"
                    name="numberOfCustomers"
                    value={formData.numberOfCustomers}
                    onChange={handleInputChange}
                    placeholder="500 paying customers"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User Metrics</label>
                  <input
                    type="text"
                    name="userMetrics"
                    value={formData.userMetrics}
                    onChange={handleInputChange}
                    placeholder="10K MAU, 70% retention, 5 sessions/week"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Key Milestones & Achievements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="keyMilestones"
                    value={formData.keyMilestones}
                    onChange={handleInputChange}
                    required
                    placeholder="What have you achieved so far? Product launches, partnerships, awards, key hires..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Funding */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1C4E64] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Funding</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Funding Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fundingStage"
                    value={formData.fundingStage}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Select funding stage</option>
                    <option value="pre_seed">Pre-Seed</option>
                    <option value="seed">Seed</option>
                    <option value="series_a">Series A</option>
                    <option value="series_b">Series B</option>
                    <option value="series_c_plus">Series C+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Funding Amount Seeking <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fundingAmount"
                    value={formData.fundingAmount}
                    onChange={handleInputChange}
                    required
                    placeholder="$2M - $5M"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Previous Funding Raised</label>
                  <input
                    type="text"
                    name="previousFunding"
                    value={formData.previousFunding}
                    onChange={handleInputChange}
                    placeholder="$500K pre-seed from angels"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Investors</label>
                  <input
                    type="text"
                    name="currentInvestors"
                    value={formData.currentInvestors}
                    onChange={handleInputChange}
                    placeholder="Y Combinator, angel investors"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Use of Funds <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="useOfFunds"
                    value={formData.useOfFunds}
                    onChange={handleInputChange}
                    required
                    placeholder="How will you use the investment? (hiring, marketing, product development, etc.)"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current/Target Valuation</label>
                  <input
                    type="text"
                    name="valuation"
                    value={formData.valuation}
                    onChange={handleInputChange}
                    placeholder="$15M post-money"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#2D5F73] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Team</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    required
                    placeholder="5 full-time, 2 contractors"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Key Team Members <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="keyTeamMembers"
                    value={formData.keyTeamMembers}
                    onChange={handleInputChange}
                    required
                    placeholder="List key team members, their roles, and relevant backgrounds..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Advisors</label>
                  <textarea
                    name="advisors"
                    value={formData.advisors}
                    onChange={handleInputChange}
                    placeholder="List any advisors and their expertise..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hiring Plans</label>
                  <textarea
                    name="hiringPlans"
                    value={formData.hiringPlans}
                    onChange={handleInputChange}
                    placeholder="What are your key hiring needs over the next 12-18 months?"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Product & Technology */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#3A7A94] rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Product & Technology</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your product, its features, and how it works..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Technology Stack</label>
                  <input
                    type="text"
                    name="technologyStack"
                    value={formData.technologyStack}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, PostgreSQL, AWS..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Intellectual Property</label>
                  <textarea
                    name="intellectualProperty"
                    value={formData.intellectualProperty}
                    onChange={handleInputChange}
                    placeholder="Patents, proprietary technology, trade secrets..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Roadmap</label>
                  <textarea
                    name="productRoadmap"
                    value={formData.productRoadmap}
                    onChange={handleInputChange}
                    placeholder="What's planned for the next 12-24 months?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Go-to-Market */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#245167] rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Go-to-Market Strategy</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Acquisition <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="customerAcquisition"
                    value={formData.customerAcquisition}
                    onChange={handleInputChange}
                    required
                    placeholder="How do you acquire customers? CAC, channels, conversion rates..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sales Strategy <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="salesStrategy"
                    value={formData.salesStrategy}
                    onChange={handleInputChange}
                    required
                    placeholder="Direct sales, self-serve, enterprise, partner-led..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marketing Strategy</label>
                  <textarea
                    name="marketingStrategy"
                    value={formData.marketingStrategy}
                    onChange={handleInputChange}
                    placeholder="Content, paid ads, SEO, PR, events, influencers..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Partnership Strategy</label>
                  <textarea
                    name="partnershipStrategy"
                    value={formData.partnershipStrategy}
                    onChange={handleInputChange}
                    placeholder="Strategic partnerships, distribution channels, integrations..."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Financial Projections */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1C4E64] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Financial Projections</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Projected Revenue (3 years)</label>
                  <input
                    type="text"
                    name="projectedRevenue"
                    value={formData.projectedRevenue}
                    onChange={handleInputChange}
                    placeholder="Y1: $1M, Y2: $5M, Y3: $15M"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Burn Rate</label>
                  <input
                    type="text"
                    name="burnRate"
                    value={formData.burnRate}
                    onChange={handleInputChange}
                    placeholder="$80K/month"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Runway</label>
                  <input
                    type="text"
                    name="runway"
                    value={formData.runway}
                    onChange={handleInputChange}
                    placeholder="18 months"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Break-Even Timeline</label>
                  <input
                    type="text"
                    name="breakEvenTimeline"
                    value={formData.breakEvenTimeline}
                    onChange={handleInputChange}
                    placeholder="Q3 2026"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#2D5F73] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              </div>

              <div className="space-y-6">
                <FileUpload
                  name="pitchDeck"
                  label="Pitch Deck (Required)"
                  required
                  value={formData.pitchDeck}
                  onChange={(file: any) => handleFileChange("pitchDeck", file)}
                />

                <FileUpload
                  name="financialModel"
                  label="Financial Model (Optional)"
                  value={formData.financialModel}
                  onChange={(file: any) => handleFileChange("financialModel", file)}
                />

                <FileUpload
                  name="businessPlan"
                  label="Business Plan (Optional)"
                  value={formData.businessPlan}
                  onChange={(file: any) => handleFileChange("businessPlan", file)}
                />

                <FileUpload
                  name="productDemo"
                  label="Product Demo / Screenshots (Optional)"
                  value={formData.productDemo}
                  onChange={(file: any) => handleFileChange("productDemo", file)}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#3A7A94] rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Why MUSEDATA? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyUs"
                    value={formData.whyUs}
                    onChange={handleInputChange}
                    required
                    placeholder="Why do you want MUSEDATA as your investor? What value beyond capital are you looking for?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How did you hear about us?</label>
                  <input
                    type="text"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    placeholder="Portfolio company, investor referral, conference, etc."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exit Strategy / Vision</label>
                  <textarea
                    name="exitStrategy"
                    value={formData.exitStrategy}
                    onChange={handleInputChange}
                    placeholder="What's your long-term vision? IPO, acquisition, building for the long haul?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Challenges / Risks</label>
                  <textarea
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    placeholder="What are the biggest challenges or risks you're facing?"
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="p-8 md:p-12 bg-white">
              <div className="mb-8">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 mt-0.5 cursor-pointer accent-[#1C4E64] rounded"
                  />
                  <label htmlFor="terms" className="flex-1 text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#1C4E64] hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#1C4E64] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                    . I understand that all information provided will be kept confidential and used solely for
                    investment evaluation purposes. <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 px-8 bg-gradient-to-r from-[#1C4E64] to-[#2D5F73] hover:from-[#163B4F] hover:to-[#245167] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing Application...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Our investment team will review your application and reach out within 2 weeks
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f2942] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-3">MUSEDATA</div>
          <p className="text-white/70 text-sm mb-4">Backing the Next Generation of Transformative Companies</p>
          <div className="flex justify-center gap-6 text-sm">
            <a
              href="mailto:investments@musedata.ai"
              className="text-white/70 hover:text-white transition-colors"
            >
              investments@musedata.ai
            </a>
            <span className="text-white/30">|</span>
            <span className="text-white/70">© 2026 MUSEDATA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}