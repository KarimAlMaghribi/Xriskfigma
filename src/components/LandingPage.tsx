import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-81dejan7f8";
import imgHero from "figma:asset/fea06be5cea92d665177a3b32ba42a925e4a88c3.png";
import imgHeroBus from "figma:asset/74503bfc0cde48656b8667a50fffd00beea668cd.png";
import imgMartin from "figma:asset/b4ecfaf9c6e73e8dd6c209458e50397edd6b1743.png";
import imgLena from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgBus from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";
import { RiskInputModal } from "./RiskInputModal";
import { LandingNavbar } from "./landing/LandingNavbar";
import { FAQSection } from "./landing/FAQSection";
import { VariantSwitcherSection } from "./landing/VariantSwitcherSection";
import { NeuesteRisikenSection } from "./landing/NeuesteRisikenSection";
import SectionWasIstXrisk from "../imports/SectionWasIstXrisk";
import SectionTestimonial from "../imports/SectionWasIstXrisk-4013-1246";

interface LandingPageProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
}

type VariantType = "market" | "bus";

export function LandingPage({ onLogin, isLoggedIn = false }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [riskInput, setRiskInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<VariantType>("market");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Variant configurations
  const variants = {
    market: {
      heroImage: imgHero,
      headline: (
        <>
          <span>Wenn das Wetter </span>
          <span className="text-[#ff671f]">deinen Markttag </span>
          <span>verhagelt.</span>
        </>
      ),
      subheadline: "Keine Besucher. Keine Verkäufe. Nur Frust. Sichere dich gegen Wetterausfall ab und starte entspannt in den nächsten Markt.",
      testimonialImage: imgLena,
      testimonialName: "Lena, Künstlerin",
      testimonialQuote: "\"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall.\"",
      processImage: imgLena,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description: "\"Ich verkaufe Kunst auf Wochenmärkten. Wenn es regnet, bleiben die Leute weg und ich verdiene nichts.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description: "Martin sieht deine Anfrage: \"Als Landwirt kenne ich Wetter. Für eine angemessene Prämie übernehme ich dein Wetterrisiko.\"",
      step3Title: "Du wählst und bist abgesichert",
      step3Description: "Du nimmst Martins Angebot an. Ab sofort weißt du: Falls es regnet, ist Martin für dich da.",
    },
    bus: {
      heroImage: imgHeroBus,
      headline: "Mit dem T3 über die Alpen. Aber was, wenn er's nicht schafft?",
      subheadline: "Du liebst deinen Bus. Aber er ist alt. Und die Berge sind hoch. Absichern gegen Pannen – damit aus dem Traum kein Albtraum wird.",
      testimonialImage: imgBus,
      testimonialName: "Marco, T3-Besitzer",
      testimonialQuote: "\"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig.\"",
      processImage: imgBus,
      processTitle: "Von der Sorge zur Sicherheit in 3 Schritten",
      processSubtitle: "Erzähl dein Anliegen. Finde deinen Experten. Schlaf wieder ruhig",
      step1Title: "Sag uns, was du absichern möchtest",
      step1Description: "\"Ich habe einen T3 Baujahr 1987. Mein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt.\"",
      step2Title: "Experten machen dir ein Angebot",
      step2Description: "Stefan sieht deine Anfrage: \"T3? Kenn ich in- und auswendig. Für eine angemessene Prämie bin ich dein Experte falls was passiert.\"",
      step3Title: "Du wählst und bist abgesichert",
      step3Description: "Du nimmst Stefans Angebot an. Ab sofort weißt du: Falls der Bus liegen bleibt, ist Stefan für dich da.",
    },
  };

  const currentVariant = variants[variant];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "was-ist-xrisk", "prozess", "faq"];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }

      // Show sticky CTA if scrolled past hero section
      const heroElement = document.getElementById("hero");
      if (heroElement) {
        const { offsetTop, offsetHeight } = heroElement;
        setShowStickyCTA(scrollPosition >= offsetTop + offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleRiskRequest = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#fdfcfc] flex flex-col items-start relative w-full">
      {/* Import LandingNavbar component - fixed at top, over hero */}
      <LandingNavbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
      />

      {/* Hero Section - Full Height, starts at 0 (navigation overlays it) */}
      <div id="hero" className="w-full flex justify-center">
        <div className="md:h-[800px] h-[720px] relative w-full container-hero">
          <div className="flex flex-col justify-center overflow-clip size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] md:h-[800px] h-[720px] items-start justify-center md:pb-[80px] pb-[40px] pt-[0px] relative w-full pr-[0px] pl-[0px]">
              <div className="basis-0 grow min-h-px min-w-px relative md:rounded-bl-[24px] md:rounded-br-[24px] rounded-bl-[24px] rounded-br-[24px] w-full">
                <div className="flex flex-col md:justify-center justify-end size-full">
                  <div className="box-border content-stretch flex flex-col gap-[10px] isolate items-start md:items-start items-center md:justify-center justify-end md:pb-[40px] pb-[180px] md:pl-[108px] pl-[24px] md:pr-[217px] pr-[24px] pt-[24px] relative size-full">
                    
                    {/* Variant Switcher - Desktop: Bottom Right, Mobile: Bottom Left */}
                    <div className="absolute md:bottom-[48px] bottom-[24px] content-stretch flex gap-[10px] items-center md:right-[40px] left-[24px] md:left-auto right-auto z-[4]">
                      {/* Market Button */}
                      <button
                        onClick={() => setVariant("market")}
                        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer ${
                          variant === "market" ? "md:h-[90px] md:w-[160px] h-[90px] w-[160px]" : "md:h-[90px] md:w-[90px] h-[90px] w-[90px]"
                        }`}
                        aria-label="Markt-Variante"
                      >
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                          <img 
                            alt="Markt" 
                            className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" 
                            src={imgLena} 
                          />
                          <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px] transition-opacity duration-500 ease-in-out ${
                            variant === "market" ? "opacity-0" : "opacity-100"
                          }`} />
                        </div>
                      </button>

                      {/* Bus Button */}
                      <button
                        onClick={() => setVariant("bus")}
                        className={`relative rounded-[16px] shrink-0 transition-all duration-500 ease-in-out cursor-pointer ${
                          variant === "bus" ? "md:h-[90px] md:w-[160px] h-[90px] w-[160px]" : "md:h-[90px] md:w-[90px] h-[90px] w-[90px]"
                        }`}
                        aria-label="Bus-Variante"
                      >
                        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                          <img 
                            alt="Bus" 
                            className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" 
                            src={imgBus} 
                          />
                          <div className={`absolute bg-[rgba(0,0,0,0.4)] inset-0 rounded-[16px] transition-opacity duration-500 ease-in-out ${
                            variant === "bus" ? "opacity-0" : "opacity-100"
                          }`} />
                        </div>
                      </button>
                    </div>

                    {/* Text Content - Desktop: Left aligned, Mobile: Center aligned */}
                    <div className="content-stretch flex flex-col md:gap-[24px] gap-[24px] items-start justify-center relative shrink-0 md:w-[630px] w-full z-[3]">
                      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic relative shrink-0 text-[#e6e5e5] w-full">
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 md:text-[52px] text-[32px] w-full transition-all duration-500">
                          {currentVariant.headline}
                        </p>
                        <p className="[text-shadow:#000000_10px_5px_40px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full transition-all duration-500">
                          {currentVariant.subheadline}
                        </p>
                      </div>
                      
                      {/* CTA Bar - direkt im Hero */}
                      <div className="flex gap-[16px] items-center w-full">
                        <div className="backdrop-blur-[47px] bg-[rgba(245,245,245,0.85)] border border-[#dddddd] flex-1 rounded-[100px] shadow-[10px_10px_20px_0px_rgba(0,0,0,0.1)]">
                          <input
                            type="text"
                            value={riskInput}
                            onChange={(e) => setRiskInput(e.target.value)}
                            placeholder="Welches Risiko möchtest du absichern?"
                            className="body-base text-primary placeholder:text-primary bg-white/10 backdrop-blur-md w-full px-[24px] py-[16px] outline-none rounded-[100px] border border-white/25 shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40 focus:bg-white/25 focus:border-[#ff671f]/40 focus:shadow-xl"
                          />
                        </div>
                        <button
                          className="bg-[#ff671f] px-[24px] py-[16px] rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#e05a1b] transition-all border-none whitespace-nowrap"
                          onClick={handleRiskRequest}
                        >
                          <span className="button-text text-white">Risiko anfragen</span>
                        </button>
                      </div>
                    </div>

                    {/* Background Image */}
                    <div className="absolute inset-0 z-[1]">
                      <div aria-hidden="true" className="absolute inset-0 pointer-events-none md:rounded-bl-[24px] md:rounded-br-[24px] rounded-bl-[24px] rounded-br-[24px]">
                        <div className="absolute inset-0 overflow-hidden md:rounded-bl-[24px] md:rounded-br-[24px] rounded-bl-[24px] rounded-br-[24px]">
                          {/* Desktop Image */}
                          <img 
                            alt="" 
                            className="hidden md:block absolute max-w-none object-cover rounded-bl-[24px] rounded-br-[24px] size-full transition-all duration-500 object-center" 
                            src={currentVariant.heroImage} 
                          />
                          {/* Mobile Image */}
                          <img 
                            alt="" 
                            className="block md:hidden absolute max-w-none object-cover rounded-bl-[24px] rounded-br-[24px] size-full transition-all duration-500 object-[30%_50%]" 
                            src={currentVariant.heroImage} 
                          />
                        </div>
                        <div className="absolute bg-gradient-to-b md:from-[rgba(0,0,0,0.2)] md:to-[rgba(0,0,0,0.2)] from-[24.519%] from-[rgba(0,0,0,0)] to-[64.423%] to-[rgba(0,0,0,0.5)] inset-0 md:rounded-bl-[24px] md:rounded-br-[24px] rounded-bl-[24px] rounded-br-[24px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section - So funktioniert xrisk */}
      <div id="testimonial" className="w-full section-spacing px-[0px] py-[40px]">
        <SectionTestimonial variant={variant} />
      </div>

      {/* NEW: Variant Switcher Section - Individual Risks */}
      <VariantSwitcherSection
        variant={variant}
        onVariantChange={setVariant}
      />

      {/* NEW: Neueste Risiken Section */}
      <div className="w-full section-spacing px-[0px] py-[40px]">
        <NeuesteRisikenSection variant={variant} />
      </div>

      {/* Section Was ist xrisk - Orangene Section */}
      <div id="was-ist-xrisk" className="w-full section-spacing p-[0px]">
        <SectionWasIstXrisk />
      </div>

      {/* Section 3-Step Anleitung - Grid 6/6 */}
      <div id="prozess" className="w-full section-spacing px-[0px] py-[40px]">
        <div className="container-grid">
          <div className="grid-12">
            {/* Left Column - Text - 6 cols desktop, 12 cols mobile/tablet */}
            <div className="col-span-6 flex flex-col gap-8 py-6">
              <div className="flex flex-col gap-4 items-start w-full">
                <div className="flex flex-col gap-2 items-start w-full">
                  <h2 className="display-large text-primary">
                    {currentVariant.processTitle}
                  </h2>
                </div>
                <p className="text-lg-medium text-primary">
                  {currentVariant.processSubtitle}
                </p>
              </div>
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p1edfde00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 1:</span> {currentVariant.step1Title}
                    </p>
                    <p className="body-base text-primary">
                      {currentVariant.step1Description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p33705900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p161d4800} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p2b304d00} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d={svgPaths.p13e20900} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 2:</span> {currentVariant.step2Title}
                    </p>
                    <p className="body-base text-primary">
                      {currentVariant.step2Description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start w-full">
                  <div className="flex gap-[10px] items-center justify-center shrink-0 w-[31px] h-[31px]">
                    <div className="shrink-0 w-[24px] h-[24px]">
                      <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p2501aa80} stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M14 2V8H20" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M16 13H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M16 17H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M10 9H9H8" stroke="#FF671F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-col gap-2 grow min-h-px min-w-px">
                    <p className="heading-3 text-primary">
                      <span className="text-brand">Schritt 3:</span> {currentVariant.step3Title}
                    </p>
                    <p className="body-base text-primary">
                      {currentVariant.step3Description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image - 12 cols mobile/tablet, 6 cols desktop */}
            <div className="col-span-6">
              <div className="rounded-[24px] h-[600px] relative overflow-hidden bg-[#353131]" id="prozess-testimonial">
                <img 
                  alt="Lena, Künstlerin" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  src={currentVariant.processImage} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Grid 6/6 */}
      <FAQSection
        title={
          <>
            <span className="text-brand">Deine</span>
            <span> Fragen. </span>
            <span className="text-brand">Unsere</span>
            <span> Antworten.</span>
          </>
        }
        subtitle="Du hast Fragen? Wir haben Antworten. Hier findest du alles Wichtige zu xrisk."
        faqs={[
          {
            question: "Was ist xRisk?",
            answer: (
              <div>
                <p><strong>Ein Marktplatz für Risiken – offen, transparent und menschlich.</strong></p>
                <p>xRisk bringt Menschen mit unterschiedlichen Risikohaltungen zusammen:</p>
                <ul>
                  <li>Optimisten, die Chancen erkennen,</li>
                  <li>Pessimisten, die Sicherheit suchen,</li>
                  <li>Spielerische, die den Nervenkitzel mögen.</li>
                </ul>
                <p>Jede Risikoübernahme funktioniert wie eine Wette auf Wahrscheinlichkeiten – aber mit echtem Nutzen: Du eliminierst Risiko statt zu spekulieren.</p>
                <p>So entsteht ein neuer Markt für kleine und große Risiken.</p>
              </div>
            ),
          },
          {
            question: "Was kostet mich xRisk?",
            answer: (
              <div>
                <p><strong>Starte kostenlos – lerne Risiko spielerisch kennen.</strong></p>
                <p>Aktuell nutzt du xRisk kostenlos.</p>
                <p>Wir testen das System, trainieren unsere KI-Agenten und laden dich ein, Teil der ersten Community zu sein.</p>
                <p>Du kannst sogar gewinnen, wenn du aktiv mitmachst!</p>
                <p>In Zukunft werden wir kostenpflichtige Funktionen anbieten.</p>
              </div>
            ),
          },
          {
            question: "Wie bewertet xRisk mein Risiko?",
            answer: (
              <div>
                <p><strong>KI macht dein Risiko verständlich – in drei einfachen Schritten.</strong></p>
                <ol>
                  <li>Du beschreibst dein Risiko.</li>
                  <li>Unsere KI stellt dir kurze Rückfragen.</li>
                  <li>Die KI analysiert Millionen Datenquellen in deiner Sprache.</li>
                </ol>
                <p><strong>Ergebnis:</strong> eine faire, datenbasierte Risikobewertung und Vorschläge für deine individuelle Risikogebühr.</p>
                <p>Schnell, transparent und günstiger als jede klassische Analyse.</p>
              </div>
            ),
          },
          {
            question: "Wer ist mein Risikopartner?",
            answer: (
              <div>
                <p><strong>Echte Menschen. Echte Unternehmen. Echte Sicherheit.</strong></p>
                <p>Alle Teilnehmer bei xRisk sind verifiziert.</p>
                <ul>
                  <li>Identitätsprüfung mit ID und Selfie</li>
                  <li>Bonitätscheck</li>
                  <li>Transparente Profilbilder</li>
                </ul>
                <p>So siehst du immer, mit wem du dein Risiko teilst – sicher und vertrauenswürdig.</p>
              </div>
            ),
          },
          {
            question: "Was passiert im Schadensfall?",
            answer: (
              <div>
                <p><strong>Klare Regeln. Faire Abwicklung.</strong></p>
                <p>Du und dein Risikopartner legt im Vertrag fest, wann ein Leistungsfall eintritt und wie er belegt wird.</p>
                <p>Ein unabhängiger Dienstleister prüft den Fall neutral.</p>
                <p>Falls es Unklarheiten gibt, sorgt ein Schlichtungsverfahren für eine schnelle und faire Entscheidung.</p>
              </div>
            ),
          },
          {
            question: "Wie sicher ist xRisk?",
            answer: (
              <div>
                <p><strong>Vertrauen durch Regulierung und Technik.</strong></p>
                <p>xRisk arbeitet unter Aufsicht der <strong>BaFin (Deutschland)</strong> und <strong>FINMA (Schweiz)</strong>.</p>
                <p>Zahlungen werden über <strong>Stripe</strong> abgewickelt – einen der sichersten globalen Zahlungsdienste.</p>
                <ul>
                  <li>Risikogebühr: vom Risikogeber gezahlt</li>
                  <li>Leistungsbetrag: auf Karte des Risikonehmers reserviert</li>
                </ul>
                <p>So sind alle Zahlungen doppelt geschützt.</p>
              </div>
            ),
          },
          {
            question: "Was sagen andere über xRisk?",
            answer: (
              <div>
                <p><strong>Echte Stimmen. Echte Begeisterung.</strong></p>
                <p><em>„Wenn ich auf die Website komme, verstehe ich sofort, worum es geht. Die Fallbeispiele machen Lust, xRisk auszuprobieren. Sehr überzeugend!"</em></p>
                <p>— Externer Fachmann, Oktober 2025</p>
              </div>
            ),
          },
          {
            question: "Warum xRisk?",
            answer: (
              <div>
                <p><strong>Weil Risiko Vertrauen braucht.</strong></p>
                <ul>
                  <li><strong>Einfach</strong> – jeder versteht, wie es funktioniert.</li>
                  <li><strong>Fair</strong> – KI sorgt für Transparenz.</li>
                  <li><strong>Mutig</strong> – neue Wege für neue Generationen.</li>
                </ul>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button 
                    style={{ 
                      backgroundColor: '#ff671f', 
                      padding: '16px 24px', 
                      borderRadius: '100px', 
                      cursor: 'pointer',
                      border: 'none',
                      color: 'white'
                    }}
                    onClick={onLogin}
                  >
                    Jetzt registrieren
                  </button>
                  <button 
                    style={{ 
                      backgroundColor: 'rgba(245,245,245,0.5)', 
                      border: '1px solid #353131', 
                      padding: '16px 24px', 
                      borderRadius: '100px', 
                      cursor: 'pointer',
                      color: '#353131'
                    }}
                    onClick={onLogin}
                  >
                    Beta-Version testen
                  </button>
                </div>
              </div>
            ),
          },
        ]}
        defaultExpanded={0}
      />

      {/* Footer - Full width background with grid container */}
      <div className="bg-[#ff671f] relative w-full section-spacing-top">
        <div className="container-grid">
          <div className="grid-12 pb-[140px] pt-16 items-start">
            <div className="col-span-6 lg:col-span-4 flex flex-col gap-8">
              <p className="display-large text-white">Logo</p>
              <div className="flex flex-col gap-4 items-start">
                {["Impressum", "Datenschutz", "AGB", "Kontakt"].map((item) => (
                  <p key={item} className="body-base text-white cursor-pointer hover:opacity-70 transition-opacity">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="col-span-3 lg:col-span-4 flex flex-col gap-[10px]">
              <img 
                src={imgLogo} 
                alt="XRISK Logo" 
                className="h-[48px] w-[55px]" 
              />
            </div>
            
            <div className="col-span-3 lg:col-span-4 flex flex-col gap-[10px]">
              <p className="heading-3 text-inverse mb-4">
                Das ist Versicherung, wie sie sein sollte.
              </p>
              <div className="body-sm text-inverse">
                <p className="mb-4">
                  Versicherung war gestern ein notwendiges Übel. Wir haben sie neu erfunden: individuell statt kollektiv, intelligent statt bürokratisch.
                </p>
                <p className="mb-4">
                  Bei xrisk sichert dich kein anonymer Konzern ab, sondern ein konkreter Experte – eine Werkstatt für dein Auto, ein Handwerker für deine Wohnung. Menschen, die dein Risiko wirklich verstehen.
                </p>
                <p>
                  Unsere KI bewertet dein individuelles Risiko fair und transparent. Dein Risikopartner verdient, wenn nichts passiert – und löst das Problem sofort, wenn doch etwas passiert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      {showStickyCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#ff671f] py-4 px-8 z-50">
          <div className="container-grid">
            <div className="flex gap-[16px] items-center justify-center w-full">
              <div className="backdrop-blur-[47px] bg-[rgba(245,245,245,0.85)] border border-[#dddddd] flex-1 rounded-[100px] shadow-[10px_10px_20px_0px_rgba(0,0,0,0.1)]">
                <input
                  type="text"
                  value={riskInput}
                  onChange={(e) => setRiskInput(e.target.value)}
                  placeholder="Welches Risiko möchtest du absichern?"
                  className="body-base text-primary placeholder:text-primary bg-white/10 backdrop-blur-md w-full px-[24px] py-[16px] outline-none rounded-[100px] border border-white/25 shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40 focus:bg-white/25 focus:border-[#ff671f]/40 focus:shadow-xl"
                />
              </div>
              <button
                className="bg-[#ff671f] px-[24px] py-[16px] rounded-[100px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#e05a1b] transition-all border-none"
                onClick={handleRiskRequest}
              >
                <span className="button-text text-white whitespace-nowrap">Risiko anfragen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk Input Modal */}
      <RiskInputModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRiskDescription={riskInput}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
      />
    </div>
  );
}