/**
 * Anchor rod + nut + washer weight calculation engine.
 *
 * - Rod: (π/4) × d² × L × ρ × k, with a per-size thread-root correction
 *   factor k reverse-engineered from the DIN 975 reference table.
 * - Nut (DIN 934) and washer (DIN 125) per-piece weights come from the
 *   KAZENCO reference workbook's "Standard Data" sheet, sourced there as
 *   "Published technical reference" — i.e. approximate catalogue masses,
 *   not a verified-exact DIN mass specification. DIN/ISO standards define
 *   product geometry and tolerances, not a mandated piece weight; actual
 *   weight varies by material, tolerance, chamfer and manufacturer
 *   geometry. (For reference, current ISO 4032:2023 covers M5–M39; the
 *   superseded ISO 4032:2012 extended to M64, which is why some of these
 *   larger sizes won't appear in a from-scratch ISO 4032:2023 lookup.)
 *   Every size from M8 to M64 now has a direct row in that source table,
 *   so none of the nut/washer figures below are interpolated/extrapolated
 *   — `nutInterpolated`/`washerInterpolated` have been removed accordingly.
 *   Treat these as the single approximate-catalogue reference for this
 *   tool; final order/shipping weight still needs supplier confirmation
 *   (surfaced in the UI as a standing note, not just for edge sizes).
 * - k for M56/M64 is interpolated from neighboring validated sizes
 *   (flagged `kInterpolated`) — unrelated to the nut/washer source above,
 *   and left as-is.
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
  "M64",
] as const;

export type AnchorSize = (typeof ANCHOR_SIZES)[number];

export type MaterialKey = "carbonSteel" | "hdg" | "stainless";

export const MATERIALS: Record<MaterialKey, { densityKgM3: number }> = {
  carbonSteel: { densityKgM3: 7850 },
  hdg: { densityKgM3: 7850 },
  stainless: { densityKgM3: 7900 },
};

const BASE_DENSITY_KG_M3 = 7850;

export interface SizeRow {
  size: AnchorSize;
  diameterMm: number;
  /** Thread-root cross-section correction factor for the rod formula. */
  k: number;
  kInterpolated?: true;
  /**
   * Per-piece nut weight (g) at the base density (carbon steel, 7850 kg/m³).
   * Approximate catalogue mass (DIN 934 profile) — see the file header.
   */
  nutWeightG: number;
  /**
   * Per-piece washer weight (g) at the base density (carbon steel, 7850 kg/m³).
   * Approximate catalogue mass (DIN 125 profile) — see the file header.
   */
  washerWeightG: number;
}

export const SIZE_TABLE: readonly SizeRow[] = [
  { size: "M8", diameterMm: 8, k: 0.808, nutWeightG: 5.2, washerWeightG: 1.83 },
  { size: "M10", diameterMm: 10, k: 0.811, nutWeightG: 11.6, washerWeightG: 3.57 },
  { size: "M12", diameterMm: 12, k: 0.816, nutWeightG: 17.3, washerWeightG: 6.27 },
  { size: "M16", diameterMm: 16, k: 0.842, nutWeightG: 33.3, washerWeightG: 11.3 },
  { size: "M20", diameterMm: 20, k: 0.843, nutWeightG: 64.4, washerWeightG: 17.2 },
  { size: "M24", diameterMm: 24, k: 0.845, nutWeightG: 110.0, washerWeightG: 32.3 },
  { size: "M27", diameterMm: 27, k: 0.856, nutWeightG: 165.0, washerWeightG: 42.3 },
  { size: "M30", diameterMm: 30, k: 0.856, nutWeightG: 223.0, washerWeightG: 53.6 },
  { size: "M33", diameterMm: 33, k: 0.879, nutWeightG: 288.0, washerWeightG: 75.3 },
  { size: "M36", diameterMm: 36, k: 0.863, nutWeightG: 393.0, washerWeightG: 92.1 },
  { size: "M42", diameterMm: 42, k: 0.864, nutWeightG: 652.0, washerWeightG: 183.0 },
  { size: "M48", diameterMm: 48, k: 0.873, nutWeightG: 977.0, washerWeightG: 294.0 },
  {
    size: "M56",
    diameterMm: 56,
    k: 0.878,
    kInterpolated: true,
    nutWeightG: 1420.0,
    washerWeightG: 425.0,
  },
  {
    size: "M64",
    diameterMm: 64,
    k: 0.882,
    kInterpolated: true,
    nutWeightG: 1980.0,
    washerWeightG: 492.0,
  },
];

