// ============================================================
// DIGITAL RISK PROTECTION
// LOOK-ALIKE & HOMOGLYPH DETECTION ENGINE
// ============================================================

// ------------------------------------------------------------
// 1. HOMOGLYPH / LOOK-ALIKE CHARACTER MAP
// ------------------------------------------------------------

export const HOMOGLYPH_MAP = {
  // Cyrillic characters
  а: "a",
  е: "e",
  о: "o",
  р: "p",
  с: "c",
  у: "y",
  х: "x",

  // Leetspeak
  0: "o",
  1: "l",
  3: "e",
  5: "s",
  8: "b",

  // Character combinations
  vv: "w",
  rn: "m",
  cl: "d",
};

// ------------------------------------------------------------
// 2. NORMALIZE LOOK-ALIKE CHARACTERS
// ------------------------------------------------------------

export function normalizeLookAlike(input) {
  let normalized = input.toLowerCase();
  let hasHomoglyphs = false;

  for (const [spoofed, real] of Object.entries(HOMOGLYPH_MAP)) {
    if (normalized.includes(spoofed)) {
      hasHomoglyphs = true;

      normalized = normalized.replaceAll(spoofed, real);
    }
  }

  return {
    normalized,
    hasHomoglyphs,
  };
}

// ------------------------------------------------------------
// 3. LEVENSHTEIN DISTANCE
// Used for:
// - Typosquatting
// - Character swaps
// - Missing characters
// - Extra characters
// ------------------------------------------------------------

export function calculateLevenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ------------------------------------------------------------
// 4. SUSPICIOUS AFFIXES
// Common keywords used by impersonators
// ------------------------------------------------------------

export const SUSPICIOUS_AFFIXES = [
  "support",
  "official",
  "helpdesk",
  "care",
  "login",
  "verify",
  "bonus",
  "rewards",
  "airdrop",
];

// ------------------------------------------------------------
// 5. NAME SIMILARITY ANALYSIS
// ------------------------------------------------------------

export function analyzeNameSimilarity(targetName, officialBrand) {
  const cleanTarget = targetName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const cleanBrand = officialBrand
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const {
    normalized,
    hasHomoglyphs,
  } = normalizeLookAlike(cleanTarget);

  // ----------------------------------------------------------
  // CHECK 1: HOMOGLYPH SPOOFING
  // ----------------------------------------------------------

  if (
    hasHomoglyphs &&
    normalized.includes(cleanBrand)
  ) {
    return {
      isLookAlike: true,
      type: "Unicode / Cyrillic Homoglyph Swap",
      details:
        "Replaced Latin characters with visually identical Unicode characters.",
      severity: "High",
      confidence: 96,
    };
  }

  // ----------------------------------------------------------
  // CHECK 2: DECEPTIVE AFFIX
  // Example:
  // kampusvc_support
  // kampusvc_official
  // kampusvc_helpdesk
  // ----------------------------------------------------------

  for (const affix of SUSPICIOUS_AFFIXES) {
    if (
      cleanTarget.includes(cleanBrand) &&
      cleanTarget.includes(affix)
    ) {
      return {
        isLookAlike: true,
        type: `Deceptive Affix (+${affix})`,
        details: `Brand name paired with deceptive keyword "${affix}".`,
        severity: "High",
        confidence: 93,
      };
    }
  }

  // ----------------------------------------------------------
  // CHECK 3: TYPOSQUATTING
  // Levenshtein distance 1 or 2
  // ----------------------------------------------------------

  const dist = calculateLevenshtein(
    cleanTarget,
    cleanBrand
  );

  if (
    dist > 0 &&
    dist <= 2 &&
    Math.abs(cleanTarget.length - cleanBrand.length) <= 1
  ) {
    return {
      isLookAlike: true,
      type: "Typosquatting / Character Swap",
      details: `Levenshtein edit distance of ${dist} from official brand.`,
      severity: "Medium",
      confidence: dist === 1 ? 91 : 82,
    };
  }

  // ----------------------------------------------------------
  // NO THREAT
  // ----------------------------------------------------------

  return {
    isLookAlike: false,
    type: "None",
    details: "Normal variation",
    severity: "Low",
    confidence: 0,
  };
}

// ============================================================
// OPTIONAL: COMPLETE RISK ANALYSIS
// ============================================================

export function analyzeThreatName(targetName, officialBrand) {
  const result = analyzeNameSimilarity(
    targetName,
    officialBrand
  );

  let riskScore = 0;

  if (result.type === "Unicode / Cyrillic Homoglyph Swap") {
    riskScore = 96;
  } else if (result.type.startsWith("Deceptive Affix")) {
    riskScore = 93;
  } else if (
    result.type === "Typosquatting / Character Swap"
  ) {
    riskScore = result.confidence;
  } else {
    riskScore = 10;
  }

  return {
    ...result,
    riskScore,
    targetName,
    officialBrand,
  };
}