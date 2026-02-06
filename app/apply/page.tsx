"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { FileUpload } from "./components/ui/file-upload-component";

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
      // Simulate API call - replace with actual API endpoint
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-8 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-600 font-medium tracking-wide">
            Growth Equity
          </div>
          <div className="text-base font-bold uppercase tracking-wider text-gray-900">
            MUSEDATA
          </div>
          <nav className="flex gap-6 md:gap-8">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              What We Do
            </Link>
            <Link
              href="#services"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[800px] mx-auto px-6 md:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
            Join MUSEDATA
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-[600px] mx-auto">
            Apply to be part of our unified platform for sourcing, hiring, and monitoring.
            All operations live on one platform.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-12">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Personal Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Email Address <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Location <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, Country"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Professional Background
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Current Role / Title <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Years of Experience <span className="text-blue-600">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
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
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Application Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Position of Interest <span className="text-blue-600">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
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
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Why MUSEDATA? <span className="text-blue-600">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us what excites you about joining MUSEDATA and how you'd contribute to our unified platform..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 min-h-[120px] resize-y focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-2 font-medium">
                    Key Skills & Technologies <span className="text-blue-600">*</span>
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    placeholder="List your top skills, technologies, and areas of expertise..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-900 min-h-[120px] resize-y focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Documents
              </h2>

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

            {/* Terms & Conditions */}
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                  className="w-[18px] h-[18px] mt-1 cursor-pointer accent-blue-600"
                />
                <label htmlFor="terms" className="flex-1 text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  . I understand that my application data will be stored and processed through the
                  MUSEDATA platform. <span className="text-blue-600">*</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
            >
              {isSubmitting ? "Processing..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-12 px-8 border-t border-gray-200 mt-24">
        <p className="text-sm text-gray-600">
          © 2026 MUSEDATA. All rights reserved. |{" "}
          <a href="mailto:partners@musedata.ai" className="text-blue-600 hover:underline">
            partners@musedata.ai
          </a>
        </p>
      </footer>
    </div>
  );
}