import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  bytesToFormatString,
  parseInputToBytes,
  isValidSeparator,
} from "@/utils/ByteArrayToStringUtils";
import { useState, useCallback, useRef } from "react";

interface SendHIDPanelProps {
  device: HIDDevice | null;
  sendData: (
    device: HIDDevice,
    reportId: number,
    data: Uint8Array,
  ) => Promise<boolean>;
}

// Default separator
const DEFAULT_SEPARATOR = " ";

export default function SendHIDPanel({
  device,
  sendData: doSendData,
}: SendHIDPanelProps) {
  const [reportId, setReportId] = useState("");
  const [inputData, setInputData] = useState("");
  const [inputFormat, setInputFormat] = useState<"hex" | "dex">("hex");
  const [separator, setSeparator] = useState(DEFAULT_SEPARATOR);
  const [separatorError, setSeparatorError] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Ref to track if we're currently converting to avoid circular updates
  const isConvertingRef = useRef(false);

  /**
   * Get effective separator (use default if empty)
   */
  const getEffectiveSeparator = useCallback((sep: string): string => {
    return sep || DEFAULT_SEPARATOR;
  }, []);

  /**
   * Parse report ID based on format
   */
  const parseReportId = useCallback((value: string, format: "hex" | "dex"): number => {
    if (!value.trim()) return NaN;
    
    if (format === "hex") {
      // Remove 0x prefix if present and parse as hex
      const cleanHex = value.replace(/^0x/i, "");
      return parseInt(cleanHex, 16);
    } else {
      return parseInt(value, 10);
    }
  }, []);

  /**
   * Format report ID for display
   */
  const formatReportId = useCallback((value: string, format: "hex" | "dex"): string => {
    if (!value.trim()) return "";
    
    const num = parseReportId(value, format === "hex" ? "dex" : "hex");
    if (isNaN(num)) return value;
    
    if (format === "hex") {
      return num.toString(16).toUpperCase();
    } else {
      return num.toString(10);
    }
  }, [parseReportId]);

  /**
   * Handle report ID input change
   */
  const handleReportIdChange = useCallback((value: string) => {
    if (inputFormat === "hex") {
      // Hex mode: only allow hex characters
      const cleanHex = value.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
      setReportId(cleanHex);
    } else {
      // Decimal mode: only allow digits
      const cleanDec = value.replace(/[^0-9]/g, "");
      setReportId(cleanDec);
    }
  }, [inputFormat]);

  /**
   * Convert current input data to the new format
   */
  const convertDataToFormat = useCallback(
    (currentData: string, fromFormat: "hex" | "dex", toFormat: "hex" | "dex", sep: string): string => {
      if (!currentData.trim()) return "";

      const effectiveSep = getEffectiveSeparator(sep);
      
      // Parse current data to bytes
      const bytes = parseInputToBytes(currentData, fromFormat, effectiveSep);
      if (bytes.length === 0) return currentData; // Return original if parsing fails

      // Convert bytes to new format
      return bytesToFormatString(bytes, toFormat, effectiveSep);
    },
    [getEffectiveSeparator],
  );

  /**
   * Handle format change - convert existing data to new format
   */
  const handleFormatChange = useCallback(
    (newFormat: string) => {
      if (newFormat !== "hex" && newFormat !== "dex") return;

      isConvertingRef.current = true;

      // Convert report ID to new format
      const convertedReportId = formatReportId(reportId, newFormat as "hex" | "dex");
      setReportId(convertedReportId);

      // Convert existing data to new format
      const convertedData = convertDataToFormat(
        inputData,
        inputFormat,
        newFormat as "hex" | "dex",
        separator,
      );
      setInputData(convertedData);
      setInputFormat(newFormat as "hex" | "dex");

      setTimeout(() => {
        isConvertingRef.current = false;
      }, 0);
    },
    [inputData, inputFormat, separator, reportId, convertDataToFormat, formatReportId],
  );

  /**
   * Handle input change with auto-formatting
   */
  const handleInputChange = useCallback(
    (str: string) => {
      if (isConvertingRef.current) {
        setInputData(str);
        return;
      }

      const effectiveSep = getEffectiveSeparator(separator);

      if (inputFormat === "hex") {
        // Hex mode: auto-add separator after every 2 characters
        const raw = str.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
        let withSeparators = "";
        for (let i = 0; i < raw.length; i++) {
          if (i > 0 && i % 2 === 0) {
            withSeparators += effectiveSep;
          }
          withSeparators += raw[i];
        }
        setInputData(withSeparators);
      } else {
        // Decimal mode: allow manual input of separator
        // Only filter out invalid characters (non-digit, non-separator)
        const escapedSep = effectiveSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`[^0-9${escapedSep}]`, "g");
        const cleaned = str.replace(regex, "");
        
        // Parse numbers and clamp them to 0-255
        const parts = cleaned.split(effectiveSep);
        const clampedParts = parts.map(part => {
          if (!part.trim()) return part; // Keep empty parts (for manual separator typing)
          const num = parseInt(part, 10);
          if (isNaN(num)) return part;
          // Clamp to 0-255
          if (num < 0) return "0";
          if (num > 255) return "255";
          return part;
        });
        
        setInputData(clampedParts.join(effectiveSep));
      }
    },
    [inputFormat, separator, getEffectiveSeparator],
  );

  /**
   * Handle separator change - validate and reformat existing data
   */
  const handleSeparatorChange = useCallback(
    (newSeparator: string) => {
      // Allow empty string (will use default)
      const char = newSeparator;
      
      // Validate: cannot be 0-9 or A-F
      if (char && !isValidSeparator(char)) {
        setSeparatorError(true);
        return;
      }
      
      setSeparatorError(false);
      
      if (char === separator) return;

      isConvertingRef.current = true;

      const oldEffectiveSep = getEffectiveSeparator(separator);
      const newEffectiveSep = getEffectiveSeparator(char);

      // Parse current data to bytes using old separator
      const bytes = parseInputToBytes(inputData, inputFormat, oldEffectiveSep);

      // Reformat with new separator
      if (bytes.length > 0) {
        const reformatted = bytesToFormatString(bytes, inputFormat, newEffectiveSep);
        setInputData(reformatted);
      }

      setSeparator(char);

      setTimeout(() => {
        isConvertingRef.current = false;
      }, 0);
    },
    [inputData, inputFormat, separator, getEffectiveSeparator],
  );

  const handleSend = async () => {
    if (!device) {
      setMessage({ type: "err", text: "Connect to device first" });
      return;
    }
    
    const rid = parseReportId(reportId, inputFormat);
    if (isNaN(rid) || rid < 0 || rid > 255) {
      setMessage({ type: "err", text: "Report ID must be between 0 and 255" });
      return;
    }

    const effectiveSep = getEffectiveSeparator(separator);
    const data = parseInputToBytes(inputData, inputFormat, effectiveSep);
    if (data.length === 0 && inputData.trim() !== "") {
      setMessage({
        type: "err",
        text: `Invalid ${inputFormat === "hex" ? "hex" : "decimal"} data`,
      });
      return;
    }

    setSending(true);
    setMessage(null);
    try {
      const ok = await doSendData(device, rid, data);
      setMessage(
        ok ? { type: "ok", text: "Sent successfully" } : { type: "err", text: "Send Error" },
      );
    } catch {
      setMessage({ type: "err", text: "Send Error" });
    } finally {
      setSending(false);
    }
  };

  const effectiveSep = getEffectiveSeparator(separator);

  return (
    <div className="space-y-5">
      {/* Header with Report ID */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-foreground">Send HID Data</h2>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Report ID
          </Label>
          <Input
            value={reportId}
            onChange={(e) => handleReportIdChange(e.target.value)}
            placeholder={inputFormat === "hex" ? "1A" : "26"}
            className="w-24 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      {/* Data Input */}
      <div className="space-y-2">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {inputFormat === "hex" ? "Hex Data" : "Decimal Data"}
        </Label>
        <textarea
          value={inputData}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={
            inputFormat === "hex"
              ? `01${effectiveSep}02${effectiveSep}FF (auto${effectiveSep}added)`
              : `1${effectiveSep}2${effectiveSep}255 (auto${effectiveSep}clamped${effectiveSep}0-255)`
          }
          rows={4}
          className="w-full resize-y rounded-xl border border-border/50 bg-background px-4 py-3 font-mono text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="text-xs text-muted-foreground">
          {inputFormat === "hex"
            ? "Hexadecimal: 00 - FF (auto-formatted with separator)"
            : "Decimal: values automatically clamped to 0-255 range"}
        </p>
      </div>

      {/* Footer with Format, Separator and Send Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Format Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Format
            </Label>
            <Tabs value={inputFormat} onValueChange={handleFormatChange}>
              <TabsList className="h-8 rounded-full bg-muted/50">
                <TabsTrigger value="hex" className="rounded-full px-4 text-xs">
                  Hex
                </TabsTrigger>
                <TabsTrigger value="dex" className="rounded-full px-4 text-xs">
                  Dec
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Separator Input */}
          <div className="flex items-center gap-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Separator
            </Label>
            <Input
              className={`h-8 w-16 rounded-lg text-center text-sm font-mono ${
                separatorError ? "border-destructive focus:border-destructive" : ""
              }`}
              value={separator}
              placeholder="space"
              onChange={(e) => handleSeparatorChange(e.target.value)}
            />
          </div>
        </div>

        {/* Send Button and Message */}
        <div className="flex items-center gap-4">
          {message && (
            <span
              className={`text-sm font-medium ${
                message.type === "ok"
                  ? "text-green-600 dark:text-green-400"
                  : "text-destructive"
              }`}
            >
              {message.text}
            </span>
          )}
          <Button
            onClick={handleSend}
            disabled={!device || sending}
            className="rounded-full px-6"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
      
      {separatorError && (
        <p className="text-xs text-destructive">
          Separator cannot be 0-9 or A-F
        </p>
      )}
    </div>
  );
}
