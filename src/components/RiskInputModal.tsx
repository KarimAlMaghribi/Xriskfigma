import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  LinearProgress,
  Fade,
  Grow,
} from "@mui/material";
import { Wand2, Sparkles, FileText, CheckCircle2, Search, BarChart3, TrendingUp, Zap } from "lucide-react";
import { Risk } from "../types/risk";
import { BaseModal } from "./BaseModal";
import { AuthModal } from "./AuthModal";
import { openWorkflowStream, sendInquiryResponse, startWorkflow } from "../workflow/xriskClient";

interface RiskInputModalProps {
  open: boolean;
  onClose: () => void;
  initialRiskDescription: string;
  onRiskCreated?: (risk: Risk) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

// Helper function to extract key items from risk description
function getItemFromDescription(description: string): string {
  const lower = description.toLowerCase();
  
  // Common items
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

function getLoadingMessages(item: string): string[] {
  return [
    `Wow, eine ${item}! 😊`,
    `Ich analysiere die Details Ihrer ${item}...`,
    `Spannend! Ich schaue mir das genauer an...`,
    `Einen Moment, ich bewerte das Risiko für Ihre ${item}...`,
    `Ich prüfe die technischen Spezifikationen...`,
    `Fast geschafft! Ich prüfe noch ein paar Details...`,
    `Ich ermittle passende Risikofaktoren...`,
    `Gleich fertig mit der Erstanalyse...`,
    `Ich bereite die Risikobewertung vor...`,
    `Nur noch einen Moment...`,
  ];
}

// Helper to determine category from description
function getCategoryFromDescription(description: string): Risk['category'] {
  const lower = description.toLowerCase();
  
  if (lower.includes("auto") || lower.includes("fahrzeug") || lower.includes("drohne")) return "vehicles";
  if (lower.includes("laptop") || lower.includes("computer") || lower.includes("kamera")) return "electronics";
  if (lower.includes("bohrmaschine") || lower.includes("werkzeug") || lower.includes("akkuschrauber")) return "tools";
  if (lower.includes("espresso") || lower.includes("mixer") || lower.includes("küche")) return "household";
  if (lower.includes("fahrrad") || lower.includes("ski")) return "sports";
  
  return "other";
}

// Loading phases configuration based on Nielsen Norman Group best practices
interface LoadingPhase {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number; // milliseconds
  progress: number; // 0-100
}

export function RiskInputModal({ open, onClose, initialRiskDescription, onRiskCreated, isLoggedIn: _isLoggedIn, onLogin }: RiskInputModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"input" | "loading" | "questions" | "auth">("input");
  const [riskDescription, setRiskDescription] = useState(initialRiskDescription);
  const [detectedItem, setDetectedItem] = useState("Gerät");
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [riskUuid, setRiskUuid] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<{ question: string; response: string | null }[]>([]);
  const [inquiryResponses, setInquiryResponses] = useState<string[]>([]);
  const [pendingInquiryResponses, setPendingInquiryResponses] = useState<string[]>([]);
  const [activeRisk, setActiveRisk] = useState<Risk | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResumeStream, setIsResumeStream] = useState(false);
  const [lastEventTime, setLastEventTime] = useState<number | null>(null);
  const [allowBackgroundClose, setAllowBackgroundClose] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const lastStreamIdRef = useRef<string | null>(null);
  const [formData, setFormData] = useState({
    description: initialRiskDescription,
    startDate: "",
    endDate: "",
    insuranceValue: "1000",
  });
  
  // Define loading phases - focused on preparing follow-up questions
  const loadingPhases: LoadingPhase[] = [
    {
      id: 0,
      title: "Deine Eingaben verstehen",
      description: "Wir schauen uns an, was Du absichern möchtest...",
      icon: <Search size={24} />,
      duration: 2500,
      progress: 25,
    },
    {
      id: 1,
      title: "Kontext checken",
      description: "Welche Art von Absicherung passt am besten?",
      icon: <BarChart3 size={24} />,
      duration: 2500,
      progress: 50,
    },
    {
      id: 2,
      title: "Wichtige Infos ermitteln",
      description: "Was brauchen wir noch von Dir?",
      icon: <TrendingUp size={24} />,
      duration: 2500,
      progress: 75,
    },
    {
      id: 3,
      title: "Fragen vorbereiten",
      description: "Gleich geht's weiter mit ein paar Details...",
      icon: <Zap size={24} />,
      duration: 2500,
      progress: 100,
    },
  ];

  const today = new Date().toISOString().split('T')[0];
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const oneYearLaterStr = oneYearLater.toISOString().split('T')[0];

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    closeEventSource();
    setIsLoading(false);
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCompletedPhases([]);
    setTaskId(null);
    setRiskUuid(null);
    setInquiries([]);
    setInquiryResponses([]);
    setPendingInquiryResponses([]);
    setActiveRisk(null);
    setErrorMessage(null);
    setIsResumeStream(false);
    setLastEventTime(null);
    setAllowBackgroundClose(false);
    lastStreamIdRef.current = null;
  }, [closeEventSource]);

  const markCompletedPhases = useCallback(() => {
    setCompletedPhases(loadingPhases.map((phase) => phase.id));
    setCurrentPhaseIndex(loadingPhases.length - 1);
  }, [loadingPhases]);

  const handleWorkflowComplete = useCallback(() => {
    closeEventSource();
    setIsLoading(false);
    setProgress(100);
    markCompletedPhases();
    setAllowBackgroundClose(false);

    if (activeRisk && onRiskCreated) {
      onRiskCreated({ ...activeRisk, status: "completed" });
    }

    onClose();
    setTimeout(() => {
      resetState();
    }, 0);
  }, [activeRisk, closeEventSource, markCompletedPhases, onClose, onRiskCreated, resetState]);

  const updateProgressFromEvent = useCallback(
    (data: any) => {
      if (data?.connected) {
        setProgress((prev) => Math.max(prev, isResumeStream ? 70 : 10));
        setCurrentPhaseIndex(isResumeStream ? 2 : 0);
        return;
      }

      const metaStep = data?.meta?.step;
      const status = data?.status;

      if (isResumeStream) {
        if (status === "inquired" || metaStep === "inquiry") {
          setProgress((prev) => Math.max(prev, 70));
          setCurrentPhaseIndex(2);
          setCompletedPhases((prev) => Array.from(new Set([...prev, loadingPhases[0].id, loadingPhases[1].id])));
        }
        if (metaStep === "report") {
          setProgress((prev) => Math.max(prev, 90));
          setCurrentPhaseIndex(3);
          setCompletedPhases((prev) => Array.from(new Set([...prev, loadingPhases[0].id, loadingPhases[1].id, loadingPhases[2].id])));
        }
        return;
      }

      if (metaStep === "classification") {
        setProgress((prev) => Math.max(prev, 25));
        setCurrentPhaseIndex(0);
      }
      if (metaStep === "classified") {
        setProgress((prev) => Math.max(prev, 50));
        setCompletedPhases([loadingPhases[0].id]);
        setCurrentPhaseIndex(1);
      }
      if (metaStep === "inquiry") {
        setProgress((prev) => Math.max(prev, 75));
        setCurrentPhaseIndex(2);
      }
    },
    [isResumeStream, loadingPhases]
  );

  const handleInquiryRequired = useCallback((data: any) => {
    const inquiriesFromMeta = data?.meta?.inquiries || [];
    const nextRiskUuid = data?.meta?.risk_uuid || riskUuid;

    setRiskUuid(nextRiskUuid || null);
    setInquiries(inquiriesFromMeta);
    setInquiryResponses(Array(inquiriesFromMeta.length).fill(""));
    setProgress(100);
    markCompletedPhases();
    setIsLoading(false);
    setStep("questions");
    closeEventSource();
  }, [closeEventSource, markCompletedPhases, riskUuid]);

  const isFinalEvent = useCallback((data: any) => {
    const status = data?.status;
    if (!status) return false;
    const finalStatuses = ["completed", "done", "finished"];
    return finalStatuses.includes(status);
  }, []);

  const handleStreamMessage = useCallback(
    (event: MessageEvent) => {
      if (!event.data || event.data === ": ping") return;

      try {
        const parsed = JSON.parse(event.data);
        setLastEventTime(Date.now());
        updateProgressFromEvent(parsed);

        if (parsed?.meta?.risk_uuid && !riskUuid) {
          setRiskUuid(parsed.meta.risk_uuid);
        }

        if (parsed?.status === "inquiry_required") {
          handleInquiryRequired(parsed);
          return;
        }

        if (isFinalEvent(parsed)) {
          handleWorkflowComplete();
        }
      } catch (err) {
        console.error("Failed to parse workflow event", err);
      }
    },
    [handleInquiryRequired, handleWorkflowComplete, isFinalEvent, riskUuid, updateProgressFromEvent]
  );

  const openStream = useCallback(
    (id: string, resume = false) => {
      setIsResumeStream(resume);
      closeEventSource();
      lastStreamIdRef.current = id;
      setLastEventTime(Date.now());
      const stream = openWorkflowStream(id, handleStreamMessage, () => {
        setErrorMessage("Die Verbindung zum Workflow ist unterbrochen. Bitte versuche es erneut.");
        setIsLoading(false);
        closeEventSource();
      });
      eventSourceRef.current = stream;
    },
    [closeEventSource, handleStreamMessage]
  );

  const retryStreamConnection = useCallback(() => {
    const resumeId = riskUuid ? `workflow_resume_${riskUuid}` : null;
    const candidateId = isResumeStream ? resumeId : taskId;
    const idToUse = candidateId || lastStreamIdRef.current;

    if (!idToUse) {
      setStep("input");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    openStream(idToUse, idToUse.startsWith("workflow_resume_"));
  }, [isResumeStream, openStream, riskUuid, taskId]);

  useEffect(() => {
    return () => {
      closeEventSource();
    };
  }, [closeEventSource]);

  useEffect(() => {
    if (!open) {
      resetState();
      setStep("input");
    }
  }, [open, resetState]);

  useEffect(() => {
    if (step !== "loading") {
      setIsLoading(false);
    }
  }, [step]);

  useEffect(() => {
    if (step === "loading" && isResumeStream) {
      setAllowBackgroundClose(false);
      const interval = setInterval(() => {
        if (lastEventTime && Date.now() - lastEventTime > 90000) {
          setAllowBackgroundClose(true);
          setErrorMessage((prev) =>
            prev ?? "Die Analyse läuft weiter im Hintergrund. Du kannst das Fenster schließen und später zurückkehren."
          );
        }
      }, 5000);

      return () => clearInterval(interval);
    }

    setAllowBackgroundClose(false);
  }, [isResumeStream, lastEventTime, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    closeEventSource();

    const form = e.target as HTMLFormElement;
    const description = (form.elements.namedItem("risk-description") as HTMLTextAreaElement)?.value || initialRiskDescription;
    const startDate = (form.elements.namedItem("start-date") as HTMLInputElement)?.value || today;
    const endDate = (form.elements.namedItem("end-date") as HTMLInputElement)?.value || oneYearLaterStr;
    const insuranceValue = (form.elements.namedItem("insurance-value") as HTMLInputElement)?.value || "1000";

    setFormData({
      description,
      startDate,
      endDate,
      insuranceValue,
    });
    setRiskDescription(description);

    const item = getItemFromDescription(description);
    setDetectedItem(item);

    setIsLoading(true);
    setStep("loading");
    setCurrentPhaseIndex(0);
    setProgress(0);
    setCompletedPhases([]);
    setIsResumeStream(false);

    try {
      const response = await startWorkflow({
        initial_prompt: description,
        start_date: startDate,
        end_date: endDate,
        insurance_value: parseInt(insuranceValue, 10),
      });

      setTaskId(response.task_id);
      setRiskUuid(response.risk_uuid);

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const duration = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));

      const evaluatingRisk: Risk = {
        id: response.risk_uuid,
        title: item,
        category: getCategoryFromDescription(description),
        description,
        coverageAmount: parseInt(insuranceValue, 10),
        premium: 0,
        duration,
        status: "evaluating",
        createdBy: "Sie",
        createdByUserId: "u5",
        createdAt: new Date(),
        expiresAt: endDateObj,
        userRole: "giver",
        riskScore: 0,
        views: 0,
        favorites: 0,
      };

      setActiveRisk(evaluatingRisk);
      if (onRiskCreated) {
        onRiskCreated(evaluatingRisk);
      }

      openStream(response.task_id);
    } catch (err) {
      console.error("Failed to start workflow", err);
      setErrorMessage("Wir konnten den Workflow nicht starten. Bitte prüfe Deine Eingaben und versuche es erneut.");
      setIsLoading(false);
      setStep("input");
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    closeEventSource();

    if (!taskId || !riskUuid) {
      setErrorMessage("Es gab ein Problem mit dem Workflow. Bitte starte erneut.");
      setStep("input");
      return;
    }

    const trimmedResponses = inquiryResponses.map((resp) => resp.trim());
    if (trimmedResponses.some((resp) => resp.length === 0)) {
      setErrorMessage("Bitte beantworte alle Fragen, bevor Du fortfährst.");
      return;
    }

    try {
      const response = await sendInquiryResponse({
        task_id: taskId,
        risk_uuid: riskUuid,
        responses: trimmedResponses,
      });

      if (response.status === 401 || response.status === 403) {
        setPendingInquiryResponses(trimmedResponses);
        setErrorMessage("Login erforderlich, bitte melde Dich an.");
        setStep("auth");
        return;
      }

      if (!response.ok) {
        throw new Error("Inquiry submission failed");
      }

      setStep("loading");
      setIsLoading(true);
      setIsResumeStream(true);
      setCompletedPhases([]);
      setProgress(70);
      setPendingInquiryResponses([]);
      openStream(`workflow_resume_${riskUuid}`, true);
    } catch (err) {
      console.error("Failed to submit inquiries", err);
      setErrorMessage("Die Antworten konnten nicht gesendet werden. Bitte versuche es erneut.");
    }
  };

  const retryInquirySubmission = useCallback(async () => {
    if (!taskId || !riskUuid || pendingInquiryResponses.length === 0) return;

    try {
      const response = await sendInquiryResponse({
        task_id: taskId,
        risk_uuid: riskUuid,
        responses: pendingInquiryResponses,
      });

      if (response.status === 401 || response.status === 403) {
        setErrorMessage("Login erforderlich. Bitte erneut anmelden.");
        setStep("auth");
        return;
      }

      if (!response.ok) {
        setErrorMessage("Wir konnten die Antworten nach dem Login nicht senden. Bitte versuche es erneut.");
        return;
      }

      setStep("loading");
      setIsLoading(true);
      setIsResumeStream(true);
      setCompletedPhases([]);
      setProgress(70);
      setPendingInquiryResponses([]);
      openStream(`workflow_resume_${riskUuid}`, true);
    } catch (err) {
      console.error("Retry inquiry submission failed", err);
      setErrorMessage("Wir konnten die Antworten nach dem Login nicht senden. Bitte versuche es erneut.");
    }
  }, [openStream, pendingInquiryResponses, riskUuid, taskId]);

  const handleAuthLogin = (_email: string, _password: string) => {
    onLogin();
    retryInquirySubmission();
  };

  const handleAuthRegister = (_email: string, _password: string, _name: string) => {
    onLogin();
    retryInquirySubmission();
  };

  const handleClose = () => {
    closeEventSource();
    onClose();
  };

  // Render step 1: Input Form
  const renderInputForm = () => (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header with Step Number */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar
            sx={{
              bgcolor: "#ff671f",
              width: 40,
              height: 40,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            1
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
              Was möchtest Du absichern?
            </Typography>
            <Typography className="body-sm text-secondary">
              Erzähl uns von Deinem Anliegen
            </Typography>
          </Box>
        </Box>

        {/* Risikobeschreibung */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Dein Anliegen:
          </Typography>
          <TextField
            name="risk-description"
            id="risk-description"
            defaultValue={initialRiskDescription}
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

        {/* Date Fields Row */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box>
            <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
              Schutz ab:
            </Typography>
            <TextField
              type="date"
              name="start-date"
              id="start-date"
              defaultValue={today}
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
              defaultValue={oneYearLaterStr}
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

        {/* Versicherungswert */}
        <Box>
          <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
            Wert (EUR):
          </Typography>
          <TextField
            type="number"
            name="insurance-value"
            id="insurance-value"
            defaultValue="1000"
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

        {errorMessage && (
          <Typography color="error" className="body-sm">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </form>
  );

  // Render step 2: Loading with optimized UX
  const renderLoading = () => {
    const progressVariant: "determinate" | "indeterminate" =
      isResumeStream && progress < 80 ? "indeterminate" : "determinate";
    return (
      <Box sx={{ py: 4 }}>
        {/* Header with Icon */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              position: "relative",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Animated Ring */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "3px solid #f3f2f2",
                borderTopColor: "#ff671f",
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            {/* Icon */}
            <Avatar
              sx={{
                bgcolor: "#ff671f",
                width: 64,
                height: 64,
                boxShadow: "0 4px 16px rgba(255, 103, 31, 0.25)",
              }}
            >
              <Sparkles size={32} color="#ffffff" />
            </Avatar>
          </Box>
        </Box>

        {/* Progress Information */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography className="heading-3 text-primary" sx={{ mb: 1 }}>
            Einen Moment...
          </Typography>
          <Typography className="body-sm text-secondary">
            {progressVariant === "indeterminate"
              ? "Analyse läuft weiter, das kann einen Moment dauern..."
              : `${Math.round(progress)}% erledigt`}
          </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 6, px: 2 }}>
        <LinearProgress
            variant={progressVariant as any}
            value={progressVariant === "indeterminate" ? undefined : progress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: "#f3f2f2",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#ff671f",
                borderRadius: 1,
                transition: "transform 0.2s ease-out",
              },
            }}
          />
      </Box>

      {/* Phases List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2 }}>
        {loadingPhases.map((phase, index) => {
            const isCompleted = completedPhases.includes(phase.id);
            const isCurrent = index === currentPhaseIndex;
            const isPending = index > currentPhaseIndex;

            return (
              <Fade in={true} key={phase.id} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isCurrent ? "rgba(255, 103, 31, 0.08)" : "transparent",
                    border: isCurrent ? "1px solid rgba(255, 103, 31, 0.2)" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    transform: isCurrent ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Icon/Status */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isCompleted ? "#00a63e" : isCurrent ? "#ff671f" : "#f3f2f2",
                      color: isCompleted || isCurrent ? "#ffffff" : "#4f4a4a",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <Grow in={true}>
                        <Box sx={{ display: "flex" }}>
                          <CheckCircle2 size={24} />
                        </Box>
                      </Grow>
                    ) : (
                      phase.icon
                    )}
                  </Box>

                  {/* Text Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      className="body-base-medium"
                      sx={{
                        color: isCurrent ? "#ff671f" : isCompleted ? "#00a63e" : "#353131",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {phase.title}
                    </Typography>
                    <Typography
                      className="body-sm"
                      sx={{
                        color: isPending ? "#9ca3af" : "#4f4a4a",
                        opacity: isPending ? 0.6 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {phase.description}
                    </Typography>
                  </Box>

                  {/* Loading Spinner for Current Phase */}
                  {isCurrent && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid #f3f2f2",
                        borderTopColor: "#ff671f",
                        animation: "spin 0.8s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              </Fade>
            );
          })}
        </Box>

        {/* Bottom Info */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography className="body-sm text-secondary" sx={{ fontStyle: "italic" }}>
            Wir schauen, welche Details wir noch brauchen
          </Typography>
        </Box>

        {allowBackgroundClose && (
          <Box sx={{ mt: 3, textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography className="body-sm" sx={{ color: "#4f4a4a" }}>
              Die Analyse läuft weiter im Hintergrund. Du kannst das Fenster schließen und später wieder öffnen.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  closeEventSource();
                  setIsLoading(false);
                  onClose();
                  setTimeout(() => resetState(), 0);
                }}
              >
                Im Hintergrund weiterlaufen lassen
              </Button>
            </Box>
          </Box>
        )}

        {errorMessage && (
          <Box sx={{ mt: 2 }}>
            <Typography color="error" className="body-sm" textAlign="center">
              {errorMessage}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
              <Button variant="contained" size="small" onClick={retryStreamConnection}>
                Verbindung neu aufbauen
              </Button>
              <Button variant="text" size="small" onClick={() => setStep("input")}>Zurück zum Start</Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  // Render step 3: Questions
  const renderQuestions = () => (
    <form onSubmit={handleQuestionSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header with Step Number */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar
            sx={{
              bgcolor: "#ff671f",
              width: 40,
              height: 40,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            2
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography className="heading-3 text-primary" sx={{ mb: 0.5 }}>
              Noch ein paar Details
            </Typography>
            <Typography className="body-sm text-secondary">
              Damit wir Dein Anliegen richtig einschätzen können
            </Typography>
          </Box>
        </Box>

        {inquiries.length === 0 ? (
          <Typography className="body-base text-secondary">
            Wir laden gerade Deine Fragen. Bitte einen Moment Geduld.
          </Typography>
        ) : (
          inquiries.map((inquiry, index) => (
            <Box key={index}>
              <Typography className="body-base-medium text-primary" sx={{ mb: 1 }}>
                {inquiry.question}
              </Typography>
              <TextField
                name={`inquiry-${index}`}
                placeholder="Bitte antworte hier"
                value={inquiryResponses[index] || ""}
                onChange={(event) => {
                  const nextResponses = [...inquiryResponses];
                  nextResponses[index] = event.target.value;
                  setInquiryResponses(nextResponses);
                }}
                fullWidth
                multiline
                rows={Math.max(3, Math.ceil((inquiryResponses[index]?.length || 0) / 80))}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f3f2f2",
                    borderRadius: 1,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "16px",
                    color: "#353131",
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
                    fontSize: "16px",
                    "&::placeholder": {
                      color: "#4f4a4a",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          ))
        )}

        {errorMessage && (
          <Typography color="error" className="body-sm">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </form>
  );

  const getTitle = () => {
    if (step === "input") return "Du suchst Schutz";
    if (step === "loading") return "Einen Moment...";
    if (step === "auth") return "Fast geschafft";
    return "Noch ein paar Details";
  };

  const getSubtitle = () => {
    if (step === "input") return "Schritt 1 von 3";
    if (step === "loading") return "Wir prüfen Deine Angaben";
    if (step === "auth") return "Schritt 3 von 3";
    return "Schritt 2 von 3";
  };

  const getIcon = () => {
    if (step === "loading") return <Sparkles size={24} color="#e6e5e5" />;
    return <FileText size={24} color="#e6e5e5" />;
  };

  const actions = step !== "loading" && step !== "auth" ? (
    <>
      <Button
        onClick={handleClose}
        variant="outlined"
        sx={{
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          borderColor: "#e6e5e5",
          color: "#353131",
          "&:hover": {
            borderColor: "#353131",
            bgcolor: "transparent",
          },
        }}
      >
        Abbrechen
      </Button>
      <Button
        type="submit"
        variant="contained"
        onClick={(e) => {
          if (step === "input") {
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          } else if (step === "questions") {
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
          }
        }}
        sx={{
          bgcolor: "#ff671f",
          color: "#e6e5e5",
          textTransform: "none",
          fontFamily: "'Roboto', sans-serif",
          display: "flex",
          gap: 1,
          alignItems: "center",
          "&:hover": {
            bgcolor: "#ff671f",
            opacity: 0.9,
          },
        }}
      >
        {step === "input" ? (
          <>
            <Wand2 size={20} />
            Jetzt absichern
          </>
        ) : (
          "Anliegen erstellen"
        )}
      </Button>
    </>
  ) : undefined;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={getTitle()}
      subtitle={getSubtitle()}
      icon={getIcon()}
      actions={actions}
      maxWidth="md"
    >
      {step === "input" && renderInputForm()}
      {step === "loading" && renderLoading()}
      {step === "questions" && renderQuestions()}
      {step === "auth" && (
        <>
          {errorMessage && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" className="body-sm" textAlign="center">
                {errorMessage}
              </Typography>
            </Box>
          )}
          <AuthModal onLogin={handleAuthLogin} onRegister={handleAuthRegister} />
        </>
      )}
    </BaseModal>
  );
}