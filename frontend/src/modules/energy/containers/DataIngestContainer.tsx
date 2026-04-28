import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useDateFilterContext } from "../context/DateRangeContext";
import { useDataIngest } from "../hooks/useDataIngest";
import ChartHeader from "../components/ChartHeader";

const DataIngestContainer = () => {
  const { startDate, endDate, hasErrors } = useDateFilterContext();
  const { mutate, isPending, isSuccess, isError, error, data, reset } = useDataIngest();

  const handleIngest = () => {
    mutate({
      startDate: `${startDate}T00:00`,
      endDate: `${endDate}T23:59`,
    });
  };

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
      <ChartHeader title="Ingesta Manual de Datos" />

      <Box sx={{ mt: 4, width: "100%", maxWidth: "600px", textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Selecciona un rango de fechas para solicitar la ingesta de datos desde la API de Red Eléctrica de España.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleIngest}
          disabled={hasErrors || isPending}
          sx={{ minWidth: "200px" }}
        >
          {isPending ? <CircularProgress size={24} color="inherit" /> : "Iniciar Ingesta"}
        </Button>

        {isSuccess && (
          <Alert severity="success" sx={{ mt: 4 }} onClose={reset}>
            {data?.message || "Ingesta completada con éxito"}
          </Alert>
        )}

        {isError && (
          <Alert severity="error" sx={{ mt: 4 }} onClose={reset}>
            {(error as any)?.response?.data?.message || "Ocurrió un error durante la ingesta de datos"}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default DataIngestContainer;
