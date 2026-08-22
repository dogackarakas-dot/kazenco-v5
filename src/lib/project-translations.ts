import type { Locale } from "@/lib/i18n";
import { PROJECTS } from "@/lib/projects";
import type { Project } from "@/types/project";

type ProjectText = Pick<Project, "role" | "summary">;

const categoryCopy: Record<Locale, Record<NonNullable<Project["category"]>, string>> = {
  en: { "Fit-out & Furnishing": "Fit-out & Furnishing", Construction: "Construction", "Material Supply": "Material Supply", Assembly: "Assembly" },
  ru: { "Fit-out & Furnishing": "Отделка и оснащение", Construction: "Строительство", "Material Supply": "Поставка материалов", Assembly: "Монтаж" },
  tr: { "Fit-out & Furnishing": "İnce işler ve mobilya", Construction: "İnşaat", "Material Supply": "Malzeme tedariki", Assembly: "Montaj" },
  kz: { "Fit-out & Furnishing": "Әрлеу және жиһаз", Construction: "Құрылыс", "Material Supply": "Материал жеткізу", Assembly: "Монтаж" },
};

const metadataTitles: Record<string, Record<Locale, string>> = {
  "worley-parsons-atyrau": {
    en: "Worley Parsons Atyrau Project",
    ru: "Проект Worley Parsons в Атырау",
    tr: "Worley Parsons Atırau Projesi",
    kz: "Атыраудағы Worley Parsons жобасы",
  },
  "worley-parsons-almaty": {
    en: "Worley Parsons Almaty Project",
    ru: "Проект Worley Parsons в Алматы",
    tr: "Worley Parsons Almatı Projesi",
    kz: "Алматыдағы Worley Parsons жобасы",
  },
  "bonatti-office-tengiz": {
    en: "Bonatti Office Tengiz Project",
    ru: "Проект офиса Bonatti в Тенгизе",
    tr: "Bonatti Ofisi Tengiz Projesi",
    kz: "Теңіздегі Bonatti кеңсесі жобасы",
  },
  "bonatti-office-aksai": {
    en: "Bonatti Office Aksai Project",
    ru: "Проект офиса Bonatti в Аксае",
    tr: "Bonatti Ofisi Aksay Projesi",
    kz: "Ақсайдағы Bonatti кеңсесі жобасы",
  },
};

interface ProjectVisualCopy {
  heading?: string;
  imageAlt?: string;
  galleryAlts?: string[];
}

