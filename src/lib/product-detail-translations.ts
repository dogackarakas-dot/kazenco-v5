import type { Locale } from "@/lib/i18n";
import { productCopy } from "@/lib/product-translations";

interface DetailItem {
  title: string;
  description: string;
}

interface TechnicalRow {
  label: string;
  value: string;
}

export interface ProductDetailCopy {
  back: string;
  category: string;
  overviewKicker: string;
  overviewTitle: string;
  overview: string;
  rangeKicker: string;
  rangeTitle: string;
  range: DetailItem[];
  technicalKicker: string;
  technicalTitle: string;
  technical: TechnicalRow[];
  processKicker: string;
  processTitle: string;
  process: DetailItem[];
  rfqKicker: string;
  rfqTitle: string;
  rfqIntro: string;
  rfqItems: string[];
  primaryCta: string;
  secondaryCta: string;
}

export const PIPES_TUBES_DETAIL: Record<Locale, ProductDetailCopy> = {
  en: {
    back: "Back to products",
    category: "Industrial piping",
    overviewKicker: "Supply overview",
    overviewTitle: "Piping materials aligned with project requirements.",
    overview: "KAZENCO coordinates the project-based supply of carbon steel, stainless steel, alloy and duplex pipes and tubes for refinery, petrochemical, energy and industrial applications. Each enquiry is reviewed against the required material, dimensions, manufacturing type, standards, documentation and delivery conditions.",
    rangeKicker: "Product range",
    rangeTitle: "Core pipe and tube supply",
    range: [
      { title: "Carbon Steel Pipes", description: "Seamless and welded carbon steel piping for industrial and process applications." },
      { title: "Stainless Steel Pipes & Tubes", description: "Corrosion-resistant stainless steel pipe and tube products for project-specific service conditions." },
      { title: "Alloy & Duplex Pipes", description: "Alloy steel and duplex piping selected in accordance with the approved project specification." },
      { title: "Seamless & Welded Pipes", description: "Manufacturing types coordinated to the required dimensions, service and applicable standard." },
    ],
    technicalKicker: "Technical alignment",
    technicalTitle: "Supply basis and documentation",
    technical: [
      { label: "Material families", value: "Seamless CS (ASTM A106 Gr. B/C), stainless (ASTM A312 TP304/304L/316/316L), alloy (ASTM A335 P11/P22/P91)" },
      { label: "Manufacturing types", value: "Seamless and welded" },
      { label: "Applicable standards", value: "ASTM A106 / A312 / A335 material standards; ASME B36.10M and B36.19M dimensional standards" },
      { label: "Documentation", value: "MTC, CoC and agreed quality records according to the approved RFQ" },
      { label: "Supply basis", value: "Specification, quantity, required date and delivery location" },
      { label: "Delivery coordination", value: "Manufacturer coordination, packaging and shipment planning" },
    ],
    processKicker: "Procurement process",
    processTitle: "From technical enquiry to delivery",
    process: [
      { title: "Technical review", description: "Review material, dimensions, manufacturing type, standards, quantities and documentation requirements." },
      { title: "Manufacturer coordination", description: "Coordinate suitable manufacturers and the commercial conditions of the requested supply package." },
      { title: "Documentation review", description: "Compile and review the agreed material certificates, conformity documents and quality records." },
      { title: "Delivery planning", description: "Coordinate packaging, transportation and delivery according to the approved schedule and destination." },
    ],
    rfqKicker: "Request preparation",
    rfqTitle: "Information to include in your pipe and tube enquiry",
    rfqIntro: "Providing the following information helps our team review the requirement accurately and prepare the appropriate supply package.",
    rfqItems: ["Material grade", "Pipe or tube type", "Outside diameter and wall thickness", "Schedule or dimensional standard", "Seamless or welded construction", "Quantity and unit", "Applicable standard", "Required documentation", "Delivery location", "Required delivery date"],
    primaryCta: "Request a quote",
    secondaryCta: "View procurement process",
  },
  tr: {
    back: "Ürünlere dön",
    category: "Endüstriyel borulama",
    overviewKicker: "Tedarik özeti",
    overviewTitle: "Proje gereksinimlerine uygun borulama malzemeleri.",
    overview: "KAZENCO; rafineri, petrokimya, enerji ve endüstriyel uygulamalar için karbon çelik, paslanmaz çelik, alaşımlı ve dubleks boruların proje bazlı tedarikini koordine eder. Her talep; malzeme, ölçü, üretim tipi, standart, dokümantasyon ve teslimat koşullarına göre incelenir.",
    rangeKicker: "Ürün kapsamı",
    rangeTitle: "Temel boru ve tüp ürünleri",
    range: [
      { title: "Karbon Çelik Borular", description: "Endüstriyel ve proses uygulamaları için dikişsiz ve kaynaklı karbon çelik borular." },
      { title: "Paslanmaz Çelik Borular ve Tüpler", description: "Projeye özel servis koşulları için korozyona dayanıklı paslanmaz çelik boru ve tüp ürünleri." },
      { title: "Alaşımlı ve Dubleks Borular", description: "Onaylı proje şartnamesine göre seçilen alaşımlı çelik ve dubleks boru ürünleri." },
      { title: "Dikişsiz ve Kaynaklı Borular", description: "Gerekli ölçü, servis koşulu ve ilgili standarda göre koordine edilen üretim tipleri." },
    ],
    technicalKicker: "Teknik uyum",
    technicalTitle: "Tedarik esası ve dokümantasyon",
    technical: [
      { label: "Malzeme grupları", value: "Dikişsiz karbon çelik (ASTM A106 Gr. B/C), paslanmaz çelik (ASTM A312 TP304/304L/316/316L), alaşımlı çelik (ASTM A335 P11/P22/P91)" },
      { label: "Üretim tipleri", value: "Dikişsiz ve kaynaklı" },
      { label: "İlgili standartlar", value: "ASTM A106 / A312 / A335 malzeme standartları; ASME B36.10M ve B36.19M ölçü standartları" },
      { label: "Dokümantasyon", value: "Onaylı RFQ kapsamına göre MTC, CoC ve mutabık kalınan kalite kayıtları" },
      { label: "Tedarik esası", value: "Şartname, miktar, gerekli tarih ve teslimat konumu" },
      { label: "Teslimat koordinasyonu", value: "Üretici koordinasyonu, paketleme ve sevkiyat planlaması" },
    ],
    processKicker: "Tedarik süreci",
    processTitle: "Teknik talepten teslimata",
    process: [
      { title: "Teknik inceleme", description: "Malzeme, ölçü, üretim tipi, standart, miktar ve dokümantasyon gereksinimlerinin incelenmesi." },
      { title: "Üretici koordinasyonu", description: "Uygun üreticilerin ve talep edilen tedarik paketine ait ticari koşulların koordine edilmesi." },
      { title: "Dokümantasyon kontrolü", description: "Mutabık kalınan malzeme sertifikaları, uygunluk belgeleri ve kalite kayıtlarının derlenip incelenmesi." },
      { title: "Teslimat planlaması", description: "Paketleme, taşıma ve teslimatın onaylı program ve varış noktasına göre koordine edilmesi." },
    ],
    rfqKicker: "Talep hazırlığı",
    rfqTitle: "Boru ve tüp talebinizde bulunması gereken bilgiler",
    rfqIntro: "Aşağıdaki bilgilerin paylaşılması, ekibimizin gereksinimi doğru değerlendirmesine ve uygun tedarik paketini hazırlamasına yardımcı olur.",
    rfqItems: ["Malzeme sınıfı", "Boru veya tüp tipi", "Dış çap ve et kalınlığı", "Schedule veya ölçü standardı", "Dikişsiz veya kaynaklı üretim", "Miktar ve birim", "İlgili standart", "Gerekli dokümantasyon", "Teslimat yeri", "İstenen teslim tarihi"],
    primaryCta: "Teklif talep et",
    secondaryCta: "Tedarik sürecini incele",
  },
  ru: {
    back: "Вернуться к продукции", category: "Промышленные трубопроводы", overviewKicker: "Обзор поставки", overviewTitle: "Трубная продукция в соответствии с требованиями проекта.", overview: "KAZENCO координирует проектные поставки труб из углеродистой, нержавеющей, легированной и дуплексной стали для нефтеперерабатывающих, нефтехимических, энергетических и промышленных объектов. Каждый запрос проверяется по материалу, размерам, типу производства, стандартам, документации и условиям доставки.", rangeKicker: "Ассортимент продукции", rangeTitle: "Основные группы трубной продукции",
    range: [{ title: "Трубы из углеродистой стали", description: "Бесшовные и сварные трубы для промышленных и технологических систем." }, { title: "Трубы из нержавеющей стали", description: "Коррозионностойкая трубная продукция для заданных условий эксплуатации." }, { title: "Легированные и дуплексные трубы", description: "Трубная продукция, подобранная по утверждённой спецификации проекта." }, { title: "Бесшовные и сварные трубы", description: "Тип производства в соответствии с размерами, условиями эксплуатации и применимым стандартом." }],
    technicalKicker: "Техническое соответствие", technicalTitle: "Основа поставки и документация", technical: [{ label: "Группы материалов", value: "Бесшовная углеродистая сталь (ASTM A106 Gr. B/C), нержавеющая сталь (ASTM A312 TP304/304L/316/316L), легированная сталь (ASTM A335 P11/P22/P91)" }, { label: "Типы производства", value: "Бесшовные и сварные" }, { label: "Применимые стандарты", value: "Материальные стандарты ASTM A106 / A312 / A335; размерные стандарты ASME B36.10M и B36.19M" }, { label: "Документация", value: "MTC, CoC и согласованные записи качества согласно утверждённому RFQ" }, { label: "Основа поставки", value: "Спецификация, количество, требуемая дата и место доставки" }, { label: "Координация доставки", value: "Координация производителя, упаковка и планирование отгрузки" }],
    processKicker: "Процесс закупки", processTitle: "От технического запроса до доставки", process: [{ title: "Технический анализ", description: "Проверка материала, размеров, типа производства, стандартов, количества и документации." }, { title: "Координация производителя", description: "Подбор производителей и согласование коммерческих условий поставки." }, { title: "Проверка документации", description: "Комплектация и проверка сертификатов материалов, документов соответствия и записей качества." }, { title: "Планирование доставки", description: "Координация упаковки, перевозки и доставки по утверждённому графику." }],
    rfqKicker: "Подготовка запроса", rfqTitle: "Данные для запроса на трубы", rfqIntro: "Эти сведения помогут точно оценить потребность и подготовить соответствующий пакет поставки.", rfqItems: ["Марка материала", "Тип трубы", "Наружный диаметр и толщина стенки", "Schedule или размерный стандарт", "Бесшовное или сварное исполнение", "Количество и единица", "Применимый стандарт", "Требуемая документация", "Место доставки", "Требуемая дата доставки"], primaryCta: "Запросить предложение", secondaryCta: "Смотреть процесс закупки",
  },
  kz: {
    back: "Өнімдерге оралу", category: "Өнеркәсіптік құбыр жүйелері", overviewKicker: "Жеткізуге шолу", overviewTitle: "Жоба талаптарына сәйкес құбыр материалдары.", overview: "KAZENCO мұнай өңдеу, мұнай-химия, энергетика және өнеркәсіптік нысандар үшін көміртекті, тот баспайтын, легірленген және дуплексті болат құбырларды жобалық негізде жеткізуді үйлестіреді. Әр сұрау материал, өлшем, өндіріс түрі, стандарт, құжаттама және жеткізу шарттары бойынша қаралады.", rangeKicker: "Өнім ассортименті", rangeTitle: "Негізгі құбыр өнімдері",
    range: [{ title: "Көміртекті болат құбырлар", description: "Өнеркәсіптік және технологиялық жүйелерге арналған жіксіз және дәнекерленген құбырлар." }, { title: "Тот баспайтын болат құбырлар мен түтіктер", description: "Белгіленген пайдалану жағдайларына арналған коррозияға төзімді өнімдер." }, { title: "Легірленген және дуплексті құбырлар", description: "Бекітілген жоба сипаттамасына сәйкес таңдалатын құбыр өнімдері." }, { title: "Жіксіз және дәнекерленген құбырлар", description: "Өлшем, пайдалану жағдайы және қолданылатын стандартқа сәйкес өндіріс түрлері." }],
    technicalKicker: "Техникалық сәйкестік", technicalTitle: "Жеткізу негізі және құжаттама", technical: [{ label: "Материал топтары", value: "Жіксіз көміртекті болат (ASTM A106 Gr. B/C), тот баспайтын болат (ASTM A312 TP304/304L/316/316L), легірленген болат (ASTM A335 P11/P22/P91)" }, { label: "Өндіріс түрлері", value: "Жіксіз және дәнекерленген" }, { label: "Қолданылатын стандарттар", value: "ASTM A106 / A312 / A335 материал стандарттары; ASME B36.10M және B36.19M өлшем стандарттары" }, { label: "Құжаттама", value: "Бекітілген RFQ бойынша MTC, CoC және келісілген сапа жазбалары" }, { label: "Жеткізу негізі", value: "Сипаттама, мөлшер, қажетті күн және жеткізу орны" }, { label: "Жеткізуді үйлестіру", value: "Өндірушіні үйлестіру, орау және жөнелтуді жоспарлау" }],
    processKicker: "Сатып алу үдерісі", processTitle: "Техникалық сұраудан жеткізуге дейін", process: [{ title: "Техникалық талдау", description: "Материал, өлшем, өндіріс түрі, стандарт, мөлшер және құжаттама талаптарын тексеру." }, { title: "Өндірушіні үйлестіру", description: "Тиісті өндірушілер мен коммерциялық жеткізу шарттарын үйлестіру." }, { title: "Құжаттаманы тексеру", description: "Материал сертификаттарын, сәйкестік құжаттарын және сапа жазбаларын жинақтап тексеру." }, { title: "Жеткізуді жоспарлау", description: "Орау, тасымалдау және жеткізуді бекітілген кестеге сай үйлестіру." }],
    rfqKicker: "Сұрауды дайындау", rfqTitle: "Құбыр сұрауына қажетті ақпарат", rfqIntro: "Бұл мәліметтер талапты дәл бағалап, тиісті жеткізу пакетін дайындауға көмектеседі.", rfqItems: ["Материал маркасы", "Құбыр немесе түтік түрі", "Сыртқы диаметр және қабырға қалыңдығы", "Schedule немесе өлшем стандарты", "Жіксіз немесе дәнекерленген өндіріс", "Мөлшер және бірлік", "Қолданылатын стандарт", "Қажетті құжаттама", "Жеткізу орны", "Қажетті жеткізу күні"], primaryCta: "Баға ұсынысын сұрау", secondaryCta: "Сатып алу үдерісін қарау",
  },
};

