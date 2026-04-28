import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AddIcon from "@mui/icons-material/Add";

export const navigationMenu = [
  {
    text: "Balance",
    path: "/",
    icon: <ElectricBoltIcon sx={{ color: "darkorange" }} />,
  },
  {
    text: "Balance por Grupo",
    path: "/balance-group",
    icon: <DataSaverOffIcon sx={{ color: "darkred" }} />,
  },
  {
    text: "Ingesta de Datos",
    path: "/data-ingestion",
    icon: <AddIcon sx={{ color: "darkgreen" }} />,
  },
];
