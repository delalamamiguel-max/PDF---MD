export type InviteConsumableInput = {
  invitedEmail: string | null;
  emailAttempt: string;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
};

export function isInviteConsumable(input: InviteConsumableInput) {
  if (input.usedAt || input.revokedAt) {
    return false;
  }

  if (new Date(input.expiresAt).getTime() <= Date.now()) {
    return false;
  }

  if (input.invitedEmail && input.invitedEmail.toLowerCase() !== input.emailAttempt.toLowerCase()) {
    return false;
  }

  return true;
}
