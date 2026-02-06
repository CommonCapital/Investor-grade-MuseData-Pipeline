"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { FileUpload } from "./components/ui/file-upload-component";
import { User, Mail, Phone, MapPin, Briefcase, Award, Linkedin, Globe, Target, Lightbulb, Code } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  experience: string;
  linkedin: string;
  portfolio: string;
  position: string;
  motivation: string;
  skills: string;
  resume: File | null;
  coverLetter: File | null;
  terms: boolean;
}

export default function ApplyPageImproved() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    experience: "",
    linkedin: "",
    portfolio: "",
    position: "",
    motivation: "",
    skills: "",
    resume: null,
    coverLetter: null,
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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

  const handleFileChange = (field: "resume" | "coverLetter", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      currentRole: "",
      experience: "",
      linkedin: "",
      portfolio: "",
      position: "",
      motivation: "",
      skills: "",
      resume: null,
      coverLetter: null,
      terms: false,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus("success");
      alert(
        "Application submitted successfully! You will receive a confirmation email shortly and can track your application status through the MUSEDATA platform."
      );
      resetForm();
    } catch (error) {
      setSubmitStatus("error");
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-[#1C4E64] tracking-tight">
              MUSEDATA
            </div>
            <div className="hidden md:block text-xs text-gray-500 font-medium tracking-wider uppercase px-3 py-1 bg-gray-100 rounded-full">
              Growth Equity
            </div>
          </div>
          <nav className="flex gap-8">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#services"
              className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-[#1C4E64] font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1C4E64] to-[#0f2942] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 Now Hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Join MUSEDATA
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Be part of our unified platform for sourcing, hiring, and monitoring. 
            We're building the future of institutional-grade finance infrastructure.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1C4E64] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="jane@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
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
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Country"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#2D5F73] rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Professional Background
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Role / Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] transition-all cursor-pointer"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1C4E64] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#3A7A94] rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position of Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Select a position</option>
                    <option value="finance">Finance</option>
                    <option value="investment">Investment</option>
                    <option value="engineering">Engineering</option>
                    <option value="analytics">Analytics</option>
                    <option value="operations">Operations</option>
                    <option value="advisory">Advisory</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Why MUSEDATA? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us what excites you about joining MUSEDATA and how you'd contribute to our unified platform..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[140px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Key Skills & Technologies <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    placeholder="List your top skills, technologies, and areas of expertise..."
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 min-h-[140px] resize-y focus:outline-none focus:border-[#1C4E64] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="p-8 md:p-12 bg-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#245167] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Documents
                </h2>
              </div>

              <FileUpload
                name="resume"
                label="Resume / CV"
                required
                value={formData.resume}
                onChange={(file: any) => handleFileChange("resume", file)}
              />

              <FileUpload
                name="coverLetter"
                label="Cover Letter (Optional)"
                value={formData.coverLetter}
                onChange={(file: any) => handleFileChange("coverLetter", file)}
              />
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
                    . I understand that my application data will be stored and processed through the
                    MUSEDATA platform. <span className="text-red-500">*</span>
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                We'll review your application and get back to you within 5 business days
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-[#0f2942] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-3">MUSEDATA</div>
          <p className="text-white/70 text-sm mb-4">
            Institutional-Grade Finance Infrastructure
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="mailto:partners@musedata.ai" className="text-white/70 hover:text-white transition-colors">
              partners@musedata.ai
            </a>
            <span className="text-white/30">|</span>
            <span className="text-white/70">© 2026 MUSEDATA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}