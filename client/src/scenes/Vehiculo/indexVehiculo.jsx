import { useState, useEffect  } from "react";
import { Box, useTheme, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel, MenuItem  } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Axios from "axios";
import Header from "../../components/Header";
import * as XLSX from 'xlsx';
import SaveIcon from '@mui/icons-material/Save';
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const Vehiculo = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [vehiculoList,setVehiculos] = useState([]);
    const [typevehiculoList,setTypevehiculo] = useState([]);
    const [modeloList,setModelos] = useState([]);
    const [combustibleList,setCombustibles] = useState([]);
    const [marcasList,setMarcas] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ id: '', descripcion: '', chasis_number: '', motor_number: '', placa_number: '', 
        vehiculo_type_id: '', marca_id: '', modelo_id: '', combustible_type_id: ''});


    // Editar
    const handleEdit = (id) => {
        const vehiculo = vehiculoList.find(v => v.id === id);
        setEditValues({ id: vehiculo.id, descripcion: vehiculo.descripcion, chasis_number: vehiculo.chasis_number, motor_number: vehiculo.motor_number, 
            placa_number: vehiculo.placa_number,  vehiculo_type_id: vehiculo.vehiculo_type_id, marca_id: vehiculo.marca_id, modelo_id: vehiculo.modelo_id, 
            combustible_type_id:vehiculo.combustible_type_id });
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        Axios.put(`http://localhost:3001/vehiculos/${editValues.id}`, {
            descripcion: editValues.descripcion,
            chasis_number: editValues.chasis_number, 
            motor_number: editValues.motor_number, 
            placa_number: editValues.placa_number,  
            vehiculo_type_id: editValues.vehiculo_type_id, 
            marca_id: editValues.marca_id, 
            modelo_id: editValues.modelo_id, 
            combustible_type_id:editValues.combustible_type_id  
        })
        .then((response) => {
            // alert('vehiculo actualizado correctamente');
            setEditOpen(false);
            getVehiculos();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };

    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/vehiculos/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getVehiculos();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values, {resetForm}) => {
        Axios.post("http://localhost:3001/vehiculos", {
            descripcion: values.descripcion,
            chasis_number: values.chasis_number, 
            motor_number: values.motor_number, 
            placa_number: values.placa_number,  
            vehiculo_type_id: values.vehiculo_type_id, 
            marca_id: values.marca_id, 
            modelo_id: values.modelo_id, 
            combustible_type_id:values.combustible_type_id  
        }).then((response) => {
            setShowAlert(true);  
            setTimeout(() => setShowAlert(false), 3000);
            getVehiculos();
        }).catch((error) => {
            console.error("There was an error!", error);
        });
        resetForm();
        console.log(values);
    };

    //Get 
    const getVehiculos = () =>{
        Axios.get("http://localhost:3001/vehiculos").then((response)=>{
            setVehiculos(response.data);
        });
    }

    const getTypevehiculos = () =>{
        Axios.get("http://localhost:3001/typevehiculos").then((response)=>{
            setTypevehiculo(response.data);
        });
    }

    const getMarcas = () =>{
        Axios.get("http://localhost:3001/marcas").then((response)=>{
            setMarcas(response.data);
        });
    }

    const getModelos = () =>{
        Axios.get("http://localhost:3001/modelos").then((response)=>{
            setModelos(response.data);
        });
    }

    const getCombustibles = () =>{
        Axios.get("http://localhost:3001/combustibles").then((response)=>{
            setCombustibles(response.data);
        });
    }

    useEffect(() => {
        getVehiculos();
        getTypevehiculos();
        getMarcas();
        getModelos();
        getCombustibles();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(vehiculoList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 0.5},
        {field:"descripcion", headerName:"DESCRIPCION",flex: 1},
        {field:"chasis_number", headerName:"No. Chasis",flex: 1},
        {field:"motor_number", headerName:"No. Motor",flex: 1},
        {field:"placa_number", headerName:"No. Placa",flex: 1},
        {field:"vehiculo_type_id", headerName:"Tipo Vehiculo ID",flex: 1},
        {field:"marca_id", headerName:"Marca ID",flex: 1},
        {field:"modelo_id", headerName:"Modelo ID",flex: 1},
        {field:"combustible_type_id", headerName:"Tipo Combustible ID",flex: 1},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1.39,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        style={{ marginRight: 16 }}
                        onClick={() => handleEdit(params.row.id)}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Eliminar
                    </Button>
                </>
            ),
        }

    ];

    return(
        <Box m="20px">
            <Box display="flex" justifyContent="center" mt="20px">
                {showAlert && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Vehiculo agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Este Vehiculo ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Vehiculos" subtitle = "Gestion de Vehiculos"></Header>

            {/* Form */}
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >    
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                            >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Descripción"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.descripcion}
                                name="descripcion"
                                error={!!touched.descripcion && !!errors.descripcion}
                                helperText={touched.descripcion && errors.descripcion}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="No. Chasis"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.chasis_number}
                                name="chasis_number"
                                sx={{ gridColumn: "span 1" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="No. Motor"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.motor_number}
                                name="motor_number"
                                sx={{ gridColumn: "span 1" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="No. Placa"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.placa_number}
                                name="placa_number"
                                sx={{ gridColumn: "span 1" }}
                            />
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="typevehiculo-select-label">Tipo Vehiculo</InputLabel>
                                    <Select
                                        label="Tipo Vehiculo"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.vehiculo_type_id}
                                        name="vehiculo_type_id"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {typevehiculoList.map((typevehiculo) => (
                                        <MenuItem key={typevehiculo.id} value={typevehiculo.id}>
                                            {typevehiculo.descripcion}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="marcas-select-label">Marca</InputLabel>
                                    <Select
                                        label="Marca"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.marca_id}
                                        name="marca_id"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {marcasList.map((marca) => (
                                        <MenuItem key={marca.id} value={marca.id}>
                                            {marca.descripcion}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="modelos-select-label">Modelo</InputLabel>
                                    <Select
                                        label="Modelo"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.modelo_id}
                                        name="modelo_id"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {modeloList.map((modelo) => (
                                        <MenuItem key={modelo.id} value={modelo.id}>
                                            {modelo.descripcion}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="modelos-select-label">Tipo Combustible</InputLabel>
                                    <Select
                                        label="Tipo Combustible"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.combustible_type_id}
                                        name="combustible_type_id"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {combustibleList.map((typecombustible) => (
                                        <MenuItem key={typecombustible.id} value={typecombustible.id}>
                                            {typecombustible.descripcion}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" varSiant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nuevo Vehiculo
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar Vehiculo</DialogTitle>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Descripción"
                                    value={editValues.descripcion}
                                    onChange={(e) => setEditValues({ ...editValues, descripcion: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="No. Chasis"
                                    value={editValues.chasis_number}
                                    onChange={(e) => setEditValues({ ...editValues, chasis_number: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="No. Motor"
                                    value={editValues.motor_number}
                                    onChange={(e) => setEditValues({ ...editValues, motor_number: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="No. Placa"
                                    value={editValues.placa_number}
                                    onChange={(e) => setEditValues({ ...editValues, placa_number: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="marcas-select-label">TypeVehiculo</InputLabel>
                                        <Select
                                            label="Marca"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, vehiculo_type_id: e.target.value })}
                                            value={editValues.vehiculo_type_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {typevehiculoList.map((typevehiculo) => (
                                            <MenuItem key={typevehiculo.id} value={typevehiculo.id}>
                                                {typevehiculo.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="marcas-select-label">Marca</InputLabel>
                                        <Select
                                            label="Marca"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, marca_id: e.target.value })}
                                            value={editValues.marca_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {marcasList.map((marca) => (
                                            <MenuItem key={marca.id} value={marca.id}>
                                                {marca.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="modelos-select-label">Modelo</InputLabel>
                                        <Select
                                            label="Modelo"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, modelo_id: e.target.value })}
                                            value={editValues.modelo_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {modeloList.map((modelo) => (
                                            <MenuItem key={modelo.id} value={modelo.id}>
                                                {modelo.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="marcas-select-label">Tipo Combustible</InputLabel>
                                        <Select
                                            label="Tipo Combustible"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, combustible_type_id: e.target.value })}
                                            value={editValues.combustible_type_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {combustibleList.map((combustible) => (
                                            <MenuItem key={combustible.id} value={combustible.id}>
                                                {combustible.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setEditOpen(false)} color="primary">
                                    Cancelar
                                </Button>
                                <Button onClick={handleEditSubmit} color="primary" variant="contained">
                                    Guardar
                                </Button>
                            </DialogActions>
                        </Dialog>
                            {/*  */}
                    </Box>
                </form>
            )}
            </Formik>
            {/* Tabla */}
            <Box m="5px"></Box>
            <Box
                m="40px 0 0 0"
                height="45vh"
                width = "100%"
                sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                },
                }}
            >
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={exportToExcel}>Exportar a Excel</Button>
            <Box m="5px"></Box>
            <DataGrid rows={vehiculoList} columns={columns} autoHeight/>
            </Box>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    descripcion: yup.string().required("required"),
  });

const initialValues = {
    descripcion: '',
    chasis_number: '', 
    motor_number: '', 
    placa_number: '', 
    vehiculo_type_id: '', 
    marca_id: '', 
    modelo_id: '', 
    combustible_type_id: ''
};
export default Vehiculo;