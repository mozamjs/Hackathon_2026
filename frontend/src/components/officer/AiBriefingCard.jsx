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
    <div className="glass-card rounded-2xl p-6 border border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/40 relative overflow-hidden shadow-2xl shadow-brand-950/50">
      {/* Ambient background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Gemini AI Operational Briefing
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400">
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
            <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
            <p className="text-sm font-medium text-slate-300">
              Analyzing municipal telemetry with Gemini AI...
            </p>
            <p className="text-xs text-slate-500">Synthesizing high priority areas and dispatch bottlenecks</p>
          </div>
        )}

        {!loading && !briefing && (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <Sparkles className="w-10 h-10 text-brand-400 mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-200">Daily Executive Summary</h4>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
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
            <div className="p-4 rounded-xl bg-slate-950/80 border border-brand-500/20 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {briefing}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
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