const SIZE_INDEX: ReadonlyMap<AnchorSize, SizeRow> = new Map(
  SIZE_TABLE.map((row) => [row.size, row]),
);

export function getSizeRow(size: AnchorSize): SizeRow {
  const row = SIZE_INDEX.get(size);
  if (!row) throw new Error(`Unknown anchor size: ${size}`);
  return row;
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

export interface CalculatorResult {
  size: AnchorSize;
  rodWeightKgPerPiece: number;
  nutWeightKgPerPiece: number;
  washerWeightKgPerPiece: number;
  setWeightKg: number;
  totalWeightKg: number;
  /** True if any figure feeding this result relies on an interpolated/extrapolated table entry. */
  usesInterpolatedData: boolean;
}

function densityScale(material: MaterialKey): number {
  return MATERIALS[material].densityKgM3 / BASE_DENSITY_KG_M3;
}

export function calculateRodWeightKg(size: AnchorSize, lengthMm: number, material: MaterialKey): number {
  const row = getSizeRow(size);
  const diameterM = row.diameterMm / 1000;
  const lengthM = lengthMm / 1000;
  const density = MATERIALS[material].densityKgM3;
  return (Math.PI / 4) * diameterM * diameterM * lengthM * density * row.k;
}

export function calculateNutWeightKg(size: AnchorSize, material: MaterialKey): number {
  const row = getSizeRow(size);
  return (row.nutWeightG / 1000) * densityScale(material);
}

export function calculateWasherWeightKg(size: AnchorSize, material: MaterialKey): number {
  const row = getSizeRow(size);
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
  // before calling in, but calculateSet is a public function and should not
  // silently accept negative, zero or fractional counts if called directly.
  assertPositiveFinite(input.lengthMm, "lengthMm");
  assertPositiveInteger(input.setQuantity, "setQuantity");
  if (input.includeNut) assertPositiveInteger(input.nutQuantityPerSet, "nutQuantityPerSet");
  if (input.includeWasher) assertPositiveInteger(input.washerQuantityPerSet, "washerQuantityPerSet");

  const row = getSizeRow(input.size);
  const rodWeightKgPerPiece = calculateRodWeightKg(input.size, input.lengthMm, input.material);
  const nutWeightKgPerPiece = calculateNutWeightKg(input.size, input.material);
  const washerWeightKgPerPiece = calculateWasherWeightKg(input.size, input.material);

  const nutTotal = input.includeNut ? nutWeightKgPerPiece * input.nutQuantityPerSet : 0;
  const washerTotal = input.includeWasher ? washerWeightKgPerPiece * input.washerQuantityPerSet : 0;

  const setWeightKg = rodWeightKgPerPiece + nutTotal + washerTotal;
  const totalWeightKg = setWeightKg * input.setQuantity;

  // Only the rod's k factor is still interpolated for any size (M56/M64);
  // nut/washer weights now have a direct row in the reference table for
  // every supported size, so they no longer contribute to this flag.
  const usesInterpolatedData = Boolean(row.kInterpolated);

  return {
    size: input.size,
    rodWeightKgPerPiece,
    nutWeightKgPerPiece,
    washerWeightKgPerPiece,
    setWeightKg,
    totalWeightKg,
    usesInterpolatedData,
  };
}
