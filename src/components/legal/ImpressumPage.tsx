import { LegalNavbar } from "./LegalNavbar";
import { LandingFooter } from "../landing/LandingFooter";
import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";

interface ImpressumPageProps {
  onNavigateBack: () => void;
  onNavigate?: (page: string) => void;
}

export function ImpressumPage({ onNavigateBack, onNavigate }: ImpressumPageProps) {
  return (
    <div className="bg-[#fdfcfc] min-h-screen">
      {/* Navbar */}
      <LegalNavbar 
        logo={imgLogo}
        onLogoClick={onNavigateBack}
      />

      {/* Content */}
      <div className="container-grid pt-[120px] section-spacing-bottom">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <h1 className="display-large text-primary mb-8">Impressum</h1>

            <div className="flex flex-col gap-8">
              {/* Angaben gemäß Schweizer Recht */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Angaben gemäß Schweizer Obligationenrecht</h2>
                <div className="body-base text-primary space-y-2">
                  <p><strong>xrisk Schweiz AG</strong></p>
                  <p>Austrasse 7</p>
                  <p>9055 Bühler</p>
                  <p>Schweiz</p>
                </div>
              </section>

              {/* Handelsregister */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Handelsregister</h2>
                <div className="body-base text-primary space-y-2">
                  <p>UID: CHE 206.630.672</p>
                  <p>CH-ID: CH-300-3021538-6</p>
                  <p>EHRA-ID: 1691920</p>
                </div>
              </section>

              {/* Verwaltungsrat */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Verwaltungsrat</h2>
                <div className="body-base text-primary space-y-2">
                  <p><strong>Prof. Dr. Gottfried Koch</strong> – Präsident und Delegierter des Verwaltungsrates</p>
                  <p>Dr. Marco Peisiker</p>
                  <p>Bosco Graf Wolff Metternich</p>
                  <p>Raphael Koch</p>
                </div>
              </section>

              {/* Kontakt */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Kontakt</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Telefon: <a href="tel:+41787999968" className="text-[#ff671f] hover:underline">+41 78 79 99 968</a></p>
                  <p>E-Mail: <a href="mailto:info@xrisk.info" className="text-[#ff671f] hover:underline">info@xrisk.info</a></p>
                </div>
              </section>

              {/* EU-Streitschlichtung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">EU-Streitschlichtung</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#ff671f] hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                </div>
              </section>

              {/* Verbraucherstreitbeilegung */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                <div className="body-base text-primary space-y-2">
                  <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                </div>
              </section>

              {/* Haftungsausschluss */}
              <section>
                <h2 className="heading-2 text-primary mb-4">Haftungsausschluss</h2>
                
                <h3 className="heading-3 text-primary mb-3 mt-6">Haftung für Inhalte</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
                  <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                </div>

                <h3 className="heading-3 text-primary mb-3 mt-6">Haftung für Links</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                </div>

                <h3 className="heading-3 text-primary mb-3 mt-6">Urheberrecht</h3>
                <div className="body-base text-primary space-y-2">
                  <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}