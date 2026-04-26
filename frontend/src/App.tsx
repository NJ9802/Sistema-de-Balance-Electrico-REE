import { Typography } from "@mui/material";
import { useEnergyBalance } from "./modules/energy/hooks/useEnergyBalance";

function App() {
  const { data, isLoading, error } = useEnergyBalance(
    "2026-01-01T00:00",
    "2026-01-31T00:00",
  );

  console.log("Energy Balance Data:", { data, isLoading, error });

  return (
    <>
      <Typography>Hello World</Typography>
    </>
  );
}

export default App;
