import type { Locale } from "@/lib/i18n";
import type { MaterialKey } from "@/lib/anchor-calculator";

/**
 * Copy for the anchor weight calculator tool.
 *
 * Deliberately NOT using the site's existing positional string-array
 * pattern (see section-translations.ts / product-translations.ts) —
 * a named-field record is far less error-prone for a form with this
 * many distinct labels, where a single insertion would silently shift
 * every index after it. This is a one-off, intentional deviation from
 * that convention for this component only.
 */
export interface CalculatorCopy {
  kicker: string;
  title: string;
  description: string;
  /** Appended to the fasteners-anchor-bolts page's SEO meta description only (not shown on the page itself). */
  metaDescriptionSuffix: string;
  placeholder: string;
  sizeLabel: string;
  lengthLabel: string;
  lengthUnit: string;
  materialLabel: string;
  materials: Record<MaterialKey, string>;
  quantityLabel: string;
  includeNutLabel: string;
  includeWasherLabel: string;
  perSetSuffix: string;
  calculateButton: string;
  resultRodLabel: string;
  resultNutLabel: string;
  resultWasherLabel: string;
  resultSetLabel: string;
  resultTotalLabel: string;
  interpolatedNote: string;
  rfqButtonLabel: string;
  rfqMessagePrefix: string;
  lengthInvalid: string;
  quantityInvalid: string;
  /** Label for the "jump to calculator" CTA on the fasteners-anchor-bolts product card. */
  gridCtaLabel: string;
}

