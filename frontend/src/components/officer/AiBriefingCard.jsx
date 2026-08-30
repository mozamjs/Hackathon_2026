import React, { useState } from 'react';
import { Sparkles, RefreshCw, Bot, CheckCircle, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';
import aiService from '../../services/aiService';
import useToast from '../../hooks/useToast';

export const AiBriefingCard = () => {
  const { error, success } = useToast();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const res = await aiService.getOfficerSummary();
      if (res?.data?.summary) {
        setBriefing(res.data.summary);
        setGeneratedAt(new Date().toLocaleTimeString());
        success('AI Executive Briefing generated successfully.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to generate AI briefing. Ensure GEMINI_API_KEY is configured.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      {/* Ambient background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                Gemini AI Operational Briefing
              </h3>
              <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated operational insights without citizen PII
            </p>
          </div>
        </div>

        <Button
          onClick={generateBriefing}
          loading={loading}
          variant="primary"
          size="sm"
          icon={Sparkles}
        >
          {briefing ? 'Regenerate Briefing' : 'Generate AI Briefing'}
        </Button>
      </div>

      <div className="pt-5 relative">
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-sm font-medium text-slate-700">
              Analyzing municipal telemetry with Gemini AI...
            </p>
            <p className="text-xs text-slate-500">Synthesizing high priority areas and dispatch bottlenecks</p>
          </div>
        )}

        {!loading && !briefing && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Sparkles className="mb-2 h-10 w-10 text-primary-600 opacity-80" />
            <h4 className="text-sm font-semibold text-slate-800">Daily Executive Summary</h4>
            <p className="mt-1 mb-4 max-w-md text-xs text-slate-600">
              Click the button above to generate a 3-5 sentence intelligent synthesis of active city bottlenecks, high-priority clusters, and resolution velocity.
            </p>
            <Button
              onClick={generateBriefing}
              variant="outline"
              size="sm"
              icon={Sparkles}
            >
              Generate Now
            </Button>
          </div>
        )}

        {!loading && briefing && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {briefing}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Computed from latest live database telemetry</span>
              </span>
              {generatedAt && (
                <span className="font-mono text-slate-500">
                  Generated at {generatedAt}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiBriefingCard;
