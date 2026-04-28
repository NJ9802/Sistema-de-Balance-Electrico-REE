import { useMutation } from "@tanstack/react-query";
import { ingestData } from "../services/energy-balance.service";

export const useDataIngest = () => {
  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
    }: {
      startDate: string;
      endDate: string;
    }) => ingestData(startDate, endDate),
  });
};
