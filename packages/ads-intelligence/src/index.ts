export const analysisDataModes = ["observed", "fixture"] as const;
export type AnalysisDataMode = (typeof analysisDataModes)[number];

export const adSourceProviders = ["meta-ad-library", "manual", "fixture"] as const;
export type AdSourceProvider = (typeof adSourceProviders)[number];

export interface AdSource {
  readonly provider: AdSourceProvider;
  readonly externalId?: string;
  readonly observedAt: string;
}

export interface AdRecord {
  readonly id: string;
  readonly creativeBody: string;
  readonly linkCaption?: string;
  readonly source: AdSource;
}

export interface MetaAdSearchRequest {
  readonly query: string;
  readonly country: string;
  readonly limit: number;
  readonly cursor?: string;
}

export interface MetaAdSearchResult {
  readonly ads: readonly AdRecord[];
  readonly nextCursor?: string;
}

export interface MetaAdLibraryPort {
  searchAds(request: MetaAdSearchRequest): Promise<MetaAdSearchResult>;
}

const hookKeywords = {
  new_product_launch: ["ใหม่", "new", "เปิดตัว"],
  discount_offer: ["ลด", "%", "sale", "promotion"],
  emoji_attention: ["✨", "🔥", "💥"],
  urgency_scarcity: ["จำกัด", "limited", "only", "วันนี้เท่านั้น"],
} as const;

const angleKeywords = {
  brightness_glow: ["ใส", "ออร่า", "bright", "glow", "radiant", "✨"],
  hydration: ["ชุ่มชื้น", "เติมน้ำ", "hydrat", "moisture"],
  anti_aging: ["ริ้วรอย", "anti-age", "wrinkle", "อ่อนวัย"],
  acne_care: ["สิว", "acne", "oil-control", "รูขุมขน"],
  sensitive_skin: ["แพ้ง่าย", "sensitive", "อ่อนโยน", "gentle"],
  natural_organic: ["ธรรมชาติ", "natural", "ออร์แกนิค", "organic"],
  luxury_premium: ["หรู", "luxury", "premium", "exclusive"],
  affordable_value: ["คุ้ม", "value", "ประหยัด", "affordable"],
  scientific_clinical: ["วิทยาศาสตร์", "science", "clinical", "research"],
  korean_beauty: ["เกาหลี", "korean", "k-beauty", "seoul"],
  vegan_cruelty_free: ["วีแกน", "vegan", "cruelty-free", "ไม่ทดลองสัตว์"],
  eco_sustainable: ["eco", "sustain", "สิ่งแวดล้อม", "recycle"],
  quick_results: ["เห็นผลเร็ว", "quick", "ทันที", "instant"],
  long_lasting: ["ติดทน", "lasting", "24 ชม.", "all-day"],
  multi_function: ["ครบ", "multi", "all-in-one", "3in1"],
  gift_worthy: ["ของขวัญ", "gift", "gift set"],
  limited_edition: ["limited edition", "จำนวนจำกัด"],
  celebrity_endorsed: ["ดารา", "celebrity", "influencer", "เซเลบ"],
  dermatologist_recommended: ["แพทย์ผิวหนัง", "dermatologist", "derma"],
  award_winning: ["รางวัล", "award", "winner", "#1"],
} as const;

const ctaKeywords = {
  direct_purchase: ["ซื้อเลย", "shop now", "order now"],
  click_through: ["คลิก", "click", "learn more"],
  message_conversation: ["ทักแชท", "inbox", "message us"],
} as const;

type KeywordCatalog = Readonly<Record<string, readonly string[]>>;
export type PatternCounts = Readonly<Record<string, number>>;

export interface TopPattern {
  readonly name: string;
  readonly count: number;
}

export interface WinningPatternAnalysis {
  readonly dataMode: AnalysisDataMode;
  readonly totalAdsAnalyzed: number;
  readonly patterns: {
    readonly hooks: PatternCounts;
    readonly angles: PatternCounts;
    readonly ctas: PatternCounts;
  };
  readonly topHook: TopPattern | null;
  readonly topAngle: TopPattern | null;
  readonly topCta: TopPattern | null;
  readonly recommendations: readonly string[];
}

function normalizeText(ad: AdRecord): string {
  return `${ad.creativeBody} ${ad.linkCaption ?? ""}`.normalize("NFKC").toLocaleLowerCase();
}

