import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';
import { apiFetch } from "../api";

export default function ReporteClase({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const [totalAulas, setTotalAulas] = React.useState(0);
    const [aulas, setAulas] = React.useState([]);

    // 🔹 Consumir API al montar
    React.useEffect(() => {
        apiFetch("/reportes/aulas")
        .then(res => {
            if (!res.ok) throw new Error("Error cargando aulas");
            return res.json();
        })
        .then(data => {
            setTotalAulas(data.totalAulas);

            // 👇 Ordenar por ID antes de guardar en el estado
            const aulasOrdenadas = data.aulas.sort((a, b) => a.aula_id - b.aula_id);
            setAulas(aulasOrdenadas);
        })
        .catch(err => {
            console.error(err);
            Alert.alert("Error", "No se pudieron cargar las aulas");
        })
        .finally(() => setLoading(false));
    }, []);

    // 🔹 Filtrado por búsqueda
    const filteredData = aulas.filter(
        (item) =>
        item.aula_id.toString().includes(search) ||
        item.Aula_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Materia_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.curso_jornada.toLowerCase().includes(search.toLowerCase()) ||
        item.profesor.toLowerCase().includes(search.toLowerCase()) ||
        item.total_usuarios.toString().includes(search) ||
        item.total_anuncios.toString().includes(search) ||
        item.total_comentarios.toString().includes(search) ||
        item.total_trabajos.toString().includes(search)
    );

    // 🔹 Paginación
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

  return (
    <View style={styles.contenedor}>

        <Encabezado />

        <Desplegable />

        {/* 👉 Scroll vertical */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      
        <View style={styles.centroUsuario}>

            {/* Botones de plataforma, clase y Agenda */}

            <View style={styles.BotonesPlataforma}>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('Reporte')}>
                    <FontAwesome5 name="book" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Plataforma</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('ReporteClase')}>
                    <FontAwesome5 name="temperature-low" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Clase</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('ReporteAgenda')}>
                    <FontAwesome5 name="clock" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Agenda</Text>
                </TouchableOpacity>

            </View>

                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Aulas</Text>
                    
                    <Text style={styles.titleUsuario}>Aulas Totales: {totalAulas}</Text>
                </View>

                <View style={styles.contenedorTabla}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.azulPrimario} />
                    ) : (
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
                            Mostrando {filteredData.length > 0 ? from + 1 : 0}-{to} de {filteredData.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}>ID</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Nombre</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Materia</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Curso</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Profesor</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>CantidadUsuario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>CantidadAnuncio</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>CantidadComentario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>CantidadTrabajo</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((aula, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.aula_id}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Aula_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Materia_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.curso_jornada}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.profesor}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.total_usuarios}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.total_anuncios}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.total_comentarios}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.total_trabajos}</Text></DataTable.Cell>
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
                    )}
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
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },
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
    // Fin tabla

});