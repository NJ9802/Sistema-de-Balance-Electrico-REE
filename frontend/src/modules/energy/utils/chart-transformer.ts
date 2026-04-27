import type { EnergyRecord } from "../interfaces";

export const formatChartData = (records: EnergyRecord[]) => {
  const dataMap = records.reduce(
    (acc, record) => {
      const dateStr = new Date(record.datetime).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!acc[dateStr]) {
        acc[dateStr] = { name: dateStr };
      }
      acc[dateStr][record.category.title] = record.value;
      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(dataMap);
};
