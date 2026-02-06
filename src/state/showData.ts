import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useShowData = create(
  combine(
    {
      dataArray: [] as DataView[],
    },
    (set) => ({
      addData: (data: DataView) =>
        set((state) => ({
          dataArray: [...state.dataArray, data],
        })),
      clearShowData: () => set(() => ({ dataArray: [] })),
    }),
  ),
);
