import { FAQAccordion } from "./FAQAccordion";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQSectionProps {
  title: string | React.ReactNode;
  subtitle?: string;
  faqs: FAQItem[];
  defaultExpanded?: number;
}

export function FAQSection({ title, subtitle, faqs, defaultExpanded = 0 }: FAQSectionProps) {
  return (
    <div id="faq" className="w-full section-spacing px-[0px] py-[40px]">
      <div className="container-grid">
        <div className="grid-12">
          {/* Left Column - Title & Subtitle - 6 cols desktop, full on tablet */}
          <div className="col-span-6 tablet-full flex flex-col gap-4 items-start">
            <div className="flex flex-col gap-2 items-start w-full">
              {typeof title === "string" ? (
                <h2 className="display-large text-primary" dangerouslySetInnerHTML={{ __html: title }} />
              ) : (
                <h2 className="display-large text-primary">{title}</h2>
              )}
            </div>
            {subtitle && (
              <p 
                className="text-lg-medium text-primary"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '16px',
                  lineHeight: '1.3',
                  color: '#353131',
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Column - FAQ Accordion - 6 cols desktop, full on tablet */}
          <div className="col-span-6 tablet-full">
            <FAQAccordion faqs={faqs} defaultExpanded={defaultExpanded} />
          </div>
        </div>
      </div>
    </div>
  );
}