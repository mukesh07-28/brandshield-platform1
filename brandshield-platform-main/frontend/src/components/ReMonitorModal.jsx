import { useState } from "react";
import {
  X,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Search,
} from "lucide-react";

export const ReMonitor = ({ threat, companyId, onClose }) => {
  const [newHandle, setNewHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!threat) return null;

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!newHandle.trim()) return;

    setLoading(true);
    setResult(null);

    /*
     * Backend re-monitoring API can be connected here later.
     *
     * Current version uses local intelligence simulation so the
     * complete re-monitoring flow works during the hackathon demo.
     */

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const normalizedInput = newHandle.toLowerCase();

    const isSimilar =
      normalizedInput.includes("kampus") ||
      normalizedInput.includes("support") ||
      normalizedInput.includes("official") ||
      normalizedInput.includes("help");

    const similarityScore = isSimilar ? 92.4 : 24.1;

    setResult({
      reappearance_detected: isSimilar,
      old_name: threat.name || "Previous Threat",
      new_name: newHandle.trim(),
      similarity_score: similarityScore,
      message: isSimilar
        ? "Reappearance Detected! Actor created a slight variation of the previously detected threat signature."
        : "Low similarity. The new identity does not strongly match the previous threat signature.",
    });

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-2xl border border-cyan-500/30 bg-[#0b111b]/95 shadow-[0_0_50px_rgba(6,182,212,0.12)] p-6 relative overflow-hidden">
        {/* Top scan line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <RefreshCw
              className={`w-6 h-6 ${loading ? "animate-spin" : ""}`}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Re-Monitoring Intelligence Engine
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Testing actor reincarnation against previously detected threat:
              <span className="text-cyan-300 font-mono ml-1">
                {threat.name}
              </span>
            </p>
          </div>
        </div>

        {/* Previous Threat Context */}
        <div className="mb-5 rounded-xl border border-slate-800 bg-[#070b12] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              Previous Threat
            </span>

            <span className="text-[10px] font-mono text-red-400">
              {threat.severity || "HIGH"}
            </span>
          </div>

          <div className="text-sm font-semibold text-white">
            {threat.name}
          </div>

          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Risk Score: {threat.risk_score ?? "--"}%
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheck} className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
              Enter Suspicious New Handle / Name to Compare
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="@kampusvc_support1 or Kampuss Official"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                className="flex-1 bg-[#07090E] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none font-mono transition"
              />

              <button
                type="submit"
                disabled={loading || !newHandle.trim()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}

                {loading ? "Checking..." : "Run Check"}
              </button>
            </div>
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div
            className={`p-4 rounded-xl border ${
              result.reappearance_detected
                ? "bg-red-500/10 border-red-500/40"
                : "bg-emerald-500/10 border-emerald-500/40"
            }`}
          >
            {/* Result Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {result.reappearance_detected ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}

              <span
                className={`text-sm font-bold uppercase font-mono ${
                  result.reappearance_detected
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {result.reappearance_detected
                  ? "REAPPEARANCE DETECTED!"
                  : "SAFE / LOW SIMILARITY"}
              </span>

              <span className="text-xs font-mono ml-auto text-slate-300">
                Similarity:{" "}
                <span
                  className={
                    result.reappearance_detected
                      ? "text-red-300"
                      : "text-emerald-300"
                  }
                >
                  {result.similarity_score}%
                </span>
              </span>
            </div>

            {/* Explanation */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.message}
            </p>

            {/* Comparison */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block mb-1">
                  ORIGINAL THREAT
                </span>

                <span className="text-white">
                  {result.old_name}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">
                  NEW INPUT
                </span>

                <span className="text-cyan-300 break-all">
                  {result.new_name}
                </span>
              </div>
            </div>

            {/* Action hint */}
            {result.reappearance_detected && (
              <div className="mt-4 rounded-lg bg-red-500/5 border border-red-500/20 px-3 py-2">
                <p className="text-[11px] text-red-300">
                  ⚠️ Previous threat signature detected again. Recommended:
                  investigate the new asset and add it to the active threat
                  monitoring queue.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between text-[10px] font-mono text-slate-600">
          <span>RE-MONITOR ENGINE</span>
          <span>THREAT SIGNATURE ANALYSIS</span>
        </div>
      </div>
    </div>
  );
};

export default ReMonitor;