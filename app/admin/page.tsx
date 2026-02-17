"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
  Users, Building2, FileText, TrendingUp, ChevronRight,
  X, Download, ExternalLink, Star, Clock, CheckCircle2,
  XCircle, AlertCircle, Search, Filter, BarChart3, Mail,
  Phone, MapPin, Linkedin, Globe, DollarSign, Calendar,
  Briefcase, ChevronDown, Eye
} from "lucide-react";

// ─── Admin whitelist (mirrors Convex backend) ───────────────────────────────
const ADMIN_EMAILS = ["collin@musedata.ai", "nursan2007@gmail.com"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const JOB_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted:    { label: "Submitted",    color: "text-sky-400",    bg: "bg-sky-400/10" },
  under_review: { label: "Under Review", color: "text-amber-400",  bg: "bg-amber-400/10" },
  interviewing: { label: "Interviewing", color: "text-violet-400", bg: "bg-violet-400/10" },
  accepted:     { label: "Accepted",     color: "text-emerald-400",bg: "bg-emerald-400/10" },
  rejected:     { label: "Rejected",     color: "text-rose-400",   bg: "bg-rose-400/10" },
};

const STARTUP_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted:    { label: "Submitted",     color: "text-sky-400",    bg: "bg-sky-400/10" },
  under_review: { label: "Under Review",  color: "text-amber-400",  bg: "bg-amber-400/10" },
  due_diligence:{ label: "Due Diligence", color: "text-violet-400", bg: "bg-violet-400/10" },
  term_sheet:   { label: "Term Sheet",    color: "text-orange-400", bg: "bg-orange-400/10" },
  funded:       { label: "Funded",        color: "text-emerald-400",bg: "bg-emerald-400/10" },
  rejected:     { label: "Rejected",      color: "text-rose-400",   bg: "bg-rose-400/10" },
  on_hold:      { label: "On Hold",       color: "text-zinc-400",   bg: "bg-zinc-400/10" },
};

