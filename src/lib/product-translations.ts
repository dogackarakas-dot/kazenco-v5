import type { Locale } from "@/lib/i18n";

export interface ProductCopy {
  title: string;
  eyebrow: string;
  description: string;
}

const copy: Record<Locale, ProductCopy[]> = {
  en: [
    { title: "Pipes & Tubes", eyebrow: "Piping systems", description: "Carbon steel, stainless steel and alloy steel pipes and tubes for refinery, petrochemical, energy and industrial projects." },
    { title: "Fittings & Flanges", eyebrow: "Connection systems", description: "Forged and butt-weld fittings, flanges and connection components supplied to international project standards." },
    { title: "Valves & Instrumentation", eyebrow: "Flow control", description: "Process valves, instrumentation valves, tubing and control components for critical industrial service." },
    { title: "Fasteners & Anchor Bolts", eyebrow: "Connection hardware", description: "Stud bolts, anchor bolts, nuts, washers and custom fastening packages supported by material documentation." },
    { title: "Electrical Equipment", eyebrow: "Electrical supply", description: "Project-based sourcing of electrical equipment, accessories and supporting industrial materials." },
    { title: "Construction Materials", eyebrow: "Site materials", description: "Coordinated supply of construction, fit-out, furnishing and site materials for project delivery across Kazakhstan." },
  ],
  ru: [
    { title: "Трубы и трубная продукция", eyebrow: "Трубопроводные системы", description: "Трубы из углеродистой, нержавеющей и легированной стали для нефтеперерабатывающих, нефтехимических, энергетических и промышленных проектов." },
    { title: "Фитинги и фланцы", eyebrow: "Соединительные системы", description: "Кованые и приварные встык фитинги, фланцы и соединительные компоненты по международным проектным стандартам." },
    { title: "Арматура и КИП", eyebrow: "Управление потоком", description: "Технологическая и приборная арматура, импульсные трубки и компоненты управления для ответственных промышленных систем." },
    { title: "Крепёж и анкерные болты", eyebrow: "Крепёжные элементы", description: "Шпильки, анкерные болты, гайки, шайбы и специальные комплекты крепежа с сопроводительной документацией на материалы." },
    { title: "Электрооборудование", eyebrow: "Электротехнические поставки", description: "Проектные поставки электрооборудования, комплектующих и вспомогательных промышленных материалов." },
    { title: "Строительные материалы", eyebrow: "Материалы для площадки", description: "Согласованная поставка строительных, отделочных, мебельных и площадочных материалов для проектов по всему Казахстану." },
  ],
  tr: [
    { title: "Boru ve Tüpler", eyebrow: "Boru sistemleri", description: "Rafineri, petrokimya, enerji ve endüstriyel projeler için karbon çelik, paslanmaz çelik ve alaşımlı çelik boru ve tüpler." },
    { title: "Bağlantı Parçaları ve Flanşlar", eyebrow: "Bağlantı sistemleri", description: "Uluslararası proje standartlarına uygun dövme ve alın kaynaklı bağlantı parçaları, flanşlar ve bağlantı bileşenleri." },
    { title: "Vanalar ve Enstrümantasyon", eyebrow: "Akış kontrolü", description: "Kritik endüstriyel uygulamalar için proses vanaları, enstrümantasyon vanaları, enstrümantasyon boruları (tubing) ve kontrol bileşenleri." },
    { title: "Bağlantı Elemanları ve Ankraj Cıvataları", eyebrow: "Bağlantı donanımı", description: "Malzeme dokümantasyonuyla desteklenen saplama, ankraj cıvatası, somun, pul ve özel bağlantı elemanı paketleri." },
    { title: "Elektrik Ekipmanları", eyebrow: "Elektrik tedariki", description: "Projeye özel elektrik ekipmanı, aksesuar ve yardımcı endüstriyel malzeme tedariki." },
    { title: "İnşaat Malzemeleri", eyebrow: "Saha malzemeleri", description: "Kazakistan genelindeki projeler için inşaat, ince işler, mobilya ve saha malzemelerinin koordineli tedariki." },
  ],
  kz: [
    { title: "Құбырлар мен түтіктер", eyebrow: "Құбыр жүйелері", description: "Мұнай өңдеу, мұнай-химия, энергетика және өнеркәсіптік жобаларға арналған көміртекті, тот баспайтын және легірленген болат құбырлар." },
    { title: "Фитингтер мен фланецтер", eyebrow: "Қосылу жүйелері", description: "Халықаралық жоба стандарттарына сәйкес соғылған және түйістіріп дәнекерленетін фитингтер, фланецтер және қосылу бөлшектері." },
    { title: "Арматура және аспаптар", eyebrow: "Ағынды басқару", description: "Жауапты өнеркәсіптік жүйелерге арналған технологиялық және аспаптық арматура, түтіктер мен басқару бөлшектері." },
    { title: "Бекіткіштер мен анкерлік болттар", eyebrow: "Бекіту жабдықтары", description: "Материал құжаттарымен расталған шпилькалар, анкерлік болттар, сомындар, шайбалар және арнайы бекіту жинақтары." },
    { title: "Электр жабдықтары", eyebrow: "Электрмен жабдықтау", description: "Жобаға бейімделген электр жабдықтарын, керек-жарақтарды және қосалқы өнеркәсіптік материалдарды жеткізу." },
    { title: "Құрылыс материалдары", eyebrow: "Алаң материалдары", description: "Қазақстан бойынша жобаларға құрылыс, әрлеу, жиһаз және алаң материалдарын үйлестіріп жеткізу." },
  ],
};

export const productCopy = (locale: Locale) => copy[locale];

export const productReferenceLabels: Record<Locale, string[]> = {
  en: ["Structural steel components", "Rolled metal products", "Steel fabrication facility", "Fabricated steel components", "Structural profiles and tubes"],
  ru: ["Элементы стальных конструкций", "Металлопрокат", "Производство металлоконструкций", "Изготовленные стальные элементы", "Стальные профили и трубы"],
  tr: ["Yapısal çelik bileşenler", "Haddelenmiş metal ürünler", "Çelik imalat tesisi", "İmal edilmiş çelik bileşenler", "Yapısal profiller ve borular"],
  kz: ["Құрылымдық болат бөлшектер", "Илектелген металл өнімдері", "Болат конструкцияларын өндіру орны", "Дайындалған болат бөлшектер", "Құрылымдық профильдер мен құбырлар"],
};
