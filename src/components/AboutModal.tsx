"use client";

import { useCallback, useId, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FullScreenModal, type ModalPhase } from "@/components/FullScreenModal";
import { SocialControls } from "@/components/SocialControls";
import { localeFromPathname } from "@/lib/i18n";
import { ABOUT_CONTENT, ABOUT_COPY } from "@/lib/modal-translations";

export interface AboutModalProps {
  triggerLabel: string;
  triggerClassName?: string;
  initialOpen?: boolean;
  hideTrigger?: boolean;
}

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
  { name: "Denholm Zholdas", image: "/images/clients/denholm-zholdas.svg" },
  { name: "AGIP KCO", image: "/images/clients/agip-kco.png" },
  { name: "Schlumberger", image: "/images/clients/schlumberger.png" },
  { name: "Kentech", image: "/images/clients/kentech.png" },
  { name: "KCOI", image: "/images/clients/kcoi.svg" },
  { name: "GATE Construction", image: "/images/clients/gate-construction.png" },
  { name: "ISKER Group", image: "/images/clients/isker-group.png" },
  { name: "SICIM", image: "/images/clients/sicim.png" },
  { name: "NCOC", image: "/images/clients/ncoc.png" },
  { name: "TCO", image: "/images/clients/tco.png" },
  { name: "WorleyParsons", image: "/images/clients/worleyparsons.png" },
];

const CONTACTS = [
  {
    name: "Dogan Karakas",
    role: "Founder & Managing Director",
    email: "dogankarakas@kazenco.com",
    phone: "+7 701 527 7284",
  },
  {
    name: "Cem Kurban",
    role: "General Manager",
    email: "cemkurban@kazenco.com",
    phone: "+7 702 431 66 98",
  },
  {
    name: "Nurlybek Kismenov",
    role: "RFQ Contact",
    email: "nurlybekkismenov@kazenco.com",
    phone: "+7 701 550 7280",
  },
];

const EYEBROW_CLASS = "mb-3 text-sm font-normal uppercase tracking-wide text-muted-foreground";

export function AboutModal({ triggerLabel, triggerClassName, initialOpen = false, hideTrigger = false }: AboutModalProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = ABOUT_COPY[locale];
  const content = ABOUT_CONTENT[locale];
  const [open, setOpen] = useState(initialOpen);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {!hideTrigger ? (
        <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
          <span className="inc-button-text" aria-hidden="true">
            <span>{triggerLabel}</span>
            <span>{triggerLabel}</span>
            <span>{triggerLabel}</span>
          </span>
          <span className="sr-only">{triggerLabel}</span>
        </button>
      ) : null}

      <FullScreenModal open={open} onClose={close} labelledBy={titleId}>
        {(phase: ModalPhase) => {
          const visible = phase === "open";
          return (
            <div className="mx-auto grid max-w-[74rem] gap-6 lg:grid-cols-[0.32fr_0.68fr]">
              <div className="flex flex-col gap-6">
                <div
                  className={`rounded-[24px] bg-card p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-150" : "translate-y-5 opacity-0"
                  }`}
                >
                  <h3 id={titleId} className="m-0 text-[1.9rem] font-medium leading-tight">
                    {copy[0]}
                  </h3>
                </div>

                <div
                  className={`flex flex-col gap-4 rounded-[24px] bg-card p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-[250ms]" : "translate-y-5 opacity-0"
                  }`}
                >
                  <p className="m-0 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {copy[1]}
                  </p>
                  <p className="m-0 text-[0.85rem] text-muted-foreground">Atyrau, Kazakhstan (UTC+5)</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <SocialControls />
                  </div>
                </div>
              </div>

              <div
                className="space-y-10 rounded-[24px] bg-card p-6 transition-[clip-path,transform] duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] delay-150 sm:p-12"
                style={{
                  clipPath: visible ? "inset(0 0 0% 0 round 24px)" : "inset(0 0 100% 0 round 24px)",
                  transform: visible ? "translateY(0)" : "translateY(50px)",
                }}
              >
                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[2]}</h4>
                  <h3 className="m-0 mb-4 text-[1.6rem] font-normal leading-tight text-foreground">
                    {copy[3]}
                  </h3>
                  <div className="space-y-4">
                    <p className="m-0 text-foreground">
                      {content.paragraphs[0]}
                    </p>
                    <p className="m-0 text-muted-foreground">
                      {content.paragraphs[1]}
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[4]}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {content.delivery.map(([title, description]) => (
                      <article key={title} className="rounded-[14px] bg-secondary p-5">
                        <h5 className="m-0 text-[15px] font-medium text-foreground">{title}</h5>
                        <p className="m-0 mt-2 text-[13px] leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[5]}</h4>
                  <ul className="m-0 list-none space-y-1 p-0 text-base text-foreground">
                    {content.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[6]}</h4>
                  <ul className="m-0 grid list-none gap-2 p-0 text-base text-foreground sm:grid-cols-2">
                    {content.industries.map((item) => (
                      <li key={item} className="rounded-[14px] bg-secondary px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[7]}</h4>
                  <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 text-base text-muted-foreground sm:grid-cols-2">
                    {content.capabilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[8]}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {content.supply.map(([title, details], index) => (
                      <div key={title} className="group overflow-hidden rounded-[14px] bg-secondary">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={SUPPLY_CATEGORIES[index].image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-end bg-foreground/72 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <ul className="m-0 list-none space-y-1 p-0 text-[12px] font-medium uppercase leading-tight tracking-[0.06em] text-background">
                              {details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="m-0 px-4 py-3 text-[12px] font-medium uppercase leading-tight tracking-[0.06em] text-foreground">
                          {title}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[9]}</h4>
                  <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                    {CLIENTS.map((client) => (
                      <li
                        key={client.name}
                        className="flex h-20 items-center justify-center rounded-[14px] bg-secondary px-5"
                      >
                        <Image
                          src={client.image}
                          alt={client.name}
                          width={220}
                          height={96}
                          sizes="(max-width: 640px) 50vw, 220px"
                          className="h-auto max-h-10 w-auto max-w-full object-contain"
                        />
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className={EYEBROW_CLASS}>{copy[10]}</h4>
                  <p className="m-0 mb-4 text-base text-muted-foreground">
                    KAZENCO Engineering Construction Materials &amp; Trade Company
                    <br />
                    {content.address}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CONTACTS.map((contact) => (
                      <div key={contact.email} className="rounded-[14px] bg-secondary p-4">
                        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {content.roles[CONTACTS.indexOf(contact)]}
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
