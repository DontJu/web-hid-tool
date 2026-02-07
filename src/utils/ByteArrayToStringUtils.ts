/** Normalize various inputs to Uint8Array; DataView uses getUint8 per-byte copy to avoid misreads or shared buffer issues */
function toUint8Array(data: Uint8Array | number[] | DataView): Uint8Array {
  if (data instanceof DataView) {
    const out = new Uint8Array(data.byteLength);
    for (let i = 0; i < data.byteLength; i++) {
      out[i] = data.getUint8(i);
    }
    return out;
  }
  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }
  return data;
}

export function toHexString(
  data: Uint8Array | number[] | DataView,
  separator: string = ", ",
): string {
  const dataArray = toUint8Array(data);
  return Array.from(
    dataArray,
    (b) => "0x" + b.toString(16).padStart(2, "0").toUpperCase(),
  ).join(separator);
}

export function toDexString(
  data: Uint8Array | number[] | DataView,
  separator: string = ", ",
): string {
  const dataArray = toUint8Array(data);
  return Array.from(dataArray, (item) => item.toString(10)).join(separator);
}

export function hexStringToBytes(hex: string): Uint8Array {
  const normalized = hex.replace(/0x|[\s,]/gi, "").toLowerCase();
  if (!/^[0-9a-f]*$/.test(normalized) || normalized.length % 2 !== 0) {
    return new Uint8Array(0);
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
