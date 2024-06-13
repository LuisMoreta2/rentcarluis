import { useState, useEffect  } from "react";
import { Box, useTheme, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel, MenuItem  } from "@mui/material";
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
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { format } from 'date-fns';

const Empleado = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [empleadoList,setEmpleados] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ id: '',nombre: '', cedula: '', tanda_shift: '',commission_percentage : '', fecha_ingreso : dayjs()});


    // Editar
    const handleEdit = (id) => {
        const empleado = empleadoList.find(v => v.id === id);
        setEditValues({ id: empleado.id, nombre: empleado.nombre, cedula: empleado.cedula, tanda_shift: empleado.tanda_shift,
            commission_percentage: empleado.commission_percentage, fecha_ingreso: dayjs(empleado.fecha_ingreso)
        });
        console.log(dayjs(empleado.fecha_ingreso));
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        console.log(editValues.fecha_ingreso);
        Axios.put(`http://localhost:3001/empleados/${editValues.id}`, {
            nombre: editValues.nombre, 
            cedula: editValues.cedula, 
            tanda_shift: editValues.tanda_shift,
            commission_percentage: editValues.commission_percentage, 
            fecha_ingreso: dayjs(editValues.fecha_ingreso).format('YYYY-MM-DD')
        })
        .then((response) => {
            // alert('empleado actualizado correctamente');
            setEditOpen(false);
            getEmpleados();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };

    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/empleados/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getEmpleados();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = async (values, { resetForm }) => {
        const cedulaSinGuion = values.cedula.replace(/-/g, '');
        try {
            const response = await Axios.get(`https://api.digital.gob.do/v3/cedulas/${cedulaSinGuion}/validate`);        
            if (response.data.valid) {
                await Axios.post("http://localhost:3001/empleados", {
                    nombre: values.nombre, 
                    cedula: values.cedula, 
                    tanda_shift: values.tanda_shift,
                    commission_percentage: values.commission_percentage, 
                    fecha_ingreso: dayjs(values.fecha_ingreso).format('YYYY-MM-DD')
                });
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
                getEmpleados();
                resetForm();
            } else {
                alert('Cédula No existe');
            }
        } catch (error) {
            console.error('Error al validar cédula:', error);
            alert('Error al validar cédula. (Esta cedula no existe)');
        }
    };

    //Get 
    const getEmpleados = () =>{
        Axios.get("http://localhost:3001/empleados").then((response)=>{
            setEmpleados(response.data);
        });
    }

    useEffect(() => {
        getEmpleados();

    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(empleadoList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 1},
        {field:"nombre", headerName:"Nombre",flex: 1},
        {field:"cedula", headerName:"Cedula",flex: 1},
        {field:"tanda_shift", headerName:"Tanda Laboral",flex: 1},
        {field:"commission_percentage", headerName:"Porciento De Comisicon",flex: 1},
        {
            field:"fecha_ingreso", 
            headerName:"Fecha de Ingreso",
            flex: 1,
            renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd')
        },   
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
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
                        Empleado agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Esta empleado ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Empleados" subtitle = "Gestion de empleados"></Header>

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
                                label="Nombre"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.nombre}
                                name="nombre"
                                error={!!touched.nombre && !!errors.nombre}
                                helperText={touched.nombre && errors.nombre}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Cedula"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cedula}
                                name="cedula"
                                error={!!touched.cedula && !!errors.cedula}
                                helperText={touched.cedula && errors.cedula}
                                inputProps={{ maxLength: 13 }}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="tanda_shift-select-label">Tanda Laboral</InputLabel>
                                    <Select
                                        label="Tanda Laboral"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.tanda_shift}
                                        name="tanda_shift"
                                        error={!!touched.tanda_shift && !!errors.tanda_shift}
                                        helperText={touched.tanda_shift && errors.tanda_shift}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <MenuItem value={"Matutina"}>Matutina</MenuItem>
                                        <MenuItem value={"Vespertina"}>Vespertina</MenuItem>
                                        <MenuItem value={"Nocturna"}>Nocturna</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Porciento Comision"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.commission_percentage}
                                name="commission_percentage"
                                inputProps={{ maxLength: 6 }}
                                error={!!touched.commission_percentage && !!errors.commission_percentage}
                                helperText={touched.commission_percentage && errors.commission_percentage}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                                name="fecha_ingreso"
                                label="Fecha Ingreso"
                                component={DatePicker}
                                value={values.fecha_ingreso}
                                onChange={(date) => handleChange({ target: { name: 'fecha_ingreso', value: date } })}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" varSiant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nuevo empleado
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar empleado</DialogTitle>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Nombre"
                                    value={editValues.nombre}
                                    onChange={(e) => setEditValues({ ...editValues, nombre: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Cedula"
                                    value={editValues.cedula}
                                    onChange={(e) => setEditValues({ ...editValues, cedula: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="persona_type-select-label">Tipo empleado</InputLabel>
                                        <Select
                                            label="Tipo empleado"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, tanda_shift: e.target.value })}
                                            value={editValues.tanda_shift}
                                            sx={{ gridColumn: "span 2", marginBottom: 2}}
                                        >
                                        <MenuItem value={"Matutina"}>Matutina</MenuItem>
                                        <MenuItem value={"Vespertina"}>Vespertina</MenuItem>
                                        <MenuItem value={"Nocturna"}>Nocturna</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Porciento Comision"
                                    value={editValues.commission_percentage}
                                    onChange={(e) => setEditValues({ ...editValues, commission_percentage: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Field
                                        name="fecha_ingreso"
                                        label="Fecha Ingreso"
                                        component={DatePicker}
                                        value={editValues.fecha_ingreso}
                                        onChange={(date) => setEditValues({ ...editValues, fecha_ingreso: date })}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
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
            <DataGrid rows={empleadoList} columns={columns} autoHeight/>
            </Box>
        </Box>
    );
};
const cedulaRegExp = /^\d{3}-\d{7}-\d{1}$/;

const checkoutSchema = yup.object().shape({
    nombre: yup.string().required("required"),
    cedula:yup.string().matches(cedulaRegExp, "Cedula no valida").required("required"),
    tanda_shift: yup.string().required("required"),
    commission_percentage: yup.number().required("required").min(0, 'Debe ser positiva'),
});

const initialValues = {
    nombre: '', 
    cedula: '', 
    tanda_shift: '',
    commission_percentage: 0, 
    fecha_ingreso: dayjs()
};

export default Empleado;