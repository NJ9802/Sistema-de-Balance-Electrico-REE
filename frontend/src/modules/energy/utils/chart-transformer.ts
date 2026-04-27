import type { EnergyRecord } from "../interfaces";

export const formatChartData = (records: EnergyRecord[]) => {
  // 1. Agrupamos los valores por fecha
  const dataMap = records.reduce(
    (acc, record) => {
      // Formateamos la fecha a un string legible (ej: 15/04)
      const dateStr = new Date(record.datetime).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (!acc[dateStr]) {
        acc[dateStr] = { name: dateStr };
      }
      // Asignamos el valor a la categoría correspondiente
      acc[dateStr][record.category.title] = record.value;
      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(dataMap);
};
