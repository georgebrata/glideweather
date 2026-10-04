export type WeatherErrorCode =
  | "configuration"
  | "authentication"
  | "rate_limit"
  | "timeout"
  | "network"
  | "http"
  | "invalid_response";

export type WeatherProviderId = "meteoblue" | "open-meteo";

export class WeatherProviderError extends Error {
  readonly provider: WeatherProviderId;
  readonly code: WeatherErrorCode;
  readonly retryable: boolean;
  readonly status?: number;

  constructor(
    provider: WeatherProviderId,
    code: WeatherErrorCode,
    message: string,
    options?: { retryable?: boolean; status?: number; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "WeatherProviderError";
    this.provider = provider;
    this.code = code;
    this.retryable = options?.retryable ?? true;
    this.status = options?.status;
  }
}

export function logWeatherRequest(entry: {
  provider: WeatherProviderId;
  fallback: boolean;
  fallbackReason?: WeatherErrorCode;
  durationMs: number;
  status?: number;
  latitude: number;
  longitude: number;
  kind: "current" | "day";
}) {
  const payload = {
    event: "weather.request",
    provider: entry.provider,
    fallback: entry.fallback,
    fallbackReason: entry.fallbackReason ?? null,
    durationMs: entry.durationMs,
    status: entry.status ?? null,
    lat: Math.round(entry.latitude * 1000) / 1000,
    lon: Math.round(entry.longitude * 1000) / 1000,
    kind: entry.kind,
  };
  console.info(JSON.stringify(payload));
}
