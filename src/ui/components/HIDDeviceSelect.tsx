import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getHIDDeviceInterfaceLabel } from "@/utils/hidDeviceLabel";
import { useCallback, useMemo } from "react";

interface HIDDeviceSelectProps {
  allDevices: HIDDevice[];
  selectedDevice: HIDDevice | null;
  onSelectDevice?: (device: HIDDevice | null) => void;
}

type HIDDeviceOption = {
  id: number;
  value: HIDDevice;
  label: string;
};
export default function HIDDeviceSelect({
  allDevices,
  selectedDevice,
  onSelectDevice,
}: HIDDeviceSelectProps) {
  const getLabel = useCallback((device: HIDDevice) => {
    return `${device.productName} - ${getHIDDeviceInterfaceLabel(device)}`;
  }, []);
  const options: HIDDeviceOption[] = useMemo(
    () =>
      allDevices.map((device, index) => ({
        id: index,
        value: device,
        label: getLabel(device),
      })),
    [allDevices, getLabel],
  );

  const handleChange = (option: HIDDeviceOption | null) => {
    onSelectDevice?.(option != null ? (option.value ?? null) : null);
  };

  const nowOption: HIDDeviceOption | null = useMemo(() => {
    if (selectedDevice == null) {
      return null;
    }
    return options.find((item) => item.label === getLabel(selectedDevice)) ?? null;
  }, [options, selectedDevice, getLabel]);

  return (
    <Combobox
      items={options}
      value={nowOption}
      onValueChange={handleChange}
    >
      <ComboboxInput placeholder="Select Device" />
      <ComboboxContent>
        <ComboboxEmpty>No Device Has Permission</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
