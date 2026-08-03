import { AboutModal } from "@/components/AboutModal";
import { ContactModal } from "@/components/ContactModal";
import { HeroStack } from "@/components/HeroStack";
import { IncrediblesCursor } from "@/components/IncrediblesCursor";
import { PremiumHeader } from "@/components/PremiumHeader";
import { ProjectsList } from "@/components/ProjectsList";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PROJECTS } from "@/lib/projects";

const PROJECT_HIGHLIGHTS = PROJECTS.filter((project) => project.image);

const HERO_CLIENTS = ["Fluor", "WorleyParsons", "Schlumberger", "NCOC", "TCO", "Bonatti"];

const PRODUCTS = [
  ["01", "Pipes & Tubes", "Carbon steel, stainless steel and alloy steel piping materials for demanding industrial applications."],
  ["02", "Fittings & Flanges", "Forged and butt-weld fittings, flanges and connection components to international standards."],
  ["03", "Valves & Instrumentation", "Process valves, instrumentation valves, tubing and control components for project supply packages."],
  ["04", "Fasteners & Anchor Bolts", "Stud bolts, anchor bolts, nuts, washers and custom connection solutions with documentation."],
  ["05", "Electrical Equipment", "Project-based sourcing of electrical equipment, accessories and supporting industrial materials."],
  ["06", "Construction Materials", "Coordinated supply of construction, fit-out, furnishing and site materials across Kazakhstan."],
];

const INDUSTRIES = [
  ["01", "Oil & Gas"],
  ["02", "Petrochemical"],
  ["03", "Energy"],
  ["04", "Industrial Facilities"],
  ["05", "Infrastructure"],
  ["06", "Commercial & Hospitality"],
];

const WHY = [
  ["01", "Two decades of regional experience", "Established in Atyrau in 2004, with project delivery knowledge built across Kazakhstan’s key industrial regions."],
  ["02", "Integrated delivery model", "Engineering support, procurement, construction, fit-out, furnishing and material supply coordinated by one team."],
  ["03", "Multilingual technical communication", "Commercial and technical coordination in English, Russian, Turkish and Kazakh."],
  ["04", "Documentation-led supply", "Project requirements supported with manufacturer documentation, certificates, inspection records and traceability."],
];

const CLIENTS = [
  { label: "Fluor", image: "/images/clients/fluor.svg" },
  { label: "Worley", image: "/images/clients/worley.svg" },
  { label: "SLB", image: "/images/clients/slb.svg" },
  { label: "NCOC", image: "/images/clients/ncoc.svg" },
  { label: "TCO", image: "/images/clients/tco.svg" },
  { label: "Bonatti", image: "/images/clients/bonatti.svg" },
];

