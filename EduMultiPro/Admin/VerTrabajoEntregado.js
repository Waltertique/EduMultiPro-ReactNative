import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function VerTrabajoEntregado({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    // Datos estáticos de ejemplo
    const data = [
        { id: '1', Nombre: 'Juan' },
        { id: '2', Nombre: 'Juan' },
        { id: '3', Nombre: 'Juan' },
        { id: '4', Nombre: 'Juan' },
        { id: '5', Nombre: 'Juan' },
        { id: '6', Nombre: 'Juan' },
    ];

    // Filtrado por búsqueda
    const filteredData = data.filter(
        (item) =>
        item.id.includes(search) ||
        item.Nombre.toLowerCase().includes(search.toLowerCase()) 
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
    
                {/* Navegardor de fucniones del trabajo */}
                <View style={styles.tituloTrabajo}>
                    
                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajo')}>
                        <Text style={styles.textoControlAula}> Trabajo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajoEntregado')}>
                        <Text style={styles.textoControlAula}> Entregas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Trabajo')}>
                        <Text style={styles.textoControlAula}> Salir</Text>
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
                                <DataTable.Title style={styles.tablaHead}>Nombre</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Ver</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((trabajo, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{trabajo.Nombre}</Text></DataTable.Cell>

                                <DataTable.Cell style={styles.tablaBody}>
                                    <TouchableOpacity style={styles.botonAccion}>
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

                <View style={styles.contenedorNota}>
                    <Text style={styles.nombre}>Johan Sneider Madrigal Tique</Text>
                    <Text style={styles.nota}>Nota: 100</Text>
                    <Text style={styles.archivo}>Ver Archivo</Text>
                    <Text style={styles.archivo}>Ver Archivo</Text>
                    <Text style={styles.fecha}>Fecha de Entrega: 19/04/3554</Text>

                    {/* Formulario Para asignar una nota */}
                    <View style={styles.ingresoNota}>
                        <TextInput style={styles.datosNota} placeholder='Nota'/>
                        <TouchableOpacity style={styles.botonNota}>
                            <Text style={styles.textoCrearAula}>Enviar</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.botonEliminar}>
                        <Text style={styles.textoCrearAula}> Salir</Text>
                    </TouchableOpacity>
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
    contenedorTabla:{
        backgroundColor: colors.fondo,
        padding: 1,
        borderRadius: 20,
        width: '90%',
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
    // Fin tabla
    contenedorNota:{
        paddingVertical: 10,
        minWidth: '90%',
        borderWidth: 1,
    },
    nombre:{
        marginLeft: 20
    },
    nota:{
        paddingVertical: 10,
        paddingLeft: 20,
        borderBottomWidth: 1
    },
    archivo:{
        marginTop: 10,
        marginLeft: 20
    },
    fecha:{
        marginTop: 10,
        paddingTop: 10,
        paddingLeft: 20,
        borderTopWidth: 1
    },
    //comentario
    ingresoNota: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosNota:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingLeft: 20,
        width: 130,
        marginTop: 15,
        marginLeft: 20,
    },
    botonNota: {
        marginTop: 15,
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        width: 80,
        height: 41,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botonEliminar: {
        marginTop: 15,
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        borderRadius: 20,
        width: 70,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },  
});