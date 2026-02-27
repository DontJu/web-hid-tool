interface HIDDeviceInfoProps {
  device: HIDDevice | null;
}

import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatHex16 } from "@/utils/HexUtils";

export default function HIDDeviceInfo({ device }: HIDDeviceInfoProps) {
  if (!device) {
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
        No device selected
      </div>
    );
  }

  const collections = device.collections ?? [];

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Device Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Name</Label>
          <div className="font-mono text-sm text-foreground">{device.productName || "—"}</div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vendor ID</Label>
          <div className="font-mono text-sm text-foreground">{formatHex16(device.vendorId)}</div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product ID</Label>
          <div className="font-mono text-sm text-foreground">{formatHex16(device.productId)}</div>
        </div>
      </div>
      
      {collections.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Collections</h3>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table className="w-full table-fixed text-sm">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[20%] text-xs font-medium text-muted-foreground">Usage Page</TableHead>
                  <TableHead className="w-[20%] text-xs font-medium text-muted-foreground">Usage</TableHead>
                  <TableHead className="w-[25%] text-xs font-medium text-muted-foreground">Type</TableHead>
                  <TableHead className="w-[35%] text-xs font-medium text-muted-foreground">Report ID</TableHead>
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
                    <TableRow key={i} className="border-border/50">
                      <TableCell className="font-mono text-xs">{formatHex16(c.usagePage ?? 0)}</TableCell>
                      <TableCell className="font-mono text-xs">{formatHex16(c.usage ?? 0)}</TableCell>
                      <TableCell className="text-xs">{c.type ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{ids.length ? ids.join(", ") : "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