const FAQS = [
  ["How can I request a quotation?", "Send your material specification, quantity, required standards and delivery location through our contact form. Our team will review your request and respond with pricing and lead time."],
  ["Which industries does KAZENCO serve?", "We support oil and gas, petrochemical, energy, construction, infrastructure, hospitality and industrial projects across Kazakhstan."],
  ["What products can KAZENCO supply?", "Our supply scope includes industrial piping materials, stainless steel pipes and fittings, bolts and connection components, electrical equipment, construction materials, office furniture and camp furniture."],
  ["Does KAZENCO provide turnkey services?", "Yes. We provide construction, fit-out, furnishing, material supply and installation services as coordinated turnkey project packages."],
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IncrediblesCursor />
      <a href="#main-content" className="inc-skip">Skip to main content</a>
      <PremiumHeader />

      <main id="main-content" className="inc-page">
        <HeroStack
          heroChildren={
            <div className="kazenco-hero-content">
              <p className="kazenco-hero-eyebrow">Engineering · Procurement · Construction</p>
              <h1 className="kazenco-hero-title">
                Engineering.<br />
                Procurement.<br />
                Construction.
              </h1>
              <p className="inc-lead kazenco-hero-lead">
                Industrial supply and turnkey project solutions for energy,
                oil &amp; gas, construction and infrastructure projects across Kazakhstan.
              </p>

              <div className="kazenco-hero-actions">
                <ContactModal
                  triggerClassName="kazenco-hero-primary"
                  triggerLabel="Request a quotation"
                />
                <a href="#projects" className="kazenco-hero-secondary">Explore projects</a>
              </div>

              <div className="kazenco-hero-meta">
                <div><strong>20+</strong><span>Years of experience</span></div>
                <div><strong>2004</strong><span>Established in Atyrau</span></div>
                <div><strong>6</strong><span>Key operating regions</span></div>
              </div>

              <div className="inc-trusted">
                <p>Trusted by global project leaders</p>
                <ul>{HERO_CLIENTS.map((client) => <li key={client}>{client}</li>)}</ul>
              </div>
            </div>
          }
          heading="Real projects, delivered end to end."
          text="Explore construction, turnkey fit-out, furnishing and industrial supply projects completed across Kazakhstan."
          projects={PROJECT_HIGHLIGHTS}
        />

        <section id="about" className="inc-section inc-proof">
          <div>
            <p className="kazenco-section-kicker">Who we are</p>
            <h2>More than two decades of project delivery</h2>
          </div>
          <blockquote>
            <span>“</span>
            <p>
              Since 2004, KAZENCO has supported international contractors,
              operators and project teams with reliable construction,
              furnishing and industrial supply solutions.
            </p>
            <cite>— KAZENCO, established in Atyrau in 2004</cite>
          </blockquote>
          <AboutModal
            triggerClassName="inc-button inc-button-view inc-showreel"
            triggerLabel="Discover KAZENCO"
          />
        </section>

        <section id="products" className="kazenco-products">
          <div className="kazenco-section-head">
            <div>
              <p className="kazenco-section-kicker">Core products</p>
              <h2>Industrial materials for complex projects.</h2>
            </div>
            <p>
              Project-based sourcing supported by technical review, manufacturer
              coordination, documentation and delivery planning.
            </p>
          </div>

          <div className="kazenco-product-grid">
            {PRODUCTS.map(([number, title, description]) => (
              <a className="kazenco-product-card" href="#contact" key={title}>
                <span className="kazenco-product-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="kazenco-product-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section id="industries" className="kazenco-industries">
          <div className="kazenco-section-head">
            <div>
              <p className="kazenco-section-kicker">Industries we serve</p>
              <h2>Built for demanding operating environments.</h2>
            </div>
            <p>
              Supporting operators, EPC contractors and project teams with
              coordinated supply and delivery across Kazakhstan.
            </p>
          </div>

          <div className="kazenco-industry-grid">
            {INDUSTRIES.map(([number, title]) => (
              <article className="kazenco-industry-card" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="kazenco-why">
          <div className="kazenco-why-copy">
            <p className="kazenco-section-kicker">Why KAZENCO</p>
            <h2>Local knowledge. International project discipline.</h2>
          </div>

          <div className="kazenco-why-list">
            {WHY.map(([number, title, description]) => (
              <article className="kazenco-why-item" key={title}>
                <strong>{number}</strong>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="inc-section inc-delivery">
          <div className="inc-delivery-top">
            <div>
              <p className="kazenco-section-kicker">Selected work</p>
              <h2>Projects</h2>
              <p>Civil, commercial and industrial project delivery across Kazakhstan.</p>
            </div>
          </div>
          <ProjectsList projects={PROJECTS} />
        </section>

        <section id="clients" className="kazenco-clients">
          <p className="kazenco-section-kicker">Trusted by global leaders</p>
          <h2>Relationships earned through delivery.</h2>
          <div className="kazenco-client-logo-grid">
            {CLIENTS.map((client) => (
              <div className="kazenco-client-logo" key={client.label}>
                <img src={client.image} alt={`${client.label} logo`} />
              </div>
            ))}
          </div>
        </section>

        <section className="inc-section inc-faq">
          <div>
            <p className="kazenco-section-kicker">FAQ</p>
            <h2>Answers to common questions</h2>
            <p>
              Need additional information?{" "}
              <ContactModal
                triggerClassName="cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"
                triggerLabel="Contact our team."
              />
            </p>
          </div>
          <div className="inc-faq-list">
            {FAQS.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="kazenco-rfq-band">
          <h2>Share your next project requirement.</h2>
          <p>
            Send your material list, technical specification, quantity and
            delivery location. Our team will review the request and follow up.
          </p>
          <ContactModal
            triggerClassName="kazenco-hero-primary"
            triggerLabel="Request a quotation"
          />
        </section>
      </main>

      <footer>
        <div className="kazenco-footer-main">
          <div className="kazenco-footer-brand">
            <img src="/images/misc/kazenco-logo.svg" alt="KAZENCO" />
            <p>
              Engineering, construction, turnkey fit-out and industrial
              material supply across Kazakhstan since 2004.
            </p>
          </div>

          <div className="kazenco-footer-column">
            <h3>Company</h3>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#clients">Clients</a>
          </div>

          <div className="kazenco-footer-column">
            <h3>Capabilities</h3>
            <a href="#products">Products</a>
            <a href="#industries">Industries</a>
            <a href="#contact">Request a quote</a>
          </div>

          <div className="kazenco-footer-column">
            <h3>Location</h3>
            <p>Atyrau, Kazakhstan</p>
            <p>English · Russian · Turkish · Kazakh</p>
          </div>
        </div>

        <div className="inc-footer">
          <p className="m-0">© {new Date().getFullYear()} KAZENCO. All Rights Reserved.</p>
          <a href="http://fibilisim.com.tr/" target="_blank" rel="noreferrer" className="inc-footer-credit">
            <span>Developed by</span>
            <img src="/images/misc/developed-by.ico" alt="Fi Bilişim" />
          </a>
        </div>
      </footer>
    </>
  );
}
