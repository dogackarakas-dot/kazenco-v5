"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import { DeferredContactModal } from "@/components/DeferredContactModal";
import type { Locale } from "@/lib/i18n";
import {
  ANCHOR_SIZES,
  calculateSet,
  type AnchorSize,
  type CalculatorResult,
  type MaterialKey,
} from "@/lib/anchor-calculator";
import { CALCULATOR_COPY } from "@/lib/anchor-calculator-translations";
import styles from "./AnchorWeightCalculator.module.css";

export interface AnchorWeightCalculatorProps {
  locale: Locale;
}

const LENGTH_PRESETS_MM = [300, 500, 1000];

const MATERIAL_KEYS: MaterialKey[] = ["carbonSteel", "hdg", "stainless"];

const NUMBER_LOCALE: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  ru: "ru-RU",
  kz: "kk-KZ",
};

function formatKg(value: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value);
}

export function AnchorWeightCalculator({ locale }: AnchorWeightCalculatorProps) {
  const copy = CALCULATOR_COPY[locale];
  const titleId = useId();

  const [size, setSize] = useState<AnchorSize>("M20");
  const [lengthMm, setLengthMm] = useState("500");
  const [material, setMaterial] = useState<MaterialKey>("carbonSteel");
  const [setQuantity, setSetQuantity] = useState("10");
  const [includeNut, setIncludeNut] = useState(true);
  const [nutQuantityPerSet, setNutQuantityPerSet] = useState("1");
  const [includeWasher, setIncludeWasher] = useState(true);
  const [washerQuantityPerSet, setWasherQuantityPerSet] = useState("1");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [resultSignature, setResultSignature] = useState<string | null>(null);
  const [error, setError] = useState("");

  const activePreset = useMemo(() => {
    const parsed = Number(lengthMm);
    return LENGTH_PRESETS_MM.includes(parsed) ? parsed : null;
  }, [lengthMm]);

  // Identifies exactly the inputs a result was calculated from. If the user
  // changes any field after calculating, this signature no longer matches
  // the one `result` was computed with — so the stale result (and the RFQ
  // message built from it) is hidden instead of silently showing numbers
  // that no longer match what's selected. Derived at render time rather
  // than cleared from an effect, so there's no extra render pass.
  const currentSignature = [
    size,
    lengthMm,
    material,
    setQuantity,
    includeNut,
    nutQuantityPerSet,
    includeWasher,
    washerQuantityPerSet,
  ].join("|");
  const displayResult = result && resultSignature === currentSignature ? result : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Parsed as-is — no rounding and no silent "|| 1" fallback. Rounding
    // before validation would accept a non-integer like "1.4" as 1, and
    // defaulting an empty/zero/invalid count to 1 would silently accept bad
    // input instead of rejecting it. Both must fail validation below.
    const parsedLength = Number(lengthMm);
    const parsedQuantity = Number(setQuantity);
    const parsedNutQty = Number(nutQuantityPerSet);
    const parsedWasherQty = Number(washerQuantityPerSet);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      setError(copy.lengthInvalid);
      setResult(null);
      setResultSignature(null);
      return;
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError(copy.quantityInvalid);
      setResult(null);
      setResultSignature(null);
      return;
    }
    if (includeNut && (!Number.isInteger(parsedNutQty) || parsedNutQty <= 0)) {
      setError(copy.quantityInvalid);
      setResult(null);
      setResultSignature(null);
      return;
    }
    if (includeWasher && (!Number.isInteger(parsedWasherQty) || parsedWasherQty <= 0)) {
      setError(copy.quantityInvalid);
      setResult(null);
      setResultSignature(null);
      return;
    }

    setError("");
    // calculateSet also validates defensively; wrapped in try/catch so a
    // call path we haven't anticipated here shows the generic error instead
    // of throwing an unhandled exception in the UI.
    try {
      setResult(
        calculateSet({
          size,
          lengthMm: parsedLength,
          material,
          setQuantity: parsedQuantity,
          includeNut,
          nutQuantityPerSet: parsedNutQty,
          includeWasher,
          washerQuantityPerSet: parsedWasherQty,
        }),
      );
      setResultSignature(currentSignature);
    } catch {
      setError(copy.quantityInvalid);
      setResult(null);
      setResultSignature(null);
    }
  }

  const rfqMessage = displayResult
    ? [
        copy.rfqMessagePrefix,
        `${copy.sizeLabel}: ${size}`,
        `${copy.lengthLabel}: ${lengthMm} ${copy.lengthUnit}`,
        `${copy.materialLabel}: ${copy.materials[material]}`,
        `${copy.quantityLabel}: ${setQuantity}`,
        `${copy.includeNutLabel}: ${includeNut ? `${copy.perSetSuffix} × ${nutQuantityPerSet}` : "—"}`,
        `${copy.includeWasherLabel}: ${includeWasher ? `${copy.perSetSuffix} × ${washerQuantityPerSet}` : "—"}`,
        `${copy.resultSetLabel}: ${formatKg(displayResult.setWeightKg, locale)} kg`,
        `${copy.resultTotalLabel}: ${formatKg(displayResult.totalWeightKg, locale)} kg`,
      ].join("\n")
    : "";

  return (
    <section id="weight-calculator" className={styles.section} aria-labelledby={titleId}>
      <div className={styles.header}>
        <p className={styles.kicker}>{copy.kicker}</p>
        <h2 id={titleId} className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.description}</p>
        <p className={styles.catalogNote}>{copy.catalogNote}</p>
      </div>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span>{copy.sizeLabel}</span>
              <select value={size} onChange={(event) => setSize(event.target.value as AnchorSize)}>
                {ANCHOR_SIZES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{copy.lengthLabel}</span>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={lengthMm}
                onChange={(event) => setLengthMm(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.chips} role="group" aria-label={copy.lengthLabel}>
            {LENGTH_PRESETS_MM.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`${styles.chip}${activePreset === preset ? ` ${styles.isActive}` : ""}`}
                aria-pressed={activePreset === preset}
                onClick={() => setLengthMm(String(preset))}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span>{copy.materialLabel}</span>
              <select value={material} onChange={(event) => setMaterial(event.target.value as MaterialKey)}>
                {MATERIAL_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {copy.materials[key]}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{copy.quantityLabel}</span>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={setQuantity}
                onChange={(event) => setSetQuantity(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={includeNut}
                onChange={(event) => setIncludeNut(event.target.checked)}
              />
              {copy.includeNutLabel}
            </label>
            {includeNut && (
              <input
                type="number"
                min={1}
                inputMode="numeric"
                aria-label={`${copy.includeNutLabel} — ${copy.perSetSuffix}`}
                className={styles.miniQty}
                value={nutQuantityPerSet}
                onChange={(event) => setNutQuantityPerSet(event.target.value)}
              />
            )}

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={includeWasher}
                onChange={(event) => setIncludeWasher(event.target.checked)}
              />
              {copy.includeWasherLabel}
            </label>
            {includeWasher && (
              <input
                type="number"
                min={1}
                inputMode="numeric"
                aria-label={`${copy.includeWasherLabel} — ${copy.perSetSuffix}`}
                className={styles.miniQty}
                value={washerQuantityPerSet}
                onChange={(event) => setWasherQuantityPerSet(event.target.value)}
              />
            )}
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.submit}>
            {copy.calculateButton}
          </button>
        </form>

        <div className={styles.resultPanel} role="status" aria-live="polite">
          {displayResult ? (
            <>
              <dl className={styles.resultList}>
                <div className={styles.resultRow}>
                  <dt>{copy.resultRodLabel}</dt>
                  <dd>{formatKg(displayResult.rodWeightKgPerPiece, locale)} kg</dd>
                </div>
                {includeNut && (
                  <div className={styles.resultRow}>
                    <dt>
                      {copy.resultNutLabel}
                      {Number(nutQuantityPerSet) > 1 ? ` (× ${nutQuantityPerSet})` : ""}
                    </dt>
                    <dd>
                      {formatKg(displayResult.nutWeightKgPerPiece, locale)} kg/{copy.perSetSuffix}
                    </dd>
                  </div>
                )}
                {includeWasher && (
                  <div className={styles.resultRow}>
                    <dt>
                      {copy.resultWasherLabel}
                      {Number(washerQuantityPerSet) > 1 ? ` (× ${washerQuantityPerSet})` : ""}
                    </dt>
                    <dd>
                      {formatKg(displayResult.washerWeightKgPerPiece, locale)} kg/{copy.perSetSuffix}
                    </dd>
                  </div>
                )}
                <div className={styles.resultRow}>
                  <dt>{copy.resultSetLabel}</dt>
                  <dd>{formatKg(displayResult.setWeightKg, locale)} kg</dd>
                </div>
                <div className={`${styles.resultRow} ${styles.resultRowTotal}`}>
                  <dt>{copy.resultTotalLabel}</dt>
                  <dd>{formatKg(displayResult.totalWeightKg, locale)} kg</dd>
                </div>
              </dl>

              {displayResult.usesInterpolatedData && <p className={styles.note}>{copy.interpolatedNote}</p>}

              <div className={styles.rfq}>
                <DeferredContactModal
                  triggerClassName={styles.rfqButton}
                  triggerLabel={copy.rfqButtonLabel}
                  initialMessage={rfqMessage}
                />
              </div>
            </>
          ) : (
            <p className={styles.placeholder}>{copy.placeholder}</p>
          )}
        </div>
      </div>
    </section>
  );
}
