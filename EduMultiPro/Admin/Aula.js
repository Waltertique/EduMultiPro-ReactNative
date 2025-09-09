import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

export default function Aula({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    // Estados para API
    const [aulas, setAulas] = React.useState([]);
    const [materias, setMaterias] = React.useState([]);
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    const [aulaSeleccionada, setAulaSeleccionada] = React.useState(null);

    // Obtener aulas
    const obtenerAulas = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Aulas");
        const data = await res.json();
        setAulas(data);
        } catch (error) {
        console.error("Error al obtener aulas:", error);
        }
    };

    // Obtener materias
    const obtenerMaterias = async () => {
        try {
        const res = await fetch("http://192.168.0.3:3000/api/edumultipro/Materias");
        const data = await res.json();
        setMaterias(data);
        } catch (error) {
        console.error("Error al obtener materias:", error);
        }
    };

    // Eliminar aula
    const eliminarAula = async (id) => {
        Alert.alert("Confirmar", "¿Seguro que deseas eliminar esta aula?", [
        { text: "Cancelar", style: "cancel" },
        { 
            text: "Eliminar", 
            onPress: async () => {
            try {
                const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Aulas/${id}`, {
                method: "DELETE"
                });
                const data = await res.json();
                Alert.alert("Aviso", data.mensaje);
                obtenerAulas();
            } catch (error) {
                console.error("Error al eliminar aula:", error);
            }
            }
        }
        ]);
    };

    // Guardar cambios de modificación
    const guardarCambios = async () => {
        try {
        const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Aulas/${aulaSeleccionada.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aulaSeleccionada)
        });
        const data = await res.json();
        Alert.alert("Aviso", data.mensaje);
        setMostrarFormulario(false);
        setAulaSeleccionada(null);
        obtenerAulas();
        } catch (error) {
        console.error("Error al modificar aula:", error);
        }
    };

    // Cargar datos al inicio
    React.useEffect(() => {
        obtenerAulas();
        obtenerMaterias();
    }, []);

    // Filtrar
    const filteredData = aulas.filter(
        (item) =>
        item.ID.toString().includes(search) ||
        item.Aula_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Materia_Nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.Curso_Jornada.toLowerCase().includes(search.toLowerCase()) ||
        item.Profesor.toLowerCase().includes(search.toLowerCase())
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

            <View style={styles.tituloUsuario}>
                <Text style={styles.titleUsuario}>Aulas Actuales</Text>
                
                <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('CrearAula')}>
                    <FontAwesome name="users" size={16} color="#fff" />
                    <Text style={styles.textoCrearUsuario}> Crear</Text>
                </TouchableOpacity>

            </View>

            {/* Formulario Modificar */}
            {mostrarFormulario && aulaSeleccionada && (
            <View style={styles.formularioModificar}>
                <Text style={styles.titleUsuario}>Modificar Aula</Text>
                <TextInput
                    style={styles.datosFormulario}
                    placeholder='Nombre'
                    value={aulaSeleccionada.Aula_Nombre}
                    onChangeText={(text) => setAulaSeleccionada({ ...aulaSeleccionada, Aula_Nombre: text })}
                />

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                    <Picker
                        selectedValue={aulaSeleccionada.materia_id || ""}
                        onValueChange={(value) => setAulaSeleccionada({ ...aulaSeleccionada, materia_id: value })}
                        >
                        <Picker.Item label="Seleccione una Materia" value="" />
                        {materias.map((m) => (
                            <Picker.Item key={m.ID} label={m.Materia_Nombre} value={m.ID} />
                        ))}
                    </Picker>
                </View>
                
                <View style={styles.formularioModificarBotones}>
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={guardarCambios}>
                        <Text style={styles.textoCrearUsuario}> Modificar</Text>
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
                            <DataTable.Title style={styles.tablaHead}>Aula</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Materia</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Curso</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Profesor</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Infomacion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>
                    
                        {filteredData.slice(from, to).map((aula, index) => (
                            <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.ID}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Aula_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Materia_Nombre}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Curso_Jornada}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{aula.Profesor}</Text></DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerAula')}>
                                    <FontAwesome name="info" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonModificar} onPress={() => { setAulaSeleccionada(aula); setMostrarFormulario(true); }}>
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarAula(aula.ID)}>
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