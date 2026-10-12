/**
 * Anchor rod + nut + washer weight calculation engine.
 *
 * Two independent rod calculation methods are used, selected per size by
 * `SizeRow.method` (a discriminated union — see below). They must never
 * both apply to the same size; that invariant is enforced by the type,
 * not just by convention.
 *
 * - `"calibrated-k"` (M8–M64): (π/4) × d² × L × ρ × k, with a per-size
 *   thread-root correction factor k reverse-engineered from the DIN 975
 *   reference table. M60 is interpolated from its M56/M64 neighbors the
 *   same way M56/M64 themselves are interpolated (flagged `kInterpolated`).
 * - `"geometry-estimate"` (M68–M100): no DIN 975-calibrated k exists for
 *   these sizes, so the rod is computed from first principles using the
 *   ISO metric minor (root) diameter formula, d3 = d − 1.226869 × pitch,
 *   averaged with the nominal diameter over a frustum cross-section —
 *   (π/4) × ((d² + d×d3 + d3²)/3) × L × ρ. This assumes the rod is
 *   THREADED ALONG ITS FULL LENGTH. That is an explicit, visible
 *   assumption for this version, not a general claim that most anchors
 *   are fully threaded — a partial-thread input is a separate,
 *   not-yet-built feature. Cross-checked against the calibrated-k method
 *   across the whole M8–M64 range (where both can be computed): the two
 *   methods agree within 0.4–2.0%, so there is no visible discontinuity
 *   at the M64→M68 boundary.
 *
 * Nut (DIN 934) and washer (DIN 125) per-piece weights come from the
 * KAZENCO reference workbook's "Standard Data" sheet, sourced there as
 * "Published technical reference" — i.e. approximate catalogue masses,
 * not a verified-exact DIN mass specification. DIN/ISO standards define
 * product geometry and tolerances, not a mandated piece weight; actual
 * weight varies by material, tolerance, chamfer and manufacturer
 * geometry. That source table covers every size from M8 up to and
 * including M72 directly (so none of those figures are
 * interpolated/extrapolated), and stops at M72: M80, M90 and M100 have
 * no catalogue or geometry-based nut/washer data anywhere in that
 * workbook (its own engine returns a blank/error for them too, rather
 * than a guess), so this engine does not invent one either — see
 * `SizeRow`'s `hardware` discriminant below. Treat the available
 * nut/washer figures as the single approximate-catalogue reference for
 * this tool; final order/shipping weight still needs supplier
 * confirmation (surfaced in the UI as a standing note).
 *
 * Base density for the nut/washer tables is carbon steel (7850 kg/m³);
 * other materials scale the per-piece gram figure by their own density
 * relative to 7850.
 */

export const ANCHOR_SIZES = [
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
  "M24",
  "M27",
  "M30",
  "M33",
  "M36",
  "M42",
  "M48",
  "M56",
  "M60",
  "M64",
  "M68",
  "M72",
  "M80",
  "M90",
  "M100",
] as const;

export type AnchorSize = (typeof ANCHOR_SIZES)[number];

export type MaterialKey = "carbonSteel" | "hdg" | "stainless";

export const MATERIALS: Record<MaterialKey, { densityKgM3: number }> = {
  carbonSteel: { densityKgM3: 7850 },
  hdg: { densityKgM3: 7850 },
  stainless: { densityKgM3: 7900 },
};

const BASE_DENSITY_KG_M3 = 7850;

/** M8–M64: rod uses the DIN 975-calibrated k factor. Catalogue nut/washer always available. */
export interface CalibratedSizeRow {
  method: "calibrated-k";
  size: AnchorSize;
  diameterMm: number;
  /** Thread-root cross-section correction factor for the rod formula. */
  k: number;
  kInterpolated?: true;
  /** Per-piece nut weight (g) at the base density — approximate catalogue mass (DIN 934). */
  nutWeightG: number;
  /** Per-piece washer weight (g) at the base density — approximate catalogue mass (DIN 125). */
  washerWeightG: number;
}

/** M68–M100: rod uses the full-thread ISO root-diameter geometry estimate (see file header). */
export interface GeometryEstimateSizeRowBase {
  method: "geometry-estimate";
  size: AnchorSize;
  diameterMm: number;
  /** Standard thread pitch (mm), used by the ISO minor-diameter formula. */
  pitchMm: number;
}

/** M68/M72 — catalogue nut/washer weight exists, so both fields are required together. */
export interface GeometryEstimateCatalogHardwareRow extends GeometryEstimateSizeRowBase {
  hardware: "catalog";
  nutWeightG: number;
  washerWeightG: number;
}

/** M80/M90/M100 — no catalogue or geometry data exists for nut/washer at all; the fields cannot be present. */
export interface GeometryEstimateUnsupportedHardwareRow extends GeometryEstimateSizeRowBase {
  hardware: "unsupported";
}

export type GeometryEstimateSizeRow = GeometryEstimateCatalogHardwareRow | GeometryEstimateUnsupportedHardwareRow;

