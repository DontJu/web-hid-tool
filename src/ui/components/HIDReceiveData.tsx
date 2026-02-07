import { useShowData } from "@/state/showData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="flex min-h-[200px] flex-col rounded border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-medium text-foreground">
          Receive Data
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={clearShowData}
            disabled={dataArray.length === 0}
          >
            Clear
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex-1 overflow-y-auto overflow-x-auto px-3 py-2 font-mono text-sm h-70 bg-stone-100">
          {showDataList.length === 0 ? (
            <div className="text-muted-foreground">No Data</div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {showDataList.map((line, i) => (
                <div key={i} className="whitespace-pre break-all">
                  {i+1 + " >>> [" +line + "]"}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-3">
        <Label className="pl-2">Data Format:</Label>
        <Tabs value={decodeOption} onValueChange={changeDecodeOption}>
          <TabsList>
            <TabsTrigger value="hex">Hex</TabsTrigger>
            <TabsTrigger value="dex">Dec</TabsTrigger>
          </TabsList>
        </Tabs>
        <Label className="pl-2">Separator: </Label>
        <Input className="w-20" value={separator} onChange={(e)=>setSeparator(e.target.value)}></Input>
      </CardFooter>
    </Card>
  );
}
