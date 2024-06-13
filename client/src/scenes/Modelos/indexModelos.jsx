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

const TipoCombustible = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [modeloList,setModelos] = useState([]);
    const [marcasList,setMarcas] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ id: '', marca_id: '', descripcion: '' });


    // Editar
    const handleEdit = (id) => {
        const modelo = modeloList.find(v => v.id === id);
        setEditValues({ id: modelo.id, marca_id: modelo.marca_id, descripcion: modelo.descripcion });
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        Axios.put(`http://localhost:3001/modelos/${editValues.id}`, {
            marca_id: editValues.marca_id,
            descripcion: editValues.descripcion,      
        })
        .then((response) => {
            // alert('Modelo actualizado correctamente');
            setEditOpen(false);
            getModelos();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };
    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/modelos/${id}`)
            .then((response) => {
                setShowAlertDelete(true);  
                setTimeout(() => setShowAlertDelete(false), 3000);
                getModelos();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values, {resetForm}) => {
        Axios.post("http://localhost:3001/modelos", {
            marca_id:values.marca_id,
            descripcion:values.descripcion
        }).then((response) => {
            setShowAlert(true);  
            setTimeout(() => setShowAlert(false), 3000);
            getModelos();
        }).catch((error) => {
            console.error("There was an error!", error);
        });
        resetForm();
        console.log(values);
    };

    //Get marca
    const getModelos = () =>{
        Axios.get("http://localhost:3001/modelos").then((response)=>{
            setModelos(response.data);
        });
    }
    const getMarcas = () =>{
        Axios.get("http://localhost:3001/marcas").then((response)=>{
            setMarcas(response.data);
        });
    }
    useEffect(() => {
        getModelos();
        getMarcas();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(modeloList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex: 3},
        {field:"marca_id", headerName:"Marca_ID",flex: 3},
        {field:"descripcion", headerName:"DESCRIPCION",flex: 3},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1.5,
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
                        Modelo agregado correctamente.
                    </Alert>
                )}
                {showAlertDelete && (
                    <Alert severity="error">
                        Esta Modelo ha sido eliminada correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Modelos" subtitle = "Gestion de Modelos"></Header>

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
                                <InputLabel id="marcas-select-label">Marca</InputLabel>
                                    <Select
                                        label="Marca"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.marca_id}
                                        name="marca_id"
                                        error={!!touched.marca_id && !!errors.marca_id}
                                        helperText={touched.marca_id && errors.marca_id}
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        {marcasList.map((marca) => (
                                        <MenuItem key={marca.id} value={marca.id}>
                                            {marca.descripcion}
                                        </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
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
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" variant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nuevo Modelo
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar Modelos</DialogTitle>
                            <DialogContent>
                                <FormControl fullWidth variant="filled">
                                    <InputLabel id="marcas-select-label">Marca</InputLabel>
                                        <Select
                                            label="Marca"
                                            onBlur={handleBlur}
                                            onChange={(e) => setEditValues({ ...editValues, marca_id: e.target.value })}
                                            value={editValues.marca_id}
                                            sx={{ gridColumn: "span 2" }}
                                        >
                                            {marcasList.map((marca) => (
                                            <MenuItem key={marca.id} value={marca.id}>
                                                {marca.descripcion}
                                            </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Descripción"
                                    value={editValues.descripcion}
                                    onChange={(e) => setEditValues({ ...editValues, descripcion: e.target.value })}
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
                height="75vh"
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
            <DataGrid rows={modeloList} columns={columns} autoHeight/>
            </Box>
        </Box>

        
    );
};

const checkoutSchema = yup.object().shape({
    descripcion: yup.string().required("required"),
    marca_id: yup.string().required("required"),
    
});

const initialValues = {
    marca_id: "",
    descripcion: "",
  };
export default TipoCombustible;