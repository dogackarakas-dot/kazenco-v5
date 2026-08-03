"use client";

import { useCallback, useId, useState } from "react";
import { FullScreenModal, type ModalPhase } from "@/components/FullScreenModal";
import { SocialControls } from "@/components/SocialControls";

interface AboutModalProps {
  triggerLabel: string;
  triggerClassName?: string;
}

const HIGHLIGHTS = [
  "Established in 2004",
  "Based in Atyrau, Kazakhstan",
  "Civil & industrial project experience",
  "Multilingual technical workforce",
  "Engineering, procurement & construction",
  "Environmental & geosynthetic applications",
];

const INDUSTRIES = [
  "Oil & Gas",
  "Petrochemical Plants",
  "Refineries",
  "Energy & Power Plants",
  "Industrial Facilities",
  "Construction & Infrastructure Projects",
  "EPC Contractors",
  "Manufacturing Industry",
];

const CAPABILITIES = [
  "Industrial supply",
  "Global procurement",
  "Project material supply",
  "Export & logistics services",
  "Oil & Gas procurement",
  "Petrochemical plant supply",
  "Manufacturing support",
  "Technical support",
  "International trade solutions",
  "Project management support",
];

const SUPPLY_CATEGORIES = [
  {
    title: "Office & Camp Furniture",
    image: "/images/supply/office-camp-furniture-visual.png",
    details: ["Workstations", "Camp furniture", "Turnkey furnishing"],
  },
  {
    title: "Bolts & Connection Components",
    image: "/images/supply/bolts-connection-components-visual.png",
    details: ["Bolts", "Fasteners", "Connection elements"],
  },
  {
    title: "Industrial Supply Solutions",
    image: "/images/supply/industrial-supply-solutions-visual.png",
    details: ["Hand tools", "Power tools", "PPE & consumables"],
  },
  {
    title: "Stainless Steel Pipes & Fittings",
    image: "/images/supply/stainless-steel-pipes-fittings-visual.png",
    details: ["Pipes", "Fittings", "Industrial components"],
  },
  {
    title: "Electrical Equipment & Devices",
    image: "/images/supply/electrical-equipment-devices-visual.png",
    details: ["Panels", "Devices", "Electrical materials"],
  },
  {
    title: "Construction Materials",
    image: "/images/supply/construction-materials-visual.png",
    details: ["Building materials", "Site supplies", "Project procurement"],
  },
];

const CLIENTS = [
  { name: "Fluor", image: "/images/clients/fluor.png" },
  { name: "PSN Kazstroy", image: "/images/clients/psn-kazstroy.png" },
  { name: "Bonatti", image: "/images/clients/bonatti.png" },
  { name: "Agip KCO", image: "/images/clients/agip-kco.png" },
  { name: "Schlumberger", image: "/images/clients/schlumberger.png" },
  { name: "Kentech", image: "/images/clients/kentech.png" },
  { name: "ISKER Group", image: "/images/clients/isker-group.png" },
  { name: "SICIM", image: "/images/clients/sicim.png" },
  { name: "NCOC", image: "/images/clients/ncoc.png" },
  { name: "TCO", image: "/images/clients/tco.png" },
  { name: "WorleyParsons", image: "/images/clients/worleyparsons.png" },
];

const CONTACTS = [
  {
    name: "Cem Kurban",
    role: "General Manager",
    email: "cemkurban@kazenco.com",
    phone: "+7 702 431 66 98",
  },
  {
    name: "Dogan Karakas",
    role: "RFQ Contact",
    email: "dogankarakas@kazenco.com",
    phone: "+7 701 527 7284",
  },
  {
    name: "Nurlybek Kismenov",
    role: "RFQ Contact",
    email: "nurlybekkismenov@kazenco.com",
    phone: "+7 701 550 7280",
  },
];

const EYEBROW_CLASS = "mb-3 text-sm font-normal uppercase tracking-wide text-muted-foreground";

