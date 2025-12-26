export interface StartWorkflowPayload {
  initial_prompt: string;
  start_date: string;
  end_date: string;
  insurance_value: number;
}

export interface InquiryResponsePayload {
  task_id: string;
  risk_uuid: string;
  responses: string[];
}

// Prefer keeping calls same-origin (BASE="" with a proxy) to preserve cookies/CORS.
// If you set BASE, point it to your own reverse proxy rather than xrisk.info directly.
const BASE = import.meta.env.VITE_XRISK_BASE_URL?.replace(/\/$/, "") ?? "";

const buildUrl = (path: string) => `${BASE}${path}`;

export async function startWorkflow(payload: StartWorkflowPayload) {
  const response = await fetch(buildUrl("/workflow/start"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to start workflow");
  }

  return response.json();
}

export async function sendInquiryResponse(payload: InquiryResponsePayload) {
  return fetch(buildUrl("/workflow/inquiry-response"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}

export function openWorkflowStream(taskId: string, onMessage: (event: MessageEvent) => void, onError: (event: Event) => void) {
  const stream = new EventSource(buildUrl(`/workflow/stream/${taskId}`), { withCredentials: true });
  stream.onmessage = onMessage;
  stream.onerror = onError;
  return stream;
}