function StatusBadge({ status, type }: { status: string; type: "job" | "startup" }) {
  const cfg = type === "job" ? JOB_STATUS_CONFIG[status] : STARTUP_STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

// ─── Document button ─────────────────────────────────────────────────────────
function DocButton({ storageId, label }: { storageId: Id<"_storage">; label: string }) {
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  const open = async () => {
    setLoading(true);
    try {
      const url = await convex.query(api.admin.getFileUrl, { storageId });
      if (url) window.open(url, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={open}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4AADCF]/50 text-sm text-zinc-300 hover:text-white transition-all group"
    >
      <FileText className="w-4 h-4 text-[#4AADCF] group-hover:scale-110 transition-transform" />
      {loading ? "Opening…" : label}
      <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
    </button>
  );
}

// ─── Job Application Drawer ───────────────────────────────────────────────────
function JobDrawer({ id, onClose }: { id: Id<"jobApplications">; onClose: () => void }) {
  const app = useQuery(api.admin.getJobApplication, { applicationId: id });
  const updateStatus = useMutation(api.admin.updateJobStatus);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (status: string) => {
    setSaving(true);
    await updateStatus({ applicationId: id, status: status as any, reviewNotes: notes || undefined });
    setSaving(false);
  };

  if (!app) return (
    <DrawerShell onClose={onClose}>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4AADCF] border-t-transparent rounded-full animate-spin" />
      </div>
    </DrawerShell>
  );

  return (
    <DrawerShell onClose={onClose}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{app.fullName}</h2>
            <p className="text-zinc-400 mt-1">{app.currentRole}</p>
          </div>
          <StatusBadge status={app.status} type="job" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{app.email}</span>
          {app.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{app.phone}</span>}
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{app.location}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Submitted {fmt(app.submittedAt)}</span>
        </div>
        {(app.linkedin || app.portfolio) && (
          <div className="flex gap-3 mt-4">
            {app.linkedin && (
              <a href={app.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {app.portfolio && (
              <a href={app.portfolio} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
        {/* Documents */}
        <Section title="Documents">
          <div className="flex flex-wrap gap-3">
            <DocButton storageId={app.resumeStorageId} label="Resume / CV" />
            {app.coverLetterStorageId && (
              <DocButton storageId={app.coverLetterStorageId} label="Cover Letter" />
            )}
          </div>
        </Section>

        {/* Role Info */}
        <Section title="Role">
          <Grid2>
            <Field label="Position" value={app.position} />
            <Field label="Experience" value={app.experience} />
          </Grid2>
        </Section>

        {/* Motivation */}
        <Section title="Why MUSEDATA">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{app.motivation}</p>
        </Section>

        {/* Skills */}
        <Section title="Skills & Technologies">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{app.skills}</p>
        </Section>

        {/* Review Notes */}
        <Section title="Review Notes">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Internal notes (visible to admins only)…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/60 resize-none min-h-[100px]"
          />
          {app.reviewNotes && (
            <p className="text-xs text-zinc-500 mt-2">Previous note: {app.reviewNotes}</p>
          )}
        </Section>

        {/* Status Actions */}
        <Section title="Update Status">
          <div className="flex flex-wrap gap-2">
            {(["under_review","interviewing","accepted","rejected"] as const).map(s => (
              <button key={s} onClick={() => save(s)} disabled={saving || app.status === s}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  app.status === s
                    ? "border-[#4AADCF] text-[#4AADCF] bg-[#4AADCF]/10 cursor-default"
                    : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5"
                }`}>
                {JOB_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </DrawerShell>
  );
}

// ─── Startup Application Drawer ───────────────────────────────────────────────
function StartupDrawer({ id, onClose }: { id: Id<"startupApplications">; onClose: () => void }) {
  const app = useQuery(api.admin.getStartupApplication, { applicationId: id });
  const updateStatus = useMutation(api.admin.updateStartupStatus);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const save = async (status: string) => {
    setSaving(true);
    await updateStatus({
      applicationId: id,
      status: status as any,
      reviewNotes: notes || undefined,
      internalRating: rating || undefined,
    });
    setSaving(false);
  };

  if (!app) return (
    <DrawerShell onClose={onClose}>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4AADCF] border-t-transparent rounded-full animate-spin" />
      </div>
    </DrawerShell>
  );

  return (
    <DrawerShell onClose={onClose}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{app.companyName}</h2>
            <p className="text-zinc-400 mt-0.5">Founded by {app.founderName}</p>
          </div>
          <StatusBadge status={app.status} type="startup" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-4">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{app.founderEmail}</span>
          {app.founderPhone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{app.founderPhone}</span>}
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{app.companyLocation}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Submitted {fmt(app.submittedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag>{app.industry}</Tag>
          <Tag>{app.stage.replace("_"," ")}</Tag>
          <Tag>{app.fundingStage.replace(/_/g," ")}</Tag>
          <Tag color="emerald">{app.fundingAmount}</Tag>
          {app.internalRating && <Tag color="amber">★ {app.internalRating}/10</Tag>}
        </div>
        <div className="flex gap-3 mt-4">
          {app.founderLinkedin && (
            <a href={app.founderLinkedin} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
          {app.companyWebsite && (
            <a href={app.companyWebsite} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors">
              <Globe className="w-4 h-4" /> Website
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
        {/* Documents */}
        <Section title="Documents">
          <div className="flex flex-wrap gap-3">
            <DocButton storageId={app.pitchDeckStorageId} label="Pitch Deck" />
            {app.financialModelStorageId && <DocButton storageId={app.financialModelStorageId} label="Financial Model" />}
            {app.businessPlanStorageId && <DocButton storageId={app.businessPlanStorageId} label="Business Plan" />}
            {app.productDemoStorageId && <DocButton storageId={app.productDemoStorageId} label="Product Demo" />}
          </div>
        </Section>

        {/* Business */}
        <Section title="Business">
          <div className="space-y-4">
            <Field label="Problem" value={app.problemStatement} long />
            <Field label="Solution" value={app.solution} long />
            <Field label="Unique Value Proposition" value={app.uniqueValueProposition} long />
            <Field label="Business Model" value={app.businessModel} long />
            <Field label="Target Market" value={app.targetMarket} long />
            {app.marketSize && <Field label="Market Size (TAM/SAM/SOM)" value={app.marketSize} />}
          </div>
        </Section>

        {/* Traction */}
        <Section title="Traction">
          <Grid2>
            {app.currentRevenue && <Field label="Revenue" value={app.currentRevenue} />}
            {app.revenueGrowth && <Field label="Growth" value={app.revenueGrowth} />}
            {app.numberOfCustomers && <Field label="Customers" value={app.numberOfCustomers} />}
            {app.userMetrics && <Field label="User Metrics" value={app.userMetrics} />}
          </Grid2>
          <Field label="Key Milestones" value={app.keyMilestones} long />
        </Section>

        {/* Funding */}
        <Section title="Funding">
          <Grid2>
            <Field label="Asking" value={app.fundingAmount} />
            {app.valuation && <Field label="Valuation" value={app.valuation} />}
            {app.previousFunding && <Field label="Previous Funding" value={app.previousFunding} />}
            {app.currentInvestors && <Field label="Current Investors" value={app.currentInvestors} />}
            {app.burnRate && <Field label="Burn Rate" value={app.burnRate} />}
            {app.runway && <Field label="Runway" value={app.runway} />}
          </Grid2>
          <Field label="Use of Funds" value={app.useOfFunds} long />
          {app.projectedRevenue && <Field label="Revenue Projections" value={app.projectedRevenue} long />}
        </Section>

        {/* Team */}
        <Section title="Team">
          <Grid2>
            <Field label="Team Size" value={app.teamSize} />
            <Field label="Incorporation" value={app.incorporationStatus.replace("_"," ")} />
          </Grid2>
          <Field label="Key Members" value={app.keyTeamMembers} long />
          {app.coFounders && <Field label="Co-Founders" value={app.coFounders} long />}
          {app.advisors && <Field label="Advisors" value={app.advisors} long />}
        </Section>

        {/* Product */}
        <Section title="Product & Technology">
          <Field label="Product" value={app.productDescription} long />
          {app.technologyStack && <Field label="Tech Stack" value={app.technologyStack} />}
          {app.intellectualProperty && <Field label="IP / Patents" value={app.intellectualProperty} long />}
          {app.productRoadmap && <Field label="Roadmap" value={app.productRoadmap} long />}
        </Section>

        {/* GTM */}
        <Section title="Go-to-Market">
          <Field label="Customer Acquisition" value={app.customerAcquisition} long />
          <Field label="Sales Strategy" value={app.salesStrategy} long />
          {app.marketingStrategy && <Field label="Marketing" value={app.marketingStrategy} long />}
          {app.competitiveAdvantage && <Field label="Moat / Competitive Advantage" value={app.competitiveAdvantage} long />}
          {app.competitors && <Field label="Competitors" value={app.competitors} long />}
        </Section>

        {/* Additional */}
        <Section title="Additional">
          <Field label="Why MUSEDATA" value={app.whyUs} long />
          {app.exitStrategy && <Field label="Exit Strategy" value={app.exitStrategy} long />}
          {app.challenges && <Field label="Challenges / Risks" value={app.challenges} long />}
          {app.referralSource && <Field label="Referred By" value={app.referralSource} />}
        </Section>

        {/* Rating + Notes */}
        <Section title="Internal Review">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Rating (1–10)</p>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} onClick={() => setRating(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                      rating === n
                        ? "bg-[#4AADCF] text-white"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
              {app.internalRating && <p className="text-xs text-zinc-600 mt-1">Previous rating: {app.internalRating}/10</p>}
            </div>
            <div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Investment thesis, concerns, next steps…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/60 resize-none min-h-[100px]"
              />
              {app.reviewNotes && <p className="text-xs text-zinc-500 mt-1">Previous: {app.reviewNotes}</p>}
            </div>
          </div>
        </Section>

        {/* Status Actions */}
        <Section title="Move to Stage">
          <div className="flex flex-wrap gap-2">
            {(["under_review","due_diligence","term_sheet","funded","rejected","on_hold"] as const).map(s => (
              <button key={s} onClick={() => save(s)} disabled={saving || app.status === s}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  app.status === s
                    ? "border-[#4AADCF] text-[#4AADCF] bg-[#4AADCF]/10 cursor-default"
                    : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5"
                }`}>
                {STARTUP_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </DrawerShell>
  );
}

// ─── Shared Drawer Shell ──────────────────────────────────────────────────────
function DrawerShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-2xl bg-[#0d1117] border-l border-white/10 flex flex-col h-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 pt-6 pb-4">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Application Detail</span>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, value, long }: { label: string; value?: string | null; long?: boolean }) {
  if (!value) return null;
  return (
    <div className={long ? "" : ""}>
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      {long
        ? <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{value}</p>
        : <p className="text-sm font-medium text-white">{value}</p>
      }
    </div>
  );
}

function Tag({ children, color = "zinc" }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    zinc:    "bg-white/5 text-zinc-400 border-white/10",
    emerald: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    amber:   "bg-amber-400/10 text-amber-400 border-amber-400/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cls[color] ?? cls.zinc}`}>
      {children}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent = false }:
  { label: string; value: number | string; sub?: string; icon: any; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent
      ? "bg-[#1C4E64]/20 border-[#4AADCF]/30"
      : "bg-white/[0.03] border-white/8"}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
        <Icon className={`w-4 h-4 ${accent ? "text-[#4AADCF]" : "text-zinc-600"}`} />
      </div>
      <p className={`text-3xl font-bold ${accent ? "text-[#4AADCF]" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [tab, setTab] = useState<"startups" | "jobs">("startups");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<Id<"jobApplications"> | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Id<"startupApplications"> | null>(null);

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#4AADCF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-2xl font-bold text-white mb-2">MUSEDATA</p>
            <p className="text-zinc-500 text-sm">Admin Portal — Sign in to continue</p>
          </div>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  if (!ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-zinc-500 text-sm max-w-sm">
            Your account <span className="text-zinc-300">{userEmail}</span> is not authorized to access this portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c10] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Load DM Sans */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-[#0d1117] border-r border-white/8 flex flex-col z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/8">
          <p className="text-lg font-bold text-white tracking-tight">MUSEDATA</p>
          <p className="text-xs text-zinc-500 mt-0.5">Admin Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem icon={Building2} label="Startup Applications" active={tab === "startups"} onClick={() => { setTab("startups"); setStatusFilter(""); }} />
          <NavItem icon={Users} label="Job Applications" active={tab === "jobs"} onClick={() => { setTab("jobs"); setStatusFilter(""); }} />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C4E64] flex items-center justify-center text-xs font-bold text-[#4AADCF]">
              {user.firstName?.[0] ?? userEmail[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.firstName ?? "Admin"}</p>
              <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 flex flex-col min-h-screen">
        {tab === "startups"
          ? <StartupsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedStartup} />
          : <JobsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedJob} />
        }
      </div>

      {/* Drawers */}
      {selectedJob && <JobDrawer id={selectedJob} onClose={() => setSelectedJob(null)} />}
      {selectedStartup && <StartupDrawer id={selectedStartup} onClose={() => setSelectedStartup(null)} />}
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-[#1C4E64]/40 text-[#4AADCF] border border-[#4AADCF]/20"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      }`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </button>
  );
}

// ─── Startups View ────────────────────────────────────────────────────────────
function StartupsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }:
  { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"startupApplications">) => void }) {

  const apps = useQuery(api.admin.listStartupApplications,
    statusFilter ? { status: statusFilter as any } : {}
  );
  const stats = useQuery(api.admin.getDashboardStats);

  const filtered = (apps ?? []).filter(a =>
    !search || a.companyName.toLowerCase().includes(search.toLowerCase()) ||
    a.founderName.toLowerCase().includes(search.toLowerCase()) ||
    a.founderEmail.toLowerCase().includes(search.toLowerCase())
  );

  const startupStatuses = ["submitted","under_review","due_diligence","term_sheet","funded","rejected","on_hold"];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Startup Applications</h1>
            <p className="text-zinc-500 text-sm mt-1">{stats?.startups.total ?? "—"} total · {stats?.startups.recent ?? "—"} this week</p>
          </div>
        </div>

        {/* Stats strip */}
        {stats && (
          <div className="grid grid-cols-7 gap-3 mb-6">
            {Object.entries(stats.startups.byStatus).map(([s, n]) => {
              const cfg = STARTUP_STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
                  className={`rounded-xl p-3 border text-center transition-all ${
                    statusFilter === s ? "border-[#4AADCF]/50 bg-[#1C4E64]/20" : "border-white/8 bg-white/[0.02] hover:bg-white/5"
                  }`}>
                  <p className={`text-xl font-bold ${cfg.color}`}>{n as number}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 capitalize">{s.replace("_"," ")}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search company, founder, email…"
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#080c10]/90 backdrop-blur-sm">
            <tr className="border-b border-white/8">
              {["Company","Founder","Industry","Stage","Funding","Status","Rating","Date"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {!apps && <tr><td colSpan={9} className="px-5 py-16 text-center text-zinc-600">Loading…</td></tr>}
            {apps && filtered.length === 0 && <tr><td colSpan={9} className="px-5 py-16 text-center text-zinc-600">No applications found</td></tr>}
            {filtered.map(a => (
              <tr key={a._id} onClick={() => onSelect(a._id)}
                className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors group">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-white group-hover:text-[#4AADCF] transition-colors">{a.companyName}</p>
                  <p className="text-xs text-zinc-500">{a.companyLocation}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-zinc-300">{a.founderName}</p>
                  <p className="text-xs text-zinc-500">{a.founderEmail}</p>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-400">{a.industry}</td>
                <td className="px-5 py-4 text-sm text-zinc-400 capitalize">{a.stage.replace("_"," ")}</td>
                <td className="px-5 py-4 text-sm font-medium text-emerald-400">{a.fundingAmount}</td>
                <td className="px-5 py-4"><StatusBadge status={a.status} type="startup" /></td>
                <td className="px-5 py-4 text-sm text-amber-400">{a.internalRating ? `★ ${a.internalRating}` : <span className="text-zinc-700">—</span>}</td>
                <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">{fmt(a.submittedAt)}</td>
                <td className="px-5 py-4"><Eye className="w-4 h-4 text-zinc-700 group-hover:text-[#4AADCF] transition-colors" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Jobs View ────────────────────────────────────────────────────────────────
function JobsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }:
  { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"jobApplications">) => void }) {

  const apps = useQuery(api.admin.listJobApplications,
    statusFilter ? { status: statusFilter as any } : {}
  );
  const stats = useQuery(api.admin.getDashboardStats);

  const filtered = (apps ?? []).filter(a =>
    !search || a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Applications</h1>
            <p className="text-zinc-500 text-sm mt-1">{stats?.jobs.total ?? "—"} total · {stats?.jobs.recent ?? "—"} this week</p>
          </div>
        </div>

        {/* Stats strip */}
        {stats && (
          <div className="grid grid-cols-5 gap-3 mb-6">
            {Object.entries(stats.jobs.byStatus).map(([s, n]) => {
              const cfg = JOB_STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
                  className={`rounded-xl p-3 border text-center transition-all ${
                    statusFilter === s ? "border-[#4AADCF]/50 bg-[#1C4E64]/20" : "border-white/8 bg-white/[0.02] hover:bg-white/5"
                  }`}>
                  <p className={`text-xl font-bold ${cfg.color}`}>{n as number}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 capitalize">{s.replace("_"," ")}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, position…"
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#080c10]/90 backdrop-blur-sm">
            <tr className="border-b border-white/8">
              {["Applicant","Position","Experience","Location","Status","Date"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-widest">{h}</th>
              ))}
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {!apps && <tr><td colSpan={7} className="px-5 py-16 text-center text-zinc-600">Loading…</td></tr>}
            {apps && filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-16 text-center text-zinc-600">No applications found</td></tr>}
            {filtered.map(a => (
              <tr key={a._id} onClick={() => onSelect(a._id)}
                className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors group">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-white group-hover:text-[#4AADCF] transition-colors">{a.fullName}</p>
                  <p className="text-xs text-zinc-500">{a.email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-300 capitalize">{a.position}</td>
                <td className="px-5 py-4 text-sm text-zinc-400">{a.experience} yrs</td>
                <td className="px-5 py-4 text-sm text-zinc-400">{a.location}</td>
                <td className="px-5 py-4"><StatusBadge status={a.status} type="job" /></td>
                <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">{fmt(a.submittedAt)}</td>
                <td className="px-5 py-4"><Eye className="w-4 h-4 text-zinc-700 group-hover:text-[#4AADCF] transition-colors" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}