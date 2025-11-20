import { RisikoCardPreview } from "./RisikoCardPreview";

interface Risk {
  id: string;
  title: string;
  category: string;
  premium: string;
  coverage: string;
  progress?: number;
}

interface NeuesteRisikenSectionProps {
  variant: "market" | "bus";
}

export function NeuesteRisikenSection({ variant }: NeuesteRisikenSectionProps) {
  const marketRisks: Risk[] = [
    {
      id: "1",
      title: "Wochenmarkt Regen",
      category: "Wetterausfall",
      premium: "40 - 60 €",
      coverage: "500 €",
      progress: 2,
    },
    {
      id: "2",
      title: "Open-Air Konzert",
      category: "Wetterausfall",
      premium: "100 - 150 €",
      coverage: "2.000 €",
      progress: 3,
    },
    {
      id: "3",
      title: "Kunstausstellung",
      category: "Wetterausfall",
      premium: "70 - 100 €",
      coverage: "1.200 €",
      progress: 2,
    },
    {
      id: "4",
      title: "Straßenfest Stand",
      category: "Wetterausfall",
      premium: "30 - 45 €",
      coverage: "400 €",
      progress: 1,
    },
  ];

  const busRisks: Risk[] = [
    {
      id: "1",
      title: "Alpen-Überquerung",
      category: "Pannenrisiko",
      premium: "130 - 180 €",
      coverage: "3.000 €",
      progress: 3,
    },
    {
      id: "2",
      title: "Nordkap-Tour",
      category: "Pannenrisiko",
      premium: "180 - 230 €",
      coverage: "4.500 €",
      progress: 2,
    },
    {
      id: "3",
      title: "Küsten-Roadtrip",
      category: "Pannenrisiko",
      premium: "90 - 120 €",
      coverage: "2.000 €",
      progress: 4,
    },
    {
      id: "4",
      title: "Festival-Fahrt",
      category: "Pannenrisiko",
      premium: "60 - 90 €",
      coverage: "1.500 €",
      progress: 2,
    },
  ];

  const risks = variant === "market" ? marketRisks : busRisks;

  return (
    <div className="w-full">
      <div className="container-grid">
        <div className="grid-12">
          <div className="col-span-12">
            <div className="content-stretch flex flex-col gap-[40px] items-center justify-center py-[80px]">
              {/* Section Headline */}
              <h2 className="font-['Inter:Black',sans-serif] font-black leading-[1.3] text-[#353131] text-[40px] text-center">
                Neueste Risiken
              </h2>

              {/* Risk Cards Grid */}
              <div className="grid grid-cols-4 gap-[24px] w-full">
                {risks.map((risk) => (
                  <div key={risk.id} className="h-[280px]">
                    <RisikoCardPreview
                      title={risk.title}
                      category={risk.category}
                      premium={risk.premium}
                      coverage={risk.coverage}
                      progress={risk.progress}
                    />
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="inline-flex items-center justify-center px-[32px] py-[16px] rounded-[12px] bg-[#ff671f] hover:bg-[#e55b1a] active:bg-[#e05a1b] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] transition-all duration-200 shadow-brand-sm hover:shadow-brand-md">
                Zur Risikobörse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}