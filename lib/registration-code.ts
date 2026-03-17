export function createRegistrationCode(id: number) {
  return `SGVP-2026-${String(id).padStart(6, "0")}`;
}
