import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeWinningPatterns,
  createCreativePlan,
  creativeAngleCatalog,
  findAngleGaps,
} from "../dist/index.js";

const source = { provider: "fixture", observedAt: "2026-08-06T00:00:00Z" };

const ad = (id, creativeBody, linkCaption = "") => ({
  id,
  creativeBody,
  linkCaption,
  source,
});

test("analyzes deterministic source-backed patterns", () => {
  const result = analyzeWinningPatterns(
    [
      ad("1", "ใหม่ ✨ ผิวใส ซื้อเลย"),
      ad("2", "เปิดตัวสูตรใหม่ ผิว glow Shop Now"),
      ad("3", "เติมน้ำสำหรับผิวแพ้ง่าย ทักแชท"),
    ],
    "fixture",
  );

  assert.equal(result.dataMode, "fixture");
  assert.equal(result.totalAdsAnalyzed, 3);
  assert.deepEqual(result.topHook, { name: "new_product_launch", count: 2 });
  assert.deepEqual(result.topAngle, { name: "brightness_glow", count: 2 });
  assert.deepEqual(result.topCta, { name: "direct_purchase", count: 2 });
});

test("finds angle gaps in catalog order", () => {
  const result = findAngleGaps(
    [ad("brand", "ผิวชุ่มชื้นและอ่อนโยน")],
    [ad("competitor", "ผิวชุ่มชื้นแบบ premium และ vegan")],
    "fixture",
  );

  assert.deepEqual(result.opportunities.redOcean, ["hydration"]);
  assert.deepEqual(result.opportunities.brandOnly, ["sensitive_skin"]);
  assert.deepEqual(result.opportunities.competitorOnly, ["luxury_premium", "vegan_cruelty_free"]);
});

test("creates twenty approval-gated creative plans without fake metrics", () => {
  const plan = createCreativePlan({
    brand: "ZEAZ",
    product: "Body Serum",
    audience: "Adults seeking body-care information",
    offer: "Verified launch bundle",
    platforms: ["instagram", "tiktok"],
  });

  assert.equal(creativeAngleCatalog.length, 20);
  assert.equal(plan.length, 20);
  assert.equal(
    plan.every((item) => item.requiresHumanApproval && item.claimsRequireEvidence),
    true,
  );
  assert.equal(
    plan.some((item) => "predictedCtr" in item || "roas" in item),
    false,
  );
});
