import { useEffect, useState } from "react";
import {
  Shield,
  AlertTriangle,
  ExternalLink,
  FileText,
  Copy,
  Check,
  X,
  RefreshCw,
  Send,
  Loader2,
  Search,
} from "lucide-react";

import { BrandShieldAPI } from "../services/api";

export default function EvidenceDossierModal({
  threat,
  company,
  onClose,
  onExecuteTakedown,
  onOpenReMonitor,
}) {
  const [evidence, setEvidence] = useState([]);
  const [investigation, setInvestigation] = useState(null);

  const [loadingEvidence, setLoadingEvidence] =
    useState(false);

  const [loadingInvestigation, setLoadingInvestigation] =
    useState(false);

  const [takedownLoading, setTakedownLoading] =
    useState(false);

  const [takedownSent, setTakedownSent] =
    useState(
      threat?.status === "Takedown Requested"
    );

  const [copied, setCopied] = useState(false);

  if (!threat) {
    return null;
  }

  // =========================================================
  // NORMALIZE REASONS
  // =========================================================

  const getReasons = () => {
    if (Array.isArray(threat.analysis_reasons)) {
      return threat.analysis_reasons;
    }

    if (typeof threat.analysis_reasons === "string") {
      return threat.analysis_reasons
        .split(",")
        .map((reason) => reason.trim())
        .filter(Boolean);
    }

    if (Array.isArray(threat.detection_reasons)) {
      return threat.detection_reasons;
    }

    return [];
  };

  const reasons = getReasons();

  const riskScore = Number(threat.risk_score || 0);

  const severity =
    threat.severity?.toLowerCase() || "medium";

  // =========================================================
  // LOAD EVIDENCE + INVESTIGATION
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!company?.id || !threat?.id) {
        return;
      }

      setLoadingEvidence(true);
      setLoadingInvestigation(true);

      const [evidenceResult, investigationResult] =
        await Promise.all([
          BrandShieldAPI.getEvidence(
            company.id,
            threat.id
          ),

          BrandShieldAPI.investigateThreat(
            company.id,
            threat.id
          ),
        ]);

      if (!cancelled) {
        setEvidence(
          Array.isArray(evidenceResult)
            ? evidenceResult
            : []
        );

        setInvestigation(
          investigationResult || null
        );
      }

      if (!cancelled) {
        setLoadingEvidence(false);
        setLoadingInvestigation(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [company?.id, threat?.id]);

  // =========================================================
  // TAKEDOWN NOTICE
  // =========================================================

  const generateTakedownNotice = () => {
    const companyName =
      company?.name || "Protected Brand";

    const threatName =
      threat?.name || "Suspicious Asset";

    const threatUrl =
      threat?.url || "Not available";

    const reasonText =
      reasons.length > 0
        ? reasons.join("; ")
        : "Potential impersonation of the protected brand.";

    return `Subject: Request for Review and Takedown of Suspected Brand Impersonation

Dear Platform Trust & Safety Team,

We are requesting a review of the following account/application suspected of impersonating ${companyName}.

Protected Brand:
${companyName}

Flagged Asset:
${threatName}

URL:
${threatUrl}

Risk Score:
${riskScore}/100

Severity:
${threat.severity || "Unknown"}

Detection Reasons:
${reasonText}

We request that your team review this asset under the applicable impersonation, fraud, or brand abuse policies and take appropriate action if a violation is confirmed.

This request is based on publicly observable information collected by our digital risk protection platform.

Regards,
BrandShield AI`;
  };

  // =========================================================
  // COPY NOTICE
  // =========================================================

  const handleCopyNotice = async () => {
    const notice = generateTakedownNotice();

    try {
      await navigator.clipboard.writeText(notice);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy notice:",
        error
      );
    }
  };

  // =========================================================
  // TAKEDOWN
  // =========================================================

  const handleTakedown = async () => {
    if (takedownSent || takedownLoading) {
      return;
    }

    setTakedownLoading(true);

    try {
      let success = false;

      if (onExecuteTakedown) {
        const response =
          await onExecuteTakedown(threat);

        success =
          response === true ||
          response?.status ===
            "Takedown Requested";
      } else {
        const response =
          await BrandShieldAPI.executeTakedown(
            company.id,
            threat.id
          );

        success =
          response?.status ===
            "Takedown Requested" ||
          Boolean(response);
      }

      if (success) {
        setTakedownSent(true);
      }
    } catch (error) {
      console.error(
        "Takedown request failed:",
        error
      );
    } finally {
      setTakedownLoading(false);
    }
  };

  // =========================================================
  // SEVERITY COLORS
  // =========================================================

  const severityStyles = {
    critical:
      "border-red-500/20 bg-red-500/10 text-red-300",

    high:
      "border-orange-500/20 bg-orange-500/10 text-orange-300",

    medium:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",

    low:
      "border-green-500/20 bg-green-500/10 text-green-300",
  };

  const severityStyle =
    severityStyles[severity] ||
    severityStyles.medium;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#071016] shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#071016]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10">
              <FileText
                size={20}
                className="text-red-400"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Evidence Dossier
              </h2>

              <p className="text-xs text-gray-500">
                Threat investigation and takedown support
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

        <div className="space-y-5 p-6">
          {/* =================================================
              THREAT SUMMARY
          ================================================= */}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:col-span-2">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Flagged Asset
              </p>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="break-all text-base font-semibold text-white">
                    {threat.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {threat.platform ||
                      threat.source_type ||
                      "Unknown source"}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase ${severityStyle}`}
                >
                  {threat.severity}
                </span>
              </div>

              {threat.url && (
                <a
                  href={threat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-start gap-2 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  <ExternalLink
                    size={13}
                    className="mt-0.5 shrink-0"
                  />

                  <span className="break-all">
                    {threat.url}
                  </span>
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Risk Score
              </p>

              <p className="text-4xl font-bold text-red-400">
                {riskScore}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                out of 100
              </p>
            </div>
          </div>

          {/* =================================================
              PROTECTED BRAND
          ================================================= */}

          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-cyan-500">
              Protected Brand
            </p>

            <div className="flex items-center gap-3">
              <Shield
                size={20}
                className="text-cyan-400"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  {company?.name || "Protected Brand"}
                </p>

                {company?.website && (
                  <p className="text-xs text-gray-500">
                    {company.website}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              DETECTION REASONS
          ================================================= */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle
                size={17}
                className="text-orange-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Detection Explanation
              </h3>
            </div>

            {reasons.length > 0 ? (
              <div className="space-y-2">
                {reasons.map((reason, index) => (
                  <div
                    key={`${reason}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-[10px] text-orange-300">
                      {index + 1}
                    </span>

                    <p className="text-xs leading-5 text-gray-300">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                No detailed detection reasons are available.
              </p>
            )}
          </div>

          {/* =================================================
              INVESTIGATION
          ================================================= */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Search
                size={17}
                className="text-cyan-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Public Infrastructure Investigation
              </h3>
            </div>

            {loadingInvestigation ? (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Loading investigation...
              </div>
            ) : investigation ? (
              <div className="space-y-3">
                {investigation.infrastructure?.domain && (
                  <div>
                    <p className="text-[10px] uppercase text-gray-600">
                      Domain
                    </p>

                    <p className="mt-1 break-all text-xs text-cyan-300">
                      {investigation.infrastructure.domain}
                    </p>
                  </div>
                )}

                {investigation.indicators?.length >
                  0 && (
                  <div>
                    <p className="mb-2 text-[10px] uppercase text-gray-600">
                      Indicators
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {investigation.indicators.map(
                        (indicator, index) => (
                          <span
                            key={`${indicator.type}-${index}`}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-gray-300"
                          >
                            {indicator.type}:{" "}
                            {indicator.value}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {investigation.investigation_note && (
                  <p className="border-t border-white/5 pt-3 text-[11px] leading-5 text-gray-500">
                    {investigation.investigation_note}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Investigation data unavailable.
              </p>
            )}
          </div>

          {/* =================================================
              EVIDENCE
          ================================================= */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText
                  size={17}
                  className="text-purple-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Collected Evidence
                </h3>
              </div>

              {loadingEvidence && (
                <Loader2
                  size={15}
                  className="animate-spin text-gray-500"
                />
              )}
            </div>

            {evidence.length > 0 ? (
              <div className="space-y-2">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-white">
                          {item.evidence_type}
                        </p>

                        {item.description && (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.evidence_url && (
                        <a
                          href={item.evidence_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !loadingEvidence ? (
              <p className="text-xs text-gray-500">
                No additional evidence has been collected yet.
              </p>
            ) : null}
          </div>

          {/* =================================================
              TAKEDOWN NOTICE
          ================================================= */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Platform Review Request
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Generate an evidence-backed request for platform review.
                </p>
              </div>

              <button
                onClick={handleCopyNotice}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-black/20 p-4 text-[11px] leading-5 text-gray-400">
              {generateTakedownNotice()}
            </pre>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                if (onOpenReMonitor) {
                  onOpenReMonitor(threat);
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              <RefreshCw size={17} />
              Re-Monitor
            </button>

            <button
              onClick={handleTakedown}
              disabled={
                takedownSent ||
                takedownLoading
              }
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                takedownSent
                  ? "cursor-default border border-green-400/20 bg-green-400/10 text-green-300"
                  : "bg-red-500 text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              }`}
            >
              {takedownLoading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : takedownSent ? (
                <>
                  <Check size={17} />
                  Review Submitted
                </>
              ) : (
                <>
                  <Send size={17} />
                  Request Platform Review
                </>
              )}
            </button>
          </div>

          {/* =================================================
              CLOSE
          ================================================= */}

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}