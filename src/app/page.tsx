import Link from "next/link";
import { AboutModal } from "@/components/AboutModal";
import { ContactModal } from "@/components/ContactModal";
import { HeroStack } from "@/components/HeroStack";
import { IncrediblesCursor } from "@/components/IncrediblesCursor";
import { KazencoMark } from "@/components/Logo";
import { ProjectsList } from "@/components/ProjectsList";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PROJECTS } from "@/lib/projects";

const TRUSTED = ["Fluor", "WorleyParsons", "Schlumberger", "NCOC", "TCO", "Bonatti"];

const PROJECT_HIGHLIGHTS = PROJECTS.filter((project) => project.image);

const FAQS = [
  [
    "How do I request a quotation?",
    "Send your material specification, quantity and delivery location through the RFQ form, or reach out to our procurement contacts directly. Our team will follow up with pricing and lead time.",
  ],
  [
    "What industries do you serve?",
    "We supply and deliver projects for oil & gas, petrochemical, refinery, energy and industrial facility operators, EPC contractors and manufacturing clients across Kazakhstan.",
  ],
  [
    "What can KAZENCO supply?",
    "Office and camp furniture, bolts and connection components, industrial supply items, stainless steel pipes and fittings, electrical equipment and construction materials.",
  ],
  [
    "Do you handle construction and fit-out as well as supply?",
    "Yes. Alongside material supply, we deliver engineering, construction, fit-out and furnishing works — from site construction through turnkey furnishing.",
  ],
  [
    "Where do you operate?",
    "Based in Atyrau, Kazakhstan, with projects delivered in Atyrau, Almaty, Tengiz, Karabatan, Aktau and Aksai.",
  ],
  [
    "What languages does your team work in?",
    "Our multilingual technical teams operate in Kazakh, Russian, English and Turkish.",
  ],
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <IncrediblesCursor />
      <a href="#main-content" className="inc-skip">Skip to main content</a>
      <header className="inc-header">
        <Link href="/" className="inc-logo" aria-label="Kazenco">
          <KazencoMark className="inc-logo-mark" />
        </Link>
        <nav className="inc-nav" aria-label="Main navigation">
          <ul>
            <li>
              <ContactModal
                triggerClassName="inc-button inc-button-conversation"
                triggerLabel="Start a conversation"
              />
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content" className="inc-page">
        <HeroStack
          heroChildren={
            <>
              <h1>Engineering and industrial supply team for projects that can&apos;t afford to miss</h1>
              <p className="inc-lead">
                Established in 2004, our multilingual technical teams deliver construction, fit-out and industrial material supply across Kazakhstan.
              </p>
              <div className="inc-trusted">
                <p>Delivering for operators including</p>
                <ul>
                  {TRUSTED.map((client) => <li key={client}>{client}</li>)}
                </ul>
              </div>
            </>
          }
          heading="Real projects, delivered end to end."
          text="From EPC support to fit-out and industrial supply — a look at completed work for operators across Kazakhstan."
          projects={PROJECT_HIGHLIGHTS}
        />

        <section className="inc-section inc-proof">
          <h2>Two decades of delivery</h2>
          <blockquote>
            <span>“</span>
            <p>From EPC support to industrial supply, KAZENCO has delivered projects for operators across Kazakhstan since 2004.</p>
            <cite>— KAZENCO, established 2004 in Atyrau</cite>
          </blockquote>
          <AboutModal triggerClassName="inc-button inc-button-view inc-showreel" triggerLabel="About Us" />
        </section>

        <section className="inc-section inc-delivery">
          <div className="inc-delivery-top">
            <div>
              <h2>Projects</h2>
              <p>Civil and industrial project delivery across Kazakhstan.</p>
            </div>
          </div>
          <ProjectsList projects={PROJECTS} />
        </section>

        <h2 className="inc-talk">Let’s talk about your project.</h2>

        <section className="inc-section inc-faq">
          <div>
            <h2>Answers to your questions</h2>
            <p>
              Need more information? Feel free to{" "}
              <ContactModal
                triggerClassName="cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"
                triggerLabel="reach out."
              />
            </p>
          </div>
          <div className="inc-faq-list">
            {FAQS.map(([question, answer]) => (
              <details key={question} open>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="inc-final">
          <h2>Build your next project with KAZENCO.</h2>
          <ContactModal
            triggerClassName="inc-button inc-button-conversation"
            triggerLabel="Start a conversation"
          />
        </section>
      </main>

      <footer className="inc-footer">
        <p className="m-0">© {new Date().getFullYear()} KAZENCO. All Rights Reserved.</p>
        <a
          href="http://fibilisim.com.tr/"
          target="_blank"
          rel="noreferrer"
          className="inc-footer-credit"
        >
          <span>Developed by</span>
          <img src="/images/misc/developed-by.ico" alt="Fi Bilişim" />
        </a>
      </footer>
    </>
  );
}
