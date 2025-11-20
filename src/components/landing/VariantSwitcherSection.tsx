import { useState } from "react";
import imgLena from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgBus from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";

interface VariantSwitcherSectionProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
}

export function VariantSwitcherSection({
  variant,
  onVariantChange,
}: VariantSwitcherSectionProps) {
  const [hoveredVariant, setHoveredVariant] = useState<"market" | "bus" | null>(
    null
  );

  const variants = {
    market: {
      image: imgLena,
      name: "Lena, Künstlerin",
      quote: '"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall."',
      description:
        "Lena verkauft ihre Kunst auf Wochenmärkten. Wenn das Wetter schlecht ist, bleiben die Besucher weg. Sie braucht eine Absicherung – aber keine klassische Versicherung bietet sowas an.",
    },
    bus: {
      image: imgBus,
      name: "Marco, T3-Besitzer",
      quote: '"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird\'s teuer und stressig."',
      description:
        "Marco hat einen T3 Baujahr 1987. Sein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt, die Strecke anspruchsvoll. Eine klassische Versicherung? Deckt sowas nicht ab. Er braucht eine andere Lösung.",
    },
  };

  const marketData = variants.market;
  const busData = variants.bus;

  // Determine which variant should be large
  const largeVariant = hoveredVariant || variant;
  const isMarketLarge = largeVariant === "market";
  const isBusLarge = largeVariant === "bus";

  const handleVariantClick = (newVariant: "market" | "bus") => {
    onVariantChange(newVariant);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-12">
            {/* Left Column */}
            <div className="content-stretch flex flex-col gap-[40px] items-start justify-center py-[80px] px-[0px] py-[40px]">
              {/* Section Headline */}
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] not-italic relative shrink-0 text-[#353131] text-[40px] w-full">
                    Individuelle Risiken, Individuelle Lösungen
                  </p>
                </div>
              </div>

              {/* Images Row */}
              <div className="content-stretch flex h-[474px] items-start relative shrink-0 w-full gap-0">
                {/* Market Variant */}
                <button
                  onClick={() => handleVariantClick("market")}
                  onMouseEnter={() => setHoveredVariant("market")}
                  onMouseLeave={() => setHoveredVariant(null)}
                  className={`h-full relative transition-all duration-500 ease-in-out cursor-pointer ${
                    isMarketLarge ? "flex-[2]" : "flex-[1]"
                  }`}
                  style={{ minWidth: isMarketLarge ? "60%" : "40%" }}
                >
                  <div className="flex flex-col justify-end size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-end p-[24px] relative size-full">
                      <div className="absolute inset-0 opacity-80 rounded-bl-[24px] rounded-tl-[24px]" />
                      <div className="absolute inset-0 rounded-bl-[24px] rounded-tl-[24px]">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px]"
                        >
                          <img
                            alt=""
                            className="absolute max-w-none object-50%-50% object-cover rounded-bl-[24px] rounded-tl-[24px] size-full transition-all duration-500"
                            src={marketData.image}
                          />
                          <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-bl-[24px] rounded-tl-[24px] to-[rgba(0,0,0,0.8)]" />
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full z-10">
                        <p
                          className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full transition-all duration-500"
                          style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                          {marketData.name}
                        </p>
                        {isMarketLarge && (
                          <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full transition-all duration-500">
                            {marketData.quote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Bus Variant */}
                <button
                  onClick={() => handleVariantClick("bus")}
                  onMouseEnter={() => setHoveredVariant("bus")}
                  onMouseLeave={() => setHoveredVariant(null)}
                  className={`h-full relative transition-all duration-500 ease-in-out cursor-pointer ${
                    isBusLarge ? "flex-[2]" : "flex-[1]"
                  }`}
                  style={{ minWidth: isBusLarge ? "60%" : "40%" }}
                >
                  <div className="flex flex-col justify-end size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-end p-[24px] relative size-full">
                      <div className="absolute inset-0 opacity-80 rounded-br-[24px] rounded-tr-[24px]" />
                      <div className="absolute inset-0 rounded-br-[24px] rounded-tr-[24px]">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none rounded-br-[24px] rounded-tr-[24px]"
                        >
                          <img
                            alt=""
                            className="absolute max-w-none object-50%-50% object-cover rounded-br-[24px] rounded-tr-[24px] size-full transition-all duration-500"
                            src={busData.image}
                          />
                          <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-br-[24px] rounded-tr-[24px] to-[rgba(0,0,0,0.8)]" />
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full z-10">
                        <p
                          className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full transition-all duration-500"
                          style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                          {busData.name}
                        </p>
                        {isBusLarge && (
                          <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full transition-all duration-500">
                            {busData.quote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}