import { Box, Typography } from "@mui/material";
import { Shield, CheckCircle2, Scale, Sparkles, Rocket } from "lucide-react";

export type RiskToleranceLevel = 1 | 2 | 3 | 4 | 5 | null;

interface RiskToleranceSelectorProps {
  value: RiskToleranceLevel;
  onChange: (level: RiskToleranceLevel) => void;
}

const riskToleranceOptions = [
  {
    level: 1,
    label: "Auf Nummer sicher",
    shortLabel: "Sicher",
    subLabel: "Wenig verdienen",
    description: "Planbar und verlässlich – dafür etwas weniger Ertrag",
    icon: Shield,
    color: "#4CAF50",
  },
  {
    level: 2,
    label: "Bedacht",
    shortLabel: "Bedacht",
    subLabel: "Solide verdienen",
    description: "Gut informiert entscheiden – mit solidem Ergebnis",
    icon: CheckCircle2,
    color: "#8BC34A",
  },
  {
    level: 3,
    label: "Flexibel",
    shortLabel: "Flexibel",
    subLabel: "Gut verdienen",
    description: "Balance zwischen Absicherung und Chance – fair vergütet",
    icon: Scale,
    color: "#FF9800",
  },
  {
    level: 4,
    label: "Entdeckerfreude",
    shortLabel: "Entdecker",
    subLabel: "Mehr verdienen",
    description: "Neues ausprobieren – wird entsprechend belohnt",
    icon: Sparkles,
    color: "#FF671F",
  },
  {
    level: 5,
    label: "Voller Tatendrang",
    shortLabel: "Tatendrang",
    subLabel: "Viel verdienen",
    description: "Vorangehen und anpacken – bringt am meisten",
    icon: Rocket,
    color: "#F44336",
  },
] as const;

export function RiskToleranceSelector({ value, onChange }: RiskToleranceSelectorProps) {
  const selectedOption = riskToleranceOptions.find((o) => o.level === value);

  return (
    <Box
      sx={{
        backgroundColor: "#fdfcfc",
        border: "1px solid #e6e5e5",
        borderRadius: "12px",
        p: 2,
      }}
    >
      {/* Question */}
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#353131",
          mb: 2,
        }}
      >
        Sicherheit oder Chancen – was ist dir wichtiger?
      </Typography>

      {/* Segmented Control Container */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          p: 0.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 0.5,
        }}
      >
        {riskToleranceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.level;

          return (
            <Box
              key={option.level}
              onClick={() => onChange(option.level as RiskToleranceLevel)}
              title={option.description}
              sx={{
                position: "relative",
                flex: { xs: "none", sm: "1 1 0" },
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                py: 1,
                px: 1.5,
                borderRadius: "8px",
                backgroundColor: isSelected ? "#ffffff" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isSelected
                  ? "0 1px 4px rgba(0, 0, 0, 0.06)"
                  : "none",
                "&:hover": {
                  backgroundColor: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              {/* Icon */}
              <Icon
                size={16}
                strokeWidth={2.5}
                style={{
                  color: isSelected ? option.color : "#9e9e9e",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              />

              {/* Labels Container */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                {/* Main Label */}
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? option.color : "#757575",
                    transition: "all 0.2s ease",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.shortLabel}
                </Typography>

                {/* Sub Label */}
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: isSelected ? option.color : "#9e9e9e",
                    transition: "all 0.2s ease",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    opacity: 0.8,
                  }}
                >
                  {option.subLabel}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}