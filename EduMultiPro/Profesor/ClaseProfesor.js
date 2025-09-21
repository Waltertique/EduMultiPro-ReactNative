import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors'; // tus variables de color
import { apiFetch } from "../api";

export default function ClaseProfesor({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');
    const [aulas, setAulas] = React.useState([]);
    const [materias, setMaterias] = React.useState([]);
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    const [aulaSeleccionada, setAulaSeleccionada] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [usuario, setUsuario] = React.useState(null);

    // cargar aulas y materias
    React.useEffect(() => {
        const cargar = async () => {
        try {
            const usuarioStr = await AsyncStorage.getItem("usuario");
            if (!usuarioStr) {
            Alert.alert("Error", "No se encontró usuario en sesión");
            setLoading(false);
            return;
            }
            const userObj = JSON.parse(usuarioStr);
            setUsuario(userObj); // 👈 guardamos el usuario en el estado

            // aulas del usuario
            const resAulas = await apiFetch(`/Aulas/usuario/${userObj.id}`);
            const dataAulas = await resAulas.json();
            setAulas(dataAulas || []);

            // materias (para el picker)
            const resMat = await apiFetch(`/Materias`);
            const dataMat = await resMat.json();
            setMaterias(dataMat || []);
        } catch (err) {
            console.error("❌ Error cargando datos:", err);
            Alert.alert("Error", "No se pudieron cargar las aulas o materias");
        } finally {
            setLoading(false);
        }
        };

        cargar();
    }, []);

    // eliminar aula (confirmación + llamada API)
    const eliminarAula = (id) => {
        Alert.alert(
        "Confirmar",
        "¿Estás seguro de eliminar esta aula?",
        [
            { text: "Cancelar", style: "cancel" },
            { 
            text: "Eliminar", 
            style: "destructive",
            onPress: async () => {
                try {
                const res = await apiFetch(`/Aulas/${id}`, { method: "DELETE" });
                const data = await res.json();
                Alert.alert("Resultado", data.mensaje || "Aula eliminada");
                setAulas(prev => prev.filter(a => a.ID !== id));
                } catch (err) {
                console.error("❌ Error eliminando aula:", err);
                Alert.alert("Error", "No se pudo eliminar el aula");
                }
            }
            }
        ]
        );
    };

    // abrir formulario modificar
    const handleModificarClick = (aula) => {
        setAulaSeleccionada({
        ...aula,
        // asegurar keys necesarias:
        Aula_Nombre: aula.Aula_Nombre ?? "",
        materia_id: aula.materia_id ?? (aula.Materia_ID ?? ""),
        });
        setMostrarFormulario(true);
    };

    // guardar cambios (PUT)
    const guardarCambios = async () => {
        if (!aulaSeleccionada?.Aula_Nombre || !aulaSeleccionada?.materia_id) {
        Alert.alert("Error", "Debe completar el nombre y seleccionar materia");
        return;
        }

        try {
        const res = await apiFetch(`/Aulas/${aulaSeleccionada.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Aula_Nombre: aulaSeleccionada.Aula_Nombre,
            materia_id: aulaSeleccionada.materia_id,
            }),
        });
        const data = await res.json();
        Alert.alert("Resultado", data.mensaje || "Aula actualizada");

        // refrescar lista de aulas
        const usuarioStr = await AsyncStorage.getItem("usuario");
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
        if (usuario) {
            const resAulas = await apiFetch(`/Aulas/usuario/${usuario.id}`);
            const dataAulas = await resAulas.json();
            setAulas(dataAulas || []);
        }

        setMostrarFormulario(false);
        setAulaSeleccionada(null);
        } catch (err) {
        console.error("❌ Error guardando cambios:", err);
        Alert.alert("Error", "No se pudo guardar la modificación");
        }
    };

    // filtro búsqueda y paginación
    const filteredData = aulas.filter((item) =>
        (item.Aula_Nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.Materia_Nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.Curso_Nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.Profesor || "").toLowerCase().includes(search.toLowerCase())
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}> 

                    <View style={styles.tituloUsuario}> 
                        <Text style={styles.titleUsuario}>Mis Aulas</Text>  

                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('CrearAulaProfesor')}>
                            <FontAwesome name="users" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Crear</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Formulario Modificar */}
                    { mostrarFormulario && aulaSeleccionada && (
                        <View style={styles.formularioModificar}>
                        <Text style={styles.titleUsuario}>Modificar Aula</Text>
                        <TextInput
                            style={styles.datosFormulario}
                            placeholder='Nombre del aula'
                            value={aulaSeleccionada.Aula_Nombre}
                            onChangeText={(text) => setAulaSeleccionada(prev => ({ ...prev, Aula_Nombre: text }))}
                        />

                        <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 8, minWidth: '80%', marginTop: 10 }}>
                            <Picker
                            selectedValue={aulaSeleccionada.materia_id}
                            onValueChange={(value) => setAulaSeleccionada(prev => ({ ...prev, materia_id: value }))}
                            >
                            <Picker.Item label="Seleccione materia" value="" />
                            {materias.map(m => (
                                <Picker.Item key={m.ID} label={m.Materia_Nombre} value={m.ID} />
                            ))}
                            </Picker>
                        </View>

                        <View style={styles.formularioModificarBotones}>
                            <TouchableOpacity style={styles.botonCrearUsuario} onPress={guardarCambios}>
                            <Text style={styles.textoCrearUsuario}> Guardar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            style={styles.botonCrearUsuario}
                            onPress={() => { setMostrarFormulario(false); setAulaSeleccionada(null); }}
                            >
                            <Text style={styles.textoCrearUsuario}> Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    )}
                    
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.azulPrimario} />
                    ) : (
                    <View style={styles.contenedorTabla}> 
                        <View style={styles.container}> 
                            {/* Barra de búsqueda */} 
                            <TextInput 
                                style={styles.searchInput} 
                                placeholder="Buscar..." 
                                value={search} onChangeText={(text) => { 
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
                                    <DataTable.Title style={styles.tablaHead}>Nombre</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Materia</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Curso</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Profesor</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Ver Aula</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title> 
                                    <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title> 
                                </DataTable.Header> 
                                
                                {filteredData.slice(from, to).map((aula) => (
                                    <DataTable.Row key={aula.ID}>
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Aula_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Materia_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Curso_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Profesor}</Text></DataTable.Cell> 

                                        <DataTable.Cell style={styles.tablaBody}>
                                            <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerAulaProfesor', { id: aula.ID })}>
                                                <FontAwesome name="info" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </DataTable.Cell>
            
                                        <DataTable.Cell style={styles.tablaBody}>
                                            {usuario && aula.usuario_id === usuario.id && (
                                            <TouchableOpacity style={styles.botonModificar} onPress={() => handleModificarClick(aula)}>
                                                <FontAwesome name="edit" size={16} color="#fff" />
                                            </TouchableOpacity>
                                            )}
                                        </DataTable.Cell>
            
                                        <DataTable.Cell style={styles.tablaBody}>
                                            {usuario && aula.usuario_id === usuario.id && (
                                            <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarAula(aula.ID)}>
                                                <FontAwesome name="trash" size={16} color="#fff" />
                                            </TouchableOpacity>
                                            )}
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
                    )}
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
    
    centroProfeso: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    tituloUsuario: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '90%',
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 8,
    },
    titleUsuario: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bbd',
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
        minWidth: 120, 
        borderWidth: 1, 
        borderColor: colors.azulPrimario
    },
    // Estilos td
    tablaBody: {
        justifyContent: 'center', 
        width: 150, 
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
        marginTop: 15
    }
})