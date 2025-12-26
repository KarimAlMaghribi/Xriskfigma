export interface Inquiry {
  question: string;
  response: string | null;
}

export interface WorkflowStartPayload {
  initial_prompt: string;
  start_date: string;
  end_date: string;
  insurance_value: number;
}

export interface WorkflowEventMeta {
  risk_uuid?: string;
  inquiries?: Inquiry[];
  step?: string;
  [key: string]: unknown;
}

export interface WorkflowEvent {
  task_id?: string;
  status?: string;
  meta?: WorkflowEventMeta;
  connected?: boolean;
  error?: string;
}

export enum WorkflowPhase {
  IDLE = "IDLE",
  STARTING = "STARTING",
  STREAMING = "STREAMING",
  INQUIRY = "INQUIRY",
  AUTH_REQUIRED = "AUTH_REQUIRED",
  RESUMING = "RESUMING",
  DONE = "DONE",
  ERROR = "ERROR",
}

export interface WorkflowState {
  phase: WorkflowPhase;
  taskId?: string;
  riskUuid?: string;
  inquiries: Inquiry[];
  pendingResponses: string[];
  progressStep?: string;
  eventsLog: WorkflowEvent[];
  error?: string;
  initialInput?: WorkflowStartPayload;
  lastStatus?: string;
}

export type WorkflowAction =
  | { type: "START_REQUEST"; payload: { input: WorkflowStartPayload } }
  | {
      type: "START_SUCCESS";
      payload: { taskId: string; riskUuid: string; event?: WorkflowEvent };
    }
  | { type: "START_FAILURE"; payload: { error: string } }
  | { type: "STREAM_EVENT_RECEIVED"; payload: { event: WorkflowEvent } }
  | { type: "INQUIRY_SET"; payload: { inquiries: Inquiry[]; riskUuid?: string } }
  | { type: "AUTH_REQUIRED"; payload: { responses: string[]; error?: string } }
  | { type: "RESUME_START" }
  | { type: "DONE" }
  | { type: "ERROR"; payload: { error: string } }
  | { type: "RESET" }
  | { type: "UPDATE_PENDING_RESPONSES"; payload: { responses: string[] } };

export interface WorkflowStreamHandle {
  close: () => void;
}
