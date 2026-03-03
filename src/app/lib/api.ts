export type ApiErrorPayload = {
  error: string;
};

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (res.ok) {
    return (await res.json()) as T;
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  const message =
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as any).error === "string"
      ? (payload as any).error
      : `Request failed (${res.status})`;

  throw new Error(message);
}
