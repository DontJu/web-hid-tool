import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hexStringToBytes } from "@/utils/ByteArrayToStringUtils";
import { useState } from "react";

interface SendHIDPanelProps {
  device: HIDDevice | null;
  sendData: (
    device: HIDDevice,
    reportId: number,
    data: Uint8Array,
  ) => Promise<boolean>;
}

export default function SendHIDPanel({
  device,
  sendData: doSendData,
}: SendHIDPanelProps) {
  const [reportId, setReportId] = useState("");
  const [hexData, setHexData] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const changeHexData = (str: string) => {
    const raw = str.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    const withSpaces = raw.replace(/(.{2})/g, "$1 ").trim();
    setHexData(withSpaces);
  };

  const handleSend = async () => {
    if (!device) {
      setMessage({ type: "err", text: "Connect to device first" });
      return;
    }
    const rid = Number(reportId);
    if (Number.isNaN(rid) || rid < 0 || rid > 255) {
      setMessage({ type: "err", text: "Report ID must be between 0 and 255" });
      return;
    }
    const data = hexStringToBytes(hexData);
    if (data.length === 0 && hexData.trim() !== "") {
      setMessage({ type: "err", text: "Invalid hex: must be an even number of hex digits" });
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      const ok = await doSendData(device, rid, data);
      setMessage(
        ok
          ? { type: "ok", text: "" }
          : { type: "err", text: "Send Error" },
      );
    } catch {
      setMessage({ type: "err", text: "Send Error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>Send HID Data</CardTitle>
        <CardAction>
          <div className="flex flex-row items-center gap-2">
            <Label className="text-sm text-muted-foreground">Report ID</Label>
            <Input
              value={reportId}
              onChange={(e) => {
                setReportId(e.target.value);
              }}
              placeholder="e.g. 1 or 0x01"
              className="rounded border border-input bg-background px-2 py-1.5 font-mono text-sm w-45"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-row gap-3">
        <div className="flex flex-1 flex-col">
          <textarea
            value={hexData}
            onChange={(e) => changeHexData(e.target.value)}
            placeholder="01 02 FF (spaces auto-added)"
            rows={3}
            className="rounded border border-input bg-background px-2 py-1.5 font-mono text-sm resize-y"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex items-center gap-2">
          
          {message && (
            <span
              className={
                message.type === "ok"
                  ? "text-green-600 dark:text-green-400"
                  : "text-destructive"
              }
            >
              {message.text}
            </span>
          )}
          <Button onClick={handleSend} disabled={!device || sending}>
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
