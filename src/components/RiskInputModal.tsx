import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircle2, FileText, Search, Sparkles, Wand2 } from "lucide-react";
import { Risk, RiskStatus } from "../types/risk";
import { BaseModal } from "./BaseModal";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../auth/AuthContext";
import {
  openResumeStream,
  openStream,
  startWorkflow,
  submitInquiries,
} from "../workflow/workflowClient";
import { Inquiry, WorkflowEvent, WorkflowStartPayload } from "../workflow/workflowTypes";

interface RiskInputModalProps {
  open: boolean;
  onClose: () => void;
  initialRiskDescription: string;
  onRiskCreated?: (risk: Risk) => void;
}

type Step = "input" | "loading" | "questions" | "auth";

const loadingPhases = [
  { title: "Verbunden", icon: <Sparkles size={16} /> },
  { title: "Klassifizierung", icon: <Search size={16} /> },
  { title: "Rückfragen", icon: <FileText size={16} /> },
];

function getItemFromDescription(description: string): string {
  const lower = description.toLowerCase();

  if (lower.includes("espresso") || lower.includes("kaffee")) return "Espressomaschine";
  if (lower.includes("drohne")) return "Drohne";
  if (lower.includes("bohrmaschine") || lower.includes("bohrer")) return "Bohrmaschine";
  if (lower.includes("kamera")) return "Kamera";
  if (lower.includes("auto") || lower.includes("fahrzeug")) return "Auto";
  if (lower.includes("fahrrad") || lower.includes("bike")) return "Fahrrad";
  if (lower.includes("werkzeug")) return "Werkzeug";
  if (lower.includes("laptop") || lower.includes("computer")) return "Laptop";
  if (lower.includes("mixer") || lower.includes("küche")) return "Küchengerät";
  if (lower.includes("rasenmäher")) return "Rasenmäher";
  if (lower.includes("akkuschrauber")) return "Akkuschrauber";

  return "Gerät";
}

function getCategoryFromDescription(description: string): Risk["category"] {
  const lower = description.toLowerCase();

  if (lower.includes("auto") || lower.includes("fahrzeug") || lower.includes("drohne")) return "vehicles";
  if (lower.includes("laptop") || lower.includes("computer") || lower.includes("kamera")) return "electronics";
  if (lower.includes("bohrmaschine") || lower.includes("werkzeug") || lower.includes("akkuschrauber")) return "tools";
  if (lower.includes("espresso") || lower.includes("mixer") || lower.includes("küche")) return "household";
  if (lower.includes("fahrrad") || lower.includes("ski")) return "sports";

  return "other";
}

function buildRisk(
  riskUuid: string,
  input: { description: string; startDate: string; endDate: string; insuranceValue: number },
  status: RiskStatus,
): Risk {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return {
    id: riskUuid,
    title: getItemFromDescription(input.description),
    category: getCategoryFromDescription(input.description),
    description: input.description,
    coverageAmount: input.insuranceValue,
    premium: 0,
    duration,
    startDate: start,
    endDate: end,
    status,
    createdBy: "Sie",
    createdByUserId: "u5",
    createdAt: new Date(),
    expiresAt: end,
    userRole: "giver",
    riskScore: 0,
    views: 0,
    favorites: 0,
  };
}

