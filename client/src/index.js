import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import Dashboard from "./scenes/dashboard"
import TypeVehiculo from "./scenes/TypeVehiculo/indexTypeVehiculo"
import Marcas from "./scenes/Marcas/indexMarcas"
import Combustibles from "./scenes/TypeCombustible/indexTypeCombustible"
import Modelos from "./scenes/Modelos/indexModelos"
import Vehiculos from "./scenes/Vehiculo/indexVehiculo"
import Clientes from "./scenes/Cliente/indexCliente"
import Empleados from "./scenes/Empleado/indexEmpleado"
import Inspeccion from "./scenes/Inspeccion/indexInspeccion"
import Rentas from "./scenes/Renta/indexRenta"
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path: "dashboard",
        element:<Dashboard />,
      },
      {
        path: "vehiculostype",
        element:<TypeVehiculo />,
      },
      {
        path: "marcas",
        element:<Marcas />,
      },
      {
        path: "combustibles",
        element:<Combustibles />,
      },
      {
        path: "modelos",
        element:<Modelos />,
      },
      {
        path: "vehiculos",
        element:<Vehiculos />,
      },
      {
        path: "clientes",
        element:<Clientes />,
      },
      {
        path: "empleados",
        element:<Empleados />,
      },
      {
        path: "inspeccion",
        element:<Inspeccion />,
      },
      {
        path: "renta",
        element:<Rentas />,
      },
    ]
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

