import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function Curso({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const [search, setSearch] = React.useState('');

    // Datos estáticos de ejemplo
    const data = [
        { id: '1', Curso: '101', Grado: 'Primero', Jornada: 'Mañana' },
        { id: '2', Curso: '201', Grado: 'Segundo', Jornada: 'Mañana' },
        { id: '3', Curso: '301', Grado: 'Tercero', Jornada: 'Tarde' },
        { id: '4', Curso: '401', Grado: 'Cuarto', Jornada: 'Tarde' },
        { id: '5', Curso: '501', Grado: 'Quinto', Jornada: 'Mixta' },
        { id: '6', Curso: '601', Grado: 'Sexto', Jornada: 'Mixta' },
    ];

    // Filtrado por búsqueda
    const filteredData = data.filter(
        (item) =>
        item.id.includes(search) ||
        item.Curso.toLowerCase().includes(search.toLowerCase()) ||
        item.Grado.toLowerCase().includes(search.toLowerCase()) ||
        item.Jornada.toLowerCase().includes(search.toLowerCase())
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

            <View style={styles.formularioModificar}>
                <Text style={styles.titleUsuario}>Modificar Curso</Text>
                <TextInput style={styles.datosFormulario} placeholder='Nombre' ></TextInput>

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                    <Picker selectedValue="Grado" onValueChange={() => {}}>
                        <Picker.Item label="Primero" value="op1" />
                        <Picker.Item label="Segundo" value="op2" />
                        <Picker.Item label="Tercero" value="op3" />
                    </Picker>
                </View>

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                    <Picker selectedValue="Jornada" onValueChange={() => {}}>
                        <Picker.Item label="Mañana" value="op1" />
                        <Picker.Item label="Tarder" value="op2" />
                        <Picker.Item label="Mixta" value="op3" />
                    </Picker>
                </View>
                
                <View style={styles.formularioModificarBotones}>
                    <TouchableOpacity style={styles.botonCrearUsuario}>
                        <Text style={styles.textoCrearUsuario}> Modificar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonCrearUsuario}>
                        <Text style={styles.textoCrearUsuario}> Cancelar</Text>
                    </TouchableOpacity>
                </View>
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
                            <DataTable.Title style={styles.tablaHead}>Curso</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Grado</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Jornada</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Infomacion</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Modificar</DataTable.Title>
                            <DataTable.Title style={styles.tablaHead}>Eliminar</DataTable.Title>
                        </DataTable.Header>

                        {filteredData.slice(from, to).map((curso, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.id}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Curso}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Grado}</Text></DataTable.Cell>
                            <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.Jornada}</Text></DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonAccion} onPress={() => navigation.navigate('VerCurso')}>
                                    <FontAwesome name="info" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>
                            
                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonModificar}>
                                    <FontAwesome name="edit" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>

                            <DataTable.Cell style={styles.tablaBody}>
                                <TouchableOpacity style={styles.botonEliminar}>
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