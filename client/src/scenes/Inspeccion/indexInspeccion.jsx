import { useState, useEffect  } from "react";
import { Box, useTheme, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel, MenuItem, Checkbox  } from "@mui/material";
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { format } from 'date-fns';

const Inspeccion = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [inspeccionList,setInspeccion] = useState([]);
    const [vehiculoList,setVehiculo] = useState([]);
    const [clienteList,setCliente] = useState([]);
    const [empleadoList,setEmpleado] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ 
        id: '',
        vehiculo_id: '', 
        cliente_id: '', 
        tiene_ralladuras: false,
        cantidad_combustible: false, 
        tiene_goma_repuesto: false, 
        tiene_gato: false, 
        tiene_vidrios_rotos: false, 
        condicion_goma_delantera_izquierda: false,
        condicion_goma_delantera_derecha: false, 
        condicion_goma_trasera_izquierda: false,
        condicion_goma_trasera_derecha: false, 
        inspeccion_date: dayjs(), 
        inspeccion_employee_id: ''
    });

    // Editar
    const handleEdit = (id) => {
        const inspeccion = inspeccionList.find(v => v.id === id);
        setEditValues({ 
            id: inspeccion.id, 
            vehiculo_id: inspeccion.vehiculo_id, 
            cliente_id: inspeccion.cliente_id, 
            tiene_ralladuras: inspeccion.tiene_ralladuras,
            cantidad_combustible: inspeccion.cantidad_combustible, 
            tiene_goma_repuesto: inspeccion.tiene_goma_repuesto, 
            tiene_gato: inspeccion.tiene_gato, 
            tiene_vidrios_rotos: inspeccion.tiene_vidrios_rotos, 
            condicion_goma_delantera_izquierda: inspeccion.condicion_goma_delantera_izquierda, 
            condicion_goma_delantera_derecha: inspeccion.condicion_goma_delantera_derecha, 
            condicion_goma_trasera_izquierda: inspeccion.condicion_goma_trasera_izquierda, 
            condicion_goma_trasera_derecha: inspeccion.condicion_goma_trasera_derecha, 
            inspeccion_date: dayjs(inspeccion.inspeccion_date), 
            inspeccion_employee_id: inspeccion.inspeccion_employee_id
        });
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        console.log(editValues.fecha_ingreso);
        Axios.put(`http://localhost:3001/inspeccion/${editValues.id}`, {
            vehiculo_id: editValues.vehiculo_id, 
            cliente_id: editValues.cliente_id, 
            tiene_ralladuras: editValues.tiene_ralladuras,
            cantidad_combustible: editValues.cantidad_combustible, 
            tiene_goma_repuesto: editValues.tiene_goma_repuesto, 
            tiene_gato: editValues.tiene_gato, 
            tiene_vidrios_rotos: editValues.tiene_vidrios_rotos, 
            condicion_goma_delantera_izquierda: editValues.condicion_goma_delantera_izquierda, 
            condicion_goma_delantera_derecha: editValues.condicion_goma_delantera_derecha, 
            condicion_goma_trasera_izquierda: editValues.condicion_goma_trasera_izquierda, 
            condicion_goma_trasera_derecha: editValues.condicion_goma_trasera_derecha, 
            inspeccion_date: dayjs(editValues.inspeccion_date).format('YYYY-MM-DD'), 
            inspeccion_employee_id: editValues.inspeccion_employee_id
        })
        .then((response) => {
            setEditOpen(false);
            getInspeccion();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };

    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/inspeccion/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getInspeccion();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values, {resetForm}) => {
        Axios.post("http://localhost:3001/inspeccion", {
            vehiculo_id: values.vehiculo_id, 
            cliente_id: values.cliente_id, 
            tiene_ralladuras: values.tiene_ralladuras,
            cantidad_combustible: values.cantidad_combustible, 
            tiene_goma_repuesto: values.tiene_goma_repuesto, 
            tiene_gato: values.tiene_gato, 
            tiene_vidrios_rotos: values.tiene_vidrios_rotos, 
            condicion_goma_delantera_izquierda: values.condicion_goma_delantera_izquierda, 
            condicion_goma_delantera_derecha: values.condicion_goma_delantera_derecha, 
            condicion_goma_trasera_izquierda: values.condicion_goma_trasera_izquierda, 
            condicion_goma_trasera_derecha: values.condicion_goma_trasera_derecha, 
            inspeccion_date: dayjs(values.inspeccion_date).format('YYYY-MM-DD'), 
            inspeccion_employee_id: values.inspeccion_employee_id
        }).then((response) => {
            setShowAlert(true);  
            setTimeout(() => setShowAlert(false), 3000);
            getInspeccion();
        }).catch((error) => {
            console.error("There was an error!", error);
        });
        resetForm();
    };

    //Get 
    const getInspeccion = () =>{
        Axios.get("http://localhost:3001/inspeccion").then((response)=>{
            setInspeccion(response.data);
        });
    }
    const getVehiculo = () =>{
        Axios.get("http://localhost:3001/vehiculos").then((response)=>{
            setVehiculo(response.data);
        });
    }    
    const getClientes = () =>{
        Axios.get("http://localhost:3001/clientes").then((response)=>{
            setCliente(response.data);
        });
    }
    const getEmpleado = () =>{
        Axios.get("http://localhost:3001/empleados").then((response)=>{
            setEmpleado(response.data);
        });
    }
    useEffect(() => {
        getInspeccion();
        getVehiculo();
        getClientes();
        getEmpleado();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(inspeccionList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 1},
        {field:"vehiculo_id", headerName:"Vehiculo",flex: 1},
        {field:"cliente_id", headerName:"Cliente",flex: 1},
        {field:"tiene_ralladuras", headerName:"RALLADURAS",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"cantidad_combustible", headerName:"CANTIDAD COMBUSTIBLE",flex: 1},
        {field:"tiene_goma_repuesto", headerName:"GOMA REPUESTO",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"tiene_gato", headerName:"GATO",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"tiene_vidrios_rotos", headerName:"VIDRIO ROTOS",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"condicion_goma_delantera_izquierda", headerName:"GOMA SUPERIOR IZ",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"condicion_goma_delantera_derecha", headerName:"GOMA SUPERIOR DE",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"condicion_goma_trasera_izquierda", headerName:"GOMA INFERIOR IZ",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {field:"condicion_goma_trasera_derecha", headerName:"GOMA INFERIOR DE",flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    disabled
                    color="primary"
                    inputProps={{ 'aria-label': 'ralladuras checkbox' }}
                />
            )
        },
        {
            field:"inspeccion_date", 
            headerName:"Fecha de Ingreso",
            flex: 1,
            renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd')
        },   
        {field:"inspeccion_employee_id", headerName:"EMPLEADO",flex: 1},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 2.3,
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
                        inspeccion agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Esta inspeccion ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Inspecciones" subtitle = "Gestion de inspecciones"></Header>

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
                                <InputLabel id="vehiculo-select-label">Vehiculo</InputLabel>
                                    <Select
                                        label="Vehiculo"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.vehiculo_id}
                                        name="vehiculo_id"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.vehiculo_id && !!errors.vehiculo_id}
                                        helperText={touched.vehiculo_id && errors.vehiculo_id}
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
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="tiene_ralladuras"
                                    color="primary"
                                    checked={values.tiene_ralladuras}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                        gridColumn: "span 0.5"
                                    }}
                                    />
                                }
                                label="Ralladuras"
                            />
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="tanda_shift-select-label">Cantidad Combustible</InputLabel>
                                    <Select
                                        label="Cantidad Combustible"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.cantidad_combustible}
                                        name="cantidad_combustible"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.cantidad_combustible && !!errors.cantidad_combustible}
                                        helperText={touched.cantidad_combustible && errors.cantidad_combustible}
                                    >
                                        <MenuItem value={"1/4"}>1/4</MenuItem>
                                        <MenuItem value={"1/2"}>1/2</MenuItem>
                                        <MenuItem value={"3/4"}>3/4</MenuItem>
                                        <MenuItem value={"Lleno"}>Lleno</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="tiene_goma_repuesto"
                                    color="primary"
                                    checked={values.tiene_goma_repuesto}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Goma Respuesto"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="tiene_gato"
                                    color="primary"
                                    checked={values.tiene_gato}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Tiene Gato"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="tiene_vidrios_rotos"
                                    color="primary"
                                    checked={values.tiene_vidrios_rotos}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Vidrios Rotos"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="condicion_goma_delantera_izquierda"
                                    color="primary"
                                    checked={values.condicion_goma_delantera_izquierda}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Goma Superior Izquierda"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="condicion_goma_delantera_derecha"
                                    color="primary"
                                    checked={values.condicion_goma_delantera_derecha}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Goma Superior Derecha"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="condicion_goma_trasera_izquierda"
                                    color="primary"
                                    checked={values.condicion_goma_trasera_izquierda}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Goma Inferior Izquierda"
                            />
                            <FormControlLabel
                                control={
                                    <Field
                                    as={Checkbox}
                                    name="condicion_goma_trasera_derecha"
                                    color="primary"
                                    checked={values.condicion_goma_trasera_derecha}
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                      }}
                                    />
                                }
                                label="Goma Inferior Derecha"
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                                name="inspeccion_date"
                                label="Fecha Inspeccion"
                                component={DatePicker}
                                value={values.inspeccion_date}
                                onChange={(date) => handleChange({ target: { name: 'inspeccion_date', value: date } })}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="empleado-select-label">Empleado</InputLabel>
                                    <Select
                                        label="Empleado"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.inspeccion_employee_id}
                                        name="inspeccion_employee_id"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.inspeccion_employee_id && !!errors.inspeccion_employee_id}
                                        helperText={touched.inspeccion_employee_id && errors.inspeccion_employee_id}
                                    >
                                        {empleadoList.map((empleado) => (
                                        <MenuItem key={empleado.id} value={empleado.id}>
                                            {empleado.nombre}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" varSiant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nueva inspeccion
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar inspeccion</DialogTitle>
                            <DialogContent>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="vehiculo-select-label">Vehiculo</InputLabel>
                                    <Select
                                        label="Vehiculo"
                                        onBlur={handleBlur}
                                        onChange={(e) => setEditValues({ ...editValues, vehiculo_id: e.target.value })}
                                        value={editValues.vehiculo_id}
                                        sx={{ gridColumn: "span 2", marginBottom: 2, }}
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
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="persona_type-select-label">Cantidad Combustible</InputLabel>
                                        <Select
                                            label="Tipo inspeccion"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, cantidad_combustible: e.target.value })}
                                            value={editValues.cantidad_combustible}
                                            sx={{ gridColumn: "span 2", marginBottom: 2 }}
                                        >
                                        <MenuItem value={"1/4"}>1/4</MenuItem>
                                        <MenuItem value={"1/2"}>1/2</MenuItem>
                                        <MenuItem value={"3/4"}>3/4</MenuItem>
                                        <MenuItem value={"Lleno"}>Lleno</MenuItem>
                                    </Select>
                                </FormControl> 
                                <FormControlLabel
                                    control={
                                        <Field
                                        as={Checkbox}
                                        name="tiene_ralladuras"
                                        color="primary"
                                        checked={editValues.tiene_ralladuras}
                                        onChange={(e) => setEditValues({ ...editValues, tiene_ralladuras: e.target.checked })}
                                        onBlur={handleBlur}
                                        sx={{
                                            color: `${colors.greenAccent[200]}`,
                                            '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                            color: `${colors.greenAccent[300]} !important`,
                                            },
                                        }}
                                        />
                                    }
                                    label="Ralladuras"
                                />          
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="tiene_goma_repuesto"
                                    color="primary"
                                    checked={editValues.tiene_goma_repuesto}
                                    onChange={(e) => setEditValues({ ...editValues, tiene_goma_repuesto: e.target.checked })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Goma Respuesto"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="tiene_gato"
                                    color="primary"
                                    checked={editValues.tiene_gato}
                                    onChange={(e) => setEditValues({ ...editValues, tiene_gato: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Tiene Gato"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="tiene_vidrios_rotos"
                                    color="primary"
                                    checked={editValues.tiene_vidrios_rotos}
                                    onChange={(e) => setEditValues({ ...editValues, tiene_vidrios_rotos: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Vidrios Rotos"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="condicion_goma_delantera_izquierda"
                                    color="primary"
                                    checked={editValues.condicion_goma_delantera_izquierda}
                                    onChange={(e) => setEditValues({ ...editValues, condicion_goma_delantera_izquierda: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Goma Superior Izquierda"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="condicion_goma_delantera_derecha"
                                    color="primary"
                                    checked={editValues.condicion_goma_delantera_derecha}
                                    onChange={(e) => setEditValues({ ...editValues, condicion_goma_delantera_derecha: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Goma Superior Derecha"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="condicion_goma_trasera_izquierda"
                                    color="primary"
                                    checked={editValues.condicion_goma_trasera_izquierda}
                                    onChange={(e) => setEditValues({ ...editValues, condicion_goma_trasera_izquierda: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Goma Inferior Izquierda"
                            />
                            <FormControlLabel 
                                control={
                                    <Field
                                    fullWidth
                                    as={Checkbox}
                                    name="condicion_goma_trasera_derecha"
                                    color="primary"
                                    checked={editValues.condicion_goma_trasera_derecha}
                                    onChange={(e) => setEditValues({ ...editValues, condicion_goma_trasera_derecha: e.target.checked  })}
                                    onBlur={handleBlur}
                                    sx={{
                                        color: `${colors.greenAccent[200]}`,
                                        '&.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-checked': {
                                          color: `${colors.greenAccent[300]} !important`,
                                        },
                                    }}
                                    />
                                }
                                label="Goma Inferior Derecha"
                            />
                            <Box style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field
                                        name="inspeccion_date"
                                        label="Fecha Inspeccion"
                                        component={DatePicker}
                                        value={editValues.inspeccion_date}
                                        onChange={(date) => setEditValues({ ...editValues, inspeccion_date: date })}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="empleado-select-label">Empleado</InputLabel>
                                        <Select
                                            label="Empleado"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, inspeccion_employee_id: e.target.value })}
                                            value={editValues.inspeccion_employee_id}
                                            sx={{ gridColumn: "span 2"}}
                                        >
                                            {empleadoList.map((empleado) => (
                                            <MenuItem key={empleado.id} value={empleado.id}>
                                                {empleado.nombre}
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
                "& .MuiCheckbox-root, .MuiCheckbox-root.Mui-checked": {
                    color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                },
                }}
            >
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={exportToExcel}>Exportar a Excel</Button>
            <Box m="5px"></Box>
            <DataGrid rows={inspeccionList} columns={columns} autoHeight/>
            </Box>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    vehiculo_id: yup.string().required("required"),
    cliente_id: yup.string().required("required"),
    cantidad_combustible: yup.string().required("required"),
    inspeccion_employee_id: yup.string().required("required")
});

const initialValues = {
    vehiculo_id: '', 
    cliente_id: '', 
    tiene_ralladuras: false,
    cantidad_combustible: '', 
    tiene_goma_repuesto: false, 
    tiene_gato: false, 
    tiene_vidrios_rotos: false, 
    condicion_goma_delantera_izquierda: false, 
    condicion_goma_delantera_derecha: false, 
    condicion_goma_trasera_izquierda: false,
    condicion_goma_trasera_derecha: false, 
    inspeccion_date: dayjs(), 
    inspeccion_employee_id: ''
};

export default Inspeccion;