import { useQuery } from "@tanstack/react-query";
import { getEnergyBalance } from "../services/energy-balance.service";

export const useEnergyBalance = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["energy-balance", startDate, endDate],
    queryFn: () => getEnergyBalance(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
