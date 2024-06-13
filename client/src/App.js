import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/SideBar"
import Dashboard from "./scenes/dashboard"
import TypeVehiculo from "./scenes/TypeVehiculo/indexTypeVehiculo"
import Marcas from "./scenes/Marcas/indexMarcas"
import Modelos from "./scenes/Modelos/indexModelos"
import Combustibles from "./scenes/TypeCombustible/indexTypeCombustible"
import Vehiculos from "./scenes/Vehiculo/indexVehiculo"
import Clientes from "./scenes/Cliente/indexCliente"
import Empleados from "./scenes/Empleado/indexEmpleado"
import Inspeccion from "./scenes/Inspeccion/indexInspeccion"
import Rentas from "./scenes/Renta/indexRenta"
import { Route, Routes } from "react-router-dom";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}> 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Sidebar />
        <main className="content">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/vehiculostype" element={<TypeVehiculo/>}/>
            <Route path="/marcas" element={<Marcas/>}/>
            <Route path="/modelos" element={<Modelos/>}/>
            <Route path="/combustibles" element={<Combustibles/>}/>
            <Route path="/vehiculos" element={<Vehiculos/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/empleados" element={<Empleados/>}/>
            <Route path="/inspeccion" element={<Inspeccion/>}/>
            <Route path="/renta" element={<Rentas/>}/>   
          </Routes>
        </main>
      </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
