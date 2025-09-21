import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors'; 
import { apiFetch } from "../api";

export default function TrabajoAlumno({ navigation, route }) {

    const { id } = route.params; // id del aula
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    const [trabajos, setTrabajos] = React.useState([]);

    // 🔹 Obtener trabajos del aula
    React.useEffect(() => {
        const obtenerTrabajos = async () => {
        try {
            const res = await apiFetch(`/Trabajos/Aula/${id}`);
            const data = await res.json();
            setTrabajos(data);
        } catch (error) {
            console.error("Error al obtener trabajos:", error);
            Alert.alert("Error", "No se pudieron cargar los trabajos");
        }
        };
        obtenerTrabajos();
    }, [id]);

    // 🔹 Filtrado por búsqueda
    const filteredData = trabajos.filter(
        (item) =>
        item.Titulo_Trabajo.toLowerCase().includes(search.toLowerCase()) ||
        item.Fecha_Trabajo.toLowerCase().includes(search.toLowerCase())
    );

    // 🔹 Paginación
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>

                    {/* Navegardor de fucniones del Aula */}
                    <View style={styles.tituloTrabajo}>
                        
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerAulaAlumno', { id })}>
                            <Text style={styles.textoControlAula}> Inicio</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('TrabajoAlumno', { id })}>
                            <Text style={styles.textoControlAula}> Trabajos</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate("PersonaAlumno", { id })}>
                            <Text style={styles.textoControlAula}> Personas</Text>
                        </TouchableOpacity>
                        
                    </View>
        
                    <View style={styles.tituloUsuario}>
                        <Text style={styles.titleUsuario}>Trabajos Actuales</Text>
    
                    </View>
    
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
                                    <DataTable.Title style={styles.tablaHead}>Titulo</DataTable.Title>
                                    <DataTable.Title style={styles.tablaHead}>Fecha</DataTable.Title>
                                    <DataTable.Title style={styles.tablaHead}>Infomacion</DataTable.Title>
                                </DataTable.Header>
                            
                                {filteredData.slice(from, to).map((trabajo, index) => (
                                    <DataTable.Row key={index}>
                                    <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{trabajo.Titulo_Trabajo}</Text></DataTable.Cell>
                                    <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{new Date(trabajo.Fecha_Trabajo).toLocaleDateString()}</Text></DataTable.Cell>
    
                                    <DataTable.Cell style={styles.tablaBody}>
                                        <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerTrabajoAlumno', { id: trabajo.ID, aula_id: id })}>
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
        minWidth: '90%',
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
        minWidth: 200, 
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
    botonControlAula: {
        flexDirection: 'row',
        backgroundColor: colors.azulClaro,
        width: 80,
        justifyContent: 'center'
    },
    textoControlAula: {
        color: 'Black',
        fontSize: 16
    },
    tituloTrabajo: {
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 5,
        marginBottom: 20
    },
})