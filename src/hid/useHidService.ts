import { useShowData } from "@/state/showData";
import { useCallback, useState } from "react";

export default function useHidService() {
  const [hidDevices, setHidDevices] = useState<HIDDevice[]>([]);

  const { addData } = useShowData();

  const isAvaliable = (): boolean => {
    if ("hid" in navigator) {
      return true;
    } else {
      return false;
    }
  };

  const getDevices = useCallback(async (): Promise<HIDDevice[]> => {
    if (!isAvaliable()) return [];
    const devices = await navigator.hid.getDevices();
    setHidDevices(devices);
    return devices;
  }, []);

  const requestDevice = useCallback(async (): Promise<HIDDevice | null> => {
    const devices = await navigator.hid.requestDevice({ filters: [] });
    await getDevices();
    if (devices.length === 1) {
      const [device] = devices;
      return device;
    } else {
      return null;
    }
  }, [getDevices]);

  const sendData = async (
    device: HIDDevice,
    reportId: number,
    data: Uint8Array,
  ): Promise<boolean> => {
    if (!isAvaliable) return false;
    try {
      if (!device.opened) {
        if (!(await openDevice(device))) {
          return false;
        }
      }

      await device.sendReport(reportId, new Uint8Array(data));
      return true;
    } catch {
      return false;
    }
  };

  const openDevice = async (device: HIDDevice): Promise<boolean> => {
    if (device.opened) return false;
    try {
      await device.open();
      device.addEventListener("inputreport", (e) => {
        addData(e.data);
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    hidDevices,
    requestDevice,
    isAvaliable,
    sendData,
    getDevices,
  };
}
