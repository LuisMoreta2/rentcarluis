import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme} from "@mui/material";
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';
import NoCrashOutlinedIcon from '@mui/icons-material/NoCrashOutlined';
import ToysOutlinedIcon from '@mui/icons-material/ToysOutlined';
import GarageOutlinedIcon from '@mui/icons-material/GarageOutlined';
import OilBarrelOutlinedIcon from '@mui/icons-material/OilBarrelOutlined';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CarRentalOutlinedIcon from '@mui/icons-material/CarRentalOutlined';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

const SideBar = () => {
    const theme = useTheme();
    const colors =  tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] =  useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box sx={{
            "& .pro-sidebar-inner" : {
                background: `${colors.primary[400]} !important`
            },
            "& .pro-icon-wrapper" : {
                backgroundColor: "transparent !important"
            },
            "& .pro-inner-item" : {
                padding: "5px 35px 5px 20px !important"
            },
            "& .pro-inner-item:hover" : {
                color: "#868dfb !important"
            },
            "& .pro-menu-item.active" : {
                color: "#6870fa !important"
            },
        }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                        margin: "10px 0 20px 0",
                        color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            ml="15px"
                        >
                            <Typography variant="h3" color={colors.grey[100]}>
                            RENTCAR
                            </Typography>
                            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                            <MenuOutlinedIcon />
                            </IconButton>
                        </Box>
                        )}
                    </MenuItem>  
                
                {/* User */}
                {!isCollapsed && (
                    <Box mb="25px">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                        alt="profile-user"
                        width="100px"
                        height="100px"
                        src={`../../assets/user2.png`}
                        style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                    </Box>
                    <Box textAlign="center">
                        <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                        >
                        Luis Moreta
                        </Typography>
                        <Typography variant="h5" color={colors.greenAccent[500]}>
                        Creador del Rentcar
                        </Typography>
                    </Box>
                    </Box>
                )}
                {/* Menu Items*/}
                <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                    {/* <Item
                    title="Home"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    /> */}
                    <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                    >
                    People
                    </Typography>
                    <Item
                    title="Clientes"
                    to="/clientes"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Item
                    title="Empleados"
                    to="/empleados"
                    icon={<PersonOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                    >
                    Car
                    </Typography>
                   <Item
                    title="Tipos de Vehiculos"
                    to="/vehiculostype"
                    icon={<DriveEtaOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Item
                    title="Marcas"
                    to="/marcas"
                    icon={<ElectricCarIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                   <Item
                    title="Modelos"
                    to="/modelos"
                    icon={<ToysOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                   <Item
                    title="Tipos de combustibles"
                    to="/combustibles"
                    icon={<OilBarrelOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Item
                    title="Vehiculos"
                    to="/vehiculos"
                    icon={<GarageOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Item
                    title="Inspeccion"
                    to="/inspeccion"
                    icon={<NoCrashOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Item
                    title="Renta y Devolucion"
                    to="/renta"
                    icon={<CarRentalOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    />
                    <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                    >
                    </Typography>
                </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
}
export default SideBar;