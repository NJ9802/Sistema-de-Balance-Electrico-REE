import { Box, Stack } from "@mui/material";
import Header from "./components/Header";
import { EnergyBalancePage } from "./modules/energy/pages/EnergyBalancePage";
import SideMenu from "./components/SideMenu";
import { Route, Routes } from "react-router";
import { EnergyGroupsBalancePage } from "./modules/energy/pages/EnergyGroupsBalancePage";

function App() {
  return (
    <>
      <Header />
      <Stack direction={"row"} sx={{ overflow: "hidden" }}>
        <SideMenu />
        <Box
          sx={{
            flexGrow: 1,
            minHeight: "calc(100vh - 64px)",
            padding: "20px 50px",
          }}
        >
          <Routes>
            <Route path="/" element={<EnergyBalancePage />} />
            <Route
              path="/balance-group"
              element={<EnergyGroupsBalancePage />}
            />
            <Route
              path="/consumption-data"
              element={<div>Consumption Data</div>}
            />
          </Routes>
        </Box>
      </Stack>
    </>
  );
}

export default App;
