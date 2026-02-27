import { useShowData } from "@/state/showData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { toDexString, toHexString } from "@/utils/ByteArrayToStringUtils";
import type { decodeOptionType } from "@/type/types";
import { Input } from "@/components/ui/input";

export default function DataDisplay() {
  const { dataArray, clearShowData } = useShowData();
  const [decodeOption, setDecodeOption] = useState<decodeOptionType>("hex");
  const [separator, setSeparator] = useState<string>(" ");
  const showDataList: string[] = useMemo(() => {
    switch (decodeOption) {
      case "hex": {
        return dataArray.map((item) => toHexString(item, separator));
      }
      case "dex": {
        return dataArray.map((item) => toDexString(item, separator));
      }
    }
  }, [decodeOption, dataArray, separator]);

  const changeDecodeOption = (option: string) => {
    if (option === "hex" || option === "dex") setDecodeOption(option);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Receive Data</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={clearShowData}
          disabled={dataArray.length === 0}
          className="rounded-full"
        >
          Clear
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
        <div className="h-64 overflow-y-auto overflow-x-auto p-4 font-mono text-sm">
          {showDataList.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No data received
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {showDataList.map((line, i) => (
                <div key={i} className="whitespace-pre break-all text-xs">
                  <span className="text-muted-foreground mr-2">{i + 1}.</span>
                  <span className="text-foreground">[{line}]</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Format</Label>
          <Tabs value={decodeOption} onValueChange={changeDecodeOption}>
            <TabsList className="bg-muted/50 rounded-full h-8">
              <TabsTrigger value="hex" className="rounded-full text-xs px-4">Hex</TabsTrigger>
              <TabsTrigger value="dex" className="rounded-full text-xs px-4">Dec</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Separator</Label>
          <Input 
            className="w-16 h-8 text-center text-sm rounded-lg" 
            value={separator} 
            onChange={(e) => setSeparator(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