export type SizeRow = CalibratedSizeRow | GeometryEstimateSizeRow;

export const SIZE_TABLE: readonly SizeRow[] = [
  { method: "calibrated-k", size: "M8", diameterMm: 8, k: 0.808, nutWeightG: 5.2, washerWeightG: 1.83 },
  { method: "calibrated-k", size: "M10", diameterMm: 10, k: 0.811, nutWeightG: 11.6, washerWeightG: 3.57 },
  { method: "calibrated-k", size: "M12", diameterMm: 12, k: 0.816, nutWeightG: 17.3, washerWeightG: 6.27 },
  { method: "calibrated-k", size: "M16", diameterMm: 16, k: 0.842, nutWeightG: 33.3, washerWeightG: 11.3 },
  { method: "calibrated-k", size: "M20", diameterMm: 20, k: 0.843, nutWeightG: 64.4, washerWeightG: 17.2 },
  { method: "calibrated-k", size: "M24", diameterMm: 24, k: 0.845, nutWeightG: 110.0, washerWeightG: 32.3 },
  { method: "calibrated-k", size: "M27", diameterMm: 27, k: 0.856, nutWeightG: 165.0, washerWeightG: 42.3 },
  { method: "calibrated-k", size: "M30", diameterMm: 30, k: 0.856, nutWeightG: 223.0, washerWeightG: 53.6 },
  { method: "calibrated-k", size: "M33", diameterMm: 33, k: 0.879, nutWeightG: 288.0, washerWeightG: 75.3 },
  { method: "calibrated-k", size: "M36", diameterMm: 36, k: 0.863, nutWeightG: 393.0, washerWeightG: 92.1 },
  { method: "calibrated-k", size: "M42", diameterMm: 42, k: 0.864, nutWeightG: 652.0, washerWeightG: 183.0 },
  { method: "calibrated-k", size: "M48", diameterMm: 48, k: 0.873, nutWeightG: 977.0, washerWeightG: 294.0 },
  {
    method: "calibrated-k",
    size: "M56",
    diameterMm: 56,
    k: 0.878,
    kInterpolated: true,
    nutWeightG: 1420.0,
    washerWeightG: 425.0,
  },
  {
    // Interpolated from the M56/M64 neighbors the same way M56 and M64
    // themselves are — not from Excel (which has no M60 geometric k
    // either), but catalogue nut/washer for M60 is a direct, real row.
    method: "calibrated-k",
    size: "M60",
    diameterMm: 60,
    k: 0.88,
    kInterpolated: true,
    nutWeightG: 1690.0,
    washerWeightG: 458.0,
  },
  {
    method: "calibrated-k",
    size: "M64",
    diameterMm: 64,
    k: 0.882,
    kInterpolated: true,
    nutWeightG: 1980.0,
    washerWeightG: 492.0,
  },
  {
    method: "geometry-estimate",
    size: "M68",
    diameterMm: 68,
    pitchMm: 6,
    hardware: "catalog",
    nutWeightG: 2300.0,
    washerWeightG: 586.0,
  },
  {
    method: "geometry-estimate",
    size: "M72",
    diameterMm: 72,
    pitchMm: 6,
    hardware: "catalog",
    nutWeightG: 2670.0,
    washerWeightG: 626.0,
  },
  { method: "geometry-estimate", size: "M80", diameterMm: 80, pitchMm: 6, hardware: "unsupported" },
  { method: "geometry-estimate", size: "M90", diameterMm: 90, pitchMm: 6, hardware: "unsupported" },
  { method: "geometry-estimate", size: "M100", diameterMm: 100, pitchMm: 6, hardware: "unsupported" },
];

const SIZE_INDEX: ReadonlyMap<AnchorSize, SizeRow> = new Map(
  SIZE_TABLE.map((row) => [row.size, row]),
);

export function getSizeRow(size: AnchorSize): SizeRow {
  const row = SIZE_INDEX.get(size);
  if (!row) throw new Error(`Unknown anchor size: ${size}`);
  return row;
}

/** Whether catalogue nut/washer weight exists for this size at all. */
export function isHardwareAvailable(size: AnchorSize): boolean {
  const row = getSizeRow(size);
  return row.method === "calibrated-k" || row.hardware === "catalog";
}

export interface CalculatorInput {
  size: AnchorSize;
  lengthMm: number;
  material: MaterialKey;
  /** Number of complete sets (rod + selected nuts/washers) ordered. */
  setQuantity: number;
  includeNut: boolean;
  nutQuantityPerSet: number;
  includeWasher: boolean;
  washerQuantityPerSet: number;
}

export type RodCalculationBasis = "calibrated-k" | "geometry-estimate-full-thread";