export function RiskInputModal({ open, onClose, initialRiskDescription, onRiskCreated }: RiskInputModalProps) {
  const { login } = useAuth();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const defaultEndDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  }, []);

  const [description, setDescription] = useState(initialRiskDescription);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [insuranceValue, setInsuranceValue] = useState("1000");
  const [step, setStep] = useState<Step>("input");
  const [taskId, setTaskId] = useState<string | undefined>();
  const [riskUuid, setRiskUuid] = useState<string | undefined>();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [progressLabel, setProgressLabel] = useState<string | undefined>();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<boolean[]>(
    new Array(loadingPhases.length).fill(false),
  );
  const [error, setError] = useState<string | undefined>();
  const [pendingAuthResponses, setPendingAuthResponses] = useState<string[] | null>(null);
  const [initialInput, setInitialInput] = useState<WorkflowStartPayload | null>(null);

  const streamRef = useRef<{ close: () => void } | null>(null);
  const riskCreatedRef = useRef(false);
  const riskCompletedRef = useRef(false);

  const loadingProgress = useMemo(() => {
    const completed = completedPhases.filter(Boolean).length;
    return Math.min(100, Math.round((completed / loadingPhases.length) * 100));
  }, [completedPhases]);

  const resetLoadingState = () => {
    setCurrentPhaseIndex(0);
    setCompletedPhases(new Array(loadingPhases.length).fill(false));
    setProgressLabel(undefined);
  };

  const closeStream = () => {
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }
  };

  const resetAll = () => {
    closeStream();
    setStep("input");
    setTaskId(undefined);
    setRiskUuid(undefined);
    setInquiries([]);
    setAnswers([]);
    setError(undefined);
    setPendingAuthResponses(null);
    setInitialInput(null);
    resetLoadingState();
    riskCreatedRef.current = false;
    riskCompletedRef.current = false;
  };

  useEffect(() => {
    if (open) {
      setDescription(initialRiskDescription);
    }
  }, [initialRiskDescription, open]);

  useEffect(() => {
    if (!open) {
      resetAll();
    }
  }, [open]);

  useEffect(() => () => closeStream(), []);

  const markPhaseCompletedThrough = (index: number) => {
    setCompletedPhases((prev) => prev.map((completed, i) => completed || i <= index));
    setCurrentPhaseIndex((prev) => Math.max(prev, Math.min(index + 1, loadingPhases.length - 1)));
  };

  const handleCompletion = () => {
    if (riskCompletedRef.current || !initialInput || !riskUuid) return;

    riskCompletedRef.current = true;
    const completedRisk = buildRisk(riskUuid, {
      description: initialInput.initial_prompt,
      startDate: initialInput.start_date,
      endDate: initialInput.end_date,
      insuranceValue: initialInput.insurance_value,
    }, "completed");
    onRiskCreated?.(completedRisk);
    markPhaseCompletedThrough(loadingPhases.length - 1);
    setProgressLabel("Abgeschlossen");
    closeStream();
  };

  const handleStreamEvent = (event: WorkflowEvent) => {
    if (event.meta?.risk_uuid) {
      setRiskUuid((prev) => prev ?? event.meta?.risk_uuid);
    }

    if (event.connected) {
      markPhaseCompletedThrough(0);
      setProgressLabel("Verbunden");
    }

    const stepValue = (event.meta?.step || event.status || "").toLowerCase();

    if (stepValue.includes("classification")) {
      markPhaseCompletedThrough(0);
      setCurrentPhaseIndex(1);
      setProgressLabel("Klassifizierung läuft");
    }

    if (stepValue === "classified") {
      markPhaseCompletedThrough(1);
      setProgressLabel("Klassifizierung abgeschlossen");
    }

    if (stepValue.includes("inquiry")) {
      markPhaseCompletedThrough(1);
      setCurrentPhaseIndex(2);
      setProgressLabel("Rückfragen vorbereiten");
    }

    if (event.status === "inquired") {
      markPhaseCompletedThrough(2);
      setProgressLabel("Rückfragen verarbeitet");
    }

    if (event.status === "inquiry_required" && event.meta?.inquiries) {
      closeStream();
      setInquiries(event.meta.inquiries);
      setAnswers(event.meta.inquiries.map((inquiry) => inquiry.response ?? ""));
      markPhaseCompletedThrough(loadingPhases.length - 1);
      setProgressLabel("Rückfragen erhalten");
      setStep("questions");
      return;
    }

    if (event.status === "error") {
      setError(event.error || "Workflow fehlgeschlagen.");
      closeStream();
      return;
    }

    const isCompletedStatus =
      stepValue === "completed" ||
      stepValue === "done" ||
      stepValue === "finished" ||
      stepValue === "report" ||
      event.status === "completed";

    if (isCompletedStatus) {
      handleCompletion();
    }
  };

  const handleStreamError = (err: Event | MessageEvent | Error) => {
    console.error("Workflow stream error", err);
    setError("Der Live-Stream wurde unerwartet beendet. Bitte versuche es erneut.");
    closeStream();
  };

  const openInitialStream = (id: string) => {
    closeStream();
    streamRef.current = openStream(id, handleStreamEvent, handleStreamError);
  };

  const openResume = (uuid: string) => {
    closeStream();
    streamRef.current = openResumeStream(uuid, handleStreamEvent, handleStreamError);
  };

  const handleStart = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(undefined);
    resetLoadingState();

    const payload: WorkflowStartPayload = {
      initial_prompt: description || initialRiskDescription,
      start_date: startDate,
      end_date: endDate,
      insurance_value: Number(insuranceValue) || 0,
    };

    setInitialInput(payload);
    setStep("loading");

    try {
      const response = await startWorkflow(payload);
      setTaskId(response.task_id);
      setRiskUuid(response.risk_uuid);

      if (!riskCreatedRef.current) {
        const evaluatingRisk = buildRisk(
          response.risk_uuid,
          {
            description: payload.initial_prompt,
            startDate: payload.start_date,
            endDate: payload.end_date,
            insuranceValue: payload.insurance_value,
          },
          "evaluating",
        );
        onRiskCreated?.(evaluatingRisk);
        riskCreatedRef.current = true;
      }

      openInitialStream(response.task_id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fehler beim Starten des Workflows";
      setError(message);
      setStep("input");
    }
  };

  const handleInquiryChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const performSubmitInquiries = async (responses: string[]) => {
    if (!taskId || !riskUuid) {
      setError("Workflow-Informationen fehlen. Bitte neu starten.");
      return;
    }

    if (!inquiries.every((_, idx) => responses[idx] && responses[idx].trim() !== "")) {
      setError("Bitte beantworte alle Rückfragen.");
      return;
    }

    setError(undefined);

    try {
      await submitInquiries({ task_id: taskId, risk_uuid: riskUuid, responses });
      setStep("loading");
      setPendingAuthResponses(null);
      openResume(riskUuid);
    } catch (err) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        setPendingAuthResponses(responses);
        setStep("auth");
        return;
      }

      const message = err instanceof Error ? err.message : "Fehler beim Senden der Antworten";
      setError(message);
    }
  };

  const handleInquirySubmit = async () => {
    await performSubmitInquiries(answers);
  };

  const handleAuthSuccess = async () => {
    await login();
    const responsesToRetry = pendingAuthResponses ?? answers;
    await performSubmitInquiries(responsesToRetry);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const renderInputForm = () => (
    <form id="risk-input-form" onSubmit={handleStart}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar sx={{ bgcolor: "#ff671f", width: 40, height: 40, fontWeight: 600 }}>1</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
              Was möchtest Du absichern?
            </Typography>
            <Typography className="body-sm text-secondary">Erzähl uns von Deinem Anliegen</Typography>
          </Box>
        </Box>

        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Dein Anliegen:
          </Typography>
          <TextField
            name="risk-description"
            id="risk-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="z.B. Ich verleih meine Espressomaschine an meinen Nachbarn und möchte sie absichern..."
            multiline
            rows={6}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f3f2f2",
                borderRadius: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "16px", md: "16px" },
                color: "#353131",
                minHeight: { xs: 120, md: "auto" },
                "& fieldset": {
                  borderColor: "#e6e5e5",
                },
                "&:hover fieldset": {
                  borderColor: "#ff671f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff671f",
                  borderWidth: "2px",
                },
              },
              "& .MuiOutlinedInput-input": {
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "16px", md: "16px" },
                "&::placeholder": {
                  color: "#4f4a4a",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Schutz ab:
            </Typography>
            <TextField
              type="date"
              name="start-date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f3f2f2",
                  borderRadius: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: "16px", md: "16px" },
                  color: "#353131",
                  minHeight: { xs: 56, md: "auto" },
                  "& fieldset": {
                    borderColor: "#e6e5e5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff671f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff671f",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Box>
          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Schutz bis:
            </Typography>
            <TextField
              type="date"
              name="end-date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f3f2f2",
                  borderRadius: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: "16px", md: "16px" },
                  color: "#353131",
                  minHeight: { xs: 56, md: "auto" },
                  "& fieldset": {
                    borderColor: "#e6e5e5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff671f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff671f",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Wert (EUR):
          </Typography>
          <TextField
            type="number"
            name="insurance-value"
            id="insurance-value"
            value={insuranceValue}
            onChange={(e) => setInsuranceValue(e.target.value)}
            inputProps={{ min: 0, step: 100 }}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f3f2f2",
                borderRadius: 1,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: "16px", md: "16px" },
                color: "#353131",
                minHeight: { xs: 56, md: "auto" },
                "& fieldset": {
                  borderColor: "#e6e5e5",
                },
                "&:hover fieldset": {
                  borderColor: "#ff671f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff671f",
                  borderWidth: "2px",
                },
              },
            }}
          />
        </Box>
      </Box>
    </form>
  );

  const renderLoading = (title: string, subtitle: string) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
        <Avatar sx={{ bgcolor: "#ff671f", width: 56, height: 56, mx: "auto" }}>
          <Sparkles />
        </Avatar>
        <Typography className="heading-3 text-primary">{title}</Typography>
        <Typography className="body-base text-secondary">{subtitle}</Typography>
      </Box>

      <Box>
        <LinearProgress variant="determinate" value={loadingProgress} sx={{ height: 10, borderRadius: 1 }} />
        {progressLabel && (
          <Typography className="body-sm text-secondary" sx={{ mt: 1, textAlign: "center" }}>
            {progressLabel}
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
        {loadingPhases.map((phase, index) => (
          <Chip
            key={phase.title}
            icon={<CheckCircle2 size={16} />}
            label={phase.title}
            color={completedPhases[index] ? "success" : "default"}
            variant={completedPhases[index] ? "filled" : index === currentPhaseIndex ? "outlined" : "outlined"}
          />
        ))}
      </Stack>
    </Box>
  );

  const renderInquiryForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Avatar sx={{ bgcolor: "#ff671f", width: 40, height: 40, fontWeight: 600 }}>2</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
            Rückfragen beantworten
          </Typography>
          <Typography className="body-sm text-secondary">Bitte fülle alle Fragen aus, damit wir fortfahren können.</Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        {inquiries.map((inquiry, index) => (
          <Box key={index}>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              {inquiry.question}
            </Typography>
            <TextField
              fullWidth
              value={answers[index] ?? ""}
              onChange={(e) => handleInquiryChange(index, e.target.value)}
              placeholder="Antwort eingeben"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f3f2f2",
                  borderRadius: 1,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: "16px", md: "16px" },
                  color: "#353131",
                  minHeight: { xs: 56, md: "auto" },
                  "& fieldset": {
                    borderColor: "#e6e5e5",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff671f",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff671f",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );

  const renderAuthRequired = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography className="heading-3 text-primary" sx={{ textAlign: "center" }}>
        Anmeldung erforderlich
      </Typography>
      <Typography className="body-base text-secondary" sx={{ textAlign: "center" }}>
        Bitte melde dich an, um die Antworten zu senden und den Workflow fortzusetzen.
      </Typography>
      <Divider sx={{ my: 1 }} />
      <AuthModal
        onLogin={async () => {
          await handleAuthSuccess();
        }}
        onRegister={async () => {
          await handleAuthSuccess();
        }}
      />
    </Box>
  );

  const renderContent = () => {
    if (step === "loading") {
      return renderLoading("Analyse gestartet", "Wir verbinden uns mit xrisk.info und empfangen Live-Updates...");
    }

    if (step === "questions") {
      return renderInquiryForm();
    }

    if (step === "auth") {
      return renderAuthRequired();
    }

    return renderInputForm();
  };

  const renderActions = () => {
    if (step === "auth") {
      return null;
    }

    if (step === "questions") {
      return (
        <>
          <Button onClick={handleClose} variant="outlined">
            Abbrechen
          </Button>
          <Button onClick={handleInquirySubmit} variant="contained">
            Weiter
          </Button>
        </>
      );
    }

    if (step === "loading") {
      return (
        <Button onClick={handleClose} variant="outlined">
          Abbrechen
        </Button>
      );
    }

    return (
      <>
        <Button onClick={handleClose} variant="outlined">
          Abbrechen
        </Button>
        <Button type="submit" form="risk-input-form" variant="contained">
          Analyse starten
        </Button>
      </>
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Risiko erfassen"
      subtitle="Wir starten für Dich den xrisk.info Workflow"
      icon={<Wand2 size={24} />}
      actions={renderActions()}
      showCloseButton
      maxWidth="md"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {renderContent()}

        {error && (
          <Typography className="body-sm text-error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>
    </BaseModal>
  );
}
