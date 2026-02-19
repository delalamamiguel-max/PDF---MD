import crypto from "node:crypto";

export function generateOpaqueToken(size = 32) {
  return crypto.randomBytes(size).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashIp(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
