interface HIDDeviceInfoProps {
  device: HIDDevice | null;
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatHex16 } from "@/utils/HexUitls";

export default function HIDDeviceInfo({ device }: HIDDeviceInfoProps) {
  if (!device) {
    return (
      <div className="rounded border border-border bg-muted/30 p-4 text-muted-foreground text-sm"></div>
    );
  }

  const collections = device.collections ?? [];

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>Device Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm pb-3 pl-2 pr-2">
          <Label className="text-muted-foreground">product name</Label>
          <div className="font-mono">{device.productName || "—"}</div>
          <Label className="text-muted-foreground">vid</Label>
          <div className="font-mono">{formatHex16(device.vendorId)}</div>
          <Label className="text-muted-foreground">pid</Label>
          <div className="font-mono">{formatHex16(device.productId)}</div>
        </div>
        {collections.length > 0 && (
          <Table className="w-full min-w-[280px] table-fixed text-xs bg-stone-50">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Usage Page</TableHead>
                <TableHead className="w-[15%]">Usage</TableHead>
                <TableHead className="w-[15%]">Type</TableHead>
                <TableHead className="w-[35%]">Report ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((c, i) => {
                const inputIds =
                  c.inputReports?.map((r) => r.reportId ?? 0) ?? [];
                const outputIds =
                  c.outputReports?.map((r) => r.reportId ?? 0) ?? [];
                const ids = [...new Set([...inputIds, ...outputIds])];
                return (
                  <TableRow key={i}>
                    <TableCell>{formatHex16(c.usagePage ?? 0)}</TableCell>
                    <TableCell>{formatHex16(c.usage ?? 0)}</TableCell>
                    <TableCell>{c.type ?? "—"}</TableCell>
                    <TableCell>{ids.length ? ids.join(", ") : "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
