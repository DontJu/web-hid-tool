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
    <div className="mx-auto max-w-[1280px] flex w-full flex-col p-4 md:p-6">
      <main className="flex flex-col flex-1  gap-4 p-4">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-[200px] flex-1">
              <HIDDeviceSelect
                allDevices={hidDevices}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
              />
            </div>
            <Button variant="outline" size="sm" onClick={connectToDevice}>
              Get Permission
            </Button>
          </div>
        </section>
        <section>
          <HIDDeviceInfo device={selectedDevice} />
        </section>
        <section>
          <DataDisplay />
        </section>
        <section>
          <SendHIDPanel device={selectedDevice} sendData={sendData} />
        </section>
      </main>
    </div>
  );
}