const projectVisualCopy: Record<string, Record<Locale, ProjectVisualCopy>> = {
  "worley-parsons-atyrau": {
    en: {
      heading: "Worley Parsons — Atyrau",
      imageAlt: "Snow-covered exterior of the Worley Parsons project building in Atyrau",
    },
    ru: {
      heading: "Worley Parsons — Атырау",
      imageAlt: "Зимний внешний вид здания проекта Worley Parsons в Атырау",
    },
    tr: {
      heading: "Worley Parsons — Atırau",
      imageAlt: "Atırau’daki Worley Parsons proje binasının karlı dış görünümü",
    },
    kz: {
      heading: "Worley Parsons — Атырау",
      imageAlt: "Атыраудағы Worley Parsons жобасы ғимаратының қысқы сыртқы көрінісі",
    },
  },
  "worley-parsons-almaty": {
    en: {
      heading: "Worley Parsons — Almaty",
      imageAlt: "Exterior of the Worley Parsons project building in Almaty",
    },
    ru: {
      heading: "Worley Parsons — Алматы",
      imageAlt: "Внешний вид здания проекта Worley Parsons в Алматы",
    },
    tr: {
      heading: "Worley Parsons — Almatı",
      imageAlt: "Almatı’daki Worley Parsons proje binasının dış görünümü",
    },
    kz: {
      heading: "Worley Parsons — Алматы",
      imageAlt: "Алматыдағы Worley Parsons жобасы ғимаратының сыртқы көрінісі",
    },
  },
  "4-batyr-houses-atyrau": {
    en: {
      imageAlt: "Multi-storey 4 Batyr Houses residential building exterior in Atyrau",
      galleryAlts: [
        "Scaffolding across the 4 Batyr Houses residential building façade",
        "Scaffolded façade beside a completed 4 Batyr Houses building",
        "Upward view of scaffolding and open balconies at 4 Batyr Houses",
        "Wide view of the scaffolded multi-storey façade at 4 Batyr Houses",
      ],
    },
    ru: {
      imageAlt: "Фасад многоэтажного жилого здания 4 Batyr Houses в Атырау",
      galleryAlts: [
        "Строительные леса на фасаде жилого здания 4 Batyr Houses",
        "Фасад в строительных лесах рядом с готовым зданием 4 Batyr Houses",
        "Вид снизу на строительные леса и открытые балконы 4 Batyr Houses",
        "Общий вид многоэтажного фасада 4 Batyr Houses в строительных лесах",
      ],
    },
    tr: {
      imageAlt: "Atırau’daki çok katlı 4 Batyr Houses konut binasının dış cephesi",
      galleryAlts: [
        "4 Batyr Houses konut binasının cephesindeki iskeleler",
        "Tamamlanmış 4 Batyr Houses binasının yanındaki iskeleli cephe",
        "4 Batyr Houses iskeleleri ve açık balkonlarının aşağıdan görünümü",
        "4 Batyr Houses çok katlı iskeleli cephesinin geniş görünümü",
      ],
    },
    kz: {
      imageAlt: "Атыраудағы көпқабатты 4 Batyr Houses тұрғын үйінің сыртқы көрінісі",
      galleryAlts: [
        "4 Batyr Houses тұрғын үйінің қасбетіндегі құрылыс сатылары",
        "Аяқталған 4 Batyr Houses ғимараты жанындағы сатылы қасбет",
        "4 Batyr Houses құрылыс сатылары мен ашық балкондарының төменнен көрінісі",
        "4 Batyr Houses көпқабатты сатылы қасбетінің кең көрінісі",
      ],
    },
  },
  "sarens-tco-tengiz": {
    en: {
      imageAlt: "Grey modular building on the snow-covered Sarens TCO site in Tengiz",
      galleryAlts: [
        "Red Sarens telescopic handler beside heavy equipment",
        "Sarens crane and packaged materials on the Tengiz site",
        "Workers handling stacked white steel members beside site equipment",
        "Modular building exterior with windows, air-conditioning units and ducts",
        "Long grey modular building on the snow-covered industrial site",
        "Modular building and orange generator on the snowy Tengiz site",
        "Open-plan modular office with wrapped desks and chairs during fit-out",
        "Furnished open-plan modular office with desks, chairs and air conditioning",
        "Office workstations, chairs, divider and storage cabinet during installation",
      ],
    },
    ru: {
      imageAlt: "Серое модульное здание на заснеженной площадке Sarens TCO в Тенгизе",
      galleryAlts: [
        "Красный телескопический погрузчик Sarens рядом с тяжёлой техникой",
        "Кран Sarens и упакованные материалы на площадке в Тенгизе",
        "Рабочие перемещают белые стальные элементы рядом с техникой",
        "Фасад модульного здания с окнами, кондиционерами и воздуховодами",
        "Длинное серое модульное здание на заснеженной промышленной площадке",
        "Модульное здание и оранжевый генератор на заснеженной площадке в Тенгизе",
        "Модульный офис открытой планировки с упакованными столами и стульями во время отделки",
        "Оборудованный модульный офис открытой планировки со столами, стульями и кондиционерами",
        "Офисные рабочие места, стулья, перегородка и шкаф во время монтажа",
      ],
    },
    tr: {
      imageAlt: "Tengiz’deki karla kaplı Sarens TCO sahasında gri modüler bina",
      galleryAlts: [
        "Ağır ekipmanın yanında kırmızı Sarens teleskopik yükleyici",
        "Tengiz sahasında Sarens vinci ve paketlenmiş malzemeler",
        "Saha ekipmanı yanında istiflenmiş beyaz çelik elemanları taşıyan çalışanlar",
        "Pencereler, klima üniteleri ve kanalları bulunan modüler bina dış cephesi",
        "Karla kaplı endüstriyel sahadaki uzun gri modüler bina",
        "Karlı Tengiz sahasında modüler bina ve turuncu jeneratör",
        "İnce işler sırasında paketli masa ve sandalyelerin bulunduğu açık plan modüler ofis",
        "Masa, sandalye ve klimalarla döşenmiş açık plan modüler ofis",
        "Montaj sırasında ofis çalışma masaları, sandalyeler, bölücü ve dolap",
      ],
    },
    kz: {
      imageAlt: "Теңіздегі қар басқан Sarens TCO алаңындағы сұр модульдік ғимарат",
      galleryAlts: [
        "Ауыр техниканың жанындағы қызыл Sarens телескопиялық тиегіші",
        "Теңіз алаңындағы Sarens краны мен қапталған материалдар",
        "Алаң техникасы жанында ақ болат элементтерді тасымалдап жатқан жұмысшылар",
        "Терезелері, кондиционерлері және ауа арналары бар модульдік ғимарат қасбеті",
        "Қар басқан өнеркәсіптік алаңдағы ұзын сұр модульдік ғимарат",
        "Қарлы Теңіз алаңындағы модульдік ғимарат пен қызғылт сары генератор",
        "Әрлеу кезінде қапталған үстелдері мен орындықтары бар ашық жоспарлы модульдік кеңсе",
        "Үстелдермен, орындықтармен және кондиционерлермен жабдықталған ашық жоспарлы модульдік кеңсе",
        "Монтаж кезіндегі кеңсе үстелдері, орындықтар, бөлгіш және шкаф",
      ],
    },
  },
  "tco-industrial-access-platforms-tengiz": {
    en: {
      imageAlt: "Green and yellow industrial access platform installed over red pipes at TCO Tengiz",
      galleryAlts: [
        "Steel access platforms and stairs under fabrication in a workshop",
        "Green and yellow access platform being installed among large pipes",
      ],
    },
    ru: {
      imageAlt: "Зелёная с жёлтым промышленная платформа доступа над красными трубами на TCO Тенгиз",
      galleryAlts: [
        "Изготовление стальных платформ доступа и лестниц в цехе",
        "Монтаж зелёной с жёлтым платформы доступа среди крупных труб",
      ],
    },
    tr: {
      imageAlt: "TCO Tengiz’de kırmızı boruların üzerine kurulmuş yeşil ve sarı endüstriyel erişim platformu",
      galleryAlts: [
        "Atölyede imal edilen çelik erişim platformları ve merdivenler",
        "Büyük borular arasında kurulmakta olan yeşil ve sarı erişim platformu",
      ],
    },
    kz: {
      imageAlt: "TCO Теңізде қызыл құбырлар үстіне орнатылған жасыл-сары өнеркәсіптік кіру платформасы",
      galleryAlts: [
        "Цехта жасалып жатқан болат кіру платформалары мен баспалдақтар",
        "Үлкен құбырлар арасында орнатылып жатқан жасыл-сары кіру платформасы",
      ],
    },
  },
  "isker-industrial-infrastructure-tengiz": {
    en: {
      imageAlt: "Pipework and green steel structures at the ISKER industrial site in Tengiz",
      galleryAlts: [
        "Worker beside green steel frames under construction at the industrial site",
        "Excavated trench lined with black protective material beside steel structures",
        "Workers installing black protective lining in an industrial trench",
        "Workers applying black protective lining around concrete foundations",
      ],
    },
    ru: {
      imageAlt: "Трубопроводы и зелёные металлоконструкции на промышленной площадке ISKER в Тенгизе",
      galleryAlts: [
        "Рабочий рядом с возводимыми зелёными металлоконструкциями на промышленной площадке",
        "Траншея с чёрным защитным материалом рядом с металлоконструкциями",
        "Рабочие монтируют чёрное защитное покрытие в промышленной траншее",
        "Рабочие укладывают чёрное защитное покрытие вокруг бетонных оснований",
      ],
    },
    tr: {
      imageAlt: "Tengiz’deki ISKER endüstriyel sahasında boru hatları ve yeşil çelik yapılar",
      galleryAlts: [
        "Endüstriyel sahada yapımı süren yeşil çelik çerçevelerin yanında çalışan",
        "Çelik yapıların yanında siyah koruyucu malzemeyle kaplanmış kazı hendeği",
        "Endüstriyel hendekte siyah koruyucu kaplama uygulayan çalışanlar",
        "Beton temellerin çevresine siyah koruyucu kaplama uygulayan çalışanlar",
      ],
    },
    kz: {
      imageAlt: "Теңіздегі ISKER өнеркәсіптік алаңындағы құбырлар мен жасыл болат құрылымдар",
      galleryAlts: [
        "Өнеркәсіптік алаңда салынып жатқан жасыл болат қаңқалар жанындағы жұмысшы",
        "Болат құрылымдар жанындағы қара қорғаныш материал төселген ор",
        "Өнеркәсіптік орға қара қорғаныш жабындысын орнатып жатқан жұмысшылар",
        "Бетон іргетастардың айналасына қара қорғаныш жабындысын төсеп жатқан жұмысшылар",
      ],
    },
  },
  "marriott-hotel-atyrau": {
    en: { imageAlt: "Marriott Hotel tower exterior in Atyrau at dusk" },
    ru: { imageAlt: "Фасад башни Marriott Hotel в Атырау в вечернее время" },
    tr: { imageAlt: "Atırau’daki Marriott Hotel kulesinin akşam dış görünümü" },
    kz: { imageAlt: "Атыраудағы Marriott Hotel мұнарасының кешкі сыртқы көрінісі" },
  },
  "akzhayik-hotel-atyrau": {
    en: { imageAlt: "Akzhayik Hotel exterior in Atyrau with snow along the street" },
    ru: { imageAlt: "Фасад Akzhayik Hotel в Атырау со снегом вдоль улицы" },
    tr: { imageAlt: "Atırau’daki Akzhayik Hotel’in cadde boyunca kar bulunan dış görünümü" },
    kz: { imageAlt: "Атыраудағы Akzhayik Hotel ғимаратының көше бойында қар бар сыртқы көрінісі" },
  },
  "kis-orion-atyrau": {
    en: { imageAlt: "KIS Orion office building exterior in Atyrau with snow-covered ground" },
    ru: { imageAlt: "Фасад офисного здания KIS Orion в Атырау на заснеженной территории" },
    tr: { imageAlt: "Atırau’daki KIS Orion ofis binasının karla kaplı zemindeki dış görünümü" },
    kz: { imageAlt: "Атыраудағы KIS Orion кеңсе ғимаратының қар басқан аумақтағы сыртқы көрінісі" },
  },
  "bonatti-office-tengiz": {
    en: {
      heading: "Bonatti Office Building — Tengiz",
      imageAlt: "White modular Bonatti office units with red trim and a crane",
      galleryAlts: [
        "Blue and white modular unit with metal access stairs during assembly",
        "Workers assembling blue and white modular units inside a workshop",
        "Metal access stairs and handrails being fitted to modular units",
      ],
    },
    ru: {
      heading: "Офисное здание Bonatti — Тенгиз",
      imageAlt: "Белые модульные офисные блоки Bonatti с красной отделкой и краном",
      galleryAlts: [
        "Сине-белый модульный блок с металлической лестницей во время сборки",
        "Рабочие собирают сине-белые модульные блоки в цехе",
        "Монтаж металлических лестниц и поручней на модульные блоки",
      ],
    },
    tr: {
      heading: "Bonatti Ofis Binası — Tengiz",
      imageAlt: "Kırmızı çerçeveli beyaz Bonatti modüler ofis üniteleri ve vinç",
      galleryAlts: [
        "Montaj sırasında metal erişim merdivenli mavi beyaz modüler ünite",
        "Atölyede mavi beyaz modüler üniteleri monte eden çalışanlar",
        "Modüler ünitelere takılan metal erişim merdivenleri ve korkuluklar",
      ],
    },
    kz: {
      heading: "Bonatti кеңсе ғимараты — Теңіз",
      imageAlt: "Қызыл жиекті ақ Bonatti модульдік кеңсе блоктары мен кран",
      galleryAlts: [
        "Құрастыру кезіндегі металл баспалдағы бар көк-ақ модульдік блок",
        "Цехта көк-ақ модульдік блоктарды құрастырып жатқан жұмысшылар",
        "Модульдік блоктарға орнатылып жатқан металл баспалдақтар мен қоршаулар",
      ],
    },
  },
  "bonatti-office-aksai": {
    en: { heading: "Bonatti Office Building — Aksai" },
    ru: { heading: "Офисное здание Bonatti — Аксай" },
    tr: { heading: "Bonatti Ofis Binası — Aksay" },
    kz: { heading: "Bonatti кеңсе ғимараты — Ақсай" },
  },
  "isker-construction-head-office-atyrau": {
    en: { imageAlt: "Glass-fronted ISKER Construction head office building in Atyrau at sunset" },
    ru: { imageAlt: "Стеклянный фасад головного офиса ISKER Construction в Атырау на закате" },
    tr: { imageAlt: "Atırau’daki cam cepheli ISKER Construction genel merkez binasının gün batımı görünümü" },
    kz: { imageAlt: "Атыраудағы әйнек қасбетті ISKER Construction бас кеңсесінің күн батардағы көрінісі" },
  },
};

