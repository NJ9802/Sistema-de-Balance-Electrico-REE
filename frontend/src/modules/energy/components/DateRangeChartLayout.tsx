import { Alert, Box, CircularProgress } from "@mui/material";
import type { EnergyBalanceResponse } from "../interfaces";
import ChartHeader from "./ChartHeader";

type DateRangeChartLayout = {
  title: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  error: Error | null;
  data: EnergyBalanceResponse | undefined;
};

const DateRangeChartLayout = ({
  title,
  children,
  isLoading,
  error,
  data,
}: DateRangeChartLayout) => {
  const canShowChart = !isLoading && !error && data;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingX: "50px",
        flex: 1,
        marginTop: 3,
      }}
    >
      <ChartHeader title={title} />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {"Ocurrió un error al cargar los datos"}
        </Alert>
      )}

      {canShowChart && children}
    </Box>
  );
};

export default DateRangeChartLayout;
