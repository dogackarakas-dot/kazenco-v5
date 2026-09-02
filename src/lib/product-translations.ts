import type { Locale } from "@/lib/i18n";

export interface ProductCopy {
  title: string;
  eyebrow: string;
  description: string;
  productRange: string[];
}

const copy: Record<Locale, ProductCopy[]> = {
  en: [
    { title: "Pipes & Tubes", eyebrow: "Industrial piping", description: "Carbon steel, stainless steel and alloy steel pipes and tubes for refinery, petrochemical, energy and industrial projects.", productRange: ["Carbon steel pipes", "Stainless steel pipes & tubes", "Alloy & duplex pipes", "Seamless & welded pipes"] },
    { title: "Fittings & Flanges", eyebrow: "Piping components", description: "Forged and butt-weld fittings, flanges and connection components supplied to international project standards.", productRange: ["Buttweld fittings", "Forged fittings", "Industrial flanges", "Special piping components"] },
    { title: "Valves & Instrumentation", eyebrow: "Process control", description: "Process valves, instrumentation valves, tubing and control components for critical industrial service.", productRange: ["Ball, gate & globe valves", "Check & butterfly valves", "Instrumentation valves & manifolds", "Instrumentation tubing & control components"] },
    { title: "Fasteners & Anchor Bolts", eyebrow: "Industrial fasteners", description: "Stud bolts, anchor bolts, nuts, washers and custom fastening packages supported by material documentation.", productRange: ["Stud bolts", "Anchor bolts", "Nuts & washers", "Custom fastener packages"] },
    { title: "Electrical Equipment", eyebrow: "Electrical systems", description: "Project-based sourcing of electrical equipment, accessories and supporting industrial materials.", productRange: ["Industrial electrical equipment", "Explosion-proof & ATEX equipment", "Measurement & test equipment", "Power, control & communication cables"] },
    { title: "Construction Materials", eyebrow: "Construction supply", description: "Coordinated supply of construction, fit-out, furnishing and site materials for project delivery across Kazakhstan.", productRange: ["Structural steel products", "Industrial insulation systems", "Construction & site materials", "Fit-out & finishing materials"] },
    { title: "Tools, Measurement & Safety Equipment", eyebrow: "Site support & safety", description: "Industrial tools, measurement and inspection instruments, PPE and fire/site safety equipment supplied to the approved project specification.", productRange: ["Hand & workshop tools", "Measurement & inspection instruments", "PPE", "Fire & site safety equipment"] },
  ],
  ru: [
    { title: "Трубы и трубная продукция", eyebrow: "Трубопроводные системы", description: "Трубы из углеродистой, нержавеющей и легированной стали для нефтеперерабатывающих, нефтехимических, энергетических и промышленных проектов.", productRange: ["Трубы из углеродистой стали", "Трубы из нержавеющей стали", "Трубы из легированных и дуплексных сталей", "Бесшовные и сварные трубы"] },
    { title: "Фитинги и фланцы", eyebrow: "Соединительные системы", description: "Кованые и приварные встык фитинги, фланцы и соединительные компоненты по международным проектным стандартам.", productRange: ["Приварные встык фитинги", "Кованые фитинги", "Промышленные фланцы", "Специальные компоненты трубопроводов"] },
    { title: "Арматура и КИП", eyebrow: "Управление потоком", description: "Технологическая и приборная арматура, импульсные трубки и компоненты управления для ответственных промышленных систем.", productRange: ["Шаровые, задвижные и запорные клапаны", "Обратные и дисковые затворы", "Приборные клапаны и манифольды", "Импульсные трубки и компоненты управления"] },
    { title: "Крепёж и анкерные болты", eyebrow: "Крепёжные элементы", description: "Шпильки, анкерные болты, гайки, шайбы и специальные комплекты крепежа с сопроводительной документацией на материалы.", productRange: ["Резьбовые шпильки", "Анкерные болты", "Гайки и шайбы", "Специальные комплекты крепежа"] },
    { title: "Электрооборудование", eyebrow: "Электротехнические поставки", description: "Проектные поставки электрооборудования, комплектующих и вспомогательных промышленных материалов.", productRange: ["Промышленное электрооборудование", "Взрывозащищённое оборудование ATEX", "Измерительное и испытательное оборудование", "Силовые, контрольные и коммуникационные кабели"] },
    { title: "Строительные материалы", eyebrow: "Материалы для площадки", description: "Согласованная поставка строительных, отделочных, мебельных и площадочных материалов для проектов по всему Казахстану.", productRange: ["Изделия из конструкционной стали", "Промышленные системы изоляции", "Строительные материалы", "Отделочные материалы"] },
    { title: "Инструменты, измерительное и защитное оборудование", eyebrow: "Поддержка площадки и безопасность", description: "Промышленные инструменты, измерительные и контрольные приборы, СИЗ и противопожарное/площадочное защитное оборудование, поставляемые по утверждённой спецификации проекта.", productRange: ["Ручной и цеховой инструмент", "Измерительные и контрольные приборы", "СИЗ", "Противопожарное и площадочное защитное оборудование"] },
  ],
  tr: [
    { title: "Borular ve Tüpler", eyebrow: "Endüstriyel borulama", description: "Rafineri, petrokimya, enerji ve endüstriyel projeler için karbon çelik, paslanmaz çelik ve alaşımlı çelik boru ve tüpler.", productRange: ["Karbon çelik borular", "Paslanmaz çelik borular ve tüpler", "Alaşımlı ve dubleks borular", "Dikişsiz ve kaynaklı borular"] },
    { title: "Boru Bağlantı Parçaları ve Flanşlar", eyebrow: "Borulama bileşenleri", description: "Uluslararası proje standartlarına uygun dövme ve alın kaynaklı bağlantı parçaları, flanşlar ve bağlantı bileşenleri.", productRange: ["Alın kaynaklı bağlantı parçaları", "Dövme bağlantı parçaları", "Endüstriyel flanşlar", "Özel borulama bileşenleri"] },
    { title: "Vanalar ve Enstrümantasyon Ekipmanları", eyebrow: "Proses kontrolü", description: "Kritik endüstriyel uygulamalar için proses vanaları, enstrümantasyon vanaları, enstrümantasyon boruları (tubing) ve kontrol bileşenleri.", productRange: ["Küresel, sürgülü ve glob vanalar", "Çekvalf ve kelebek vanalar", "Enstrümantasyon vanaları ve manifoldlar", "Enstrümantasyon tüpleri ve kontrol bileşenleri"] },
    { title: "Bağlantı Elemanları ve Ankraj Cıvataları", eyebrow: "Endüstriyel bağlantı elemanları", description: "Malzeme dokümantasyonuyla desteklenen saplama, ankraj cıvatası, somun, pul ve özel bağlantı elemanı paketleri.", productRange: ["Saplama cıvataları", "Ankraj cıvataları", "Somun ve rondelalar", "Özel bağlantı elemanı paketleri"] },
    { title: "Elektrik Ekipmanları", eyebrow: "Elektrik sistemleri", description: "Projeye özel elektrik ekipmanı, aksesuar ve yardımcı endüstriyel malzeme tedariki.", productRange: ["Endüstriyel elektrik ekipmanları", "Ex-proof ve ATEX ekipmanları", "Ölçüm ve test ekipmanları", "Güç, kontrol ve haberleşme kabloları"] },
    { title: "İnşaat ve Yapı Malzemeleri", eyebrow: "Yapı malzemeleri tedariki", description: "Kazakistan genelindeki projeler için inşaat, ince işler, mobilya ve saha malzemelerinin koordineli tedariki.", productRange: ["Yapısal çelik ürünleri", "Endüstriyel yalıtım sistemleri", "Yapı ve şantiye malzemeleri", "İnce iş ve bitirme malzemeleri"] },
    { title: "Aletler, Ölçüm ve Güvenlik Ekipmanları", eyebrow: "Saha desteği ve güvenlik", description: "Onaylı proje şartnamesine göre tedarik edilen endüstriyel aletler, ölçüm ve muayene cihazları, KKD ve yangın/saha güvenlik ekipmanları.", productRange: ["El ve atölye aletleri", "Ölçüm ve muayene cihazları", "KKD", "Yangın ve saha güvenlik ekipmanları"] },
  ],
  kz: [
    { title: "Құбырлар мен түтіктер", eyebrow: "Құбыр жүйелері", description: "Мұнай өңдеу, мұнай-химия, энергетика және өнеркәсіптік жобаларға арналған көміртекті, тот баспайтын және легірленген болат құбырлар.", productRange: ["Көміртекті болат құбырлар", "Тот баспайтын болат құбырлар мен түтіктер", "Легірленген және дуплексті құбырлар", "Жіксіз және дәнекерленген құбырлар"] },
    { title: "Фитингтер мен фланецтер", eyebrow: "Қосылу жүйелері", description: "Халықаралық жоба стандарттарына сәйкес соғылған және түйістіріп дәнекерленетін фитингтер, фланецтер және қосылу бөлшектері.", productRange: ["Түйістіріп дәнекерленетін фитингтер", "Соғылған фитингтер", "Өнеркәсіптік фланецтер", "Арнайы құбыр бөлшектері"] },
    { title: "Арматура және аспаптар", eyebrow: "Ағынды басқару", description: "Жауапты өнеркәсіптік жүйелерге арналған технологиялық және аспаптық арматура, түтіктер мен басқару бөлшектері.", productRange: ["Шарлы, ысырмалы және глобус клапандар", "Кері және көбелек клапандар", "Аспаптық клапандар мен манифольдтар", "Аспаптық түтіктер мен басқару бөлшектері"] },
    { title: "Бекіткіштер мен анкерлік болттар", eyebrow: "Бекіту жабдықтары", description: "Материал құжаттарымен расталған шпилькалар, анкерлік болттар, сомындар, шайбалар және арнайы бекіту жинақтары.", productRange: ["Бұрандалы шпилькалар", "Анкерлік болттар", "Сомындар мен шайбалар", "Арнайы бекіту жинақтары"] },
    { title: "Электр жабдықтары", eyebrow: "Электрмен жабдықтау", description: "Жобаға бейімделген электр жабдықтарын, керек-жарақтарды және қосалқы өнеркәсіптік материалдарды жеткізу.", productRange: ["Өнеркәсіптік электр жабдықтары", "Жарылыстан қорғалған ATEX жабдықтары", "Өлшеу және сынақ жабдықтары", "Қуат, басқару және байланыс кабельдері"] },
    { title: "Құрылыс материалдары", eyebrow: "Алаң материалдары", description: "Қазақстан бойынша жобаларға құрылыс, әрлеу, жиһаз және алаң материалдарын үйлестіріп жеткізу.", productRange: ["Құрылымдық болат өнімдері", "Өнеркәсіптік оқшаулау жүйелері", "Құрылыс және алаң материалдары", "Әрлеу материалдары"] },
    { title: "Құралдар, өлшеу және қауіпсіздік жабдықтары", eyebrow: "Алаңды қолдау және қауіпсіздік", description: "Бекітілген жоба сипаттамасына сай жеткізілетін өнеркәсіптік құралдар, өлшеу және тексеру аспаптары, ЖҚҚ және өрт/алаң қауіпсіздігі жабдықтары.", productRange: ["Қол және шеберхана құралдары", "Өлшеу және тексеру аспаптары", "ЖҚҚ", "Өрт және алаң қауіпсіздігі жабдықтары"] },
  ],
};

export const productCopy = (locale: Locale) => copy[locale];

export const productReferenceLabels: Record<Locale, string[]> = {
  en: ["Structural steel components", "Rolled metal products", "Steel fabrication facility", "Fabricated steel components", "Structural profiles and tubes"],
  ru: ["Элементы стальных конструкций", "Металлопрокат", "Производство металлоконструкций", "Изготовленные стальные элементы", "Стальные профили и трубы"],
  tr: ["Yapısal çelik bileşenler", "Haddelenmiş metal ürünler", "Çelik imalat tesisi", "İmal edilmiş çelik bileşenler", "Yapısal profiller ve borular"],
  kz: ["Құрылымдық болат бөлшектер", "Илектелген металл өнімдері", "Болат конструкцияларын өндіру орны", "Дайындалған болат бөлшектер", "Құрылымдық профильдер мен құбырлар"],
};
