/** Holds the reset recovery token between Verify code and Reset password (memory only). */

let pendingToken: string | undefined;

export const recoveryTokenHolder = {
  clear(): void {
    pendingToken = undefined;
  },
  get(): string | undefined {
    return pendingToken;
  },
  set(token: string): void {
    pendingToken = token;
  },
};
