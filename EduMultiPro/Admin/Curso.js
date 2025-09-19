import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function Curso({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    const [cursos, setCursos] = React.useState([]);
    const [grados, setGrados] = React.useState([]);
    const [jornadas, setJornadas] = React.useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = React.useState(null);
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);

    // Obtener todos los cursos
    const obtenerCursos = async () => {
    try {
        const res = await apiFetch("/Cursos");
        const data = await res.json();
        setCursos(data);
    } catch (error) {
        console.error("Error al obtener cursos:", error);
    }
    };

    // Obtener todos los grados
    const obtenerGrados = async () => {
    try {
        const res = await apiFetch("/Grados");
        const data = await res.json();
        setGrados(data);
    } catch (error) {
        console.error("Error al obtener grados:", error);
    }
    };

    // Obtener todas las jornadas
    const obtenerJornadas = async () => {
    try {
        const res = await apiFetch("/Jornadas");
        const data = await res.json();
        setJornadas(data);
    } catch (error) {
        console.error("Error al obtener jornadas:", error);
    }
    };

    // Eliminar curso
    const eliminarCurso = (id) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Deseas eliminar este curso?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: async () => {
                    try {
                        const res = await apiFetch(`/Cursos/${id}`, {
                            method: "DELETE",
                        });
                        const data = await res.json();
                        Alert.alert("Éxito", data.mensaje);
                        setCursos(cursos.filter((c) => c.ID !== id));
                    } catch (error) {
                        console.error("Error al eliminar curso:", error);
                        Alert.alert("Error", "No se pudo eliminar el curso");
                    }
                }}
            ]
        );
    };

    // Función para modificar curso
    const modificarCurso = async () => {
        if (!cursoSeleccionado?.ID) {
            Alert.alert("Error", "No hay curso seleccionado");
            return;
        }

        // Validación simple
        if (!cursoSeleccionado.grado_id || !cursoSeleccionado.jornada_id) {
            Alert.alert("Error", "Debes seleccionar grado y jornada");
            return;
        }

        try {
            const res = await apiFetch(`/Cursos/${cursoSeleccionado.ID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grado_id: Number(cursoSeleccionado.grado_id),
                    jornada_id: Number(cursoSeleccionado.jornada_id)
                }),
            });

            const data = await res.json();
            Alert.alert("Éxito", data.mensaje);

            setMostrarFormulario(false);
            obtenerCursos(); // Refresca la tabla
        } catch (error) {
            console.error("Error al modificar curso:", error);
            Alert.alert("Error", "No se pudo actualizar el curso");
        }
    };

    React.useEffect(() => {
    obtenerCursos();
    obtenerGrados();
    obtenerJornadas();
    }, []);

    // Filtrado de cursos según la búsqueda
    const filteredData = cursos.filter(
        (item) =>
            item.Curso_Nombre?.toLowerCase().includes(search.toLowerCase()) ||
            item.Grado_Nombre?.toLowerCase().includes(search.toLowerCase()) ||
            item.Jornada_Nombre?.toLowerCase().includes(search.toLowerCase())
    );

    // Paginación
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

  return (
    <View style={styles.contenedor}>

        <Encabezado />

        <Desplegable />

        {/* 👉 Scroll vertical */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      
        <View style={styles.centroUsuario}>
            
            {/* Botones de grados, jornadas y materias */}

            <View style={styles.BotonesPlataforma}>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('Materia')}>
                    <FontAwesome5 name="book" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Materias</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('Grado')}>
                    <FontAwesome5 name="temperature-low" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Grados</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('Jornada')}>
                    <FontAwesome5 name="clock" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Jornadas</Text>
                </TouchableOpacity>

            </View>

            {/* ----------------------------------------- */}

            <View style={styles.tituloUsuario}>
                <Text style={styles.titleUsuario}>Cursos Actuales</Text>
                
                <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('CrearCurso')}>
                    <FontAwesome5 name="layer-group" size={16} color="#fff" />
                    <Text style={styles.textoCrearUsuario}> Crear</Text>
                </TouchableOpacity>
            </View>

            {/*Formulario de modificar curso*/}
            {mostrarFormulario && cursoSeleccionado && (
            <View style={styles.formularioModificar}>
                <Text style={styles.titleUsuario}>Modificar Curso</Text>

                {/* Picker de grado */}
                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10 }}>
                    <Picker
                        selectedValue={cursoSeleccionado.grado_id}
                        onValueChange={(value) =>
                            setCursoSeleccionado({ ...cursoSeleccionado, grado_id: value ? parseInt(value) : null })
                        }
                    >
                        <Picker.Item label="Seleccione grado" value={null} />
                        {grados.map((g) => (
                            <Picker.Item key={g.ID} label={g.Grado_Nombre} value={g.ID} />
                        ))}
                    </Picker>
                </View>

                {/* Picker de jornada */}
                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20 }}>
                    <Picker
                        selectedValue={cursoSeleccionado.jornada_id}
                        onValueChange={(value) =>
                            setCursoSeleccionado({ ...cursoSeleccionado, jornada_id: value ? parseInt(value) : null })
                        }
                    >
                        <Picker.Item label="Seleccione jornada" value={null} />
                        {jornadas.map((j) => (
                            <Picker.Item key={j.ID} label={j.Jornada_Nombre} value={j.ID} />
                        ))}
                    </Picker>
                </View>

                {/* Botones */}
                <View style={styles.formularioModificarBotones}>
                <TouchableOpacity
                    style={styles.botonCrearUsuario}
                    onPress={modificarCurso} // Guarda cambios
                >
                    <Text style={styles.textoCrearUsuario}>Modificar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonCrearUsuario}
                    onPress={() => setMostrarFormulario(false)} // Cancela
                >
                    <Text style={styles.textoCrearUsuario}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}

            <View style={styles.contenedorTabla}>
                
                <View style={styles.container}>
                    {/* Barra de búsqueda */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar..."
                        value={search}
                        onChangeText={(text) => {
                        setSearch(text);
                        setPage(0); // reiniciar a la primera página al buscar
                        }}
                    />

                    {/* Mostrar cantidad de registros */}
                    <Text style={styles.infoRegistros}>
                        Mostrando {from + 1}-{to} de {filteredData.length} registros
                    </Text>

                    {/* Scroll horizontal para columnas grandes */}
                    <ScrollView horizontal>
                        <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.tablaHead}>ID</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Curso</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Grado</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Jornada</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Infomacion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>

                        {filteredData.slice(from, to).map((curso, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.ID}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Curso_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Grado_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Jornada_Nombre}</Text></DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerCurso', { id: curso.ID })}>
                                    <FontAwesome name="info" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>
                            
                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity
                                    style={styles.botonModificar}
                                    onPress={() => {
                                        setCursoSeleccionado({
                                            ID: curso.ID,
                                            Curso_Nombre: curso.Curso_Nombre,
                                            grado_id: grados.find(g => g.Grado_Nombre === curso.Grado_Nombre)?.ID || null,
                                            jornada_id: jornadas.find(j => j.Jornada_Nombre === curso.Jornada_Nombre)?.ID || null,
                                        });
                                        setMostrarFormulario(true);
                                    }}
                                >
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarCurso(curso.ID)}>
                                    <FontAwesome name="trash" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                        </DataTable.Row>
                        ))}


                        {/* Paginación */}
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
                            onPageChange={(p) => setPage(p)}
                            label={`${from + 1}-${to} de ${filteredData.length}`}
                            numberOfItemsPerPage={itemsPerPage}
                            showFastPagination
                        />
                        </DataTable>
                    </ScrollView>
                </View>

            </View>

        </View>

        <Footer />

        </ScrollView>
        
        

    </View>
  );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1, // ocupa toda la pantalla
        flexDirection: 'column',
        backgroundColor: colors.fondo, // usamos variable
        margin: 0,
        padding: 0,
        width: '100%',
    },
    
    centroUsuario: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },

    tituloUsuario: {
        width: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    botonCrearUsuario: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    textoCrearUsuario: {
        color: 'white',
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },

    contenedorTabla:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        marginVertical: 20,
    },
    container: {
        padding: 10,
        backgroundColor: colors.fondo,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.azulSecundario,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    infoRegistros: {
        marginBottom: 5,
        fontSize: 14,
        color: '#333',
    },
    
    // Estilos de la tabla
    // Estilos th
    tablaHead: {
        justifyContent: 'center', 
        minWidth: 90, 
        borderWidth: 1, 
        borderColor: colors.azulPrimario
    },
    // Estilos td
    tablaBody: {
        justifyContent: 'center', 
        width: 100,
        borderWidth: 1, 
        borderColor: colors.azulPrimario
    },
    // Estilos botones
    botonAccion: {
        alignItems: 'center',
        backgroundColor: '#17a2b8',
        padding: 5,
        width: 25,
        borderRadius: 5,
        marginHorizontal: 2,
    },

    botonModificar: {
        alignItems: 'center',
        backgroundColor: '#2600FFFF',
        padding: 5,
        width: 25,
        borderRadius: 5,
        marginHorizontal: 2,
    },

    botonEliminar: {
        alignItems: 'center',
        backgroundColor: '#dc3545',
        width: 25,
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    // Fin tabla

    //botonones plataforma
    BotonesPlataforma:{
        minWidth: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    botonPlataforma: {
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        width: 95,
        borderTopColor: colors.azulPrimario,
        borderTopWidth: 3,
    },
    textobotonPlataforma:{
        color: colors.azulPrimario
    },
    formularioModificar:{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        minWidth: '90%',
        marginTop: 20,
        alignItems: 'center',
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        marginTop: 10,
    },
    formularioModificarBotones: {
        flexDirection: 'row',
        minWidth: '60%',
        justifyContent: 'space-between',
    }
});