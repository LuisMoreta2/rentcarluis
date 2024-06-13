import { useState, useEffect  } from "react";
import { Box, useTheme, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel, MenuItem, Grid  } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Axios from "axios";
import Header from "../../components/Header";
import * as XLSX from 'xlsx';
import SaveIcon from '@mui/icons-material/Save';
import { Formik, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { format } from 'date-fns';

const Renta = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rentaList,setRentas] = useState([]);
    const [inspeccionList,setInspeccion] = useState([]);
    const [vehiculoList,setVehiculos] = useState([]);
    const [empleadoList,setEmpleados] = useState([]);
    const [clienteList,setClientes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({
        id:'',     
        empleado_id: '',
        vehiculo_id: '', 
        cliente_id: '', 
        renta_date: dayjs(), 
        devolucion_date: dayjs(), 
        monto_diario: 0, 
        cantidad_dias: 0, 
        comentario: ''
    });

    // Editar
    const handleEdit = (id) => {
        const renta = rentaList.find(v => v.id === id);
        setEditValues({ 
            id: renta.id,         
            empleado_id: renta.empleado_id,
            vehiculo_id: renta.vehiculo_id, 
            cliente_id: renta.cliente_id, 
            renta_date: dayjs(renta.renta_date), 
            devolucion_date: dayjs(renta.devolucion_date), 
            monto_diario: renta.monto_diario, 
            cantidad_dias: renta.cantidad_dias, 
            comentario: renta.comentario
        });
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        Axios.put(`http://localhost:3001/renta/${editValues.id}`, {
            empleado_id: editValues.empleado_id,
            vehiculo_id: editValues.vehiculo_id, 
            cliente_id: editValues.cliente_id, 
            renta_date: dayjs(editValues.renta_date).format('YYYY-MM-DD'), 
            devolucion_date: dayjs(editValues.devolucion_date).format('YYYY-MM-DD'), 
            monto_diario: editValues.monto_diario, 
            cantidad_dias: editValues.cantidad_dias, 
            comentario: editValues.comentario
        })
        .then((response) => {
            // alert('vehiculo actualizado correctamente');
            setEditOpen(false);
            getRentas();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };

    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/renta/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getRentas();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values, {resetForm}) => {
        console.log(values)
        Axios.post("http://localhost:3001/renta", {
            empleado_id: values.empleado_id,
            vehiculo_id: values.vehiculo_id, 
            cliente_id: values.cliente_id, 
            renta_date: dayjs(values.renta_date).format('YYYY-MM-DD'), 
            devolucion_date: values.devolucion_date ? dayjs(values.devolucion_date).format('YYYY-MM-DD') : null, 
            monto_diario: values.monto_diario, 
            cantidad_dias: values.cantidad_dias, 
            comentario: values.comentario
        }).then((response) => {
            setShowAlert(true);  
            setTimeout(() => setShowAlert(false), 3000);
            getRentas()
        }).catch((error) => {
            console.error("There was an error!", error);
        });
        resetForm();
        console.log(values);
    };

    //Get 
    const getRentas = () =>{
        Axios.get("http://localhost:3001/renta").then((response)=>{
            setRentas(response.data);
        });
    }
    const getInspeccion = () =>{
        Axios.get("http://localhost:3001/inspeccion").then((response)=>{
            setInspeccion(response.data);
        });
    }
    const getVehiculos = () =>{
        Axios.get("http://localhost:3001/vehiculos").then((response)=>{
            setVehiculos(response.data);
        });
    }
    const getEmpleados = () =>{
        Axios.get("http://localhost:3001/empleados").then((response)=>{
            setEmpleados(response.data);
        });
    }
    const getClientes = () =>{
        Axios.get("http://localhost:3001/clientes").then((response)=>{
            setClientes(response.data);
        });
    }

    useEffect(() => {
        getRentas();
        getVehiculos();
        getEmpleados();
        getClientes();
        getInspeccion();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rentaList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
    };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 1},
        {field:"empleado_id", headerName:"Empleado",flex: 1},
        {field:"vehiculo_id", headerName:"Vehiculo",flex: 1},
        {field:"cliente_id", headerName:"Cliente",flex: 1},
        {
            field:"renta_date", headerName:"Fecha Renta",flex: 0.5,
            // renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd')
        },
        {
            field:"devolucion_date", headerName:"Fecha Devolucion",flex: 0.5,
            // renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd')
        },
        {field:"monto_diario", headerName:"Monto x Dia",flex: 0.5},
        {field:"cantidad_dias", headerName:"Cantidad dias",flex: 0.5},
        {field:"comentario", headerName:"Comentario",flex: 1},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1.2,
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
    // filtro
    const rentaListFormatted = rentaList.map(renta => ({
        ...renta,
        renta_date: format(new Date(renta.renta_date), 'yyyy-MM-dd'),
        devolucion_date: renta.devolucion_date ? format(new Date(renta.devolucion_date), 'yyyy-MM-dd') : null,
    }));
    const vehiculosDisponibles = vehiculoList.filter((vehiculo) => {
        const vehiculoEnRenta = rentaListFormatted.find(renta => renta.vehiculo_id === vehiculo.id);
        const inspeccion = inspeccionList.find(inspeccion => inspeccion.vehiculo_id === vehiculo.id);
        if (!vehiculoEnRenta) {
            return true;
        }
        if (vehiculoEnRenta.devolucion_date && inspeccion) {
            const inspeccionDateFormatted = format(new Date(inspeccion.inspeccion_date), 'yyyy-MM-dd');
            return vehiculoEnRenta.devolucion_date === inspeccionDateFormatted;
        }
        return false;
    });

    useEffect(() => {
    }, [rentaListFormatted]);
    
    const [selectedEmpleado, setSelectedEmpleado] = useState('');
    const [selectedVehiculo, setSelectedVehiculo] = useState('');
    const [selectedCliente, setSelectedCliente] = useState('');
    const [rentaDate, setRentaDate] = useState(dayjs());
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const handleFilterChange = (newFilterModel) => {
        if (JSON.stringify(newFilterModel) !== JSON.stringify(filterModel)) {
            setFilterModel(newFilterModel);
        }
    };

    const handleEmpleadoChange = (event) => {
        const value = event.target.value;
        setSelectedEmpleado(value);
        const newFilterItems = filterModel.items.filter(item => item.columnField !== 'empleado_id');
        if (value) {
            newFilterItems.push({
                columnField: 'empleado_id',
                operatorValue: 'equals',
                value: value,
                operator: 'equals',
                field: 'empleado_id'
            });
        }
        setFilterModel(prevFilterModel => ({
            ...prevFilterModel,
            items: newFilterItems
        }));
    };

    const handleVehiculoChange = (event) => {
        const value = event.target.value;
        setSelectedVehiculo(value);
        const newFilterItems = filterModel.items.filter(item => item.columnField !== 'vehiculo_id');
        if (value) {
            newFilterItems.push({
                columnField: 'vehiculo_id',
                operatorValue: 'equals',
                value: value,
                operator: 'equals',
                field: 'vehiculo_id' 
            });
        }
        setFilterModel(prevFilterModel => ({
            ...prevFilterModel,
            items: newFilterItems
        }));
    };

    const handleClienteChange = (event) => {
        const value = event.target.value;
        setSelectedCliente(value);
        const newFilterItems = filterModel.items.filter(item => item.columnField !== 'cliente_id');
        if (value) {
            newFilterItems.push({
                columnField: 'cliente_id',
                operatorValue: 'equals',
                value: value,
                operator: 'equals',
                field: 'cliente_id' 
            });
        }
        setFilterModel(prevFilterModel => ({
            ...prevFilterModel,
            items: newFilterItems
        }));
    };
    const handleDateChange = (date) => {
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        setRentaDate(date);
        const newFilterItems = filterModel.items.filter(item => item.columnField !== 'renta_date');
        if (date) {
            newFilterItems.push({
                columnField: 'renta_date',
                operatorValue: 'equals',
                value: formattedDate,
                operator: 'equals',
                field: 'renta_date'
            });
        }
        console.log("newFilterItems:", rentaListFormatted);
        setFilterModel(prevFilterModel => ({
            ...prevFilterModel,
            items: newFilterItems
        }));
    };
    const handleResetDatePickerFilter = () => {
        setRentaDate(null); 
        const newFilterItems = filterModel.items.filter(item => item.columnField !== 'renta_date');
        setFilterModel(prevFilterModel => ({
            ...prevFilterModel,
            items: newFilterItems
        }));
    };
    const handleDevolucionDateChange = (date) => {
        if (date && editValues.renta_date && dayjs(date).isBefore(dayjs(editValues.renta_date))) {
            alert('La fecha de devolución no puede ser menor que la fecha de renta.');
        } else {
            setEditValues({ ...editValues, devolucion_date: date });
        }
    };
// filtro
    return(
        <Box m="20px">
            <Box display="flex" justifyContent="center" mt="20px">
                {showAlert && (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Marca agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Esta marca ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Renta y Devolucion" subtitle = "Gestion de Rentas"></Header>

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
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="empleado-select-label">Empleado</InputLabel>
                                    <Select
                                        label="Empleado"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.empleado_id}
                                        name="empleado_id"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.empleado_id && !!errors.empleado_id}
                                        helperText={touched.empleado_id && errors.empleado_id}
                                    >
                                        {empleadoList.map((empleado) => (
                                        <MenuItem key={empleado.id} value={empleado.id}>
                                            {empleado.nombre}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="vehiculo-select-label">Vehiculos</InputLabel>
                                    <Select
                                        label="Vehiculos"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.vehiculo_id}
                                        name="vehiculo_id"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.vehiculo_id && !!errors.vehiculo_id}
                                        helperText={touched.vehiculo_id && errors.vehiculo_id}
                                    >
                                        {vehiculosDisponibles.map((vehiculo) => (
                                        <MenuItem key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.descripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="cliente-select-label">Cliente</InputLabel>
                                    <Select
                                        label="Cliente"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.cliente_id}
                                        name="cliente_id"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.cliente_id && !!errors.cliente_id}
                                        helperText={touched.cliente_id && errors.cliente_id}
                                    >
                                        {clienteList.map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id}>
                                            {cliente.nombre}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                                name="renta_date"
                                label="Fecha Renta"
                                component={DatePicker}
                                value={values.renta_date}
                                onChange={(date) => handleChange({ target: { name: 'renta_date', value: date } })}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                                name="devolucion_date"
                                label="Fecha Devolucion"
                                component={DatePicker}
                                value={values.devolucion_date}
                                onChange={(date) => handleChange({ target: { name: 'devolucion_date', value: date } })}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider> */}
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Monto X Dia"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.monto_diario}
                                name="monto_diario"
                                sx={{ gridColumn: "span 1" }}
                                error={!!touched.monto_diario && !!errors.monto_diario}
                                helperText={touched.monto_diario && errors.monto_diario}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Cantidad de días"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cantidad_dias}
                                name="cantidad_dias"
                                sx={{ gridColumn: "span 1" }}
                                error={!!touched.cantidad_dias && !!errors.cantidad_dias}
                                helperText={touched.cantidad_dias && errors.cantidad_dias}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Comentario"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.comentario}
                                name="comentario"
                                multiline
                                rows={3}
                                sx={{ gridColumn: "span 1" }}
                            />
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" varSiant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nueva Renta
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar Renta</DialogTitle>
                            <DialogContent>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="empleado-select-label">Empleado</InputLabel>
                                        <Select
                                            label="Empleado"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, empleado_id: e.target.value })}
                                            value={editValues.empleado_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {empleadoList.map((empleado) => (
                                            <MenuItem key={empleado.id} value={empleado.id}>
                                                {empleado.nombre}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="vehiculo-select-label">Vehiculo</InputLabel>
                                        <Select
                                            label="Vehiculo"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, vehiculo_id: e.target.value })}
                                            value={editValues.vehiculo_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2 }}
                                        >
                                            {vehiculoList.map((vehiculo) => (
                                            <MenuItem key={vehiculo.id} value={vehiculo.id}>
                                                {vehiculo.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="cliente-select-label">Cliente</InputLabel>
                                        <Select
                                            label="Cliente"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, cliente_id: e.target.value })}
                                            value={editValues.cliente_id}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                            {clienteList.map((cliente) => (
                                            <MenuItem key={cliente.id} value={cliente.id}>
                                                {cliente.nombre}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field
                                        name="renta_date"
                                        label="Fecha Renta"
                                        component={DatePicker}
                                        value={editValues.renta_date}
                                        onChange={(date) => setEditValues({ ...editValues, renta_date: date })}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                </Box>
                                <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field
                                        name="devolucion_date"
                                        label="Fecha Devolucion"
                                        component={DatePicker}
                                        value={editValues.devolucion_date}
                                        onChange={handleDevolucionDateChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                </Box>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Monto X Dia"
                                    value={editValues.monto_diario}
                                    onChange={(e) => setEditValues({ ...editValues, monto_diario: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Cantidad de dias"
                                    value={editValues.cantidad_dias}
                                    onChange={(e) => setEditValues({ ...editValues, cantidad_dias: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Comentario"
                                    value={editValues.comentario}
                                    onChange={(e) => setEditValues({ ...editValues, comentario: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
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
            <Box Box m="5px" mb={2}>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={exportToExcel}>Exportar a Excel</Button>
            </Box>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <FormControl style={{ minWidth: 200 }}>
                            <InputLabel id="empleado-label">Empleado</InputLabel>
                            <Select
                                labelId="empleado-label"
                                value={selectedEmpleado}
                                onChange={handleEmpleadoChange}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {empleadoList.map((empleado) => (
                                    <MenuItem key={empleado.id} value={empleado.id}>
                                        {empleado.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl style={{ minWidth: 200 }}>
                            <InputLabel id="vehiculo-label">Vehiculo</InputLabel>
                            <Select
                                labelId="vehiculo-label"
                                value={selectedVehiculo}
                                onChange={handleVehiculoChange}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {vehiculoList.map((vehiculo) => (
                                    <MenuItem key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl style={{ minWidth: 200 }}>
                            <InputLabel id="cliente-label">Cliente</InputLabel>
                            <Select
                                labelId="cliente-label"
                                value={selectedCliente}
                                onChange={handleClienteChange}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {clienteList.map((cliente) => (
                                    <MenuItem key={cliente.id} value={cliente.id}>
                                        {cliente.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha Renta"
                                value={rentaDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                    <Button variant="contained" color="primary" startIcon={<RestartAltOutlinedIcon />} onClick={handleResetDatePickerFilter}>Reset Fecha renta</Button>
                    </Grid>                  
                </Grid>
            <DataGrid 
                rows={rentaListFormatted} 
                columns={columns} 
                filterModel={filterModel}
                onFilterModelChange={handleFilterChange}
                autoHeight
                />
            </Box>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    empleado_id: yup.string().required("required"),
    vehiculo_id: yup.string().required("required"),
    cliente_id: yup.string().required("required"),
    monto_diario: yup.number().required("required").min(0, 'Monto diario debe ser positivo'),
    cantidad_dias: yup.number().required("required").min(0, 'Cantidad de dias debe ser positiva'),
  });

const initialValues = {
    empleado_id: '',
    vehiculo_id: '', 
    cliente_id: '', 
    renta_date: dayjs(), 
    devolucion_date: null, 
    monto_diario: 0, 
    cantidad_dias: 0, 
    comentario: ''
};
export default Renta;