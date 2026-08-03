import { AboutModal } from "@/components/AboutModal";
import { ContactModal } from "@/components/ContactModal";
import { HeroStack } from "@/components/HeroStack";
import { IncrediblesCursor } from "@/components/IncrediblesCursor";
import { KazencoClients } from "@/components/KazencoClients";
import { KazencoFooter } from "@/components/KazencoFooter";
import { KazencoHeroContent } from "@/components/KazencoHeroContent";
import { KazencoIndustries } from "@/components/KazencoIndustries";
import { KazencoNumbers } from "@/components/KazencoNumbers";
import { KazencoProducts } from "@/components/KazencoProducts";
import { KazencoWhy } from "@/components/KazencoWhy";
import { PremiumHeader } from "@/components/PremiumHeader";
import { ProjectsList } from "@/components/ProjectsList";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PROJECTS } from "@/lib/projects";

const PROJECT_HIGHLIGHTS = PROJECTS.filter((project) => project.image);


const FAQS = [
  [
    "How can I request a quotation?",
    "Send your material specification, quantity, required standards and delivery location through our contact form. Our team will review your request and respond with pricing and lead time.",
  ],
  [
    "Which industries does KAZENCO serve?",
    "We support oil and gas, petrochemical, energy, construction, infrastructure, hospitality and industrial projects across Kazakhstan.",
  ],
  [
    "What products can KAZENCO supply?",
    "Our supply scope includes industrial piping materials, stainless steel pipes and fittings, bolts and connection components, electrical equipment, construction materials, office furniture and camp furniture.",
  ],
  [
    "Does KAZENCO provide turnkey services?",
    "Yes. We provide construction, fit-out, furnishing, material supply and installation services as coordinated turnkey project packages.",
  ],
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
          heroChildren={<KazencoHeroContent />}
          heading="Real projects, delivered end to end."
          text="Explore construction, turnkey fit-out, furnishing and industrial supply projects completed across Kazakhstan."
          projects={PROJECT_HIGHLIGHTS}
        />


        <KazencoClients />

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


        <KazencoWhy />

        <KazencoNumbers />

        <KazencoProducts />

        <KazencoIndustries />

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


        <section id="contact" className="kazenco-v5-rfq">
          <p className="kazenco-section-kicker">Request for quotation</p>
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

      <KazencoFooter />
    </>
  );
}
