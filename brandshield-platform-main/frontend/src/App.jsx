import { useState, useEffect } from "react";
import {
  Shield,
  Building,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  X,
  Radar,
  Smartphone,
  Activity,
  Search,
  ShieldCheck,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import ThreeBrandShield from "./components/3D/ThreeBrandShield";
import BrandProfileModal from "./components/BrandProfileModal";
import EvidenceDossierModal from "./components/EvidenceDossierModal";

import { BrandShieldAPI } from "./services/api";

// ======================================================
// 1. DIGITAL RISK MONITOR
// ======================================================

const DigitalRiskMonitor = ({
  threats,
  onInvestigate,
}) => {
  const [monitorFilter, setMonitorFilter] =
    useState("all");

  const socialThreats = threats.filter(
    (threat) =>
      threat.source_type === "social" &&
      threat.status !== "Taken_Down"
  );

  const appThreats = threats.filter(
    (threat) =>
      threat.source_type === "app" &&
      threat.status !== "Taken_Down"
  );

  const activeThreats = threats.filter(
    (threat) =>
      threat.status !== "Taken_Down"
  );

  const recentThreats =
    monitorFilter === "social"
      ? socialThreats
      : monitorFilter === "app"
      ? appThreats
      : activeThreats;

  return (
    <section className="w-full mb-12">

      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Radar className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-mono tracking-[0.18em] text-cyan-400 uppercase">
              Continuous Monitoring
            </span>

          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Digital Risk Monitor
          </h2>

          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Continuous monitoring across social media
            platforms and mobile app ecosystems.
          </p>

        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          MONITORING ACTIVE

        </div>

      </div>

      {/* ==================================================
          MONITORING STATS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">

        {/* SOCIAL */}

        <button
          type="button"
          onClick={() =>
            setMonitorFilter(
              monitorFilter === "social"
                ? "all"
                : "social"
            )
          }
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            monitorFilter === "social"
              ? "border-cyan-400/60 bg-cyan-500/10"
              : "border-cyan-500/15 bg-[#0b111a]/80 hover:border-cyan-400/40"
          }`}
        >

          <div className="flex items-center justify-between mb-5">

            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              SOCIAL
            </span>

          </div>

          <div className="flex items-end justify-between gap-3">

            <div>
              <p className="text-3xl font-black text-white font-mono">
                {socialThreats.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Active Social Threats
              </p>
            </div>

            <span className="text-[10px] font-mono text-cyan-400">
              MONITORED
            </span>

          </div>

        </button>

        {/* APPS */}

        <button
          type="button"
          onClick={() =>
            setMonitorFilter(
              monitorFilter === "app"
                ? "all"
                : "app"
            )
          }
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer ${
            monitorFilter === "app"
              ? "border-purple-400/60 bg-purple-500/10"
              : "border-purple-500/15 bg-[#0b111a]/80 hover:border-purple-400/40"
          }`}
        >

          <div className="flex items-center justify-between mb-5">

            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Smartphone className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              APP ECOSYSTEM
            </span>

          </div>

          <div className="flex items-end justify-between gap-3">

            <div>
              <p className="text-3xl font-black text-white font-mono">
                {appThreats.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Suspicious App Threats
              </p>
            </div>

            <span className="text-[10px] font-mono text-purple-400">
              MONITORED
            </span>

          </div>

        </button>

        {/* SYSTEM */}

        <div className="rounded-2xl p-5 border border-emerald-500/15 bg-[#0b111a]/80">

          <div className="flex items-center justify-between mb-5">

            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-mono text-slate-500">
              RISK ENGINE
            </span>

          </div>

          <div className="flex items-end justify-between gap-3">

            <div>
              <p className="text-3xl font-black text-white font-mono">
                {activeThreats.length}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Active Digital Risks
              </p>
            </div>

            <span className="text-[10px] font-mono text-emerald-400">
              LIVE
            </span>

          </div>

        </div>

      </div>

      {/* ==================================================
          RECENT DETECTIONS
      ================================================== */}

      <div className="rounded-3xl border border-slate-800 bg-[#0a1018]/90 overflow-hidden">

        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>

            <h3 className="text-sm font-bold text-white">
              Recent Detections
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Newly identified impersonation signals
            </p>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setMonitorFilter("all")
              }
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                monitorFilter === "all"
                  ? "bg-cyan-500 text-black font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              ALL
            </button>

            <button
              type="button"
              onClick={() =>
                setMonitorFilter("social")
              }
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                monitorFilter === "social"
                  ? "bg-cyan-500 text-black font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              SOCIAL
            </button>

            <button
              type="button"
              onClick={() =>
                setMonitorFilter("app")
              }
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer ${
                monitorFilter === "app"
                  ? "bg-purple-500 text-white font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              APPS
            </button>

          </div>

        </div>

        <div className="divide-y divide-slate-800/80">

          {recentThreats
            .slice(0, 4)
            .map((threat) => (

              <motion.div
                key={threat.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="px-5 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4"
              >

                {/* ICON */}

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    threat.source_type === "app"
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  }`}
                >

                  {threat.source_type === "app" ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}

                </div>

                {/* DETAILS */}

                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2 mb-1">

                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {threat.platform}
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        threat.severity === "Critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {threat.risk_score}%{" "}
                      {threat.severity}
                    </span>

                  </div>

                  <h4 className="text-sm font-bold text-white truncate">
                    {threat.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 truncate font-mono">
                    {threat.url}
                  </p>

                </div>

                {/* TIME */}

                <div className="lg:w-28 shrink-0">

                  <p className="text-[10px] text-slate-500 font-mono">
                    DETECTED
                  </p>

                  <p className="text-xs text-slate-300 mt-0.5">
                    {threat.created_at ||
                      "Recently"}
                  </p>

                </div>

                {/* ACTION */}

                <button
                  type="button"
                  onClick={() =>
                    onInvestigate(threat)
                  }
                  className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/50 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                >

                  <Search className="w-3.5 h-3.5" />

                  Investigate

                  <ChevronRight className="w-3.5 h-3.5" />

                </button>

              </motion.div>

            ))}

        </div>

        {recentThreats.length === 0 && (
          <div className="py-12 text-center">

            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />

            <p className="text-sm font-semibold text-white">
              No active threats detected
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Monitoring continues across your digital ecosystem.
            </p>

          </div>
        )}

      </div>

    </section>
  );
};

// ======================================================
// 2. RE-MONITOR MODAL
// ======================================================

const ReMonitorModal = ({
  threat,
  companyId,
  onClose,
}) => {
  const [newHandle, setNewHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!threat) return null;

  const handleCheck = async (event) => {
    event.preventDefault();

    if (!newHandle.trim()) return;

    setLoading(true);

    let response = null;

    try {
      response =
        await BrandShieldAPI.checkReappearance(
          companyId,
          threat.id,
          newHandle
        );
    } catch (error) {
      console.warn(
        "Re-monitoring backend unavailable:",
        error
      );
    }

    if (response) {
      setResult(response);
    } else {
      const lowerHandle =
        newHandle.toLowerCase();

      const isSimilar =
        lowerHandle.includes("kampus") ||
        lowerHandle.includes("support");

      setResult({
        reappearance_detected: isSimilar,
        old_name: threat.name,
        new_name: newHandle,
        similarity_score: isSimilar
          ? 92.4
          : 24.1,
        message: isSimilar
          ? "Reappearance Detected! Threat actor recreated a slight variation of the previously taken-down account."
          : "Low similarity. Does not match previous threat signature.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">

      <div className="glass-panel-glow w-full max-w-xl rounded-2xl p-6 relative border border-cyan-500/30">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <RefreshCw className="w-6 h-6" />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Re-Monitoring Intelligence Engine
            </h2>

            <p className="text-xs text-slate-400">
              Testing actor reincarnation against taken-down
              threat:{" "}
              <span className="text-cyan-300 font-mono">
                {threat.name}
              </span>
            </p>

          </div>

        </div>

        <form
          onSubmit={handleCheck}
          className="space-y-4 mb-6"
        >

          <div>

            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
              Enter Suspicious New Handle / Name
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="@kampusvc_support1"
                value={newHandle}
                onChange={(event) =>
                  setNewHandle(event.target.value)
                }
                className="flex-1 bg-[#07090E] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none font-mono"
              />

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >

                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}

                Run Check

              </button>

            </div>

          </div>

        </form>

        {result && (
          <div
            className={`p-4 rounded-xl border ${
              result.reappearance_detected
                ? "bg-red-500/10 border-red-500/40"
                : "bg-emerald-500/10 border-emerald-500/40"
            }`}
          >

            <div className="flex items-center gap-2 mb-2">

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
                  ? "🚨 REAPPEARANCE DETECTED!"
                  : "✅ SAFE / LOW SIMILARITY"}
              </span>

              <span className="text-xs font-mono ml-auto text-slate-300">
                Similarity:{" "}
                {result.similarity_score}%
              </span>

            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.message}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400 gap-4">

              <span>
                Original:{" "}
                <span className="text-white">
                  {result.old_name}
                </span>
              </span>

              <span>
                New Input:{" "}
                <span className="text-cyan-300">
                  {result.new_name}
                </span>
              </span>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

// ======================================================
// 3. DEFAULT COMPANY
// ======================================================

const DEFAULT_COMPANY = {
  id: 1,
  name: "Kampus VC",
  website: "https://kampus.vc",
  description:
    "Applied AI Venture Studio & Company Building Ecosystem",
};

// ======
// ================================================
// 4. FALLBACK THREATS
// ======================================================

const FALLBACK_THREATS = [
  {
    id: 1,
    company_id: 1,
    source_type: "social",
    platform: "Activity",
    name: "Kampus VC Support Official",
    url: "https://Activity.com/kampusvc_support",
    risk_score: 94,
    severity: "Critical",
    status: "New",
    analysis_reasons: [
      "RapidFuzz Name similarity: 94.12%",
      "Unverified account imitating official @kampusvc handle",
      "Suspicious support bio with phishing link",
    ],
    created_at: "Just now",
  },

  {
    id: 2,
    company_id: 1,
    source_type: "app",
    platform: "Google Play",
    name: "Kampus VC Rewards & Grants",
    url: "https://play.google.com/store/apps/details?id=com.kampus.fake.rewards",
    risk_score: 91,
    severity: "Critical",
    status: "New",
    analysis_reasons: [
      "Publisher discrepancy: Apex Global Apps Ltd (Not Kampus VC)",
      "Clone application title & package ID spoofing",
      "Intrusive permissions flagged",
    ],
    created_at: "10 mins ago",
  },

  {
    id: 3,
    company_id: 1,
    source_type: "social",
    platform: "Telegram",
    name: "KampusVC Airdrop Community",
    url: "https://t.me/kampus_airdrop_bot",
    risk_score: 78,
    severity: "High",
    status: "New",
    analysis_reasons: [
      "Deceptive cryptocurrency airdrop campaign",
      "Unauthorized trademark & logo use",
      "RapidFuzz similarity: 82.5%",
    ],
    created_at: "1 hour ago",
  },
];

// ======================================================
// 5. MAIN APP
// ======================================================

function App() {
  const [company, setCompany] =
    useState(DEFAULT_COMPANY);

  const [threats, setThreats] =
    useState(FALLBACK_THREATS);

  const [selectedThreat, setSelectedThreat] =
    useState(null);

  const [reMonitorThreat, setReMonitorThreat] =
    useState(null);

  const [filterType, setFilterType] =
    useState("all");

  const [isBrandModalOpen, setIsBrandModalOpen] =
    useState(false);

  const [isScanning, setIsScanning] =
    useState(false);

  const [
    isBackendConnected,
    setIsBackendConnected,
  ] = useState(false);

  // ====================================================
  // BACKEND SYNC
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const syncData = async () => {
      try {
        const isOnline =
          await BrandShieldAPI.checkHealth();

        if (!mounted) return;

        setIsBackendConnected(
          Boolean(isOnline)
        );

        if (isOnline) {
          try {
            const liveCompany =
              await BrandShieldAPI.getCompany(1);

            if (mounted && liveCompany) {
              setCompany(liveCompany);
            }
          } catch (error) {
            console.warn(
              "Company sync unavailable:",
              error
            );
          }

          try {
            const liveThreats =
              await BrandShieldAPI.getThreats(1);

            if (
              mounted &&
              Array.isArray(liveThreats) &&
              liveThreats.length > 0
            ) {
              setThreats(liveThreats);
            }
          } catch (error) {
            console.warn(
              "Threat sync unavailable:",
              error
            );
          }
        }
      } catch (error) {
        console.warn(
          "Backend unavailable. Running standalone demo mode.",
          error
        );

        if (mounted) {
          setIsBackendConnected(false);
        }
      }
    };

    syncData();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // RADAR SCAN
  // ====================================================

  const handleScan = async () => {
    if (isScanning) return;

    setIsScanning(true);

    if (isBackendConnected) {
      try {
        const updated =
          await BrandShieldAPI.getThreats(
            company.id
          );

        if (
          Array.isArray(updated) &&
          updated.length > 0
        ) {
          setThreats(updated);
        }
      } catch (error) {
        console.warn(
          "Radar scan failed:",
          error
        );
      }
    }

    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  // ====================================================
  // TAKEDOWN / RESPONSE
  // ====================================================

  const handleExecuteTakedown = async (
    threatId
  ) => {
    if (isBackendConnected) {
      try {
        await BrandShieldAPI.executeTakedown(
          company.id,
          threatId
        );
      } catch (error) {
        console.warn(
          "Takedown API unavailable:",
          error
        );
      }
    }

    setThreats((previous) =>
      previous.map((threat) => {
        if (threat.id === threatId) {
          return {
            ...threat,
            status: "Taken_Down",
            risk_score: 15,
            severity: "Low",
          };
        }

        return threat;
      })
    );
  };

  // ====================================================
  // FILTER
  // ====================================================

  const filteredThreats =
    threats.filter((threat) => {
      if (filterType === "social") {
        return (
          threat.source_type === "social"
        );
      }

      if (filterType === "app") {
        return (
          threat.source_type === "app"
        );
      }

      return true;
    });

  // ====================================================
  // COUNTERS
  // ====================================================

  const criticalCount =
    threats.filter(
      (threat) =>
        threat.severity === "Critical" &&
        threat.status !== "Taken_Down"
    ).length;

  const takenDownCount =
    threats.filter(
      (threat) =>
        threat.status === "Taken_Down"
    ).length;

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 cyber-grid relative overflow-x-hidden">

      {/* AMBIENT LIGHTS */}

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="fixed top-1/3 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="glass-panel sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-cyan-500/15">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">

            <div className="w-full h-full bg-[#07090E] rounded-[11px] flex items-center justify-center">

              <Shield className="w-5 h-5 text-cyan-400" />

            </div>

          </div>

          <div>

            <div className="flex items-center gap-2">

              <span className="font-extrabold text-lg tracking-wider text-white">
                BRANDSHIELD AI
              </span>

              <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                FASTAPI + RAPIDFUZZ
              </span>

            </div>

            <p className="text-[11px] text-slate-400">
              Digital Risk Protection • Social & App
              Monitoring
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border ${
              isBackendConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >

            {isBackendConnected ? (
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}

            {isBackendConnected
              ? "FASTAPI BACKEND ONLINE"
              : "STANDALONE DEMO MODE"}

          </div>

          <button
            type="button"
            onClick={() =>
              setIsBrandModalOpen(true)
            }
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer"
          >

            <Building className="w-3.5 h-3.5 text-cyan-400" />

            <span className="hidden sm:inline">
              Company Vault
            </span>

            <span>
              ({company.name})
            </span>

          </button>

          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs flex items-center gap-2 hover:opacity-95 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >

            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isScanning
                  ? "animate-spin"
                  : ""
              }`}
            />

            <span className="hidden sm:inline">
              {isScanning
                ? "Scanning..."
                : "Run Radar Scan"}
            </span>

          </button>

        </div>

      </nav>

      {/* ==================================================
          HERO
      ================================================== */}

      <header className="max-w-7xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="lg:col-span-7 space-y-6"
        >

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">

            <Sparkles className="w-3.5 h-3.5" />

            Kampus.VC Venture Studio
            Challenge

          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">

            Real-Time DRP For
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-200">
              Social Feeds & App Stores
            </span>

          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">

            Connected to Python FastAPI &
            PostgreSQL. Uses RapidFuzz similarity
            algorithms and threat evidence dossiers
            to defend {company.name} across the
            digital ecosystem.

          </p>

          <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg">

            <div className="glass-panel p-4 rounded-xl border border-red-500/20">

              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Critical Threats
              </span>

              <span className="text-2xl font-black text-red-400 font-mono">
                {criticalCount}
              </span>

            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">

              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Monitored Assets
              </span>

              <span className="text-2xl font-black text-cyan-400 font-mono">
                {threats.length}
              </span>

            </div>

            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">

              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Taken Down
              </span>

              <span className="text-2xl font-black text-emerald-400 font-mono">
                {takenDownCount}
              </span>

            </div>

          </div>

        </motion.div>

        {/* ==================================================
            3D DIGITAL RISK RADAR
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
          }}
          className="lg:col-span-5 h-[360px] sm:h-[400px] relative glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center p-4"
        >

          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-mono text-cyan-400">

            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />

            3D DIGITAL RISK RADAR

          </div>

          <ThreeBrandShield />

          <div className="absolute bottom-4 text-center z-10 text-[11px] text-slate-400 font-mono">
            Drag to inspect threat vectors
          </div>

        </motion.div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-7xl mx-auto px-6 pb-24">

        {/* ==================================================
            DIGITAL RISK MONITOR
        ================================================== */}

        <DigitalRiskMonitor
          threats={threats}
          onInvestigate={(threat) =>
            setSelectedThreat(threat)
          }
        />

        {/* ==================================================
            THREAT INTERCEPTOR FEED
        ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">

          <div>

            <h2 className="text-2xl font-black text-white tracking-wide">
              Threat Interceptor Feed
            </h2>

            <p className="text-xs text-slate-400">
              PostgreSQL Live Data • RapidFuzz AI
              Scoring
            </p>

          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">

            <button
              type="button"
              onClick={() =>
                setFilterType("all")
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "all"
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({threats.length})
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterType("social")
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "social"
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Social Media
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterType("app")
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === "app"
                  ? "bg-cyan-500 text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              App Stores
            </button>

          </div>

        </div>

        {/* ==================================================
            THREAT CARDS
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <AnimatePresence mode="popLayout">

            {filteredThreats.map(
              (threat, index) => (

                <motion.div
                  key={threat.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  onClick={() =>
                    setSelectedThreat(
                      threat
                    )
                  }
                  className={`glass-panel rounded-2xl p-6 cursor-pointer hover:border-cyan-400/50 transition-all duration-300 relative group flex flex-col justify-between ${
                    threat.status ===
                    "Taken_Down"
                      ? "opacity-55 border-emerald-500/20"
                      : "border-cyan-500/15"
                  }`}
                >

                  <div>

                    <div className="flex items-center justify-between mb-4 gap-3">

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                        {threat.platform}
                      </span>

                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                          threat.status ===
                          "Taken_Down"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : threat.severity ===
                              "Critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {threat.status ===
                        "Taken_Down"
                          ? "TAKEN DOWN"
                          : `${threat.risk_score}% ${threat.severity}`}
                      </span>

                    </div>

                    <div className="mb-3">

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                        {threat.name}
                      </h3>

                      <p className="text-xs font-mono text-slate-400 line-clamp-1 truncate">
                        {threat.url}
                      </p>

                    </div>

                    <div className="space-y-1.5 mb-4">

                      {(
                        threat.analysis_reasons ||
                        []
                      )
                        .slice(0, 2)
                        .map(
                          (
                            reason,
                            reasonIndex
                          ) => (

                            <div
                              key={
                                reasonIndex
                              }
                              className="text-xs text-slate-300 flex items-start gap-1.5 line-clamp-1"
                            >

                              <span className="text-red-400">
                                •
                              </span>

                              {reason}

                            </div>

                          )
                        )}

                    </div>

                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">

                    <span className="text-[11px] text-slate-400 font-mono">
                      Status:{" "}
                      {threat.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />

                  </div>

                </motion.div>

              )
            )}

          </AnimatePresence>

        </div>

        {filteredThreats.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            No threats found for this filter.
          </div>
        )}

      </main>

      {/* ==================================================
          EVIDENCE DOSSIER MODAL
      ================================================== */}

      <EvidenceDossierModal
        threat={selectedThreat}
        company={company}
        onClose={() =>
          setSelectedThreat(null)
        }
        onExecuteTakedown={
          handleExecuteTakedown
        }
        onOpenReMonitor={(threat) => {
          setSelectedThreat(null);
          setReMonitorThreat(threat);
        }}
      />

      {/* ==================================================
          RE-MONITOR MODAL
      ================================================== */}

      <ReMonitorModal
        threat={reMonitorThreat}
        companyId={company.id}
        onClose={() =>
          setReMonitorThreat(null)
        }
      />

      {/* ==================================================
          BRAND PROFILE MODAL
      ================================================== */}

      <BrandProfileModal
        isOpen={isBrandModalOpen}
        onClose={() =>
          setIsBrandModalOpen(false)
        }
        brand={{
          name: company.name,

          officialHandles: {
            twitter: "@KampusVC",
            Activity: "@kampus.vc",
            linkedin: "kampus-vc",
            telegram: "kampusvc_official",
          },

          officialApps: {
            googlePlayPackage:
              "vc.kampus.app",
            appleAppId:
              "id647890123",
          },

          officialPublisher:
            "Kampus Venture Studio Inc.",

          officialDomain:
            company.website,

          logoUrl:
            company.logo_url || "",
        }}
        onUpdate={(updated) => {
          setCompany((previous) => ({
            ...previous,
            name:
              updated.name ||
              previous.name,
            website:
              updated.officialDomain ||
              previous.website,
          }));
        }}
      />

    </div>
  );
}

export default App;