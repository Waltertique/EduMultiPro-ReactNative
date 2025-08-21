import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function Usuario() {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const [search, setSearch] = React.useState('');

    // Datos estáticos de ejemplo
    const data = [
        { id: '1', pNombre: 'Juan', sNombre: 'Carlos', pApellido: 'Pérez', sApellido: 'Gómez' },
        { id: '2', pNombre: 'María', sNombre: 'Luisa', pApellido: 'Rodríguez', sApellido: 'Díaz' },
        { id: '3', pNombre: 'Pedro', sNombre: 'José', pApellido: 'Martínez', sApellido: 'Torres' },
        { id: '4', pNombre: 'Ana', sNombre: 'Isabel', pApellido: 'Ramírez', sApellido: 'Mora' },
        { id: '5', pNombre: 'Sofía', sNombre: 'Alejandra', pApellido: 'García', sApellido: 'López' },
        { id: '6', pNombre: 'Luis', sNombre: 'Miguel', pApellido: 'Fernández', sApellido: 'Castro' },
    ];

    // Filtrado por búsqueda
    const filteredData = data.filter(
        (item) =>
        item.id.includes(search) ||
        item.pNombre.toLowerCase().includes(search.toLowerCase()) ||
        item.sNombre.toLowerCase().includes(search.toLowerCase()) ||
        item.pApellido.toLowerCase().includes(search.toLowerCase()) ||
        item.sApellido.toLowerCase().includes(search.toLowerCase())
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
                <Text style={styles.titleUsuario}>Gestion de Usuarios</Text>
                
                <TouchableOpacity style={styles.botonCrearUsuario}>
                    <FontAwesome name="user" size={16} color="#fff" />
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
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>ID</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>P Nombre</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>S Nombre</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>P Apellido</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>S Apellido</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>Infomacion</DataTable.Title>
                            <DataTable.Title style={{ paddingRight: 20, minWidth: 40 }}>Eliminar</DataTable.Title>
                        </DataTable.Header>

                        {filteredData.slice(from, to).map((usuario, index) => (
                            <DataTable.Row key={index}>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40 }}>{usuario.id}</DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40 }}>{usuario.pNombre}</DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40 }}>{usuario.sNombre}</DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40 }}>{usuario.pApellido}</DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40 }}>{usuario.sApellido}</DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40, justifyContent: 'center'}}>
                                <TouchableOpacity style={styles.botonAccion}>
                                    <FontAwesome name="info" size={16} color="#fff" />
                                </TouchableOpacity>
                            </DataTable.Cell>
                            <DataTable.Cell style={{ paddingRight: 20, minWidth: 40, justifyContent: 'center'}}>
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
    
    botonAccion: {
        alignItems: 'center',
        backgroundColor: '#17a2b8',
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

});