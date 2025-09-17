import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native"; // 👈 para recibir params
import { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import Encabezado from "../Encabezado";
import Footer from "../footer";
import Desplegable from "../Desplegable";
import { apiFetch } from "../api";
import colors from '../colors';

export default function Persona({ navigation }) {

    const route = useRoute();
    const { id } = route.params; // 👈 id del aula recibido

    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = useState("");

    // 🔹 Cargar personas desde el backend
    useEffect(() => {
        const fetchUsuarios = async () => {
        try {
            const res = await apiFetch(`/Aulas/${id}/integrantes`);
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
        };
        fetchUsuarios();
    }, [id]);

    // 🔹 Filtrado
    const filteredData = usuarios.filter(
        (item) =>
        item.ID.toString().includes(search) ||
        item.Primer_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        (item.Segundo_Nombre || "").toLowerCase().includes(search.toLowerCase()) ||
        item.Primer_Apellido.toLowerCase().includes(search.toLowerCase()) ||
        (item.Segundo_Apellido || "").toLowerCase().includes(search.toLowerCase())
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
    
                {/* Navegardor de fucniones del Aula */}
                <View style={styles.tituloTrabajo}>
                    
                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate("VerAula", { id })}>
                        <Text style={styles.textoControlAula}> Inicio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Trabajo', { id })}>
                        <Text style={styles.textoControlAula}> Trabajos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Nota', { id })}>
                        <Text style={styles.textoControlAula}> Notas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate("Persona", { id })}>
                        <Text style={styles.textoControlAula}> Personas</Text>
                    </TouchableOpacity>
                    
                </View>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Personas del aula</Text>
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
                                <DataTable.Title style={styles.tablaHead}>ID</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Nombre</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>sNombre</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>pApellido</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>sApellido</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((usuario, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuario.ID}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuario.Primer_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuario.Segundo_Nombre || ""}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuario.Primer_Apellido}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuario.Segundo_Apellido || ""}</Text></DataTable.Cell>
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
        width: 285,
        height: 'auto',
        justifyContent: 'flex-start',
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
        minWidth: 90, 
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
});