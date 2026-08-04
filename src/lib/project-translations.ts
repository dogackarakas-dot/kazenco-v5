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
