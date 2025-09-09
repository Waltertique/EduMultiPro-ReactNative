import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

export default function Noticia({ navigation }) {

    const [noticias, setNoticias] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10; // 👉 ahora de 10 en 10
    const [search, setSearch] = React.useState('');

    // 🔹 Obtener Noticias desde el backend
    const obtenerNoticias = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Noticias"); 
        // 👉 en físico cambia 10.0.2.2 por la IP local de tu PC
        const data = await res.json();
        setNoticias(data);
        } catch (err) {
        console.error("❌ Error al obtener noticias:", err);
        Alert.alert("Error", "No se pudieron cargar las noticias");
        }
    };

    // 🔹 Eliminar noticia
    const eliminarNoticia = async (id) => {
        Alert.alert(
        "Confirmar",
        "¿Seguro que quieres eliminar esta noticia?",
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
                try {
                const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Noticias/${id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                Alert.alert("Info", data.mensaje);

                // Actualizar lista local
                setNoticias((prev) => prev.filter((n) => n.ID !== id));
                } catch (error) {
                console.error("❌ Error al eliminar noticia:", error);
                Alert.alert("Error", "No se pudo eliminar la noticia");
                }
            }
            }
        ]
        );
    };

    // 🔹 Filtrado de búsqueda
    const filteredData = noticias.filter(
        (item) =>
        item.ID.toString().includes(search) ||
        item.Titulo_Noticia?.toLowerCase().includes(search.toLowerCase()) ||
        item.Tipo?.toLowerCase().includes(search.toLowerCase())
    );

    // 🔹 Paginación
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

    React.useEffect(() => {
        obtenerNoticias();
    }, []);

  return (
    <View style={styles.contenedor}>

        <Encabezado />

        <Desplegable />

        {/* 👉 Scroll vertical */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      
        <View style={styles.centroUsuario}>

            <View style={styles.tituloUsuario}>
                <Text style={styles.titleUsuario}>Noticias Actuales</Text>
                
                <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('CrearNoticia')}>
                    <FontAwesome name="newspaper-o" size={16} color="#fff" />
                    <Text style={styles.textoCrearUsuario}> Crear</Text>
                </TouchableOpacity>

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
                            <DataTable.Title style={styles.tablaHead}>Noticia</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Tipo</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Infomacion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>
                    
                        {filteredData.slice(from, to).map((noticia, index) => (
                            <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{noticia.ID}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{noticia.Titulo_Noticia}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{noticia.Tipo}</Text></DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerNoticia')}>
                                    <FontAwesome name="info" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonModificar} onPress={() => navigation.navigate('ActualizarNoticia')}>
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarNoticia(noticia.ID)}>
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

});
