/** 将多种输入统一为 Uint8Array；DataView 使用 getUint8 逐字节复制，避免错读或共享 buffer 问题 */
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
  spliter: string = ", ",
): string {
  const dataArray = toUint8Array(data);
  return Array.from(
    dataArray,
    (b) => "0x" + b.toString(16).padStart(2, "0").toUpperCase(),
  ).join(spliter);
}

export function toDexString(
  data: Uint8Array | number[] | DataView,
  spliter: string = ", ",
): string {
  const dataArray = toUint8Array(data);
  return Array.from(dataArray, (item) => item.toString(10)).join(spliter);
}

/** 将十六进制字符串解析为 Uint8Array，支持 "01 02 ff"、"0102ff"、"0x01 0x02" 等格式 */
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
