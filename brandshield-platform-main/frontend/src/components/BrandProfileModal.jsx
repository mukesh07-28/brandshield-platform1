import { useEffect, useState } from "react";

import {
  Building2,
  Globe,
  Send,
  Smartphone,
  ShieldCheck,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { BrandShieldAPI } from "../services/api";

const DEFAULT_BRAND = {
  id: 1,
  name: "Kampus VC",
  website: "https://kampus.vc",
  description:
    "Applied AI Venture Studio & Company Building Ecosystem",

  officialPublisher: "Kampus VC",

  officialHandles: {
    twitter: "",
    instagram: "kampusvc",
    linkedin: "",
    telegram: "",
  },

  officialApps: {
    googlePlayPackage: "",
    appleAppId: "",
  },
};

export default function BrandProfileModal({
  brand,
  companyId = 1,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState(
    brand || DEFAULT_BRAND
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      ...DEFAULT_BRAND,
      ...(brand || {}),
      officialHandles: {
        ...DEFAULT_BRAND.officialHandles,
        ...(brand?.officialHandles || {}),
      },
      officialApps: {
        ...DEFAULT_BRAND.officialApps,
        ...(brand?.officialApps || {}),
      },
    });
  }, [brand]);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateHandle = (platform, value) => {
    setFormData((previous) => ({
      ...previous,
      officialHandles: {
        ...previous.officialHandles,
        [platform]: value,
      },
    }));
  };

  const updateApp = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      officialApps: {
        ...previous.officialApps,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaved(false);
    setSaving(true);

    try {
      if (!formData.name?.trim()) {
        throw new Error("Brand name is required.");
      }

      const socialAccounts = [];

      const handles = formData.officialHandles || {};

      if (handles.twitter?.trim()) {
        const username = handles.twitter
          .trim()
          .replace(/^@/, "");

        socialAccounts.push({
          platform: "X",
          username,
          profile_url: `https://x.com/${username}`,
          verified: true,
        });
      }

      if (handles.instagram?.trim()) {
        const username = handles.instagram
          .trim()
          .replace(/^@/, "");

        socialAccounts.push({
          platform: "Instagram",
          username,
          profile_url: `https://instagram.com/${username}`,
          verified: true,
        });
      }

      if (handles.linkedin?.trim()) {
        const value = handles.linkedin.trim();

        socialAccounts.push({
          platform: "LinkedIn",
          username: value.replace(/^@/, ""),
          profile_url: value.startsWith("http")
            ? value
            : `https://linkedin.com/company/${value.replace(
                /^@/,
                ""
              )}`,
          verified: true,
        });
      }

      if (handles.telegram?.trim()) {
        const username = handles.telegram
          .trim()
          .replace(/^@/, "");

        socialAccounts.push({
          platform: "Telegram",
          username,
          profile_url: `https://t.me/${username}`,
          verified: true,
        });
      }

      const officialApps = [];

      const apps = formData.officialApps || {};

      if (apps.googlePlayPackage?.trim()) {
        const packageId = apps.googlePlayPackage.trim();

        officialApps.push({
          app_name: formData.name.trim(),
          developer:
            formData.officialPublisher?.trim() ||
            formData.name.trim(),
          package_id: packageId,
          store: "Google Play",
          store_url: `https://play.google.com/store/apps/details?id=${packageId}`,
          verified: true,
        });
      }

      if (apps.appleAppId?.trim()) {
        const appId = apps.appleAppId.trim();

        officialApps.push({
          app_name: formData.name.trim(),
          developer:
            formData.officialPublisher?.trim() ||
            formData.name.trim(),
          package_id: appId,
          store: "Apple App Store",
          store_url: `https://apps.apple.com/app/id${appId}`,
          verified: true,
        });
      }

      for (const account of socialAccounts) {
        const response =
          await BrandShieldAPI.addSocialAccount(
            companyId,
            account
          );

        if (!response) {
          console.warn(
            `Could not save ${account.platform} account`
          );
        }
      }

      for (const app of officialApps) {
        const response =
          await BrandShieldAPI.addOfficialApp(
            companyId,
            app
          );

        if (!response) {
          console.warn(
            `Could not save ${app.store} application`
          );
        }
      }

      if (onUpdate) {
        onUpdate({
          ...formData,
          id: companyId,
        });
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Brand profile save failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to save brand profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#071016] shadow-2xl">

        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#071016]/95 px-6 py-5 backdrop-blur-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <ShieldCheck
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Brand Profile
              </h2>

              <p className="text-xs text-gray-500">
                Configure official brand identities for monitoring
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={19} />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* COMPANY */}
          <section>

            <div className="mb-4 flex items-center gap-2">
              <Building2
                size={17}
                className="text-cyan-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Company Information
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Brand / Company Name
                </label>

                <input
                  value={formData.name || ""}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Kampus VC"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                />
              </div>

              <div>

                <label className="mb-2 block text-xs text-gray-400">
                  Official Website
                </label>

                <div className="relative">

                  <Globe
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    value={formData.website || ""}
                    onChange={(event) =>
                      updateField(
                        "website",
                        event.target.value
                      )
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                  />

                </div>

              </div>

            </div>

            <div className="mt-4">

              <label className="mb-2 block text-xs text-gray-400">
                Description
              </label>

              <textarea
                value={formData.description || ""}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Describe the company or brand..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
              />

            </div>

            <div className="mt-4">

              <label className="mb-2 block text-xs text-gray-400">
                Official App Publisher / Developer
              </label>

              <input
                value={
                  formData.officialPublisher || ""
                }
                onChange={(event) =>
                  updateField(
                    "officialPublisher",
                    event.target.value
                  )
                }
                placeholder="Kampus VC"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
              />

            </div>

          </section>

          {/* SOCIAL */}
          <section>

            <div className="mb-4">

              <div className="flex items-center gap-2">

                <Globe
                  size={17}
                  className="text-purple-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Official Social Accounts
                </h3>

              </div>

              <p className="mt-1 text-xs text-gray-600">
                These identities are used as trusted references
                during threat detection.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* X */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-sm font-bold">𝕏</span>
                  X / Twitter
                </label>

                <input
                  value={
                    formData.officialHandles?.twitter ||
                    ""
                  }
                  onChange={(event) =>
                    updateHandle(
                      "twitter",
                      event.target.value
                    )
                  }
                  placeholder="@brand"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

              {/* INSTAGRAM */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-sm">◎</span>
                  Instagram
                </label>

                <input
                  value={
                    formData.officialHandles
                      ?.instagram || ""
                  }
                  onChange={(event) =>
                    updateHandle(
                      "instagram",
                      event.target.value
                    )
                  }
                  placeholder="@brand"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

              {/* LINKEDIN */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="test-sm font-bold">in</span>
                  LinkedIn
                </label>

                <input
                  value={
                    formData.officialHandles
                      ?.linkedin || ""
                  }
                  onChange={(event) =>
                    updateHandle(
                      "linkedin",
                      event.target.value
                    )
                  }
                  placeholder="company/brand"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

              {/* TELEGRAM */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <Send size={14} />
                  Telegram
                </label>

                <input
                  value={
                    formData.officialHandles
                      ?.telegram || ""
                  }
                  onChange={(event) =>
                    updateHandle(
                      "telegram",
                      event.target.value
                    )
                  }
                  placeholder="@brand"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

            </div>

          </section>

          {/* APPS */}
          <section>

            <div className="mb-4">

              <div className="flex items-center gap-2">

                <Smartphone
                  size={17}
                  className="text-green-400"
                />

                <h3 className="text-sm font-semibold text-white">
                  Official Mobile Applications
                </h3>

              </div>

              <p className="mt-1 text-xs text-gray-600">
                Add official package IDs so suspicious applications
                can be compared against trusted applications.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-xs text-gray-400">
                  Google Play Package ID
                </label>

                <input
                  value={
                    formData.officialApps
                      ?.googlePlayPackage || ""
                  }
                  onChange={(event) =>
                    updateApp(
                      "googlePlayPackage",
                      event.target.value
                    )
                  }
                  placeholder="com.example.app"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

              <div>

                <label className="mb-2 block text-xs text-gray-400">
                  Apple App ID
                </label>

                <input
                  value={
                    formData.officialApps
                      ?.appleAppId || ""
                  }
                  onChange={(event) =>
                    updateApp(
                      "appleAppId",
                      event.target.value
                    )
                  }
                  placeholder="123456789"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-cyan-400/50"
                />

              </div>

            </div>

          </section>

          {/* SUCCESS */}
          {saved && (
            <div className="flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-400/10 p-3">

              <CheckCircle2
                size={18}
                className="text-green-400"
              />

              <p className="text-xs text-green-300">
                Brand profile saved successfully.
              </p>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3">

              <AlertTriangle
                size={18}
                className="mt-0.5 text-red-400"
              />

              <p className="text-xs text-red-300">
                {error}
              </p>

            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Brand Profile
                </>
              )}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}