export const PRODUCT_DETAIL_SLUGS = [
  "pipes-tubes",
  "fittings-flanges",
  "valves-instrumentation",
  "fasteners-anchor-bolts",
  "electrical-equipment",
  "construction-materials",
] as const;

export type ProductDetailSlug = (typeof PRODUCT_DETAIL_SLUGS)[number];

const PRODUCT_IMAGE_ALTS: Record<ProductDetailSlug, Record<Locale, string>> = {
  "pipes-tubes": {
    en: "Bundles of industrial steel pipes in a warehouse",
    tr: "Depoda demetler halinde endüstriyel çelik borular",
    ru: "Связки промышленных стальных труб на складе",
    kz: "Қоймадағы өнеркәсіптік болат құбырлар бумалары",
  },
  "fittings-flanges": {
    en: "Industrial elbows, tees, reducers, caps and flanges arranged in a workshop",
    tr: "Atölyede düzenlenmiş endüstriyel dirsekler, T bağlantı parçaları, redüksiyonlar, kepler ve flanşlar",
    ru: "Промышленные отводы, тройники, переходы, заглушки и фланцы в цехе",
    kz: "Цехта орналастырылған өнеркәсіптік иіндер, үштіктер, өтпелер, бітеуіштер және фланецтер",
  },
  "valves-instrumentation": {
    en: "Industrial valves with instrumentation manifolds and tubing components",
    tr: "Enstrümantasyon manifoldları ve borulama bileşenleriyle endüstriyel vanalar",
    ru: "Промышленная арматура с приборными манифольдами и трубными компонентами",
    kz: "Аспаптық манифольдтар мен түтік компоненттері бар өнеркәсіптік арматура",
  },
  "fasteners-anchor-bolts": {
    en: "Anchor bolts with nuts and base plates stacked on a wooden pallet",
    tr: "Ahşap palet üzerinde istiflenmiş somunlu ve taban plakalı ankraj bulonları",
    ru: "Анкерные болты с гайками и опорными пластинами на деревянном поддоне",
    kz: "Ағаш паллетке жиналған сомындары мен тірек тақталары бар анкерлік болттар",
  },
  "electrical-equipment": {
    en: "Industrial switchgear, electrical enclosures, test equipment and cables",
    tr: "Endüstriyel şalt ekipmanları, elektrik muhafazaları, test cihazları ve kablolar",
    ru: "Промышленное распределительное оборудование, электротехнические корпуса, испытательные приборы и кабели",
    kz: "Өнеркәсіптік тарату жабдықтары, электр корпустары, сынақ аспаптары және кабельдер",
  },
  "construction-materials": {
    en: "Assorted insulation, coatings, roofing and construction site materials",
    tr: "Çeşitli yalıtım, kaplama, çatı ve şantiye malzemeleri",
    ru: "Различные изоляционные, лакокрасочные, кровельные и строительные материалы",
    kz: "Әртүрлі оқшаулау, жабын, шатыр және құрылыс алаңы материалдары",
  },
};

