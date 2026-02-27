import { Button } from "@/components/ui/button";
import useHidService from "@/hid/useHidService";
import { useCallback, useEffect, useState } from "react";
import DataDisplay from "./components/HIDReceiveData";
import HIDDeviceInfo from "./components/HIDDeviceInfo";
import HIDDeviceSelect from "./components/HIDDeviceSelect";
import SendHIDPanel from "./components/SendHIDPanel";

export default function HIDPage() {
  const { hidDevices, requestDevice, getDevices, sendData } =
    useHidService();
  const [selectedDevice, setSelectedDevice] = useState<HIDDevice | null>(null);

  useEffect(() => {
    getDevices();
  }, [getDevices]);
  const connectToDevice = useCallback( async() => {
    const device = await requestDevice()
    if (device != null) {
      setSelectedDevice(device)
    }
  },[requestDevice])
  return (
    <div className="mx-auto max-w-5xl flex w-full flex-col p-6 md:p-8">
      <main className="flex flex-col flex-1 gap-6">
        <section className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[240px] flex-1">
              <HIDDeviceSelect
                allDevices={hidDevices}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
              />
            </div>
            <Button 
              variant="default" 
              size="default" 
              onClick={connectToDevice}
              className="rounded-full px-6"
            >
              Get Permission
            </Button>
          </div>
        </section>
        
        <section className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <HIDDeviceInfo device={selectedDevice} />
        </section>
        
        <section className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <DataDisplay />
        </section>
        
        <section className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <SendHIDPanel device={selectedDevice} sendData={sendData} />
        </section>
      </main>
    </div>
  );
}
