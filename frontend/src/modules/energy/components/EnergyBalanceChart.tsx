import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Box } from "@mui/material";
import { useMemo } from "react";
import type { EnergyCategory, EnergyRecord } from "../interfaces";
import { formatChartData } from "../utils/chart-transformer";

interface Props {
  records: EnergyRecord[];
  categories: EnergyCategory[];
}

export const EnergyBalanceChart = ({ records, categories }: Props) => {
  const chartData = useMemo(() => formatChartData(records), [records]);

  if (chartData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        No hay datos para estas fechas
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 400, maxWidth: "xl" }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="5 5" opacity={1} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
          <Legend style={{ marginTop: "20px" }} />
          <Tooltip
            formatter={(value, name) => [
              `${Math.round(value as number)} MWh`,
              name,
            ]}
          />

          {categories.map((cat) => (
            <Line
              key={cat.id}
              dataKey={cat.title}
              stroke={cat.color || "#8884d8"}
              fill={cat.color || "#8884d8"}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
