import { useState, useEffect  } from "react";
import { Box, useTheme, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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

const Marcas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [marcasList,setMarcas] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editValues, setEditValues] = useState({ id: '', descripcion: '' });


    // Editar
    const handleEdit = (id) => {
        const marca = marcasList.find(v => v.id === id);
        setEditValues({ id: marca.id, descripcion: marca.descripcion });
        setEditOpen(true);
    };

    const handleEditSubmit = () => {
        Axios.put(`http://localhost:3001/marcas/${editValues.id}`, {
            descripcion: editValues.descripcion,      
        })
        .then((response) => {
            setEditOpen(false);
            getMarcas();
        })
        .catch((error) => {
            console.error("Hubo un error al actualizar!", error);
        });
    };
    // delete
    const handleDelete = (id) => {
        Axios.delete(`http://localhost:3001/marcas/${id}`)
            .then((response) => {
                getMarcas();
            })
            .catch((error) => {
                console.error("Hubo un error al eliminar!", error);
            });
    };
    //form post
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values, {resetForm}) => {
        Axios.post("http://localhost:3001/marcas", {
            descripcion: values.descripcion
        }).then((response) => {
            setShowAlert(true);  
            setTimeout(() => setShowAlert(false), 3000);
            getMarcas();
        }).catch((error) => {
            console.error("There was an error!", error);
        });
        resetForm();
        console.log(values);
    };

    //Get marca
    const getMarcas = () =>{
        Axios.get("http://localhost:3001/marcas").then((response)=>{
            setMarcas(response.data);
        });
    }
    useEffect(() => {
        getMarcas();
    }, []);
    //Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(marcasList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reporte.xlsx');
      };

    //Tabla
    const columns = [
        {field:"id", headerName:"ID", flex:0.5},
        {field:"descripcion", headerName:"DESCRIPCION",flex: 1},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 0.3,
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
                        Marca agregado correctamente.
                    </Alert>
                )}
            </Box>
            <Header title="Marcas" subtitle = "Gestion de Marcas"></Header>

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
                        </Box>
                    <Box display="flex" justifyContent="initial" mt="20px">
                    <Button type="submit" color="secondary" variant="contained" endIcon={<SendIcon />} disabled={Formik.isSubmitting}>
                        Crear Nueva Marca
                    </Button>
                            {/*  */}
                        <Dialog open={editOpen} onClose={() => setEditOpen(false)} axWidth="md" fullWidth>
                            <DialogTitle>Editar Marca</DialogTitle>
                            <DialogContent>
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
            <DataGrid rows={marcasList} columns={columns} autoHeight/>
            </Box>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    descripcion: yup.string().required("required"),
  });

const initialValues = {
    descripcion: "",
  };
export default Marcas;