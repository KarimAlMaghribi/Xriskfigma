import imgLogo from "figma:asset/62c15dd4132b6b07480e5845d83ae202650e6625.png";
import { LandingButton } from "./LandingButton";
import { LandingNavLink } from "./LandingNavLink";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LandingNavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  isLoggedIn?: boolean;
  onLogin: () => void;
}

export function LandingNavbar({
  activeSection,
  scrollToSection,
  isLoggedIn = false,
  onLogin,
}: LandingNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full" role="banner">
      <div className="container-grid">
        <nav className="flex items-center justify-between py-4" aria-label="Hauptnavigation">
          {/* Left Side: Logo */}
          <div className="flex gap-6 items-center">
            <img
              src={imgLogo}
              alt="XRISK Logo - Zur Startseite"
              className="h-[48px] w-[55px]"
            />
          </div>

          {/* Desktop: Right Side Navigation Menu + Login Button */}
          <div className="hidden md:flex gap-6 items-center">
            {/* Navigation Menu */}
            <nav className="bg-surface-frost backdrop-blur-lg flex gap-2 items-center px-4 py-1 rounded-[100px] shadow-sm p-[4px]" aria-label="Seiten-Navigation">
              <LandingNavLink
                onClick={() => scrollToSection("testimonial")}
                isActive={activeSection === "testimonial"}
                aria-current={activeSection === "testimonial" ? "page" : undefined}
                aria-label="Zu Abschnitt: So funktioniert's"
              >
                So funktioniert's
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("was-ist-xrisk")}
                isActive={activeSection === "was-ist-xrisk"}
                aria-current={activeSection === "was-ist-xrisk" ? "page" : undefined}
                aria-label="Zu Abschnitt: Was ist xrisk?"
              >
                Was ist xrisk?
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("prozess")}
                isActive={activeSection === "prozess"}
                aria-current={activeSection === "prozess" ? "page" : undefined}
                aria-label="Zu Abschnitt: Prozess"
              >
                Prozess
              </LandingNavLink>
              <LandingNavLink
                onClick={() => scrollToSection("faq")}
                isActive={activeSection === "faq"}
                aria-current={activeSection === "faq" ? "page" : undefined}
                aria-label="Zu Abschnitt: FAQ"
              >
                FAQ
              </LandingNavLink>
            </nav>

            {/* Login Button */}
            {!isLoggedIn && (
              <LandingButton onClick={onLogin} aria-label="Anmelden oder Registrieren">
                Anmelden
              </LandingButton>
            )}
          </div>

          {/* Mobile: Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-surface-frost backdrop-blur-lg"
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-40">
          <div className="bg-surface w-full p-6 shadow-lg">
            <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
              <button
                onClick={() => handleNavClick("testimonial")}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${
                  activeSection === "testimonial" 
                    ? "bg-brand-alpha-12 text-brand" 
                    : "text-primary hover:bg-black-alpha-3"
                }`}
              >
                So funktioniert's
              </button>
              <button
                onClick={() => handleNavClick("was-ist-xrisk")}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${
                  activeSection === "was-ist-xrisk" 
                    ? "bg-brand-alpha-12 text-brand" 
                    : "text-primary hover:bg-black-alpha-3"
                }`}
              >
                Was ist xrisk?
              </button>
              <button
                onClick={() => handleNavClick("prozess")}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${
                  activeSection === "prozess" 
                    ? "bg-brand-alpha-12 text-brand" 
                    : "text-primary hover:bg-black-alpha-3"
                }`}
              >
                Prozess
              </button>
              <button
                onClick={() => handleNavClick("faq")}
                className={`text-left py-3 px-4 rounded-lg transition-colors ${
                  activeSection === "faq" 
                    ? "bg-brand-alpha-12 text-brand" 
                    : "text-primary hover:bg-black-alpha-3"
                }`}
              >
                FAQ
              </button>
              
              {!isLoggedIn && (
                <div className="pt-4 border-t border-border">
                  <LandingButton onClick={() => { onLogin(); setIsMobileMenuOpen(false); }} className="w-full">
                    Anmelden
                  </LandingButton>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}