export function getProductImageAlt(slug: ProductDetailSlug, locale: Locale) {
  return PRODUCT_IMAGE_ALTS[slug][locale];
}

interface CategorySpecificCopy {
  overviewTitle: string;
  overview: string;
  rangeTitle: string;
  rangeDescriptions: string[];
  technicalTitle: string;
  technical: TechnicalRow[];
  rfqTitle: string;
  rfqItems: string[];
}

const ADDITIONAL_PRODUCT_DETAILS: Record<Exclude<ProductDetailSlug, "pipes-tubes">, Record<Locale, CategorySpecificCopy>> = {
  "fittings-flanges": {
    en: {
      overviewTitle: "Piping components matched to the complete line specification.",
      overview: "KAZENCO supplies buttweld fittings, forged fittings, flanges and special piping components in accordance with project material classes, dimensional standards, pressure ratings and documentation requirements.",
      rangeTitle: "Core fittings and flange supply",
      rangeDescriptions: ["Elbows, tees, reducers, caps and related buttweld components.", "Socket-weld and threaded forged fittings for industrial piping systems.", "Weld neck, slip-on, blind, socket-weld and threaded flange configurations.", "Project-specific piping components coordinated to approved drawings and specifications."],
      technicalTitle: "Component specification and documentation",
      technical: [{ label: "Product families", value: "Buttweld fittings, forged fittings, flanges and special piping components" }, { label: "Material families", value: "Butt-weld (ASTM A234-WPB, A420-WPL6), forged (ASTM A105, A350-LF2, A182 F304/F316)" }, { label: "Applicable standards", value: "ASME B16.5, B16.9, B16.11 and B16.47" }, { label: "Pressure and dimensions", value: "Nominal size, schedule, pressure class, facing and end connection" }, { label: "Documentation", value: "MTC, CoC and agreed inspection or quality records" }, { label: "Delivery coordination", value: "Manufacturer coordination, packing and shipment planning" }],
      rfqTitle: "Information to include in your fittings and flanges enquiry",
      rfqItems: ["Component type", "Material grade", "Nominal size", "Schedule or wall thickness", "Pressure class", "Facing or end connection", "Applicable standard", "Quantity and unit", "Required documentation", "Delivery location and date"],
    },
    tr: {
      overviewTitle: "Boru hattı malzeme sınıfına uygun bağlantı bileşenleri.",
      overview: "KAZENCO; alın kaynaklı ve dövme bağlantı parçaları, flanşlar ve özel borulama bileşenlerini proje malzeme sınıfları, ölçü standartları, basınç sınıfları ve dokümantasyon gereksinimlerine göre tedarik eder.",
      rangeTitle: "Temel bağlantı parçası ve flanş ürünleri",
      rangeDescriptions: ["Dirsek, tee, redüksiyon, kep ve ilgili alın kaynaklı bileşenler.", "Endüstriyel borulama sistemleri için soket kaynaklı ve dişli dövme bağlantı parçaları.", "Kaynak boyunlu, slip-on, kör, soket kaynaklı ve dişli flanş tipleri.", "Onaylı çizim ve şartnamelere göre projeye özel borulama bileşenleri."],
      technicalTitle: "Bileşen şartnamesi ve dokümantasyon",
      technical: [{ label: "Ürün grupları", value: "Alın kaynaklı bağlantı parçaları, dövme bağlantı parçaları, flanşlar ve özel borulama bileşenleri" }, { label: "Malzeme grupları", value: "Alın kaynaklı (ASTM A234-WPB, A420-WPL6), dövme (ASTM A105, A350-LF2, A182 F304/F316)" }, { label: "İlgili standartlar", value: "ASME B16.5, B16.9, B16.11 ve B16.47" }, { label: "Basınç ve ölçüler", value: "Nominal çap, schedule, basınç sınıfı, yüzey ve uç bağlantısı" }, { label: "Dokümantasyon", value: "MTC, CoC ve mutabık kalınan muayene veya kalite kayıtları" }, { label: "Teslimat koordinasyonu", value: "Üretici koordinasyonu, paketleme ve sevkiyat planlaması" }],
      rfqTitle: "Bağlantı parçası ve flanş talebinizde bulunması gereken bilgiler",
      rfqItems: ["Bileşen tipi", "Malzeme sınıfı", "Nominal çap", "Schedule veya et kalınlığı", "Basınç sınıfı", "Yüzey veya uç bağlantısı", "İlgili standart", "Miktar ve birim", "Gerekli dokümantasyon", "Teslimat yeri ve tarihi"],
    },
    ru: { overviewTitle: "Компоненты трубопроводов по спецификации проекта.", overview: "Поставка приварных и кованых фитингов, фланцев и специальных компонентов по классам материалов, размерам, давлению и требованиям к документации.", rangeTitle: "Основные фитинги и фланцы", rangeDescriptions: ["Отводы, тройники, переходы, заглушки и другие приварные компоненты.", "Кованые фитинги под раструбную сварку и резьбу.", "Различные типы промышленных фланцев.", "Специальные компоненты по утверждённым чертежам."], technicalTitle: "Спецификация и документация", technical: [{ label: "Группы продукции", value: "Приварные и кованые фитинги, фланцы и специальные компоненты" }, { label: "Материалы", value: "Приварные встык (ASTM A234-WPB, A420-WPL6), кованые (ASTM A105, A350-LF2, A182 F304/F316)" }, { label: "Стандарты", value: "ASME B16.5, B16.9, B16.11 и B16.47" }, { label: "Параметры", value: "Размер, schedule, класс давления, уплотнительная поверхность и присоединение" }, { label: "Документация", value: "MTC, CoC и согласованные записи качества" }, { label: "Доставка", value: "Координация производителя, упаковка и отгрузка" }], rfqTitle: "Данные для запроса на фитинги и фланцы", rfqItems: ["Тип компонента", "Марка материала", "Номинальный размер", "Schedule или толщина стенки", "Класс давления", "Тип присоединения", "Стандарт", "Количество", "Документация", "Место и дата доставки"] },
    kz: { overviewTitle: "Жоба сипаттамасына сәйкес құбыр компоненттері.", overview: "Дәнекерленетін және соғылған фитингтерді, фланецтерді және арнайы компоненттерді материал, өлшем, қысым және құжаттама талаптарына сай жеткізу.", rangeTitle: "Негізгі фитингтер мен фланецтер", rangeDescriptions: ["Иіндер, үштіктер, редукторлар және басқа дәнекерленетін компоненттер.", "Ұялы дәнекерлеу және бұрандалы соғылған фитингтер.", "Өнеркәсіптік фланец түрлері.", "Бекітілген сызбалар бойынша арнайы компоненттер."], technicalTitle: "Сипаттама және құжаттама", technical: [{ label: "Өнім топтары", value: "Дәнекерленетін және соғылған фитингтер, фланецтер және арнайы компоненттер" }, { label: "Материалдар", value: "Түйістіріп дәнекерленетін (ASTM A234-WPB, A420-WPL6), соғылған (ASTM A105, A350-LF2, A182 F304/F316)" }, { label: "Стандарттар", value: "ASME B16.5, B16.9, B16.11 және B16.47" }, { label: "Параметрлер", value: "Өлшем, schedule, қысым класы, бет және ұштық қосылыс" }, { label: "Құжаттама", value: "MTC, CoC және келісілген сапа жазбалары" }, { label: "Жеткізу", value: "Өндірушіні үйлестіру, орау және жөнелту" }], rfqTitle: "Фитингтер мен фланецтер сұрауына қажетті ақпарат", rfqItems: ["Компонент түрі", "Материал маркасы", "Номиналды өлшем", "Schedule немесе қабырға қалыңдығы", "Қысым класы", "Қосылыс түрі", "Стандарт", "Мөлшер", "Құжаттама", "Жеткізу орны мен күні"] },
  },
  "valves-instrumentation": {
    en: { overviewTitle: "Process control components selected for service conditions.", overview: "KAZENCO coordinates process valves, instrumentation valves, manifolds, tubing and control components against the required medium, pressure, temperature, materials, end connections and applicable project standards.", rangeTitle: "Core valve and instrumentation supply", rangeDescriptions: ["Ball, gate and globe valve configurations for isolation and process service.", "Check and butterfly valves selected for the required duty and line conditions.", "Instrumentation valves and manifolds for measurement and control interfaces.", "Instrumentation tubing and associated control components."], technicalTitle: "Service data and technical documentation", technical: [{ label: "Product families", value: "Process valves, instrumentation valves, manifolds, tubing and control components" }, { label: "Selection basis", value: "Medium, pressure, temperature, size, body/trim material (ASTM A105, A350, A182) and end connection" }, { label: "Applicable standards", value: "API and NACE as required by the approved project specification; ASME B16.34 design standard" }, { label: "Operation", value: "Manual or specified actuation and control requirements" }, { label: "Documentation", value: "MTC, CoC, test certificates and agreed quality records" }, { label: "Delivery coordination", value: "Technical review, manufacturer coordination, packing and shipment" }], rfqTitle: "Information to include in your valve and instrumentation enquiry", rfqItems: ["Valve or instrument type", "Line size", "Pressure class or rating", "Body and trim material", "End connection", "Operating method", "Process medium", "Design pressure and temperature", "Applicable standard and documents", "Quantity and delivery details"] },
    tr: { overviewTitle: "Servis koşullarına göre seçilen proses kontrol bileşenleri.", overview: "KAZENCO; proses vanaları, enstrümantasyon vanaları, manifoldlar, enstrümantasyon tüpleri ve kontrol bileşenlerini akışkan, basınç, sıcaklık, malzeme, uç bağlantısı ve ilgili proje standartlarına göre koordine eder.", rangeTitle: "Temel vana ve enstrümantasyon ürünleri", rangeDescriptions: ["İzolasyon ve proses servisi için küresel, sürgülü ve glob vana tipleri.", "Gerekli görev ve hat koşullarına göre seçilen çekvalf ve kelebek vanalar.", "Ölçüm ve kontrol arayüzleri için enstrümantasyon vanaları ve manifoldlar.", "Enstrümantasyon tüpleri ve ilgili kontrol bileşenleri."], technicalTitle: "Servis verileri ve teknik dokümantasyon", technical: [{ label: "Ürün grupları", value: "Proses vanaları, enstrümantasyon vanaları, manifoldlar, tüpler ve kontrol bileşenleri" }, { label: "Seçim esası", value: "Akışkan, basınç, sıcaklık, çap, gövde/trim malzemesi (ASTM A105, A350, A182) ve uç bağlantısı" }, { label: "İlgili standartlar", value: "Onaylı proje şartnamesine göre API ve NACE; ASME B16.34 tasarım standardı" }, { label: "Çalıştırma", value: "Manuel veya belirtilen aktüasyon ve kontrol gereksinimleri" }, { label: "Dokümantasyon", value: "MTC, CoC, test sertifikaları ve mutabık kalınan kalite kayıtları" }, { label: "Teslimat koordinasyonu", value: "Teknik inceleme, üretici koordinasyonu, paketleme ve sevkiyat" }], rfqTitle: "Vana ve enstrümantasyon talebinizde bulunması gereken bilgiler", rfqItems: ["Vana veya enstrüman tipi", "Hat çapı", "Basınç sınıfı veya rating", "Gövde ve trim malzemesi", "Uç bağlantısı", "Çalıştırma yöntemi", "Proses akışkanı", "Tasarım basıncı ve sıcaklığı", "İlgili standart ve belgeler", "Miktar ve teslimat bilgileri"] },
    ru: { overviewTitle: "Компоненты управления процессом по условиям эксплуатации.", overview: "Поставка технологической и приборной арматуры, манифольдов, трубок и компонентов управления по параметрам среды, давления, температуры и проекта.", rangeTitle: "Основная арматура и КИП", rangeDescriptions: ["Шаровые, задвижные и запорные клапаны.", "Обратные и дисковые затворы.", "Приборные клапаны и манифольды.", "Импульсные трубки и компоненты управления."], technicalTitle: "Эксплуатационные данные и документация", technical: [{ label: "Продукция", value: "Технологическая и приборная арматура, манифольды, трубки и компоненты" }, { label: "Основа выбора", value: "Среда, давление, температура, размер, материал корпуса/деталей (ASTM A105, A350, A182) и присоединение" }, { label: "Стандарты", value: "API и NACE по спецификации проекта; конструктивный стандарт ASME B16.34" }, { label: "Управление", value: "Ручное или заданное исполнительное управление" }, { label: "Документация", value: "MTC, CoC, протоколы испытаний и записи качества" }, { label: "Доставка", value: "Технический анализ, координация производителя и отгрузка" }], rfqTitle: "Данные для запроса на арматуру и КИП", rfqItems: ["Тип изделия", "Размер линии", "Класс давления", "Материал корпуса и внутренних деталей", "Присоединение", "Тип управления", "Рабочая среда", "Давление и температура", "Стандарты и документы", "Количество и доставка"] },
    kz: { overviewTitle: "Пайдалану жағдайына сай процесс бақылау компоненттері.", overview: "Технологиялық және аспаптық арматураны, манифольдтарды, түтіктерді және басқару компоненттерін орта, қысым, температура және жоба талаптарына сай жеткізу.", rangeTitle: "Негізгі арматура және аспаптар", rangeDescriptions: ["Шарлы, ысырмалы және глобус клапандар.", "Кері және көбелек клапандар.", "Аспаптық клапандар мен манифольдтар.", "Аспаптық түтіктер мен басқару компоненттері."], technicalTitle: "Пайдалану деректері және құжаттама", technical: [{ label: "Өнімдер", value: "Технологиялық және аспаптық арматура, манифольдтар, түтіктер және компоненттер" }, { label: "Таңдау негізі", value: "Орта, қысым, температура, өлшем, корпус/ішкі бөлшек материалы (ASTM A105, A350, A182) және қосылыс" }, { label: "Стандарттар", value: "Жоба сипаттамасына сай API және NACE; ASME B16.34 жобалау стандарты" }, { label: "Басқару", value: "Қолмен немесе көрсетілген жетекпен басқару" }, { label: "Құжаттама", value: "MTC, CoC, сынақ сертификаттары және сапа жазбалары" }, { label: "Жеткізу", value: "Техникалық талдау, өндірушіні үйлестіру және жөнелту" }], rfqTitle: "Арматура мен аспаптар сұрауына қажетті ақпарат", rfqItems: ["Өнім түрі", "Желі өлшемі", "Қысым класы", "Корпус және ішкі бөлшек материалы", "Қосылыс", "Басқару түрі", "Жұмыс ортасы", "Қысым және температура", "Стандарттар мен құжаттар", "Мөлшер және жеткізу"] },
  },
  "fasteners-anchor-bolts": {
    en: { overviewTitle: "Fastening packages coordinated to structural and equipment requirements.", overview: "KAZENCO supplies stud bolts, anchor bolts, nuts, washers and custom fastener packages according to the specified material grade, dimensions, thread, coating, testing and documentation requirements.", rangeTitle: "Core fastener supply", rangeDescriptions: ["Stud bolts for flanged joints and industrial assemblies.", "Anchor bolts for structural, equipment and foundation interfaces.", "Matched nuts and washers for the specified bolting system.", "Project-specific fastening packages supplied against drawings and bills of materials."], technicalTitle: "Fastener specification and traceability", technical: [{ label: "Product families", value: "Stud bolts, anchor bolts, nuts, washers and custom fasteners" }, { label: "Selection basis", value: "Material grade, diameter, length, thread, coating and service condition" }, { label: "Applicable standards", value: "Anchor bolts ASTM F1554 Gr. 36/55/105; stud bolts ASTM A193 B7/B7M/B16 (elevated temperature) and ASTM A320 L7/L7M (low temperature); nuts ASTM A194; washers ASTM F436; metric ISO 898-1 (8.8/10.9/12.9); stainless ISO 3506-1" }, { label: "Custom supply", value: "Fabrication against approved drawings and dimensional requirements" }, { label: "Documentation", value: "MTC, CoC, test reports and agreed traceability records" }, { label: "Packaging", value: "Tagged and packaged by project, item or installation package as agreed" }], rfqTitle: "Information to include in your fastener enquiry", rfqItems: ["Fastener type", "Material grade", "Diameter and length", "Thread specification", "Nut and washer requirement", "Coating or surface treatment", "Applicable standard", "Drawing or bill of materials", "Quantity and documentation", "Delivery location and date"] },
    tr: { overviewTitle: "Yapısal ve ekipman gereksinimlerine göre hazırlanan bağlantı paketleri.", overview: "KAZENCO; saplama ve ankraj cıvataları, somunlar, rondelalar ve özel bağlantı elemanı paketlerini belirtilen malzeme sınıfı, ölçü, diş, kaplama, test ve dokümantasyon gereksinimlerine göre tedarik eder.", rangeTitle: "Temel bağlantı elemanı ürünleri", rangeDescriptions: ["Flanşlı bağlantılar ve endüstriyel montajlar için saplama cıvataları.", "Yapısal, ekipman ve temel bağlantıları için ankraj cıvataları.", "Belirtilen cıvata sistemiyle uyumlu somun ve rondelalar.", "Çizim ve malzeme listelerine göre projeye özel bağlantı elemanı paketleri."], technicalTitle: "Bağlantı elemanı şartnamesi ve izlenebilirlik", technical: [{ label: "Ürün grupları", value: "Saplama cıvataları, ankraj cıvataları, somunlar, rondelalar ve özel bağlantı elemanları" }, { label: "Seçim esası", value: "Malzeme sınıfı, çap, boy, diş, kaplama ve servis koşulu" }, { label: "İlgili standartlar", value: "Ankraj cıvataları ASTM F1554 Gr. 36/55/105; saplama cıvataları ASTM A193 B7/B7M/B16 (yüksek sıcaklık) ve ASTM A320 L7/L7M (düşük sıcaklık); somunlar ASTM A194; rondelalar ASTM F436; metrik ISO 898-1 (8.8/10.9/12.9); paslanmaz ISO 3506-1" }, { label: "Özel üretim", value: "Onaylı çizim ve ölçü gereksinimlerine göre imalat" }, { label: "Dokümantasyon", value: "MTC, CoC, test raporları ve mutabık kalınan izlenebilirlik kayıtları" }, { label: "Paketleme", value: "Mutabakata göre proje, kalem veya montaj paketine göre etiketleme ve paketleme" }], rfqTitle: "Bağlantı elemanı talebinizde bulunması gereken bilgiler", rfqItems: ["Bağlantı elemanı tipi", "Malzeme sınıfı", "Çap ve boy", "Diş özelliği", "Somun ve rondela gereksinimi", "Kaplama veya yüzey işlemi", "İlgili standart", "Çizim veya malzeme listesi", "Miktar ve dokümantasyon", "Teslimat yeri ve tarihi"] },
    ru: { overviewTitle: "Крепёжные комплекты по требованиям конструкций и оборудования.", overview: "Поставка шпилек, анкерных болтов, гаек, шайб и специальных комплектов по материалу, размерам, резьбе, покрытию и документации.", rangeTitle: "Основные крепёжные изделия", rangeDescriptions: ["Шпильки для фланцевых соединений.", "Анкерные болты для конструкций и оборудования.", "Согласованные гайки и шайбы.", "Специальные комплекты по чертежам и ведомостям."], technicalTitle: "Спецификация и прослеживаемость", technical: [{ label: "Продукция", value: "Шпильки, анкеры, гайки, шайбы и специальный крепёж" }, { label: "Основа выбора", value: "Материал, диаметр, длина, резьба, покрытие и условия" }, { label: "Стандарты", value: "Анкерные болты ASTM F1554 Gr. 36/55/105; шпильки ASTM A193 B7/B7M/B16 (повышенная температура) и ASTM A320 L7/L7M (низкая температура); гайки ASTM A194; шайбы ASTM F436; метрические ISO 898-1 (8.8/10.9/12.9); нержавеющие ISO 3506-1" }, { label: "Специзготовление", value: "По утверждённым чертежам" }, { label: "Документация", value: "MTC, CoC, испытания и записи прослеживаемости" }, { label: "Упаковка", value: "Маркировка и упаковка по проекту" }], rfqTitle: "Данные для запроса на крепёж", rfqItems: ["Тип крепежа", "Материал", "Диаметр и длина", "Резьба", "Гайки и шайбы", "Покрытие", "Стандарт", "Чертёж или ведомость", "Количество и документы", "Место и дата доставки"] },
    kz: { overviewTitle: "Құрылымдар мен жабдық талаптарына сай бекіту пакеттері.", overview: "Шпилькаларды, анкерлік болттарды, сомындарды, шайбаларды және арнайы жинақтарды материал, өлшем, бұранда, жабын және құжаттама талаптарына сай жеткізу.", rangeTitle: "Негізгі бекіту өнімдері", rangeDescriptions: ["Фланецті қосылыстарға арналған шпилькалар.", "Құрылымдар мен жабдықтарға арналған анкерлік болттар.", "Сәйкес сомындар мен шайбалар.", "Сызбалар мен тізімдер бойынша арнайы жинақтар."], technicalTitle: "Сипаттама және қадағалану", technical: [{ label: "Өнімдер", value: "Шпилькалар, анкерлер, сомындар, шайбалар және арнайы бекіткіштер" }, { label: "Таңдау негізі", value: "Материал, диаметр, ұзындық, бұранда, жабын және жағдай" }, { label: "Стандарттар", value: "Анкерлік болттар ASTM F1554 Gr. 36/55/105; шпилькалар ASTM A193 B7/B7M/B16 (жоғары температура) және ASTM A320 L7/L7M (төмен температура); сомындар ASTM A194; шайбалар ASTM F436; метрлік ISO 898-1 (8.8/10.9/12.9); тот баспайтын ISO 3506-1" }, { label: "Арнайы өндіріс", value: "Бекітілген сызбалар бойынша" }, { label: "Құжаттама", value: "MTC, CoC, сынақ және қадағалау жазбалары" }, { label: "Орау", value: "Жоба бойынша таңбалау және орау" }], rfqTitle: "Бекіткіштер сұрауына қажетті ақпарат", rfqItems: ["Бекіткіш түрі", "Материал", "Диаметр және ұзындық", "Бұранда", "Сомындар мен шайбалар", "Жабын", "Стандарт", "Сызба немесе тізім", "Мөлшер және құжаттар", "Жеткізу орны мен күні"] },
  },
  "electrical-equipment": {
    en: { overviewTitle: "Electrical packages coordinated to industrial service requirements.", overview: "KAZENCO sources industrial electrical equipment, explosion-protected equipment, measurement and test devices, and power, control and communication cables according to project specifications and site conditions.", rangeTitle: "Core electrical supply", rangeDescriptions: ["Industrial distribution, control and supporting electrical equipment.", "Explosion-protected equipment selected for the specified hazardous-area requirements.", "Measuring and test equipment for project and operational requirements.", "Power, control, instrumentation and communication cable packages."], technicalTitle: "Electrical specification and compliance", technical: [{ label: "Product families", value: "Industrial equipment, Ex equipment, test devices and cable packages" }, { label: "Selection basis", value: "Voltage, current, frequency, duty, installation and environmental conditions" }, { label: "Applicable requirements", value: "IEC, ATEX and IP ratings as required by the approved project specification" }, { label: "Hazardous areas", value: "Area classification, protection concept, gas group and temperature class as specified" }, { label: "Documentation", value: "CoC, datasheets, test records and agreed conformity documentation" }, { label: "Delivery coordination", value: "Manufacturer review, package consolidation and shipment planning" }], rfqTitle: "Information to include in your electrical equipment enquiry", rfqItems: ["Equipment or cable type", "Voltage, current and frequency", "Rated duty or capacity", "Installation environment", "Hazardous-area classification", "ATEX, Ex and IP requirements", "Applicable IEC standard", "Quantity and accessories", "Datasheets and documentation", "Delivery location and date"] },
    tr: { overviewTitle: "Endüstriyel servis gereksinimlerine göre koordine edilen elektrik paketleri.", overview: "KAZENCO; endüstriyel elektrik ekipmanları, patlamadan korunmuş ekipmanlar, ölçüm ve test cihazları ile güç, kontrol ve haberleşme kablolarını proje şartnameleri ve saha koşullarına göre tedarik eder.", rangeTitle: "Temel elektrik ürünleri", rangeDescriptions: ["Endüstriyel dağıtım, kontrol ve yardımcı elektrik ekipmanları.", "Belirtilen tehlikeli saha gereksinimlerine göre seçilen ex-proof ekipmanlar.", "Proje ve işletme gereksinimleri için ölçüm ve test ekipmanları.", "Güç, kontrol, enstrümantasyon ve haberleşme kablo paketleri."], technicalTitle: "Elektrik şartnamesi ve uygunluk", technical: [{ label: "Ürün grupları", value: "Endüstriyel ekipmanlar, Ex ekipmanları, test cihazları ve kablo paketleri" }, { label: "Seçim esası", value: "Gerilim, akım, frekans, görev, montaj ve çevre koşulları" }, { label: "İlgili gereksinimler", value: "Onaylı proje şartnamesine göre IEC, ATEX ve IP sınıfları" }, { label: "Tehlikeli sahalar", value: "Belirtilen saha sınıflandırması, koruma tipi, gaz grubu ve sıcaklık sınıfı" }, { label: "Dokümantasyon", value: "CoC, teknik föyler, test kayıtları ve mutabık kalınan uygunluk belgeleri" }, { label: "Teslimat koordinasyonu", value: "Üretici incelemesi, paket birleştirme ve sevkiyat planlaması" }], rfqTitle: "Elektrik ekipmanı talebinizde bulunması gereken bilgiler", rfqItems: ["Ekipman veya kablo tipi", "Gerilim, akım ve frekans", "Anma görevi veya kapasitesi", "Montaj ortamı", "Tehlikeli saha sınıflandırması", "ATEX, Ex ve IP gereksinimleri", "İlgili IEC standardı", "Miktar ve aksesuarlar", "Teknik föy ve dokümantasyon", "Teslimat yeri ve tarihi"] },
    ru: { overviewTitle: "Электротехнические пакеты для промышленных условий.", overview: "Поставка промышленного и взрывозащищённого электрооборудования, измерительных приборов и кабелей по спецификациям проекта.", rangeTitle: "Основные электротехнические изделия", rangeDescriptions: ["Промышленное распределительное и управляющее оборудование.", "Взрывозащищённое оборудование для опасных зон.", "Измерительное и испытательное оборудование.", "Силовые, контрольные и коммуникационные кабели."], technicalTitle: "Спецификация и соответствие", technical: [{ label: "Продукция", value: "Промышленное и Ex оборудование, приборы и кабели" }, { label: "Основа выбора", value: "Напряжение, ток, частота, режим и условия установки" }, { label: "Требования", value: "IEC, ATEX и классы IP по спецификации" }, { label: "Опасные зоны", value: "Классификация зоны, тип защиты, группа газа и температурный класс" }, { label: "Документация", value: "CoC, технические листы, испытания и документы соответствия" }, { label: "Доставка", value: "Проверка производителя, комплектация и отгрузка" }], rfqTitle: "Данные для запроса на электрооборудование", rfqItems: ["Тип оборудования или кабеля", "Напряжение, ток и частота", "Номинальная мощность", "Условия установки", "Классификация зоны", "ATEX, Ex и IP", "Стандарт IEC", "Количество и аксессуары", "Техническая документация", "Место и дата доставки"] },
    kz: { overviewTitle: "Өнеркәсіптік жағдайларға арналған электр пакеттері.", overview: "Өнеркәсіптік және жарылыстан қорғалған электр жабдықтарын, өлшеу құралдарын және кабельдерді жоба сипаттамаларына сай жеткізу.", rangeTitle: "Негізгі электр өнімдері", rangeDescriptions: ["Өнеркәсіптік тарату және басқару жабдықтары.", "Қауіпті аймақтарға арналған жарылыстан қорғалған жабдықтар.", "Өлшеу және сынақ жабдықтары.", "Қуат, басқару және байланыс кабельдері."], technicalTitle: "Сипаттама және сәйкестік", technical: [{ label: "Өнімдер", value: "Өнеркәсіптік және Ex жабдықтар, аспаптар және кабельдер" }, { label: "Таңдау негізі", value: "Кернеу, ток, жиілік, жұмыс және орнату жағдайы" }, { label: "Талаптар", value: "Сипаттама бойынша IEC, ATEX және IP кластары" }, { label: "Қауіпті аймақтар", value: "Аймақ класы, қорғаныс түрі, газ тобы және температура класы" }, { label: "Құжаттама", value: "CoC, техникалық парақтар, сынақ және сәйкестік құжаттары" }, { label: "Жеткізу", value: "Өндірушіні тексеру, жинақтау және жөнелту" }], rfqTitle: "Электр жабдықтары сұрауына қажетті ақпарат", rfqItems: ["Жабдық немесе кабель түрі", "Кернеу, ток және жиілік", "Номиналды қуат", "Орнату жағдайы", "Аймақ класы", "ATEX, Ex және IP", "IEC стандарты", "Мөлшер және керек-жарақтар", "Техникалық құжаттама", "Жеткізу орны мен күні"] },
  },
  "construction-materials": {
    en: { overviewTitle: "Construction materials coordinated as a project supply package.", overview: "KAZENCO coordinates structural steel products, insulation systems, building and site materials, and fit-out and finishing materials according to approved specifications, quantities, submittals and delivery schedules.", rangeTitle: "Core construction material supply", rangeDescriptions: ["Structural steel products and supporting fabricated components.", "Industrial thermal, acoustic and protective insulation systems.", "Building and site materials for civil and construction work packages.", "Interior fit-out, finishing and associated project materials."], technicalTitle: "Material submittals and supply control", technical: [{ label: "Product families", value: "Structural steel, insulation, building, site, fit-out and finishing materials" }, { label: "Selection basis", value: "Approved specification, drawings, bill of quantities, samples and site conditions" }, { label: "Technical review", value: "Product data, dimensions, performance requirements and interface conditions" }, { label: "Submittals", value: "Datasheets, samples, CoC and agreed material approval documentation" }, { label: "Package coordination", value: "Quantities, approved alternatives, packaging and phased delivery requirements" }, { label: "Delivery planning", value: "Site access, storage conditions, handling and approved programme" }], rfqTitle: "Information to include in your construction materials enquiry", rfqItems: ["Material or system type", "Specification and performance requirement", "Drawings or bill of quantities", "Dimensions and finish", "Brand or approved equivalent requirement", "Sample or submittal requirement", "Quantity and unit", "Required certificates and datasheets", "Site and storage conditions", "Delivery location and programme"] },
    tr: { overviewTitle: "Proje tedarik paketi olarak koordine edilen yapı malzemeleri.", overview: "KAZENCO; yapısal çelik ürünlerini, yalıtım sistemlerini, yapı ve şantiye malzemelerini, ince iş ve bitirme malzemelerini onaylı şartname, miktar, malzeme sunumu ve teslimat programına göre koordine eder.", rangeTitle: "Temel inşaat ve yapı malzemeleri", rangeDescriptions: ["Yapısal çelik ürünleri ve destekleyici imal edilmiş bileşenler.", "Endüstriyel ısı, ses ve koruyucu yalıtım sistemleri.", "İnşaat iş paketleri için yapı ve şantiye malzemeleri.", "İç mekân ince işleri, bitirme ve ilgili proje malzemeleri."], technicalTitle: "Malzeme sunumları ve tedarik kontrolü", technical: [{ label: "Ürün grupları", value: "Yapısal çelik, yalıtım, yapı, şantiye, ince iş ve bitirme malzemeleri" }, { label: "Seçim esası", value: "Onaylı şartname, çizimler, metraj, numuneler ve saha koşulları" }, { label: "Teknik inceleme", value: "Ürün verileri, ölçüler, performans gereksinimleri ve arayüz koşulları" }, { label: "Malzeme sunumları", value: "Teknik föyler, numuneler, CoC ve mutabık kalınan malzeme onay belgeleri" }, { label: "Paket koordinasyonu", value: "Miktarlar, onaylı alternatifler, paketleme ve aşamalı teslimat gereksinimleri" }, { label: "Teslimat planlaması", value: "Saha erişimi, depolama koşulları, elleçleme ve onaylı program" }], rfqTitle: "Yapı malzemesi talebinizde bulunması gereken bilgiler", rfqItems: ["Malzeme veya sistem tipi", "Şartname ve performans gereksinimi", "Çizimler veya metraj", "Ölçüler ve yüzey", "Marka veya onaylı muadil gereksinimi", "Numune veya malzeme sunumu gereksinimi", "Miktar ve birim", "Gerekli sertifika ve teknik föyler", "Saha ve depolama koşulları", "Teslimat yeri ve programı"] },
    ru: { overviewTitle: "Строительные материалы как единый пакет поставки.", overview: "Координация металлоконструкций, изоляции, строительных, площадочных и отделочных материалов по утверждённым спецификациям и графику.", rangeTitle: "Основные строительные материалы", rangeDescriptions: ["Изделия из конструкционной стали.", "Промышленные системы изоляции.", "Строительные и площадочные материалы.", "Материалы для отделки и завершения работ."], technicalTitle: "Согласование и контроль материалов", technical: [{ label: "Продукция", value: "Сталь, изоляция, строительные и отделочные материалы" }, { label: "Основа выбора", value: "Спецификация, чертежи, ведомости, образцы и условия площадки" }, { label: "Технический анализ", value: "Характеристики, размеры и требования к эксплуатации" }, { label: "Согласование", value: "Технические листы, образцы, CoC и документы одобрения" }, { label: "Комплектация", value: "Количество, аналоги, упаковка и поэтапная доставка" }, { label: "Доставка", value: "Доступ, хранение, обработка и утверждённый график" }], rfqTitle: "Данные для запроса на строительные материалы", rfqItems: ["Тип материала", "Спецификация", "Чертежи или ведомость", "Размеры и отделка", "Марка или аналог", "Образец или согласование", "Количество", "Сертификаты и листы", "Условия площадки", "Место и график доставки"] },
    kz: { overviewTitle: "Бірыңғай жеткізу пакеті ретіндегі құрылыс материалдары.", overview: "Құрылымдық болат, оқшаулау, құрылыс, алаң және әрлеу материалдарын бекітілген сипаттамалар мен кестеге сай үйлестіру.", rangeTitle: "Негізгі құрылыс материалдары", rangeDescriptions: ["Құрылымдық болат өнімдері.", "Өнеркәсіптік оқшаулау жүйелері.", "Құрылыс және алаң материалдары.", "Әрлеу және аяқтау материалдары."], technicalTitle: "Материалдарды келісу және бақылау", technical: [{ label: "Өнімдер", value: "Болат, оқшаулау, құрылыс және әрлеу материалдары" }, { label: "Таңдау негізі", value: "Сипаттама, сызбалар, тізімдер, үлгілер және алаң жағдайы" }, { label: "Техникалық талдау", value: "Сипаттар, өлшемдер және пайдалану талаптары" }, { label: "Келісу", value: "Техникалық парақтар, үлгілер, CoC және бекіту құжаттары" }, { label: "Жинақтау", value: "Мөлшер, баламалар, орау және кезеңдік жеткізу" }, { label: "Жеткізу", value: "Қолжетімділік, сақтау, өңдеу және бекітілген кесте" }], rfqTitle: "Құрылыс материалдары сұрауына қажетті ақпарат", rfqItems: ["Материал түрі", "Сипаттама", "Сызбалар немесе тізім", "Өлшемдер және әрлеу", "Марка немесе балама", "Үлгі немесе келісу", "Мөлшер", "Сертификаттар мен парақтар", "Алаң жағдайы", "Жеткізу орны мен кестесі"] },
  },
};

export function isProductDetailSlug(value: string): value is ProductDetailSlug {
  return PRODUCT_DETAIL_SLUGS.includes(value as ProductDetailSlug);
}

export function getProductDetail(slug: ProductDetailSlug, locale: Locale): ProductDetailCopy {
  if (slug === "pipes-tubes") return PIPES_TUBES_DETAIL[locale];
  const productIndex = PRODUCT_DETAIL_SLUGS.indexOf(slug);
  const product = productCopy(locale)[productIndex];
  const shared = PIPES_TUBES_DETAIL[locale];
  const specific = ADDITIONAL_PRODUCT_DETAILS[slug][locale];
  return {
    ...shared,
    category: product.eyebrow,
    overviewTitle: specific.overviewTitle,
    overview: specific.overview,
    rangeTitle: specific.rangeTitle,
    range: product.productRange.map((title, index) => ({ title, description: specific.rangeDescriptions[index] })),
    technicalTitle: specific.technicalTitle,
    technical: specific.technical,
    rfqTitle: specific.rfqTitle,
    rfqItems: specific.rfqItems,
  };
}
