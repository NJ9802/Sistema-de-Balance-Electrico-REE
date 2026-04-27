import { Stack, TextField, Typography } from "@mui/material";
import { useDateFilterContext } from "../context/DateRangeContext";

type ChartHeaderProps = {
  title: string;
};

const sx = { maxWidth: "169px" };

const ChartHeader = ({ title }: ChartHeaderProps) => {
  const { register, errors } = useDateFilterContext();

  return (
    <Stack
      sx={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        mb: 2,
        minHeight: "112px",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Stack sx={{ flexDirection: "row", gap: 3 }}>
        <TextField
          label="Fecha Inicio"
          type="date"
          {...register("startDate")}
          error={!!errors.startDate}
          helperText={errors.startDate?.message}
          sx={sx}
        />

        <TextField
          label="Fecha Fin"
          type="date"
          {...register("endDate")}
          error={!!errors.endDate}
          helperText={errors.endDate?.message}
          sx={sx}
        />
      </Stack>
    </Stack>
  );
};

export default ChartHeader;
