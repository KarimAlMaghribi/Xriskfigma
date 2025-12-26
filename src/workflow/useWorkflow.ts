import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  Inquiry,
  WorkflowAction,
  WorkflowEvent,
  WorkflowPhase,
  WorkflowStartPayload,
  WorkflowState,
  WorkflowStreamHandle,
} from "./workflowTypes";
import { openResumeStream, openStream, startWorkflow, submitInquiries } from "./workflowClient";

const initialState: WorkflowState = {
  phase: WorkflowPhase.IDLE,
  taskId: undefined,
  riskUuid: undefined,
  inquiries: [],
  pendingResponses: [],
  progressStep: undefined,
  eventsLog: [],
  error: undefined,
  initialInput: undefined,
  lastStatus: undefined,
};

function reducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "START_REQUEST":
      return {
        ...initialState,
        phase: WorkflowPhase.STARTING,
        initialInput: action.payload.input,
      };
    case "START_SUCCESS": {
      const nextEvents = action.payload.event
        ? [...state.eventsLog, action.payload.event].slice(-10)
        : state.eventsLog;

      return {
        ...state,
        phase: WorkflowPhase.STREAMING,
        taskId: action.payload.taskId,
        riskUuid: action.payload.riskUuid,
        eventsLog: nextEvents,
      };
    }
    case "START_FAILURE":
      return {
        ...state,
        phase: WorkflowPhase.ERROR,
        error: action.payload.error,
      };
    case "STREAM_EVENT_RECEIVED": {
      const { event } = action.payload;
      const nextEvents = [...state.eventsLog, event].slice(-10);
      return {
        ...state,
        eventsLog: nextEvents,
        progressStep: event.meta?.step ?? state.progressStep,
        riskUuid: event.meta?.risk_uuid ?? state.riskUuid,
        lastStatus: event.status ?? state.lastStatus,
      };
    }
    case "INQUIRY_SET":
      return {
        ...state,
        phase: WorkflowPhase.INQUIRY,
        inquiries: action.payload.inquiries,
        pendingResponses: action.payload.inquiries.map((inquiry) => inquiry.response ?? ""),
        riskUuid: action.payload.riskUuid ?? state.riskUuid,
      };
    case "AUTH_REQUIRED":
      return {
        ...state,
        phase: WorkflowPhase.AUTH_REQUIRED,
        pendingResponses: action.payload.responses,
        error: action.payload.error,
      };
    case "RESUME_START":
      return {
        ...state,
        phase: WorkflowPhase.RESUMING,
        error: undefined,
      };
    case "DONE":
      return {
        ...state,
        phase: WorkflowPhase.DONE,
      };
    case "ERROR":
      return {
        ...state,
        phase: WorkflowPhase.ERROR,
        error: action.payload.error,
      };
    case "RESET":
      return {
        ...initialState,
      };
    case "UPDATE_PENDING_RESPONSES":
      return {
        ...state,
        pendingResponses: action.payload.responses,
      };
    default:
      return state;
  }
}

function hasInquiryResponses(inquiries: Inquiry[], responses: string[]): boolean {
  if (!inquiries.length) return false;
  return inquiries.every((_, index) => responses[index] && responses[index].trim() !== "");
}

export function useWorkflow() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const streamRef = useRef<WorkflowStreamHandle | null>(null);

  const closeStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }
  }, []);

  const handleStreamError = useCallback(
    (error: Event | MessageEvent | Error) => {
      console.error("Workflow stream error", error);
      closeStream();
      dispatch({ type: "ERROR", payload: { error: "Stream unterbrochen" } });
    },
    [closeStream],
  );

  const handleStreamEvent = useCallback(
    (event: WorkflowEvent) => {
      dispatch({ type: "STREAM_EVENT_RECEIVED", payload: { event } });

      if (event.status === "inquiry_required" && event.meta?.inquiries) {
        closeStream();
        dispatch({
          type: "INQUIRY_SET",
          payload: { inquiries: event.meta.inquiries, riskUuid: event.meta.risk_uuid },
        });
        return;
      }

      if (event.status === "completed") {
        closeStream();
        dispatch({ type: "DONE" });
        return;
      }

      if (event.status === "error") {
        closeStream();
        dispatch({ type: "ERROR", payload: { error: "Workflow fehlgeschlagen" } });
      }
    },
    [closeStream],
  );

  const openInitialStream = useCallback(
    (taskId: string) => {
      closeStream();
      streamRef.current = openStream(taskId, handleStreamEvent, handleStreamError);
    },
    [closeStream, handleStreamError, handleStreamEvent],
  );

  const openResume = useCallback(
    (riskUuid: string) => {
      closeStream();
      dispatch({ type: "RESUME_START" });
      streamRef.current = openResumeStream(riskUuid, handleStreamEvent, handleStreamError);
    },
    [closeStream, handleStreamError, handleStreamEvent],
  );

  const start = useCallback(
    async (input: WorkflowStartPayload) => {
      dispatch({ type: "START_REQUEST", payload: { input } });
      closeStream();

      try {
        const response = await startWorkflow(input);
        dispatch({
          type: "START_SUCCESS",
          payload: { taskId: response.task_id, riskUuid: response.risk_uuid },
        });
        openInitialStream(response.task_id);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        dispatch({ type: "START_FAILURE", payload: { error: message } });
      }
    },
    [closeStream, openInitialStream],
  );

  const submitResponses = useCallback(
    async (responses?: string[]) => {
      const effectiveResponses = responses ?? state.pendingResponses;
      const { taskId, riskUuid } = state;

      if (!taskId || !riskUuid) {
        dispatch({ type: "ERROR", payload: { error: "Task oder Risiko unbekannt" } });
        return;
      }

      if (!hasInquiryResponses(state.inquiries, effectiveResponses)) {
        dispatch({ type: "ERROR", payload: { error: "Bitte alle Fragen beantworten" } });
        return;
      }

      dispatch({ type: "UPDATE_PENDING_RESPONSES", payload: { responses: effectiveResponses } });

      try {
        await submitInquiries({ task_id: taskId, risk_uuid: riskUuid, responses: effectiveResponses });
        openResume(riskUuid);
      } catch (error) {
        if (error instanceof Error && error.message === "AUTH_REQUIRED") {
          dispatch({ type: "AUTH_REQUIRED", payload: { responses: effectiveResponses } });
          return;
        }

        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        dispatch({ type: "ERROR", payload: { error: message } });
      }
    },
    [openResume, state],
  );

  const resumeAfterAuth = useCallback(async () => {
    if (!state.pendingResponses.length) {
      if (state.riskUuid) {
        openResume(state.riskUuid);
      }
      return;
    }

    await submitResponses(state.pendingResponses);
  }, [openResume, state.pendingResponses, state.riskUuid, submitResponses]);

  const reset = useCallback(() => {
    closeStream();
    dispatch({ type: "RESET" });
  }, [closeStream]);

  const requireAuth = useCallback(
    (responses: string[], errorMessage?: string) => {
      dispatch({ type: "AUTH_REQUIRED", payload: { responses, error: errorMessage } });
    },
    [],
  );

  useEffect(() => {
    return () => {
      closeStream();
    };
  }, [closeStream]);

  return {
    state,
    startWorkflow: start,
    submitInquiryResponses: submitResponses,
    resumeAfterAuth,
    updateResponses: (responses: string[]) =>
      dispatch({ type: "UPDATE_PENDING_RESPONSES", payload: { responses } }),
    requireAuth,
    reset,
  };
}
