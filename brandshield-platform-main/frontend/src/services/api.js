const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

async function request(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      console.error("API Error:", response.status, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Network Error:", error);
    return null;
  }
}

export const BrandShieldAPI = {
  // =========================================================
  // HEALTH CHECK
  // =========================================================

  async checkHealth() {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 2000);

      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      return response.ok;
    } catch {
      return false;
    }
  },

  // =========================================================
  // COMPANY
  // =========================================================

  async getCompany(companyId = 1) {
    return await request(`/companies/${companyId}`);
  },

  async createCompany(data) {
    return await request("/companies/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // =========================================================
  // SOCIAL ACCOUNTS
  // =========================================================

  async getSocialAccounts(companyId = 1) {
    return await request(
      `/companies/${companyId}/social-accounts`
    );
  },

  async addSocialAccount(companyId, data) {
    return await request(
      `/companies/${companyId}/social-accounts`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // =========================================================
  // OFFICIAL APPS
  // =========================================================

  async getOfficialApps(companyId = 1) {
    return await request(
      `/companies/${companyId}/official-apps`
    );
  },

  async addOfficialApp(companyId, data) {
    return await request(
      `/companies/${companyId}/official-apps`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // =========================================================
  // THREATS
  // =========================================================

  async getThreats(companyId = 1, filters = {}) {
    const params = new URLSearchParams();

    if (filters.severity) {
      params.append("severity", filters.severity);
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    const queryString = params.toString();

    return await request(
      `/companies/${companyId}/threats${
        queryString ? `?${queryString}` : ""
      }`
    );
  },

  // =========================================================
  // THREAT DETAILS
  // =========================================================

  async getThreatDetails(companyId, threatId) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/details`
    );
  },

  // =========================================================
  // THREAT STATUS
  // =========================================================

  async updateThreatStatus(
    companyId,
    threatId,
    status
  ) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PATCH",
      }
    );
  },

  // =========================================================
  // SOCIAL MONITORING
  // =========================================================

  async monitorSocial(companyId, data) {
    const params = new URLSearchParams({
      platform: data.platform || "Instagram",
      username: data.username || "",
      profile_url: data.profile_url || "",
    });

    return await request(
      `/companies/${companyId}/monitor/social?${params.toString()}`,
      {
        method: "POST",
      }
    );
  },

  // =========================================================
  // APP MONITORING
  // =========================================================

  async monitorApp(companyId, data) {
    const params = new URLSearchParams({
      app_name: data.app_name || "",
      developer: data.developer || "",
      store: data.store || "Google Play",
      store_url: data.store_url || "",
    });

    return await request(
      `/companies/${companyId}/monitor/app?${params.toString()}`,
      {
        method: "POST",
      }
    );
  },

  // =========================================================
  // TAKEDOWN
  // =========================================================

  async executeTakedown(companyId, threatId) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/takedown`,
      {
        method: "POST",
      }
    );
  },

  // =========================================================
  // EVIDENCE
  // =========================================================

  async getEvidence(companyId, threatId) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/evidence`
    ) || [];
  },

  async addEvidence(companyId, threatId, data) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/evidence`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // =========================================================
  // TAKEDOWN REPORT
  // =========================================================

  async getTakedownReport(companyId, threatId) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/takedown-report`
    );
  },

  // =========================================================
  // INVESTIGATION
  // =========================================================

  async investigateThreat(companyId, threatId) {
    return await request(
      `/companies/${companyId}/threats/${threatId}/investigation`
    );
  },

  // =========================================================
  // RE-MONITORING
  // =========================================================

  async checkReappearance(
    companyId,
    threatId,
    newAccountName,
    newUrl
  ) {
    const params = new URLSearchParams({
      new_name: newAccountName || "",
      new_url: newUrl || "",
    });

    return await request(
      `/companies/${companyId}/threats/${threatId}/remonitor?${params.toString()}`,
      {
        method: "POST",
      }
    );
  },

  // =========================================================
  // THREAT STATISTICS
  // =========================================================

  async getThreatStatistics(companyId = 1) {
    return await request(
      `/companies/${companyId}/threat-statistics`
    );
  },

  // =========================================================
  // DASHBOARD OVERVIEW
  // =========================================================

  async getDashboardOverview(companyId = 1) {
    return await request(
      `/companies/${companyId}/dashboard-overview`
    );
  },
};