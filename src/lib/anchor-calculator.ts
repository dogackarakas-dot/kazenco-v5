/**
 * Anchor rod + nut + washer weight calculation engine.
 *
 * All tables below are the validated numbers from the design draft
 * ("Ankraj Seti Ağırlık Hesaplayıcı: Tasarım ve İçerik Taslağı"):
 * - Rod: (π/4) × d² × L × ρ × k, with a per-size thread-root correction
 *   factor k reverse-engineered from the DIN 975 reference table.
 * - Nut (DIN 934) and washer (DIN 125A) weights are pre-computed
 *   per-piece figures (hex-prism-minus-bore / annulus-minus-bore geometry),
 *   corrected against real Fabory/Kramp catalog weights with empirical
 *   factors (nut ×0.95, washer ×0.88) to account for the manufactured
 *   corner chamfer that pure geometry ignores.
 * - M27/M33 nut+washer and M42–M64 washer entries are not from a
 *   cross-checked catalog page; they are interpolated/extrapolated from
 *   the validated neighbors (the same approach Portland Bolt discloses
 *   using for sizes their own supplier sheets don't cover) and are
 *   flagged `interpolated: true` so the UI can show a disclaimer.
 * - k for M56/M64 is similarly interpolated (flagged `kInterpolated`).
 *
 * Base density for the nut/washer tables is carbon steel (7850 kg/m³);
 * other materials scale the per-piece gram figure by their own density
 * relative to 7850, per the design draft's §4 note.
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
  /** Per-piece nut weight (g) at the base density (carbon steel, 7850 kg/m³). */
  nutWeightG: number;
  nutInterpolated?: true;
  /** Per-piece washer weight (g) at the base density (carbon steel, 7850 kg/m³). */
  washerWeightG: number;
  washerInterpolated?: true;
}

export const SIZE_TABLE: readonly SizeRow[] = [
  { size: "M8", diameterMm: 8, k: 0.808, nutWeightG: 4.6, washerWeightG: 1.9 },
  { size: "M10", diameterMm: 10, k: 0.811, nutWeightG: 8.6, washerWeightG: 3.6 },
  { size: "M12", diameterMm: 12, k: 0.816, nutWeightG: 12.9, washerWeightG: 5.5 },
  { size: "M16", diameterMm: 16, k: 0.842, nutWeightG: 31.4, washerWeightG: 9.9 },
  { size: "M20", diameterMm: 20, k: 0.843, nutWeightG: 57.8, washerWeightG: 15.1 },
  { size: "M24", diameterMm: 24, k: 0.845, nutWeightG: 99.4, washerWeightG: 28.4 },
  {
    size: "M27",
    diameterMm: 27,
    k: 0.856,
    nutWeightG: 144.6,
    nutInterpolated: true,
    washerWeightG: 37.1,
    washerInterpolated: true,
  },
  { size: "M30", diameterMm: 30, k: 0.856, nutWeightG: 202.1, washerWeightG: 47.2 },
  {
    size: "M33",
    diameterMm: 33,
    k: 0.879,
    nutWeightG: 268.5,
    nutInterpolated: true,
    washerWeightG: 62.6,
    washerInterpolated: true,
  },
  { size: "M36", diameterMm: 36, k: 0.863, nutWeightG: 348.0, washerWeightG: 81.1 },
  {
    size: "M42",
    diameterMm: 42,
    k: 0.864,
    nutWeightG: 536.6,
    washerWeightG: 132.8,
    washerInterpolated: true,
  },
  {
    size: "M48",
    diameterMm: 48,
    k: 0.873,
    nutWeightG: 815.3,
    washerWeightG: 173.9,
    washerInterpolated: true,
  },
  {
    size: "M56",
    diameterMm: 56,
    k: 0.878,
    kInterpolated: true,
    nutWeightG: 1197.9,
    washerWeightG: 279.5,
    washerInterpolated: true,
  },
  {
    size: "M64",
    diameterMm: 64,
    k: 0.882,
    kInterpolated: true,
    nutWeightG: 1646.1,
    washerWeightG: 410.8,
    washerInterpolated: true,
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

  const usesInterpolatedData =
    Boolean(row.kInterpolated) ||
    (input.includeNut && Boolean(row.nutInterpolated)) ||
    (input.includeWasher && Boolean(row.washerInterpolated));

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
