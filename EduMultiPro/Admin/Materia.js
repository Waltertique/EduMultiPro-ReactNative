import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

export default function Materia({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');
    const [materias, setMaterias] = React.useState([]);

    // Formularios
    const [nuevaMateria, setNuevaMateria] = React.useState({ nombre: '', descripcion: '' });
    const [materiaSeleccionada, setMateriaSeleccionada] = React.useState(null);

    // Obtener materias desde la API
    const obtenerMaterias = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Materias");
        const data = await res.json();
        setMaterias(data);
        } catch (err) {
        Alert.alert("Error", "No se pudieron cargar las materias");
        console.error(err);
        }
    };

    React.useEffect(() => {
        obtenerMaterias();
    }, []);

    // Crear materia
    const crearMateria = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Materias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Materia_Nombre: nuevaMateria.nombre,
            Descripcion_Materia: nuevaMateria.descripcion,
            }),
        });
        const data = await res.json();
        Alert.alert("Aviso", data.mensaje);
        setNuevaMateria({ nombre: '', descripcion: '' });
        obtenerMaterias();
        } catch (err) {
        Alert.alert("Error", "No se pudo crear la materia");
        console.error(err);
        }
    };

    // Modificar materia
    const modificarMateria = async () => {
        try {
        const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Materias/${materiaSeleccionada.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            Materia_Nombre: materiaSeleccionada.Materia_Nombre,
            Descripcion_Materia: materiaSeleccionada.Descripcion_Materia,
            }),
        });
        const data = await res.json();
        Alert.alert("Aviso", data.mensaje);
        setMateriaSeleccionada(null);
        obtenerMaterias();
        } catch (err) {
        Alert.alert("Error", "No se pudo modificar la materia");
        console.error(err);
        }
    };

    // Eliminar materia
    const eliminarMateria = async (id) => {
        Alert.alert("Confirmar", "¿Deseas eliminar esta materia?", [
        { text: "Cancelar", style: "cancel" },
        {
            text: "Eliminar",
            onPress: async () => {
            try {
                const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Materias/${id}`, {
                method: "DELETE",
                });
                const data = await res.json();
                Alert.alert("Aviso", data.mensaje);
                obtenerMaterias();
            } catch (err) {
                Alert.alert("Error", "No se pudo eliminar la materia");
                console.error(err);
            }
            },
        },
        ]);
    };

    // Filtrado
    const filteredData = materias.filter(
        (item) =>
        item.ID.toString().includes(search) ||
        item.Materia_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Descripcion_Materia.toLowerCase().includes(search.toLowerCase())
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
                <Text style={styles.titleUsuario}>Materias Actuales</Text>
            </View>

            <View style={styles.ContenedorCrear}>
                <TextInput
                    style={styles.CrearMateriaInput}
                    placeholder="Nombre"
                    value={nuevaMateria.nombre}
                    onChangeText={(text) => setNuevaMateria((prev) => ({ ...prev, nombre: text }))}
                />
                <TextInput
                    style={styles.CrearMateriaInput}
                    placeholder="Descripcion"
                    value={nuevaMateria.descripcion}
                    onChangeText={(text) => setNuevaMateria((prev) => ({ ...prev, descripcion: text }))}
                />
                <TouchableOpacity style={styles.botonCrear} onPress={crearMateria}>
                    <Text style={styles.textoBotonPlataforma}> Crear Materia</Text>
                </TouchableOpacity>
            </View>

            {materiaSeleccionada && (
                <View style={styles.ContenedorModificar}>
                    <Text style={styles.titleUsuario}>Modificar Materia</Text>
                    <TextInput
                        style={styles.ModificarMateriaInput}
                        placeholder="Nombre"
                        value={materiaSeleccionada.Materia_Nombre}
                        onChangeText={(text) =>
                        setMateriaSeleccionada((prev) => ({ ...prev, Materia_Nombre: text }))
                        }
                    />
                    <TextInput
                        style={styles.ModificarMateriaInput}
                        placeholder="Descripcion"
                        value={materiaSeleccionada.Descripcion_Materia}
                        onChangeText={(text) =>
                        setMateriaSeleccionada((prev) => ({ ...prev, Descripcion_Materia: text }))
                        }
                    />

                    <View style={styles.formularioModificarBotones}>
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={modificarMateria}>
                            <Text style={styles.textoCrearUsuario}> Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.botonCrearUsuario}
                            onPress={() => setMateriaSeleccionada(null)}
                            >
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
                            <DataTable.Title style={styles.tablaHead}>Materia</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Descripcion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>

                        {filteredData.slice(from, to).map((materia, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{materia.ID}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{materia.Materia_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{materia.Descripcion_Materia}</Text></DataTable.Cell>
                            
                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity
                                    style={styles.botonModificar}
                                    onPress={() => setMateriaSeleccionada(materia)}
                                >
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity
                                    style={styles.botonEliminar}
                                    onPress={() => eliminarMateria(materia.ID)}
                                >
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