function countCatalogMatches(ads: readonly AdRecord[], catalog: KeywordCatalog): PatternCounts {
  const counts = new Map<string, number>();

  for (const ad of ads) {
    const text = normalizeText(ad);
    for (const [pattern, keywords] of Object.entries(catalog)) {
      if (keywords.some((keyword) => text.includes(keyword.toLocaleLowerCase()))) {
        counts.set(pattern, (counts.get(pattern) ?? 0) + 1);
      }
    }
  }

  return Object.freeze(
    Object.fromEntries(
      [...counts.entries()].sort(([leftName, leftCount], [rightName, rightCount]) =>
        rightCount === leftCount ? leftName.localeCompare(rightName) : rightCount - leftCount,
      ),
    ),
  );
}

function topPattern(counts: PatternCounts): TopPattern | null {
  const first = Object.entries(counts)[0];
  return first === undefined ? null : Object.freeze({ name: first[0], count: first[1] });
}

function buildRecommendations(
  topHook: TopPattern | null,
  topAngle: TopPattern | null,
  topCta: TopPattern | null,
): readonly string[] {
  const recommendations: string[] = [];
  if (topHook !== null)
    recommendations.push(`Test hook pattern '${topHook.name}' with source evidence.`);
  if (topAngle !== null)
    recommendations.push(`Prioritize angle '${topAngle.name}' in the next approved experiment.`);
  if (topCta !== null)
    recommendations.push(`Evaluate CTA '${topCta.name}' without claiming conversion uplift.`);
  return Object.freeze(
    recommendations.length > 0
      ? recommendations
      : ["Collect more source-backed ads before generating recommendations."],
  );
}

export function analyzeWinningPatterns(
  ads: readonly AdRecord[],
  dataMode: AnalysisDataMode = "observed",
): WinningPatternAnalysis {
  const hooks = countCatalogMatches(ads, hookKeywords);
  const angles = countCatalogMatches(ads, angleKeywords);
  const ctas = countCatalogMatches(ads, ctaKeywords);
  const topHook = topPattern(hooks);
  const topAngle = topPattern(angles);
  const topCta = topPattern(ctas);

  return Object.freeze({
    dataMode,
    totalAdsAnalyzed: ads.length,
    patterns: Object.freeze({ hooks, angles, ctas }),
    topHook,
    topAngle,
    topCta,
    recommendations: buildRecommendations(topHook, topAngle, topCta),
  });
}

export const angleCatalog = Object.freeze(
  Object.entries(angleKeywords).map(([id]) => id),
) as readonly (keyof typeof angleKeywords)[];

export interface AngleGapAnalysis {
  readonly dataMode: AnalysisDataMode;
  readonly brandAngles: readonly string[];
  readonly competitorAngles: readonly string[];
  readonly opportunities: {
    readonly competitorOnly: readonly string[];
    readonly brandOnly: readonly string[];
    readonly blueOcean: readonly string[];
    readonly redOcean: readonly string[];
  };
}

function detectedAngles(ads: readonly AdRecord[]): Set<string> {
  return new Set(Object.keys(countCatalogMatches(ads, angleKeywords)));
}

function orderedAngles(values: ReadonlySet<string>): readonly string[] {
  return Object.freeze(angleCatalog.filter((angle) => values.has(angle)));
}

export function findAngleGaps(
  brandAds: readonly AdRecord[],
  competitorAds: readonly AdRecord[],
  dataMode: AnalysisDataMode = "observed",
): AngleGapAnalysis {
  const brand = detectedAngles(brandAds);
  const competitors = detectedAngles(competitorAds);
  const all = new Set<string>(angleCatalog);

  const competitorOnly = new Set([...competitors].filter((angle) => !brand.has(angle)));
  const brandOnly = new Set([...brand].filter((angle) => !competitors.has(angle)));
  const blueOcean = new Set(
    [...all].filter((angle) => !brand.has(angle) && !competitors.has(angle)),
  );
  const redOcean = new Set([...brand].filter((angle) => competitors.has(angle)));

  return Object.freeze({
    dataMode,
    brandAngles: orderedAngles(brand),
    competitorAngles: orderedAngles(competitors),
    opportunities: Object.freeze({
      competitorOnly: orderedAngles(competitorOnly),
      brandOnly: orderedAngles(brandOnly),
      blueOcean: orderedAngles(blueOcean),
      redOcean: orderedAngles(redOcean),
    }),
  });
}

export interface CreativeAngleDefinition {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly defaultCta: string;
}

