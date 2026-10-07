import { useState } from "react";
import {
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  X,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import { BrandShieldAPI } from "../services/api";

export default function ReMonitorModal({
  threat,
  companyId = 1,
  onClose,
}) {
  const [newHandle, setNewHandle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!threat) {
    return null;
  }

  const handleReMonitor = async () => {
    setError("");
    setResult(null);

    const name = newHandle.trim();
    const url = newUrl.trim();

    if (!name) {
      setError("Please enter the new account or app name.");
      return;
    }

    if (!url) {
      setError("Please enter the new URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response =
        await BrandShieldAPI.checkReappearance(
          companyId,
          threat.id,
          name,
          url
        );

      if (!response) {
        throw new Error(
          "Unable to perform re-monitoring."
        );
      }

      setResult(response);
    } catch (err) {
      console.error(
        "Re-monitoring failed:",
        err
      );

      setError(
        err?.message ||
          "Re-monitoring failed. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const similarity = result?.similarity || {};

  const previousSimilarity = Number(
    similarity.previous_threat_similarity || 0
  );

  const brandSimilarity = Number(
    similarity.brand_similarity || 0
  );

  const detected =
    result?.reappearance_detected === true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#071016] shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <RefreshCw
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Re-Monitor Threat
              </h2>

              <p className="text-xs text-gray-500">
                Detect possible reappearance of a removed threat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            ORIGINAL THREAT
        ================================================= */}

        <div className="border-b border-white/10 px-6 py-5">
          <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-gray-500">
            Original Threat
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {threat.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {threat.platform ||
                    threat.source_type ||
                    "Unknown source"}
                </p>
              </div>

              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[10px] font-semibold text-red-300">
                {threat.severity || "Unknown"}
              </span>
            </div>

            {threat.url && (
              <div className="mt-3 flex items-start gap-2">
                <ExternalLink
                  size={13}
                  className="mt-0.5 shrink-0 text-gray-600"
                />

                <p className="break-all text-xs text-gray-500">
                  {threat.url}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        {!result && (
          <div className="px-6 py-5">
            <div className="mb-5">
              <p className="mb-1 text-sm font-medium text-white">
                Check a new suspicious asset
              </p>

              <p className="text-xs leading-5 text-gray-500">
                Enter the newly discovered account/app name
                and its public URL. BrandShield will compare it
                with the previous threat and the protected brand.
              </p>
            </div>

            {/* NAME */}

            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-gray-400">
                New Account / App Name
              </label>

              <input
                type="text"
                value={newHandle}
                onChange={(event) =>
                  setNewHandle(event.target.value)
                }
                placeholder="Example: KampusVC Support 1"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
              />
            </div>

            {/* URL */}

            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-gray-400">
                New Public URL
              </label>

              <input
                type="text"
                value={newUrl}
                onChange={(event) =>
                  setNewUrl(event.target.value)
                }
                placeholder="https://instagram.com/kampusvc_support1"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-xs text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* BUTTON */}

            <button
              onClick={handleReMonitor}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Analyzing Reappearance...
                </>
              ) : (
                <>
                  <RefreshCw size={17} />
                  Run Re-Monitoring
                </>
              )}
            </button>
          </div>
        )}

        {/* =================================================
            RESULT
        ================================================= */}

        {result && (
          <div className="px-6 py-5">
            {/* DETECTION STATUS */}

            <div
              className={`mb-5 rounded-2xl border p-5 ${
                detected
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-green-500/20 bg-green-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                {detected ? (
                  <AlertTriangle
                    size={22}
                    className="mt-0.5 shrink-0 text-red-400"
                  />
                ) : (
                  <CheckCircle2
                    size={22}
                    className="mt-0.5 shrink-0 text-green-400"
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      detected
                        ? "text-red-300"
                        : "text-green-300"
                    }`}
                  >
                    {detected
                      ? "Possible Threat Reappearance Detected"
                      : "No Strong Reappearance Detected"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    {detected
                      ? "The new asset has significant similarity with the previous threat or protected brand."
                      : "The new asset did not cross the configured similarity threshold."}
                  </p>
                </div>
              </div>
            </div>

            {/* NEW THREAT */}

            {result.new_threat && (
              <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-cyan-400"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    New Threat
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase text-gray-600">
                      Name
                    </p>

                    <p className="mt-1 break-all text-xs text-white">
                      {result.new_threat.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-gray-600">
                      Risk Score
                    </p>

                    <p className="mt-1 text-xl font-bold text-orange-400">
                      {result.new_threat.risk_score}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-gray-600">
                      Severity
                    </p>

                    <p className="mt-1 text-xs font-semibold text-red-300">
                      {result.new_threat.severity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SIMILARITY */}

            <div className="mb-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Similarity Analysis
              </p>

              <div className="space-y-4">
                {/* PREVIOUS */}

                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-gray-400">
                      Previous Threat Similarity
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {previousSimilarity.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-orange-400 transition-all"
                      style={{
                        width: `${Math.min(
                          previousSimilarity,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* BRAND */}

                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-gray-400">
                      Brand Similarity
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {brandSimilarity.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${Math.min(
                          brandSimilarity,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DETECTION REASONS */}

            {Array.isArray(
              result.detection_reasons
            ) &&
              result.detection_reasons.length > 0 && (
                <div className="mb-5">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    Detection Reasons
                  </p>

                  <div className="space-y-2">
                    {result.detection_reasons.map(
                      (reason, index) => (
                        <div
                          key={`${reason}-${index}`}
                          className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                        >
                          <AlertTriangle
                            size={14}
                            className="mt-0.5 shrink-0 text-orange-400"
                          />

                          <p className="text-xs text-gray-300">
                            {reason}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* CLOSE */}

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}