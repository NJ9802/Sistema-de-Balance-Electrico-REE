import api from "../../../api/axios.config";
import { type EnergyBalanceResponse } from "../interfaces";

export const getEnergyBalance = async (
  startDate: string,
  endDate: string,
): Promise<EnergyBalanceResponse> => {
  const { data } = await api.get<EnergyBalanceResponse>("/api/energy/balance", {
    params: {
      startDate,
      endDate,
    },
  });
  return data;
};

export const ingestData = async (
  startDate: string,
  endDate: string,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(
    "/api/energy/ingest-data",
    {
      startDate,
      endDate,
    },
  );
  return data;
};
