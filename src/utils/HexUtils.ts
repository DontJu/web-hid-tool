export function formatHex16(n: number): string {
  return "0x" + n.toString(16).padStart(4, "0").toUpperCase();
}
