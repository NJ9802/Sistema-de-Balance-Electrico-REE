import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { navigationMenu } from "../constants/navigation-menu";
import { useLocation, useNavigate } from "react-router";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ maxWidth: "250px", flexGrow: 1, boxShadow: 5 }}>
      <List>
        {navigationMenu.map((nav) => (
          <ListItem key={nav.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(nav.path)}
              sx={{
                background:
                  location.pathname === nav.path
                    ? "rgba(0,0,0,0.08)"
                    : "transparent",
              }}
            >
              <ListItemIcon>{nav.icon}</ListItemIcon>
              <ListItemText primary={nav.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideMenu;