export const creativeAngleCatalog: readonly CreativeAngleDefinition[] = Object.freeze([
  {
    id: "free_gift",
    title: "Free Gift First Order",
    objective: "Reduce first-purchase friction",
    defaultCta: "Claim Gift",
  },
  {
    id: "gift_card",
    title: "Gift Card",
    objective: "Enable recipient choice",
    defaultCta: "Send Gift Card",
  },
  {
    id: "new_launch",
    title: "New Launch",
    objective: "Introduce a new product",
    defaultCta: "Discover New",
  },
  {
    id: "catalog_bestsellers",
    title: "Catalog Bestsellers",
    objective: "Show proven customer choices",
    defaultCta: "View Bestsellers",
  },
  {
    id: "carousel_routine",
    title: "Carousel Routine",
    objective: "Explain a step-by-step routine",
    defaultCta: "Build Routine",
  },
  {
    id: "ugc_review",
    title: "UGC Review",
    objective: "Present attributable customer proof",
    defaultCta: "See Reviews",
  },
  {
    id: "quiz_personalization",
    title: "Quiz Personalization",
    objective: "Guide product discovery",
    defaultCta: "Start Quiz",
  },
  {
    id: "shade_match",
    title: "Shade Match",
    objective: "Reduce selection uncertainty",
    defaultCta: "Find Shade",
  },
  {
    id: "mini_trial",
    title: "Mini Trial",
    objective: "Offer a low-risk trial",
    defaultCta: "Try Mini",
  },
  {
    id: "bundle_stack",
    title: "Bundle Stack",
    objective: "Explain bundle value",
    defaultCta: "Build Bundle",
  },
  {
    id: "loyalty",
    title: "Loyalty",
    objective: "Promote membership benefits",
    defaultCta: "Join Rewards",
  },
  {
    id: "flash_gift",
    title: "Flash Gift 24h",
    objective: "Communicate a verified limited-time offer",
    defaultCta: "View Offer",
  },
  {
    id: "sensitive_skin",
    title: "Sensitive Skin",
    objective: "Explain suitability with evidence",
    defaultCta: "View Details",
  },
  {
    id: "clean_beauty",
    title: "Clean Beauty",
    objective: "Explain ingredient and sourcing standards",
    defaultCta: "Explore Ingredients",
  },
  {
    id: "unboxing",
    title: "Unboxing",
    objective: "Show the product experience",
    defaultCta: "See Product",
  },
  {
    id: "before_after",
    title: "Before/After",
    objective: "Present consented and substantiated results",
    defaultCta: "See Evidence",
  },
  {
    id: "seasonal",
    title: "Seasonal",
    objective: "Connect an offer to a timely occasion",
    defaultCta: "Shop Collection",
  },
  {
    id: "cart_retargeting",
    title: "Cart Retargeting",
    objective: "Remind an opted-in shopper",
    defaultCta: "Return to Cart",
  },
  {
    id: "social_proof",
    title: "Social Proof",
    objective: "Summarize attributable customer evidence",
    defaultCta: "Read Stories",
  },
  {
    id: "routine_comparison",
    title: "Routine Comparison",
    objective: "Compare options without unsupported superiority claims",
    defaultCta: "Compare Options",
  },
]);

export interface CreativeBrief {
  readonly brand: string;
  readonly product: string;
  readonly audience: string;
  readonly offer?: string;
  readonly platforms: readonly string[];
}

export interface CreativePlanItem {
  readonly angleId: string;
  readonly title: string;
  readonly headlinePrompt: string;
  readonly bodyPrompt: string;
  readonly visualPrompt: string;
  readonly cta: string;
  readonly requiresHumanApproval: true;
  readonly claimsRequireEvidence: true;
}

export function createCreativePlan(brief: CreativeBrief): readonly CreativePlanItem[] {
  const offerContext = brief.offer === undefined ? "No offer supplied." : `Offer: ${brief.offer}`;
  const platforms = brief.platforms.join(", ");

  return Object.freeze(
    creativeAngleCatalog.map((angle) =>
      Object.freeze({
        angleId: angle.id,
        title: angle.title,
        headlinePrompt: `Draft a ${angle.title} headline for ${brief.brand} ${brief.product}.`,
        bodyPrompt: `${angle.objective}. Audience: ${brief.audience}. ${offerContext} Do not invent performance, medical, scarcity, or endorsement claims.`,
        visualPrompt: `Create a source-safe visual concept for ${angle.title} on ${platforms}.`,
        cta: angle.defaultCta,
        requiresHumanApproval: true as const,
        claimsRequireEvidence: true as const,
      }),
    ),
  );
}
