"use client";

import * as React from "react";
import { Send, CheckCircle2, Sparkles, Building2, Mail, User, MessageSquare } from "lucide-react";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [topic, setTopic] = React.useState("Enterprise Deployment");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate fast enterprise submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-4 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-white">Message Dispatched</h4>
        <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
          Thank you, <span className="text-emerald-400 font-semibold">{name}</span>. Our enterprise solutions architecture team will contact you at <span className="font-mono text-emerald-300">{email}</span> within 2 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 pt-2 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="CyberTech Global"
              className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Area of Interest
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none transition cursor-pointer"
          >
            <option value="Enterprise Deployment">Enterprise Multi-Tenant Deployment</option>
            <option value="AI Governance">AI Agent Governance & Approvals</option>
            <option value="Jira to CoreSync Migration">Jira to CoreSync Migration</option>
            <option value="Custom Pricing & SLA">Custom Pricing & SOC2 SLA</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-300 mb-1.5">
          Message
        </label>
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your team size, current workflow tools, and any specific AI governance requirements..."
            className="w-full bg-[#16171D] border border-white/10 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] text-white font-medium py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] disabled:opacity-50 cursor-pointer"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending Inquiry...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Contact Enterprise Team
          </span>
        )}
      </button>
    </form>
  );
}