export interface CalculatorResult {
  size: AnchorSize;
  rodWeightKgPerPiece: number;
  /** Null when this size has no catalogue nut data at all (see `hardwareAvailable`). */
  nutWeightKgPerPiece: number | null;
  /** Null when this size has no catalogue washer data at all (see `hardwareAvailable`). */
  washerWeightKgPerPiece: number | null;
  setWeightKg: number;
  totalWeightKg: number;
  /** True if the rod's k factor is interpolated (M56/M60/M64) — unrelated to hardware availability. */
  usesInterpolatedData: boolean;
  /** Which method produced rodWeightKgPerPiece — surfaced in the UI as "calculation basis". */
  rodCalculationBasis: RodCalculationBasis;
  /** Whether catalogue nut/washer weight exists for this size (false for M80/M90/M100). */
  hardwareAvailable: boolean;
}

function densityScale(material: MaterialKey): number {
  return MATERIALS[material].densityKgM3 / BASE_DENSITY_KG_M3;
}

export function calculateRodWeightKg(size: AnchorSize, lengthMm: number, material: MaterialKey): number {
  const row = getSizeRow(size);
  const diameterM = row.diameterMm / 1000;
  const lengthM = lengthMm / 1000;
  const density = MATERIALS[material].densityKgM3;

  if (row.method === "calibrated-k") {
    return (Math.PI / 4) * diameterM * diameterM * lengthM * density * row.k;
  }

  // Geometry estimate (M68–M100), full-thread assumption only — see file header.
  const rootDiameterM = (row.diameterMm - 1.226869 * row.pitchMm) / 1000;
  const meanAreaFactor = (diameterM * diameterM + diameterM * rootDiameterM + rootDiameterM * rootDiameterM) / 3;
  return (Math.PI / 4) * meanAreaFactor * lengthM * density;
}

export function calculateNutWeightKg(size: AnchorSize, material: MaterialKey): number {
  const row = getSizeRow(size);
  if (row.method === "geometry-estimate" && row.hardware === "unsupported") {
    throw new Error(`Nut weight is not available for ${size}: no catalogue or geometry data exists for this size.`);
  }
  return (row.nutWeightG / 1000) * densityScale(material);
}

export function calculateWasherWeightKg(size: AnchorSize, material: MaterialKey): number {
  const row = getSizeRow(size);
  if (row.method === "geometry-estimate" && row.hardware === "unsupported") {
    throw new Error(`Washer weight is not available for ${size}: no catalogue or geometry data exists for this size.`);
  }
  return (row.washerWeightG / 1000) * densityScale(material);
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive, finite number (got ${value}).`);
  }
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive whole number (got ${value}).`);
  }
}

export function calculateSet(input: CalculatorInput): CalculatorResult {
  // Defensive engine-level validation: the UI already guards length/quantity
  // (and hardware availability) before calling in, but calculateSet is a
  // public function and should not silently accept bad input if called
  // directly.
  assertPositiveFinite(input.lengthMm, "lengthMm");
  assertPositiveInteger(input.setQuantity, "setQuantity");
  if (input.includeNut) assertPositiveInteger(input.nutQuantityPerSet, "nutQuantityPerSet");
  if (input.includeWasher) assertPositiveInteger(input.washerQuantityPerSet, "washerQuantityPerSet");

  const row = getSizeRow(input.size);
  const hardwareAvailable = isHardwareAvailable(input.size);

  // Never silently treat an unavailable nut/washer as 0 kg — reject the
  // request instead, the same way the reference workbook's own engine
  // returns a blank/error rather than a guess for these sizes.
  if (!hardwareAvailable && (input.includeNut || input.includeWasher)) {
    throw new Error(
      `Nut/washer weight is not available for ${input.size}: no catalogue or geometry data exists for this size.`,
    );
  }

  const rodWeightKgPerPiece = calculateRodWeightKg(input.size, input.lengthMm, input.material);
  const nutWeightKgPerPiece = hardwareAvailable ? calculateNutWeightKg(input.size, input.material) : null;
  const washerWeightKgPerPiece = hardwareAvailable ? calculateWasherWeightKg(input.size, input.material) : null;

  const nutTotal = input.includeNut && nutWeightKgPerPiece !== null ? nutWeightKgPerPiece * input.nutQuantityPerSet : 0;
  const washerTotal =
    input.includeWasher && washerWeightKgPerPiece !== null ? washerWeightKgPerPiece * input.washerQuantityPerSet : 0;

  const setWeightKg = rodWeightKgPerPiece + nutTotal + washerTotal;
  const totalWeightKg = setWeightKg * input.setQuantity;

  // Only the rod's k factor is interpolated, and only for calibrated-k
  // sizes (M56/M60/M64); nut/washer weights are always a direct catalogue
  // row when hardwareAvailable is true, so they never contribute here.
  const usesInterpolatedData = row.method === "calibrated-k" && Boolean(row.kInterpolated);
  const rodCalculationBasis: RodCalculationBasis =
    row.method === "calibrated-k" ? "calibrated-k" : "geometry-estimate-full-thread";

  return {
    size: input.size,
    rodWeightKgPerPiece,
    nutWeightKgPerPiece,
    washerWeightKgPerPiece,
    setWeightKg,
    totalWeightKg,
    usesInterpolatedData,
    rodCalculationBasis,
    hardwareAvailable,
  };
}