const translations: Record<Exclude<Locale, "en">, Record<string, ProjectText>> = {
  tr: {
    "worley-parsons-atyrau": { role: "Anahtar teslim ince işler ve mobilya", summary: "Worley Parsons’ın Atırau ofislerinde iç inşaat, mobilya ve nihai montajı kapsayan eksiksiz anahtar teslim ince işler ve mobilya uygulaması." },
    "4-batyr-houses-atyrau": { role: "İnşaat ve ince işler", summary: "Atırau’daki 4 Batyr Houses için koordineli saha uygulaması ve iç mekân tamamlamasıyla gerçekleştirilen inşaat ve ince işler." },
    "sarens-tco-tengiz": { role: "Anahtar teslim ince işler ve mobilya (endüstriyel saha mobilizasyonu)", summary: "Sarens / Tengizchevroil (TCO) için Tengiz’de; malzeme elleçleme ve modüler bina kurulumundan tamamlanmış ofis iç mekânlarına kadar endüstriyel saha mobilizasyonunu destekleyen anahtar teslim uygulama." },
    "tco-industrial-access-platforms-tengiz": { role: "Endüstriyel erişim platformu imalatı, montajı ve saha hizmetleri", summary: "Tengiz’deki TCO projesi için atölye imalatı, saha montajı ve operasyonel erişimin tamamlanmasını kapsayan endüstriyel erişim platformları ve saha altyapı desteği." },
    "isker-industrial-infrastructure-tengiz": { role: "Çelik konstrüksiyon montajı, zemin kaplama ve boru hattı altyapı desteği", summary: "ISKER Group için Tengiz’de; beton temeller üzerinde çelik taşıyıcı montajı, koruyucu zemin kaplama ve yalıtım sistemleri ile CaTRo boru hattı ve yükleme raflarına yönelik altyapı işleri, sıkı petrol ve gaz HSE kurallarına uygun olarak tamamlandı." },
    "worley-parsons-almaty": { role: "Anahtar teslim ince işler ve mobilya", summary: "Worley Parsons’ın Almatı ofislerinde iç mekân işleri, mobilya tedariki ve nihai montajı kapsayan anahtar teslim uygulama." },
    "marriott-hotel-atyrau": { role: "Ekipman ve malzeme tedariki", summary: "Atırau Marriott Hotel için konaklama sektörü şartnamelerine ve teslimat programına uygun ekipman ve malzeme tedariki." },
    "akzhayik-hotel-atyrau": { role: "Ekipman ve malzeme tedariki", summary: "Atırau’daki Akzhayik Hotel için iç mekân gereksinimleriyle koordineli ekipman ve malzeme tedariki." },
    "kis-orion-atyrau": { role: "Anahtar teslim mobilya", summary: "Atırau’daki KIS Orion projesinde mobilya üretimi, tedariki ve montajının eksiksiz paket olarak teslimi." },
    "gate-agip-camp-karabatan": { role: "İnşaat, ince işler ve mobilya", summary: "Karabatan’daki GATE Construction AGIP kampında büyük ölçekli endüstriyel konaklama ihtiyacını destekleyen inşaat, ince işler ve mobilya uygulamaları." },
    "isker-construction-atyrau": { role: "Anahtar teslim mobilya", summary: "ISKER Construction için Atırau’da tedarik, teslimat ve montajı kapsayan anahtar teslim mobilya işleri." },
    "isker-institute-aktau": { role: "Anahtar teslim mobilya", summary: "Aktau’daki ISKER Institute için mobilya tedariki ve montajını kapsayan eksiksiz anahtar teslim paket." },
    "sapsan-office-buildings-houses-tengiz": { role: "Anahtar teslim ince işler ve mobilya", summary: "Sapsan’ın Tengiz’deki ofis binaları ve konutlarında saha operasyon alanlarını destekleyen ince işler ve mobilya uygulamaları." },
    "sicim-office-karabatan": { role: "Anahtar teslim inşaat", summary: "Karabatan’daki SICIM ofisinin saha koordinasyonundan montaj ve kuruluma kadar anahtar teslim inşaatı." },
    "bonatti-office-tengiz": { role: "İnşaat, ince işler ve mobilya", summary: "Tengiz’deki Bonatti ofis binasının endüstriyel saha standartlarına uygun anahtar teslim inşaat, ince işler ve mobilya uygulaması." },
    "bonatti-office-aksai": { role: "İnşaat ve ince işler", summary: "Aksai’deki Bonatti ofis binasında endüstriyel müşteri gereksinimlerine uygun inşaat ve ince işler." },
    "agip-kashagan-gate-camp": { role: "Montaj işleri", summary: "Bölgenin önemli endüstriyel yatırımlarından AGIP Kashagan gate camp için Karabatan’da gerçekleştirilen montaj işleri." },
    "nur-oil-head-office-atyrau": { role: "Anahtar teslim mobilya", summary: "NUR Oil Atırau Genel Merkezi için koordineli mobilya tedariki ve montajını içeren anahtar teslim uygulama." },
    "mmk-head-office-atyrau": { role: "Anahtar teslim mobilya", summary: "MMK Atırau Genel Merkezi için entegre tedarik ve montaj kapsamında tamamlanan anahtar teslim mobilya işleri." },
    "isker-construction-head-office-atyrau": { role: "Anahtar teslim mobilya", summary: "ISKER Construction Atırau Genel Merkezi için satın almadan nihai yerleşime kadar anahtar teslim mobilya uygulaması." },
  },
  ru: {
    "worley-parsons-atyrau": { role: "Отделка и оснащение под ключ", summary: "Полная отделка и оснащение офисов Worley Parsons в Атырау: внутренние работы, мебель и финальный монтаж под ключ." },
    "4-batyr-houses-atyrau": { role: "Строительство и отделка", summary: "Строительные и отделочные работы для 4 Batyr Houses в Атырау с координацией площадки и завершением интерьеров." },
    "sarens-tco-tengiz": { role: "Отделка и оснащение под ключ (мобилизация промышленной площадки)", summary: "Комплексная реализация для Sarens / Tengizchevroil (TCO) в Тенгизе — от обработки материалов и установки модульных зданий до полностью оборудованных офисов." },
    "tco-industrial-access-platforms-tengiz": { role: "Изготовление и монтаж промышленных платформ, площадочные услуги", summary: "Изготовление промышленных платформ доступа и поддержка площадочных коммуникаций для проекта TCO в Тенгизе, включая цеховое производство, монтаж и подготовку эксплуатационного доступа." },
    "isker-industrial-infrastructure-tengiz": { role: "Монтаж металлоконструкций, изоляция грунта и поддержка трубопроводной инфраструктуры", summary: "Промышленные работы для ISKER Group в Тенгизе: монтаж стальных рам на бетонных основаниях, защитная изоляция грунта и гражданские работы для трубопровода CaTRo и наливных эстакад в соответствии со строгими требованиями HSE." },
    "worley-parsons-almaty": { role: "Отделка и оснащение под ключ", summary: "Отделка и оснащение офисов Worley Parsons в Алматы, включая интерьерные работы, поставку мебели и финальный монтаж." },
    "marriott-hotel-atyrau": { role: "Поставка оборудования и материалов", summary: "Поставка оборудования и материалов для Marriott Hotel в Атырау в соответствии с гостиничными спецификациями и графиком." },
    "akzhayik-hotel-atyrau": { role: "Поставка оборудования и материалов", summary: "Поставка оборудования и материалов для Akzhayik Hotel в Атырау с учётом требований к гостиничной отделке." },
    "kis-orion-atyrau": { role: "Оснащение под ключ", summary: "Производство, поставка и монтаж мебели для проекта KIS Orion в Атырау единым комплексным пакетом." },
    "gate-agip-camp-karabatan": { role: "Строительство, отделка и оснащение", summary: "Строительство, отделка и оснащение лагеря GATE Construction AGIP в Карабатане для крупного промышленного жилого комплекса." },
    "isker-construction-atyrau": { role: "Оснащение под ключ", summary: "Оснащение ISKER Construction в Атырау под ключ, включая согласованные поставку, доставку и монтаж." },
    "isker-institute-aktau": { role: "Оснащение под ключ", summary: "Полный пакет поставки и монтажа мебели для ISKER Institute в Актау." },
    "sapsan-office-buildings-houses-tengiz": { role: "Отделка и оснащение под ключ", summary: "Отделка и оснащение офисных зданий и домов Sapsan в Тенгизе для поддержки рабочих пространств площадки." },
    "sicim-office-karabatan": { role: "Строительство под ключ", summary: "Строительство офиса SICIM в Карабатане под ключ — от координации площадки до сборки и монтажа." },
    "bonatti-office-tengiz": { role: "Строительство, отделка и оснащение", summary: "Строительство, отделка и оснащение офисного здания Bonatti в Тенгизе под ключ по стандартам промышленной площадки." },
    "bonatti-office-aksai": { role: "Строительство и отделка", summary: "Строительные и отделочные работы в офисном здании Bonatti в Аксае в соответствии с требованиями промышленного заказчика." },
    "agip-kashagan-gate-camp": { role: "Монтажные работы", summary: "Монтажные работы для лагеря AGIP Kashagan Gate Camp в Карабатане — одного из ключевых промышленных проектов региона." },
    "nur-oil-head-office-atyrau": { role: "Оснащение под ключ", summary: "Оснащение головного офиса NUR Oil в Атырау под ключ, включая согласованную поставку и монтаж мебели." },
    "mmk-head-office-atyrau": { role: "Оснащение под ключ", summary: "Оснащение головного офиса MMK в Атырау под ключ в рамках единого комплекса поставки и монтажа." },
    "isker-construction-head-office-atyrau": { role: "Оснащение под ключ", summary: "Оснащение головного офиса ISKER Construction в Атырау под ключ — от закупки мебели до финальной расстановки." },
  },
  kz: {
    "worley-parsons-atyrau": { role: "Кілтпен әрлеу және жиһаздау", summary: "Атыраудағы Worley Parsons кеңселерін ішкі құрылыс, жиһаз және соңғы монтажды қамтитын толық кілтпен әрлеу және жабдықтау." },
    "4-batyr-houses-atyrau": { role: "Құрылыс және әрлеу", summary: "Атыраудағы 4 Batyr Houses үшін алаңды үйлестіру және интерьерді аяқтауды қамтитын құрылыс пен әрлеу жұмыстары." },
    "sarens-tco-tengiz": { role: "Кілтпен әрлеу және жиһаздау (өнеркәсіптік алаңды жұмылдыру)", summary: "Теңіздегі Sarens / Tengizchevroil (TCO) үшін материалдарды өңдеу мен модульдік ғимараттарды орнатудан бастап дайын кеңсе интерьерлеріне дейінгі толық орындау." },
    "tco-industrial-access-platforms-tengiz": { role: "Өнеркәсіптік кіру платформаларын жасау, орнату және алаң қызметтері", summary: "Теңіздегі TCO жобасына арналған өнеркәсіптік кіру платформаларын жасау және алаң инфрақұрылымын қолдау: цехтық өндіріс, монтаж және пайдалануға дайын кіру жолдары." },
    "isker-industrial-infrastructure-tengiz": { role: "Металл конструкцияларын монтаждау, жерді оқшаулау және құбыр инфрақұрылымын қолдау", summary: "Теңіздегі ISKER Group үшін бетон іргетастарға болат қаңқаларды монтаждау, қорғаныш жер төсемі мен оқшаулау жүйелері, сондай-ақ CaTRo құбыры мен тиеу эстакадаларына арналған азаматтық жұмыстар қатаң HSE талаптарына сай орындалды." },
    "worley-parsons-almaty": { role: "Кілтпен әрлеу және жиһаздау", summary: "Алматыдағы Worley Parsons кеңселерін ішкі жұмыстар, жиһаз жеткізу және соңғы монтажды қамтитын кілтпен әрлеу және жабдықтау." },
    "marriott-hotel-atyrau": { role: "Жабдық пен материал жеткізу", summary: "Атыраудағы Marriott Hotel үшін қонақүй талаптары мен кестесіне сәйкес жабдық пен материал жеткізу." },
    "akzhayik-hotel-atyrau": { role: "Жабдық пен материал жеткізу", summary: "Атыраудағы Akzhayik Hotel үшін әрлеу талаптарына сәйкестендірілген жабдық пен материал жеткізу." },
    "kis-orion-atyrau": { role: "Кілтпен жиһаздау", summary: "Атыраудағы KIS Orion жобасына жиһаз өндіру, жеткізу және монтаждауды бір толық пакетпен орындау." },
    "gate-agip-camp-karabatan": { role: "Құрылыс, әрлеу және жиһаздау", summary: "Қарабатандағы GATE Construction AGIP лагерінде ірі өнеркәсіптік тұру қажеттіліктеріне арналған құрылыс, әрлеу және жиһаздау жұмыстары." },
    "isker-construction-atyrau": { role: "Кілтпен жиһаздау", summary: "Атыраудағы ISKER Construction үшін жеткізу мен монтажды қамтитын кілтпен жиһаздау." },
    "isker-institute-aktau": { role: "Кілтпен жиһаздау", summary: "Ақтаудағы ISKER Institute үшін жиһаз жеткізу мен монтаждаудың толық пакеті." },
    "sapsan-office-buildings-houses-tengiz": { role: "Кілтпен әрлеу және жиһаздау", summary: "Теңіздегі Sapsan кеңсе ғимараттары мен үйлерін алаңдағы жұмыс орындарын қолдайтын әрлеу және жиһаздау." },
    "sicim-office-karabatan": { role: "Кілтпен құрылыс", summary: "Қарабатандағы SICIM кеңсесін алаңды үйлестіруден жинау мен монтажға дейін кілтпен салу." },
    "bonatti-office-tengiz": { role: "Құрылыс, әрлеу және жиһаздау", summary: "Теңіздегі Bonatti кеңсе ғимаратын өнеркәсіптік алаң стандарттарына сай кілтпен салу, әрлеу және жиһаздау." },
    "bonatti-office-aksai": { role: "Құрылыс және әрлеу", summary: "Ақсайдағы Bonatti кеңсе ғимаратында өнеркәсіптік тапсырыс беруші талаптарына сай құрылыс пен әрлеу." },
    "agip-kashagan-gate-camp": { role: "Монтаж жұмыстары", summary: "Өңірдің ірі өнеркәсіптік жобаларының бірі — Қарабатандағы AGIP Kashagan Gate Camp үшін монтаж жұмыстары." },
    "nur-oil-head-office-atyrau": { role: "Кілтпен жиһаздау", summary: "Атыраудағы NUR Oil бас кеңсесіне жиһаз жеткізу мен монтажды қамтитын кілтпен орындау." },
    "mmk-head-office-atyrau": { role: "Кілтпен жиһаздау", summary: "Атыраудағы MMK бас кеңсесіне біртұтас жеткізу және монтаж көлемінде кілтпен жиһаздау." },
    "isker-construction-head-office-atyrau": { role: "Кілтпен жиһаздау", summary: "Атыраудағы ISKER Construction бас кеңсесіне жиһаз сатып алудан соңғы орналастыруға дейінгі кілтпен орындау." },
  },
};

export function getLocalizedProjects(locale: Locale): Project[] {
  return PROJECTS.map((project) => getLocalizedProject(project.slug, locale) ?? project);
}

export function getLocalizedProject(slug: string, locale: Locale): Project | undefined {
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) return undefined;
  const text = locale === "en" ? undefined : translations[locale][slug];
  return {
    ...project,
    ...text,
    localizedCategory: project.category ? categoryCopy[locale][project.category] : undefined,
  };
}

export function getProjectMetadataTitle(slug: string, locale: Locale): string | undefined {
  return metadataTitles[slug]?.[locale];
}

export function getProjectHeading(slug: string, locale: Locale, fallback: string): string {
  return projectVisualCopy[slug]?.[locale]?.heading ?? fallback;
}

export function getProjectImageAlt(slug: string, locale: Locale, fallback: string): string {
  return projectVisualCopy[slug]?.[locale]?.imageAlt ?? fallback;
}

export function getProjectGalleryAlts(slug: string, locale: Locale): string[] | undefined {
  return projectVisualCopy[slug]?.[locale]?.galleryAlts;
}
