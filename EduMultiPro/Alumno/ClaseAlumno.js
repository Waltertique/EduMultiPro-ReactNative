import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataTable } from 'react-native-paper';
import { apiFetch } from "../api";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function ClaseAlumno({ navigation }) {

    const [aulas, setAulas] = React.useState([]);
    const [page, setPage] = React.useState(0); 
    const itemsPerPage = 10; 
    const [search, setSearch] = React.useState('');  
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAulas = async () => {
            try {
                const usuario = JSON.parse(await AsyncStorage.getItem("usuario"));
                if (!usuario) return;

                const res = await apiFetch(`/Aulas/usuario/${usuario.id}`);
                const data = await res.json();
                setAulas(data);
            } catch (error) {
                console.error("❌ Error cargando aulas:", error);
                Alert.alert("Error", "No se pudieron cargar las aulas");
            } finally {
                setLoading(false);
            }
        };

        fetchAulas();
    }, []);

    const filteredData = aulas.filter((item) =>
        item.Aula_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Materia_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Curso_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Profesor.toLowerCase().includes(search.toLowerCase())
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>
                    
                    <View style={styles.tituloUsuario}> 
                        <Text style={styles.titleUsuario}>Mis Aulas</Text>  
                    </View>

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
                                </DataTable.Header> 
                                
                                {filteredData.slice(from, to).map((aula, index) => ( 
                                        <DataTable.Row key={index}> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Aula_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Materia_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Curso_Nombre}</Text></DataTable.Cell> 
                                        <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Profesor}</Text></DataTable.Cell> 

                                        <DataTable.Cell style={styles.tablaBody}>
                                            <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerAulaAlumno', { id: aula.ID })}>
                                                <FontAwesome name="info" size={16} color="#fff" />
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
    
    centroAlumno: {
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