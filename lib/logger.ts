type Meta = Record<string, unknown>;

function write(level: "INFO" | "WARN" | "ERROR", message: string, meta?: Meta) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ?? {})
  };

  // Keep logs structured for ingestion stage tracing.
  console[level === "ERROR" ? "error" : level === "WARN" ? "warn" : "log"](JSON.stringify(payload));
}

export const logger = {
  info: (message: string, meta?: Meta) => write("INFO", message, meta),
  warn: (message: string, meta?: Meta) => write("WARN", message, meta),
  error: (message: string, meta?: Meta) => write("ERROR", message, meta)
};