export function AboutModal({ triggerLabel, triggerClassName }: AboutModalProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        <span className="inc-button-text" aria-hidden="true">
          <span>{triggerLabel}</span>
          <span>{triggerLabel}</span>
          <span>{triggerLabel}</span>
        </span>
        <span className="sr-only">{triggerLabel}</span>
      </button>

      <FullScreenModal open={open} onClose={close} labelledBy={titleId}>
        {(phase: ModalPhase) => {
          const visible = phase === "open";
          return (
            <div className="mx-auto grid max-w-[74rem] gap-6 lg:grid-cols-[0.32fr_0.68fr]">
              <div className="flex flex-col gap-6">
                <div
                  className={`rounded-[24px] bg-white p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-150" : "translate-y-5 opacity-0"
                  }`}
                >
                  <h3 id={titleId} className="m-0 text-[1.9rem] font-medium leading-tight">
                    About KAZENCO
                  </h3>
                </div>

                <div
                  className={`flex flex-col gap-4 rounded-[24px] bg-white p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-[250ms]" : "translate-y-5 opacity-0"
                  }`}
                >
                  <p className="m-0 text-[0.95rem] leading-relaxed text-muted-foreground">
                    Engineering, construction and industrial materials supply for civil and industrial projects
                    across Kazakhstan.
                  </p>
                  <p className="m-0 text-[0.85rem] text-muted-foreground">Atyrau, Kazakhstan (UTC+5)</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <SocialControls />
                  </div>
                </div>
              </div>

              <div
                className="space-y-10 rounded-[24px] bg-white p-6 transition-[clip-path,transform] duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] delay-150 sm:p-12"
                style={{
                  clipPath: visible ? "inset(0 0 0% 0 round 24px)" : "inset(0 0 100% 0 round 24px)",
                  transform: visible ? "translateY(0)" : "translateY(50px)",
                }}
              >
                <section>
                  <h4 className={EYEBROW_CLASS}>About Us</h4>
                  <h3 className="m-0 mb-4 text-[1.6rem] font-normal leading-tight text-foreground">
                    Engineering Excellence Since 2004
                  </h3>
                  <div className="space-y-4">
                    <p className="m-0 text-foreground">
                      Founded in 2004 in Atyrau, Kazakhstan, KAZENCO is an engineering, construction and industrial
                      materials supply company serving civil, commercial and industrial projects across the
                      country.
                    </p>
                    <p className="m-0 text-muted-foreground">
                      Our experience covers construction, design, engineering consultancy, environmental
                      applications, fit-out works, prefabricated steel structures, furnishing and industrial
                      material supply. Our multilingual teams operate in Kazakh, Russian, English and Turkish, with
                      projects delivered in Atyrau, Almaty, Tengiz, Karabatan, Aktau and Aksai.
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Company Highlights</h4>
                  <ul className="m-0 list-none space-y-1 p-0 text-base text-foreground">
                    {HIGHLIGHTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Industries We Serve</h4>
                  <ul className="m-0 grid list-none gap-2 p-0 text-base text-foreground sm:grid-cols-2">
                    {INDUSTRIES.map((item) => (
                      <li key={item} className="rounded-[14px] bg-[#F1F1F1] px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Capabilities</h4>
                  <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 text-base text-muted-foreground sm:grid-cols-2">
                    {CAPABILITIES.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Supply Categories</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SUPPLY_CATEGORIES.map((category) => (
                      <div key={category.title} className="group overflow-hidden rounded-[14px] bg-[#F1F1F1]">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={category.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-end bg-foreground/72 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <ul className="m-0 list-none space-y-1 p-0 text-[12px] font-medium uppercase leading-tight tracking-[0.06em] text-background">
                              {category.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="m-0 px-4 py-3 text-[12px] font-medium uppercase leading-tight tracking-[0.06em] text-foreground">
                          {category.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Our Clients</h4>
                  <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                    {CLIENTS.map((client) => (
                      <li
                        key={client.name}
                        className="flex h-20 items-center justify-center rounded-[14px] bg-[#F1F1F1] px-5"
                      >
                        <img
                          src={client.image}
                          alt={client.name}
                          className="max-h-10 max-w-full object-contain"
                        />
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>Contact</h4>
                  <p className="m-0 mb-4 text-base text-muted-foreground">
                    KAZENCO Engineering Construction Materials &amp; Trade Company
                    <br />
                    Zheti Kazyna, 2-1, Atyrau, Kazakhstan
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CONTACTS.map((contact) => (
                      <div key={contact.email} className="rounded-[14px] bg-[#F1F1F1] p-4">
                        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {contact.role}
                        </p>
                        <h5 className="m-0 mt-2 text-[16px] font-normal leading-tight text-foreground">
                          {contact.name}
                        </h5>
                        <div className="mt-3 grid gap-1 text-[13px] leading-snug text-muted-foreground">
                          <a href={`mailto:${contact.email}`} className="transition-colors hover:text-foreground">
                            {contact.email}
                          </a>
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, "")}`}
                            className="transition-colors hover:text-foreground"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          );
        }}
      </FullScreenModal>
    </>
  );
}
