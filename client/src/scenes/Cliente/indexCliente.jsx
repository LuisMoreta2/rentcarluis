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

const Cliente = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [clienteList,setClientes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ id: '',nombre: '', cedula: '', tarjeta_number: '', credito_limit: '', persona_type: ''});


    // Editar
    const handleEdit = (id) => {
        const cliente = clienteList.find(v => v.id === id);
        setEditValues({ id: cliente.id, nombre: cliente.nombre, cedula: cliente.cedula, tarjeta_number: cliente.tarjeta_number, 
            credito_limit:cliente.credito_limit, persona_type: cliente.persona_type});
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        Axios.put(`http://localhost:3001/clientes/${editValues.id}`, {
            nombre: editValues.nombre, 
            cedula: editValues.cedula, 
            tarjeta_number: editValues.tarjeta_number, 
            credito_limit: editValues.credito_limit, 
            persona_type: editValues.persona_type
        })
        .then((response) => {
            // alert('Cliente actualizado correctamente');
            setEditOpen(false);
            getClientes();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };

    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/clientes/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getClientes();
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
                await Axios.post("http://localhost:3001/clientes", {
                    nombre: values.nombre,
                    cedula: values.cedula,
                    tarjeta_number: values.tarjeta_number,
                    credito_limit: values.credito_limit,
                    persona_type: values.persona_type
                });
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
                getClientes();
                resetForm();
            } else {
                alert('Cédula No existe');
            }
        } catch (error) {
            console.error('Error al validar cédula:', error);
            alert('Error al validar cédula');
        }
    };

    //Get 
    const getClientes = () =>{
        Axios.get("http://localhost:3001/clientes").then((response)=>{
            setClientes(response.data);
        });
    }

    useEffect(() => {
        getClientes();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(clienteList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 1},
        {field:"nombre", headerName:"Nombre",flex: 1},
        {field:"cedula", headerName:"Cedula",flex: 1},
        {field:"tarjeta_number", headerName:"No. Tarjeta",flex: 1},
        {field:"credito_limit", headerName:"Limite de Credito",flex: 1},
        {field:"persona_type", headerName:"Tipo de Persona",flex: 1},
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
                        Cliente agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Esta cliente ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Clientes" subtitle = "Gestion de Clientes"></Header>

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
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="No. Tarjeta"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.tarjeta_number}
                                name="tarjeta_number"
                                sx={{ gridColumn: "span 1.5" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Limite De Credito"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.credito_limit}
                                name="credito_limit"
                                error={!!touched.credito_limit && !!errors.credito_limit}
                                helperText={touched.credito_limit && errors.credito_limit}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="typepersona-select-label">Tipo Persona</InputLabel>
                                    <Select
                                        label="Tipo Persona"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.persona_type}
                                        name="persona_type"
                                        sx={{ gridColumn: "span 2" }}
                                        error={!!touched.persona_type && !!errors.persona_type}
                                        helperText={touched.persona_type && errors.persona_type}
                                    >
                                        <MenuItem value={"Física"}>Física</MenuItem>
                                        <MenuItem value={"Jurídica"}>Jurídica</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" varSiant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nuevo Cliente
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar Cliente</DialogTitle>
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
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="No. Tarjeta"
                                    value={editValues.tarjeta_number}
                                    onChange={(e) => setEditValues({ ...editValues, tarjeta_number: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Limite de credito"
                                    value={editValues.credito_limit}
                                    onChange={(e) => setEditValues({ ...editValues, credito_limit: e.target.value })}
                                    sx={{ marginBottom: 2,  marginTop: 2, }}
                                />
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="persona_type-select-label">Tipo Cliente</InputLabel>
                                        <Select
                                            label="Tipo Cliente"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, persona_type: e.target.value })}
                                            value={editValues.persona_type}
                                            sx={{ gridColumn: "span 2", marginBottom: 2,  marginTop: 2 }}
                                        >
                                        <MenuItem value={"Física"}>Física</MenuItem>
                                        <MenuItem value={"Jurídica"}>Jurídica</MenuItem>
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
            <DataGrid rows={clienteList} columns={columns} autoHeight/>
            </Box>
        </Box>
    );
};
const cedulaRegExp = /^\d{3}-\d{7}-\d{1}$/;

const checkoutSchema = yup.object().shape({
    nombre: yup.string().required("required"),
    cedula:yup.string().matches(cedulaRegExp, "Cedula no valida").required("required"),
    persona_type: yup.string().required("required"),
    credito_limit: yup.number().required("required").min(0, 'Cantidad de dias debe ser positiva'),
});

const initialValues = {
    nombre: '', 
    cedula: '', 
    tarjeta_number: '', 
    credito_limit: 0, 
    persona_type: ''
};

export default Cliente;