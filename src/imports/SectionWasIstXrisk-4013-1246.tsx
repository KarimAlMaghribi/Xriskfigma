import imgImage from "figma:asset/bd5ef2489f9b4f9b730b2a87634c31cb90a5552a.png";
import imgImage1 from "figma:asset/6dced1441827933a0838781a6f2ab7f608b86595.png";
import imgLena from "figma:asset/2fb22e12698929d8163c2e846418914dcd3c2d2e.png";
import imgMartin from "figma:asset/b4ecfaf9c6e73e8dd6c209458e50397edd6b1743.png";

interface SectionWasIstXriskProps {
  variant?: "market" | "bus";
}

function Container({ variant = "bus" }: SectionWasIstXriskProps) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full">
        <span>{`Was ist `}</span>
        <span className="text-[#ff671f]">x</span>risk?
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[1.3] relative shrink-0 text-[40px] w-full">
        <span className="text-[#ff671f]">Zwei Menschen.</span>
        <span>
          {" "}
          <br aria-hidden="true" />
          {`Ein Risiko. `}
        </span>
        <span className="text-[#ff671f]">Eine Lösung.</span>
      </p>
    </div>
  );
}

function SectionHeadline({ variant = "bus" }: SectionWasIstXriskProps) {
  const subtitle = variant === "market" 
    ? "Wenn Künstler auf Wetterexperten treffen, entstehen faire Absicherungen – direkt, ohne Umwege."
    : "Wenn T3-Besitzer auf Mechaniker-Experten treffen, entstehen faire Absicherungen – direkt, ohne Umwege.";
    
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-[#353131] w-full" data-name="Section headline">
      <Container variant={variant} />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] relative shrink-0 text-[18px] w-full">{subtitle}</p>
    </div>
  );
}

function Frame({ variant = "bus" }: SectionWasIstXriskProps) {
  const name = variant === "market" ? "Lena, Künstlerin" : "Marco, T3-Besitzer";
  const quote = variant === "market"
    ? `"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall."`
    : `"Seit Jahren träume ich von dieser Tour. Aber mit zwei Kindern im Bus? Wenn der Wagen mitten in den Bergen liegen bleibt, wird's teuer und stressig."`;
    
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {name}
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">{quote}</p>
    </div>
  );
}

function TestimonialImage({ variant = "bus" }: SectionWasIstXriskProps) {
  const image = variant === "market" ? imgLena : imgImage;
  const description = variant === "market"
    ? "Lena verkauft ihre Kunstwerke auf Wochenmärkten. Ihr Einkommen hängt vom Wetter ab. Wenn es regnet, bleiben die Besucher weg – und damit ihre Einnahmen. Eine klassische Versicherung? Gibt's dafür nicht. Sie braucht eine andere Lösung."
    : "Marco hat einen T3 Baujahr 1987. Sein Traum: Alpenüberquerung mit der Familie. Aber der Bus ist alt, die Strecke anspruchsvoll. Eine klassische Versicherung? Deckt sowas nicht ab. Er braucht eine andere Lösung.";
    
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[24px] shrink-0 w-full transition-all duration-500 md:h-auto h-[400px]" data-name="TestimonialImage">
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-end p-[24px] relative size-full">
          <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
          <div className="absolute inset-0 rounded-[24px]" data-name="Image">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[24px] size-full transition-all duration-500" src={image} />
              <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-[24px] to-[rgba(0,0,0,0.8)]" />
            </div>
          </div>
          <Frame variant={variant} />
          <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] min-w-full relative shrink-0 text-[#e6e5e5] text-[16px] w-[min-content] transition-all duration-500" style={{ fontVariationSettings: "'wdth' 100" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function LeftRow({ variant = "bus" }: SectionWasIstXriskProps) {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[900px] md:h-[900px] h-auto items-start justify-center relative rounded-bl-[24px] rounded-br-[24px]" data-name="Left Row">
      <SectionHeadline variant={variant} />
      <TestimonialImage variant={variant} />
    </div>
  );
}

function Frame1({ variant = "bus" }: SectionWasIstXriskProps) {
  const name = variant === "market" ? "Martin, Landwirt" : "Stefan, T3-Fan";
  const quote = variant === "market"
    ? `"Als Landwirt kenne ich Wetter. Ich weiß, wie man damit umgeht. Für eine angemessene Prämie übernehme ich dieses Risiko."`
    : `"Ich kenne diese Busse in- und auswendig. Ich weiß, was sie können. Und ich weiß, worauf man achten muss."`;
    
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[1.3] relative shrink-0 w-full">
      <p className="font-['Roboto:Regular',sans-serif] font-normal relative shrink-0 text-[#ededed] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        {name}
      </p>
      <p className="font-['Inter:Black',sans-serif] font-black not-italic relative shrink-0 text-[#e6e5e5] text-[18px] w-full">{quote}</p>
    </div>
  );
}

function TestimonialImage1({ variant = "bus" }: SectionWasIstXriskProps) {
  const image = variant === "market" ? imgMartin : imgImage1;
  const description = variant === "market"
    ? `Martin bewirtschaftet seit 20 Jahren Felder. Wetter ist sein tägliches Geschäft. Er sieht Lenas Anfrage und versteht das Risiko. Er denkt: \"Das kann ich gut einschätzen.\"`
    : `Stefan schraubt seit 15 Jahren an T3-Bussen rum. Er hat selbst drei Alpentouren hinter sich. Er sieht sich Marcos Bus an – Wartungszustand, Motor, Reifen – und denkt: \"Der schafft das.\"`;
    
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] h-full items-start justify-end p-[24px] relative rounded-[24px] shrink-0 w-full transition-all duration-500" data-name="TestimonialImage">
      <div className="absolute inset-0 opacity-80 rounded-[24px]" data-name="Abblende" />
      <div className="absolute inset-0 rounded-[24px]" data-name="Image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[24px] size-full transition-all duration-500" src={image} />
          <div className="absolute bg-gradient-to-b from-[23.077%] from-[rgba(0,0,0,0)] inset-0 rounded-[24px] to-[rgba(0,0,0,0.8)]" />
        </div>
      </div>
      <Frame1 variant={variant} />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.3] min-w-full relative shrink-0 text-[#e6e5e5] text-[16px] w-[min-content] transition-all duration-500" style={{ fontVariationSettings: "'wdth' 100" }}>{description}</p>
    </div>
  );
}

function RightRow({ variant = "bus" }: SectionWasIstXriskProps) {
  return (
    <div className="content-stretch flex gap-[10px] h-[900px] md:h-[900px] h-[400px] items-center relative" data-name="Right Row">
      <TestimonialImage1 variant={variant} />
    </div>
  );
}

export default function SectionWasIstXrisk({ variant = "bus" }: SectionWasIstXriskProps) {
  return (
    <div className="w-full" data-name="Section Was ist xrisk">
      <div className="container-grid">
        <div className="grid-12 py-[80px]">
          {/* Left side - 6 columns */}
          <div className="col-span-6">
            <LeftRow variant={variant} />
          </div>
          
          {/* Right side - 6 columns */}
          <div className="col-span-6">
            <RightRow variant={variant} />
          </div>
        </div>
      </div>
    </div>
  );
}