export const CALCULATOR_COPY: Record<Locale, CalculatorCopy> = {
  tr: {
    kicker: "Hesaplama Aracı",
    title: "Ankraj / Somun / Pul Ağırlık Hesaplama",
    description:
      "M8–M64 ankraj çubuğu, somun ve pul ağırlıklarını hesaplayın; set başına ve toplam sipariş ağırlığını görün.",
    metaDescriptionSuffix: "Sitede M8–M64 ankraj seti ağırlık hesaplayıcısı da bulunur.",
    placeholder: "Ölçü, malzeme ve adet girip Hesapla'ya basın — set ve toplam ağırlık burada görünecek.",
    sizeLabel: "Ölçü",
    lengthLabel: "Boy (mm)",
    lengthUnit: "mm",
    materialLabel: "Malzeme",
    materials: {
      carbonSteel: "Karbon Çelik",
      hdg: "Sıcak Daldırma Galvaniz (HDG)",
      stainless: "Paslanmaz Çelik (304/316)",
    },
    quantityLabel: "Adet (set)",
    includeNutLabel: "Somun ekle",
    includeWasherLabel: "Pul ekle",
    perSetSuffix: "adet",
    calculateButton: "Hesapla",
    resultRodLabel: "Çubuk",
    resultNutLabel: "Somun",
    resultWasherLabel: "Pul",
    resultSetLabel: "Set başı",
    resultTotalLabel: "Toplam",
    interpolatedNote:
      "Bu ölçüde ağırlık, standart ölçü ilişkisinden tahmin edilmiştir; kesin sipariş öncesi teyit öneririz.",
    rfqButtonLabel: "Teklif İste",
    rfqMessagePrefix: "Ağırlık hesaplayıcısından gelen talep",
    lengthInvalid: "Lütfen geçerli bir boy girin.",
    quantityInvalid: "Lütfen geçerli bir adet girin.",
    gridCtaLabel: "Ağırlık hesapla",
  },
  en: {
    kicker: "Calculation Tool",
    title: "Anchor Bolt / Nut / Washer Weight Calculator",
    description:
      "Calculate M8–M64 anchor rod, nut and washer weights — per set and for the full order.",
    metaDescriptionSuffix: "The page also includes an M8–M64 anchor set weight calculator.",
    placeholder: "Enter size, material and quantity, then press Calculate — the per-set and total weight will appear here.",
    sizeLabel: "Size",
    lengthLabel: "Length (mm)",
    lengthUnit: "mm",
    materialLabel: "Material",
    materials: {
      carbonSteel: "Carbon Steel",
      hdg: "Hot-Dip Galvanized (HDG)",
      stainless: "Stainless Steel (304/316)",
    },
    quantityLabel: "Quantity (sets)",
    includeNutLabel: "Add nut",
    includeWasherLabel: "Add washer",
    perSetSuffix: "pcs",
    calculateButton: "Calculate",
    resultRodLabel: "Rod",
    resultNutLabel: "Nut",
    resultWasherLabel: "Washer",
    resultSetLabel: "Per set",
    resultTotalLabel: "Total",
    interpolatedNote:
      "This size's weight is estimated from the standard dimension relationship; please confirm before placing a firm order.",
    rfqButtonLabel: "Request a Quote",
    rfqMessagePrefix: "Request from the weight calculator",
    lengthInvalid: "Please enter a valid length.",
    quantityInvalid: "Please enter a valid quantity.",
    gridCtaLabel: "Calculate weight",
  },
  ru: {
    kicker: "Инструмент расчёта",
    title: "Расчёт веса анкерного болта / гайки / шайбы",
    description:
      "Рассчитайте вес анкерного стержня, гайки и шайбы M8–M64 — на комплект и на весь заказ.",
    metaDescriptionSuffix: "На странице также доступен калькулятор веса анкерного комплекта M8–M64.",
    placeholder: "Укажите размер, материал и количество и нажмите «Рассчитать» — вес на комплект и итоговый вес появятся здесь.",
    sizeLabel: "Размер",
    lengthLabel: "Длина (мм)",
    lengthUnit: "мм",
    materialLabel: "Материал",
    materials: {
      carbonSteel: "Углеродистая сталь",
      hdg: "Горячее цинкование (HDG)",
      stainless: "Нержавеющая сталь (304/316)",
    },
    quantityLabel: "Количество (комплектов)",
    includeNutLabel: "Добавить гайку",
    includeWasherLabel: "Добавить шайбу",
    perSetSuffix: "шт.",
    calculateButton: "Рассчитать",
    resultRodLabel: "Стержень",
    resultNutLabel: "Гайка",
    resultWasherLabel: "Шайба",
    resultSetLabel: "На комплект",
    resultTotalLabel: "Итого",
    interpolatedNote:
      "Вес для этого размера оценён на основе зависимости стандартных размеров; перед окончательным заказом рекомендуем подтверждение.",
    rfqButtonLabel: "Запросить предложение",
    rfqMessagePrefix: "Запрос из калькулятора веса",
    lengthInvalid: "Пожалуйста, введите корректную длину.",
    quantityInvalid: "Пожалуйста, введите корректное количество.",
    gridCtaLabel: "Рассчитать вес",
  },
  kz: {
    kicker: "Есептеу құралы",
    title: "Анкер болт / гайка / шайба салмағын есептеу",
    description:
      "M8–M64 анкер өзегі, гайка және шайба салмағын есептеңіз — жиынтыққа және жалпы тапсырысқа.",
    metaDescriptionSuffix: "Бетте M8–M64 анкер жиынтығының салмақ калькуляторы да қолжетімді.",
    placeholder: "Өлшемді, материалды және санды енгізіп, «Есептеу» түймесін басыңыз — жиынтық және жалпы салмақ осында көрінеді.",
    sizeLabel: "Өлшем",
    lengthLabel: "Ұзындық (мм)",
    lengthUnit: "мм",
    materialLabel: "Материал",
    materials: {
      carbonSteel: "Көміртекті болат",
      hdg: "Ыстық мырышталған (HDG)",
      stainless: "Тот баспайтын болат (304/316)",
    },
    quantityLabel: "Саны (жиынтық)",
    includeNutLabel: "Гайка қосу",
    includeWasherLabel: "Шайба қосу",
    perSetSuffix: "дана",
    calculateButton: "Есептеу",
    resultRodLabel: "Өзек",
    resultNutLabel: "Гайка",
    resultWasherLabel: "Шайба",
    resultSetLabel: "Жиынтығына",
    resultTotalLabel: "Барлығы",
    interpolatedNote:
      "Бұл өлшемнің салмағы стандартты өлшем қатынасынан болжанған; түпкілікті тапсырыс алдында растауды ұсынамыз.",
    rfqButtonLabel: "Баға сұрау",
    rfqMessagePrefix: "Салмақ калькуляторынан келген сұрау",
    lengthInvalid: "Жарамды ұзындық енгізіңіз.",
    quantityInvalid: "Жарамды сан енгізіңіз.",
    gridCtaLabel: "Салмақты есептеу",
  },
};
