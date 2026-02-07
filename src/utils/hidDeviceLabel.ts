import { formatHex16 } from "./HexUtils";

export function getHIDDeviceInterfaceLabel(device: HIDDevice): string {
  const collections = device.collections ?? [];
  if (collections.length === 0) return "Interface 0";

  const parts: string[] = [];
  for (const c of collections) {
    const type = c.type ?? 0;
    const page = c.usagePage ?? 0;
    const usage = c.usage ?? 0;
    const key = `Usage Page: ${formatHex16(page)} /Type: ${formatHex16(type)} / Usage: ${formatHex16(usage)}`;
    parts.push(key);
  }
  return parts.join(", ");
}
