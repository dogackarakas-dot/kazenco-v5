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
  /** Standing disclaimer shown under the header, always — not just for interpolated sizes. */
  catalogNote: string;
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
  /** Label for the rod calculation-basis result row (always shown). */
  calculationBasisLabel: string;
  /** Value shown in the calculation-basis row for M8–M64 (calibrated-k method). */
  basisCalibratedLabel: string;
  /** Value shown in the calculation-basis row for M68–M100 (full-thread geometry estimate). */
  basisGeometryEstimateLabel: string;
  /** Shown whenever the rod uses the full-thread geometry estimate (M68–M100) — states the full-thread assumption explicitly. */
  rodGeometryEstimateNote: string;
  /** Shown instead of/next to the nut & washer toggles when the selected size has no catalogue hardware data (M80–M100). */
  hardwareUnavailableNote: string;
  /** Appended to the RFQ message, replacing the nut/washer lines, when the selected size has no catalogue hardware data (M80–M100). */
  hardwareExcludedRfqLine: string;
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
      "M8–M100 ankraj çubuğu ağırlığını hesaplayın; M8–M72'de set başına ve toplam sipariş ağırlığına yaklaşık katalog somun/pul isteğe bağlı olarak eklenebilir. M80–M100'de yalnızca tam dişli çubuk geometrisi hesaplanır.",
    metaDescriptionSuffix: "Sitede M8–M100 ankraj ağırlık hesaplayıcısı da bulunur (M8–M72 için isteğe bağlı somun/pul seçeneğiyle).",
    catalogNote:
      "Katalog ağırlıkları yaklaşık değerlerdir; kesin sipariş ve sevkiyat ağırlığı tedarikçi teyidine tabidir.",
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
    calculationBasisLabel: "Hesaplama Yöntemi",
    basisCalibratedLabel: "Kalibre edilmiş katsayı (DIN 975)",
    basisGeometryEstimateLabel: "Tam dişli geometri tahmini (ISO kök çapı)",
    rodGeometryEstimateNote:
      "Bu ölçüde çubuk ağırlığı, çubuğun tam boyunca dişli olduğu varsayımıyla hesaplanmıştır; kısmi dişli çubuklar için bu hesap geçerli değildir.",
    hardwareUnavailableNote:
      "Bu ölçüde somun/pul için katalog verisi yoktur; somun ve pul seçenekleri devre dışıdır.",
    hardwareExcludedRfqLine: "Somun/Pul: dahil değil — bu ölçüde katalog verisi yok",
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
      "Calculate M8–M100 anchor rod weight; for M8–M72 the per-set and total order weight can optionally include approximate catalogue nut/washer. For M80–M100 only full-thread rod geometry is calculated.",
    metaDescriptionSuffix: "The page also includes an M8–M100 anchor weight calculator (with an optional nut/washer option for M8–M72).",
    catalogNote:
      "Catalogue weights are approximate; final order and shipping weight is subject to supplier confirmation.",
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
    calculationBasisLabel: "Calculation Basis",
    basisCalibratedLabel: "Calibrated factor (DIN 975)",
    basisGeometryEstimateLabel: "Full-thread geometry estimate (ISO root diameter)",
    rodGeometryEstimateNote:
      "For this size, the rod weight assumes the rod is threaded along its full length; this calculation does not apply to partially threaded rods.",
    hardwareUnavailableNote:
      "No catalogue nut/washer data exists for this size; the nut and washer options are disabled.",
    hardwareExcludedRfqLine: "Nut/Washer: not included — no catalogue data exists for this size",
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
      "Рассчитайте вес анкерного стержня M8–M100; для M8–M72 вес на комплект и итоговый вес заказа может дополнительно включать приблизительный каталожный вес гайки/шайбы (по желанию). Для M80–M100 рассчитывается только геометрия стержня с резьбой по всей длине.",
    metaDescriptionSuffix: "На странице также доступен калькулятор веса анкера M8–M100 (с возможностью добавить гайку/шайбу для M8–M72).",
    catalogNote:
      "Каталожные веса являются приблизительными; точный вес заказа и отгрузки подлежит подтверждению поставщиком.",
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
    calculationBasisLabel: "Метод расчёта",
    basisCalibratedLabel: "Калиброванный коэффициент (DIN 975)",
    basisGeometryEstimateLabel: "Оценка по геометрии (резьба по всей длине, ISO)",
    rodGeometryEstimateNote:
      "Для этого размера вес стержня рассчитан исходя из того, что резьба нанесена по всей длине стержня; этот расчёт не применим к частично резьбовым стержням.",
    hardwareUnavailableNote:
      "Для этого размера отсутствуют каталожные данные по гайке/шайбе; опции гайки и шайбы отключены.",
    hardwareExcludedRfqLine: "Гайка/Шайба: не включены — для этого размера отсутствуют каталожные данные",
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
      "M8–M100 анкер өзегінің салмағын есептеңіз; M8–M72 үшін жиынтық және жалпы тапсырыс салмағына қалауыңыз бойынша жуық каталог гайка/шайба салмағы қосылуы мүмкін. M80–M100 үшін тек толық бұрандалы өзек геометриясы есептеледі.",
    metaDescriptionSuffix: "Бетте M8–M100 анкер салмағын есептеу құралы да қолжетімді (M8–M72 үшін қалауыңызша гайка/шайба қосу мүмкіндігімен).",
    catalogNote:
      "Каталог салмақтары жуық мәндер; тапсырыс пен жеткізудің нақты салмағы жеткізушінің растауына жатады.",
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
    calculationBasisLabel: "Есептеу әдісі",
    basisCalibratedLabel: "Калибрленген коэффициент (DIN 975)",
    basisGeometryEstimateLabel: "Толық бұрандалы геометриялық бағалау (ISO)",
    rodGeometryEstimateNote:
      "Бұл өлшем үшін өзек салмағы өзектің толық бойымен бұрандалы болуы негізінде есептелген; бұл есептеу ішінара бұрандалы өзектерге қолданылмайды.",
    hardwareUnavailableNote:
      "Бұл өлшем үшін гайка/шайба бойынша каталог деректері жоқ; гайка және шайба опциялары өшірілген.",
    hardwareExcludedRfqLine: "Гайка/Шайба: кірмейді — бұл өлшем үшін каталог деректері жоқ",
    rfqButtonLabel: "Баға сұрау",
    rfqMessagePrefix: "Салмақ калькуляторынан келген сұрау",
    lengthInvalid: "Жарамды ұзындық енгізіңіз.",
    quantityInvalid: "Жарамды сан енгізіңіз.",
    gridCtaLabel: "Салмақты есептеу",
  },
};
