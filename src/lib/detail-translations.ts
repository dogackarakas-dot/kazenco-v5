import type { Locale } from "@/lib/i18n";

export const DETAIL_COPY: Record<Locale, {
  project: string[];
  capability: string[];
}> = {
  en: {
    project: ["Back to portfolio", "Verified project photography pending", "Project story", "Delivered through coordinated execution.", "Client", "Location", "Scope", "Year", "Status", "Completed", "Project gallery", "Delivery in detail.", "Previous project", "Next project", "Project navigation", "Project cover"],
    capability: ["All capabilities", "Capability", "Defined scope", "Requirements translated into coordinated delivery.", "Delivery approach", "From review to handover.", "Related delivery", "Selected project references.", "Have a defined scope or material requirement?", "Discuss the project with KAZENCO.", "Contact our team"],
  },
  ru: {
    project: ["Назад к портфолио", "Подтверждённые фотографии проекта ожидаются", "История проекта", "Реализовано благодаря скоординированному выполнению.", "Клиент", "Локация", "Объём", "Год", "Статус", "Завершён", "Галерея проекта", "Реализация в деталях.", "Предыдущий проект", "Следующий проект", "Навигация по проектам", "Обложка проекта"],
    capability: ["Все возможности", "Возможность", "Определённый объём", "Требования преобразованы в скоординированную реализацию.", "Подход к реализации", "От анализа до передачи.", "Связанные проекты", "Избранные проектные референсы.", "Есть определённый объём работ или потребность в материалах?", "Обсудите проект с KAZENCO.", "Связаться с командой"],
  },
  tr: {
    project: ["Portföye dön", "Doğrulanmış proje fotoğrafları bekleniyor", "Proje hikâyesi", "Koordineli proje uygulamasıyla tamamlandı.", "Müşteri", "Konum", "Kapsam", "Yıl", "Durum", "Tamamlandı", "Proje galerisi", "Uygulamanın ayrıntıları.", "Önceki proje", "Sonraki proje", "Proje gezintisi", "Proje kapak görseli"],
    capability: ["Tüm yetkinlikler", "Yetkinlik", "Tanımlı kapsam", "Gereksinimlerden koordineli proje uygulamasına.", "Uygulama yaklaşımı", "Teknik incelemeden nihai teslime.", "İlgili projeler", "Seçili proje referansları.", "Tanımlı bir kapsam veya malzeme ihtiyacınız mı var?", "Projeyi KAZENCO ile görüşün.", "Ekibimizle iletişime geçin"],
  },
  kz: {
    project: ["Портфельге оралу", "Расталған жоба фотосуреттері күтілуде", "Жоба тарихы", "Үйлестірілген орындау арқылы жеткізілді.", "Клиент", "Орналасқан жері", "Көлемі", "Жыл", "Мәртебе", "Аяқталған", "Жоба галереясы", "Орындау егжей-тегжейі.", "Алдыңғы жоба", "Келесі жоба", "Жоба навигациясы", "Жобаның мұқаба суреті"],
    capability: ["Барлық мүмкіндіктер", "Мүмкіндік", "Белгіленген көлем", "Талаптарды үйлестірілген орындауға айналдыру.", "Орындау тәсілі", "Талдаудан тапсыруға дейін.", "Қатысты жобалар", "Таңдаулы жоба мысалдары.", "Белгіленген жұмыс көлемі немесе материал қажеттілігі бар ма?", "Жобаны KAZENCO-мен талқылаңыз.", "Командаға хабарласу"],
  },
};
