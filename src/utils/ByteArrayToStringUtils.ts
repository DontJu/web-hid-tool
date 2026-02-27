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

/**
 * Clamp a number to the range [0, 255]
 */
function clampToByte(value: number): number {
  return Math.max(0, Math.min(255, value));
}

/**
 * Parse decimal string to Uint8Array
 * Supports various separators (space, comma, etc.)
 * Each number is automatically clamped to 0-255 range
 */
export function decimalStringToBytes(decimal: string, separator: string = " "): Uint8Array {
  // Use default space if separator is empty
  const effectiveSeparator = separator || " ";
  
  // Split by separator, filter empty strings
  const parts = decimal
    .split(effectiveSeparator)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  if (parts.length === 0) {
    return new Uint8Array(0);
  }
  
  const bytes: number[] = [];
  for (const part of parts) {
    const num = parseInt(part, 10);
    // Clamp to valid byte range 0-255
    if (!isNaN(num)) {
      bytes.push(clampToByte(num));
    }
  }
  
  return new Uint8Array(bytes);
}

/**
 * Convert bytes to formatted string based on format type
 */
export function bytesToFormatString(
  bytes: Uint8Array,
  format: 'hex' | 'dex',
  separator: string = " "
): string {
  // Use default space if separator is empty
  const effectiveSeparator = separator || " ";
  
  if (format === 'hex') {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join(effectiveSeparator);
  } else {
    return Array.from(bytes, (b) => b.toString(10)).join(effectiveSeparator);
  }
}

/**
 * Parse input string to bytes based on format type
 */
export function parseInputToBytes(
  input: string,
  format: 'hex' | 'dex',
  separator: string = " "
): Uint8Array {
  if (format === 'hex') {
    return hexStringToBytes(input);
  } else {
    return decimalStringToBytes(input, separator);
  }
}

/**
 * Check if a character is valid for separator (not a digit or hex letter)
 */
export function isValidSeparator(char: string): boolean {
  if (char.length !== 1) return false;
  // Cannot be 0-9 or A-F (case insensitive)
  return !/^[0-9a-fA-F]$/.test(char);
}
