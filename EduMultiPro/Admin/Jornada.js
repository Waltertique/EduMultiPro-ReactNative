import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

export default function Jornada({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const [search, setSearch] = React.useState('');

    const [jornadas, setJornadas] = React.useState([]);

    // Estados crear
    const [nuevaJornada, setNuevaJornada] = React.useState({ nombre: '', descripcion: '' });

    // Estados modificar
    const [jornadaSeleccionada, setJornadaSeleccionada] = React.useState(null);

    // ✅ Obtener jornadas
    const obtenerJornadas = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Jornadas");
        const data = await res.json();
        setJornadas(data);
        } catch (error) {
        console.error("Error al obtener jornadas:", error);
        }
    };

    React.useEffect(() => {
        obtenerJornadas();
    }, []);

    // ✅ Crear jornada
    const crearJornada = async () => {
        if (!nuevaJornada.nombre || !nuevaJornada.descripcion) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
        }

        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Jornadas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Jornada_Nombre: nuevaJornada.nombre,
            Descripcion_Jornada: nuevaJornada.descripcion,
            }),
        });

        const data = await res.json();
        Alert.alert("✅", data.mensaje);
        setNuevaJornada({ nombre: "", descripcion: "" });
        obtenerJornadas();
        } catch (error) {
        console.error("Error al crear jornada:", error);
        }
    };

    // ✅ Modificar jornada
    const modificarJornada = async () => {
        if (!jornadaSeleccionada) return;

        try {
        const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Jornadas/${jornadaSeleccionada.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Jornada_Nombre: jornadaSeleccionada.Jornada_Nombre,
            Descripcion_Jornada: jornadaSeleccionada.Descripcion_Jornada,
            }),
        });

        const data = await res.json();
        Alert.alert("✅", data.mensaje);
        setJornadaSeleccionada(null);
        obtenerJornadas();
        } catch (error) {
        console.error("Error al modificar jornada:", error);
        }
    };

    // ✅ Eliminar jornada
    const eliminarJornada = async (id) => {
        Alert.alert("Confirmar", "¿Eliminar esta jornada?", [
        { text: "Cancelar" },
        {
            text: "Eliminar",
            onPress: async () => {
            try {
                const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Jornadas/${id}`, {
                method: "DELETE",
                });

                const data = await res.json();
                Alert.alert("✅", data.mensaje);
                obtenerJornadas();
            } catch (error) {
                console.error("Error al eliminar jornada:", error);
            }
            },
        },
        ]);
    };

    // ✅ Filtrado
    const filteredData = jornadas.filter(
        (item) =>
        item.ID.toString().includes(search) ||
        item.Jornada_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Descripcion_Jornada.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Paginación
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
                <Text style={styles.titleUsuario}>Jornadas Actuales</Text>
            </View>

            <View style={styles.ContenedorCrear}>
                <TextInput
                    style={styles.CrearMateriaInput}
                    placeholder='Nombre'
                    value={nuevaJornada.nombre}
                    onChangeText={(text) => setNuevaJornada((prev) => ({ ...prev, nombre: text }))}
                />
                <TextInput
                    style={styles.CrearMateriaInput}
                    placeholder='Descripcion'
                    value={nuevaJornada.descripcion}
                    onChangeText={(text) => setNuevaJornada((prev) => ({ ...prev, descripcion: text }))}
                />

                <TouchableOpacity style={styles.botonCrear} onPress={crearJornada}>
                    <Text style={styles.textoBotonPlataforma}> Crear Jornada</Text>
                </TouchableOpacity>

            </View>

            {/* Modificar Jornada */}
            {jornadaSeleccionada && (
                <View style={styles.ContenedorModificar}>
                    <Text style={styles.titleUsuario}>Modificar Jornada</Text>
                    <TextInput
                        style={styles.ModificarMateriaInput}
                        placeholder='Nombre'
                        value={jornadaSeleccionada.Jornada_Nombre}
                        onChangeText={(text) =>
                        setJornadaSeleccionada((prev) => ({ ...prev, Jornada_Nombre: text }))
                        }
                    />
                    <TextInput
                        style={styles.ModificarMateriaInput}
                        placeholder='Descripcion'
                        value={jornadaSeleccionada.Descripcion_Jornada}
                        onChangeText={(text) =>
                        setJornadaSeleccionada((prev) => ({ ...prev, Descripcion_Jornada: text }))
                        }
                    />

                    <View style={styles.formularioModificarBotones}>
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={modificarJornada}>
                            <Text style={styles.textoCrearUsuario}> Modificar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => setJornadaSeleccionada(null)}>
                            <Text style={styles.textoCrearUsuario}> Cancelar</Text>
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
                            <DataTable.Title style={styles.tablaHead}>Jornada</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Descripcion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>

                        {filteredData.slice(from, to).map((jornada, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{jornada.ID}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{jornada.Jornada_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{jornada.Descripcion_Jornada}</Text></DataTable.Cell>
                            
                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonModificar} onPress={() => setJornadaSeleccionada(jornada)}>
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarJornada(jornada.ID)}>
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
        fontSize: 25,
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
    ContenedorCrear:{
        backgroundColor: 'white',
        minWidth: '90%',
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20,
    },
    CrearMateriaInput:{
        borderWidth: 1,
        minWidth: '70%',
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
    },
    textoBotonPlataforma: {
        borderWidth: 1,
        width: 130,
        textAlign: 'center',
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: colors.azulSecundario,
        color: 'white',
        borderColor: colors.azulPrimario,
        marginTop: 15,
    },
// formulario modificar
    ContenedorModificar:{
        backgroundColor: 'white',
        minWidth: '90%',
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20,
    },
    ModificarMateriaInput:{
        borderWidth: 1,
        minWidth: '70%',
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
    },
    formularioModificarBotones: {
        flexDirection: 'row',
        minWidth: '50%',
        justifyContent: 'space-between',
        marginTop: 15,
    }
});