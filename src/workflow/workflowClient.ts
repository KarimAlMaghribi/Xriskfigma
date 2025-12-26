import { WorkflowEvent, WorkflowStartPayload, WorkflowStreamHandle } from "./workflowTypes";

type EventCallback = (event: WorkflowEvent) => void;

type ErrorCallback = (error: Event | MessageEvent | Error) => void;

function parseEventData(data: string): WorkflowEvent | null {
  if (!data || data.trim() === "" || data.trim() === ": ping" || data.trim() === "ping") {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn("Failed to parse workflow event", { data, error });
    return null;
  }
}

function openEventSource(url: string, onEvent: EventCallback, onError: ErrorCallback): WorkflowStreamHandle {
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onmessage = (event) => {
    const parsed = parseEventData(event.data);
    if (parsed) {
      onEvent(parsed);
    }
  };

  eventSource.onerror = (error) => {
    eventSource.close();
    onError(error);
  };

  return {
    close: () => eventSource.close(),
  };
}

export async function startWorkflow(payload: WorkflowStartPayload): Promise<{ task_id: string; risk_uuid: string }> {
  const response = await fetch("/workflow/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to start workflow (${response.status})`);
  }

  return response.json();
}

export async function submitInquiries(payload: {
  task_id: string;
  risk_uuid: string;
  responses: string[];
}): Promise<void> {
  const response = await fetch("/workflow/inquiry-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to submit inquiries (${response.status})`);
  }
}

export function openStream(taskId: string, onEvent: EventCallback, onError: ErrorCallback): WorkflowStreamHandle {
  return openEventSource(`/workflow/stream/${taskId}`, onEvent, onError);
}

export function openResumeStream(riskUuid: string, onEvent: EventCallback, onError: ErrorCallback): WorkflowStreamHandle {
  return openEventSource(`/workflow/stream/workflow_resume_${riskUuid}`, onEvent, onError);
}
