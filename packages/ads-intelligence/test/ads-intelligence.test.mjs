import assert from "node:assert/strict";
import test from "node:test";

import {
  AdEvidenceIntegrityError,
  analyzeWinningPatterns,
  createCreativePlan,
  creativeAngleCatalog,
  findAngleGaps,
} from "../dist/index.js";

const source = { provider: "fixture", observedAt: "2026-08-06T00:00:00Z" };

const ad = (id, creativeBody, linkCaption = "", adSource = source) => ({
  id,
  creativeBody,
  linkCaption,
  source: adSource,
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

test("rejects fixture records masquerading as observed evidence", () => {
  assert.throws(
    () => analyzeWinningPatterns([ad("fixture-observed", "new launch")]),
    (error) =>
      error instanceof AdEvidenceIntegrityError &&
      /fixture source cannot be treated as observed evidence/.test(error.message),
  );
});

test("rejects duplicate ad ids before pattern counting", () => {
  assert.throws(
    () => analyzeWinningPatterns([ad("duplicate", "ใหม่"), ad("duplicate", "ซื้อเลย")], "fixture"),
    (error) => error instanceof AdEvidenceIntegrityError && /duplicate ad id/.test(error.message),
  );
});

test("rejects invalid evidence timestamps", () => {
  assert.throws(
    () =>
      analyzeWinningPatterns(
        [ad("bad-time", "ใหม่", "", { provider: "fixture", observedAt: "not-a-date" })],
        "fixture",
      ),
    (error) =>
      error instanceof AdEvidenceIntegrityError &&
      /invalid observedAt timestamp/.test(error.message),
  );
});

test("requires attributable Meta Ad Library identity for observed evidence", () => {
  assert.throws(
    () =>
      analyzeWinningPatterns([
        ad("meta-no-id", "new product", "", {
          provider: "meta-ad-library",
          observedAt: "2026-09-13T00:00:00Z",
        }),
      ]),
    (error) =>
      error instanceof AdEvidenceIntegrityError && /requires an externalId/.test(error.message),
  );
});

test("accepts attributable Meta Ad Library observed evidence", () => {
  const result = analyzeWinningPatterns([
    ad("meta-local-id", "new product shop now", "", {
      provider: "meta-ad-library",
      externalId: "meta-123",
      observedAt: "2026-09-13T00:00:00Z",
    }),
  ]);

  assert.equal(result.dataMode, "observed");
  assert.equal(result.totalAdsAnalyzed, 1);
});

test("rejects the same evidence record on both sides of an angle comparison", () => {
  assert.throws(
    () => findAngleGaps([ad("same-record", "ชุ่มชื้น")], [ad("same-record", "premium")], "fixture"),
    (error) =>
      error instanceof AdEvidenceIntegrityError &&
      /appears in both brand and competitor/.test(error.message),
  );
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
