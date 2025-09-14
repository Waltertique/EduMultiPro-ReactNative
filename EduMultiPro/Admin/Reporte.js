import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function Reporte({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const [search, setSearch] = React.useState('');

    // Datos estáticos de ejemplo
    const data2 = [
        { id: '1', pNombre: 'juan', pApellido: 'perez', Curso: '103', Rol: 'Alumno' },
    ];

    // Filtrado por búsqueda
    const filteredData2 = data2.filter(
        (item) =>
        item.id.includes(search) ||
        item.pNombre.toLowerCase().includes(search.toLowerCase()) ||
        item.pApellido.toLowerCase().includes(search.toLowerCase()) ||
        item.Curso.toLowerCase().includes(search.toLowerCase()) ||
        item.Rol.toLowerCase().includes(search.toLowerCase()) 
    );

    // Datos estáticos de ejemplo
    const data1 = [
        { id: '1', Total: '11'},
    ];
    const filteredData1 = data1.filter(
        (item) =>
        item.id.includes(search) ||
        item.Total.toLowerCase().includes(search.toLowerCase()) 
    );
    
    const data = [
        { id: '1', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
        { id: '2', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
        { id: '3', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
        { id: '4', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
        { id: '5', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
        { id: '6', Materias: 'Materia1', Grado: 'Grado1', Jornada: 'Jornada1', Cantidad: '3' },
    ];

    // Filtrado por búsqueda
    const filteredData = data.filter(
        (item) =>
        item.id.includes(search) ||
        item.Materias.toLowerCase().includes(search.toLowerCase()) ||
        item.Grado.toLowerCase().includes(search.toLowerCase()) ||
        item.Jornada.toLowerCase().includes(search.toLowerCase()) ||
        item.Cantidad.toLowerCase().includes(search.toLowerCase())
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
            
            {/* Informacion del total de informacion de usuarios */}

            <View style={styles.title1}>
                <Text style={styles.textTitle}>Usuarios</Text>

                <View style={styles.ingresoComentario}>
                    <TextInput style={styles.datosComentar} placeholder='ID'/>
                    <TouchableOpacity style={styles.botonComentar}>
                        <Text style={styles.textoCrearAula}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>

                <View style={styles.contenedorTabla1}>
                    <View style={styles.container}>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>ID</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>pNombre</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>pApellido</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Curso</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Rol</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Informacion</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Cerrar</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData2.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.id}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.pNombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.pApellido}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Curso}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Rol}</Text></DataTable.Cell>

                                <DataTable.Cell style={styles.tablaBody}>
                                    <TouchableOpacity style={styles.botonAccion}>
                                        <FontAwesome name="info" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.tablaBody}>
                                    <TouchableOpacity style={styles.botonEliminar}>
                                        <FontAwesome name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            </DataTable>
                        </ScrollView>
                    </View>
                </View>

            <View style={styles.infoTitle}>
                <Text style={styles.textTitle2}>Total Usuarios</Text>
                <Text style={styles.textTitle2}>Total Coordinadores</Text>
            </View>
            <View style={styles.infoTotal}>
                <Text>41</Text>
                <Text>2</Text>
            </View>

            <View style={styles.infoTitle}>
                <Text style={styles.textTitle2}>Total Profesores</Text>
                <Text style={styles.textTitle2}>Total Alumnos</Text>
            </View>
            <View style={styles.infoTotal}>
                <Text>8</Text>
                <Text>29</Text>
            </View>
            
            {/* Informacion del total de informacion de cursos */}

            <View style={styles.title1}>
                <Text style={styles.textTitle}>Curso</Text>
            </View>

                <View style={styles.contenedorTabla1}>
                    
                    <View style={styles.container}>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Total Cursos</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>En Jornada Mañana</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>En Jornada Tarde</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>En Jornada Mixta</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData1.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Total}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Total}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Total}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Total}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            </DataTable>
                        </ScrollView>
                    </View>
                </View>

            {/* Informacion del total de informacion de la estructura */}

            <View style={styles.title1}>
                <Text style={styles.textTitle}>Estuctura</Text>
            </View>

            <View style={styles.infoTitle}>
                <Text style={styles.textTitle2}>Total Materias</Text>
                <Text style={styles.textTitle2}>Total Grados</Text>
                <Text style={styles.textTitle2}>Total Jornadas</Text>
            </View>
            <View style={styles.infoTotal}>
                <Text>10</Text>
                <Text>11</Text>
                <Text>3</Text>
            </View>
            
            {/* Informacion de las materias y las aulas que las usan */}

                <View style={styles.contenedorTabla}>
                    
                    <View style={styles.container}>
                        {/* Barra de búsqueda La cual no usaremos en estas tablas pero esta aqui de ejemplo  
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            value={search}
                            onChangeText={(text) => {
                            setSearch(text);
                            setPage(0); // reiniciar a la primera página al buscar
                            }}
                        />
                        */}
                        
                        {/* Mostrar cantidad de registros */}
                        <Text style={styles.infoRegistros}>
                            Mostrando {from + 1}-{to} de {filteredData.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Materias</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Aulas que las usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Materias}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Cantidad}</Text></DataTable.Cell>
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
            
            {/* Informacion de los grados y los cursos que los usan */}
                <View style={styles.contenedorTabla}>
                    
                    <View style={styles.container}>
                        {/* Barra de búsqueda La cual no usaremos en estas tablas pero esta aqui de ejemplo 
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            value={search}
                            onChangeText={(text) => {
                            setSearch(text);
                            setPage(0); // reiniciar a la primera página al buscar
                            }}
                        />
                        */}

                        {/* Mostrar cantidad de registros */}
                        <Text style={styles.infoRegistros}>
                            Mostrando {from + 1}-{to} de {filteredData.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Grados</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Cursos que los usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Grado}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Cantidad}</Text></DataTable.Cell>
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
            
            {/* Informacion de las jornadas y los cursos que las usan */}

                <View style={styles.contenedorTabla}>
                    
                    <View style={styles.container}>
                        
                        {/* Barra de búsqueda La cual no usaremos en estas tablas pero esta aqui de ejemplo
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            value={search}
                            onChangeText={(text) => {
                            setSearch(text);
                            setPage(0); // reiniciar a la primera página al buscar
                            }}
                        />
                        */}

                        {/* Mostrar cantidad de registros */}
                        <Text style={styles.infoRegistros}>
                            Mostrando {from + 1}-{to} de {filteredData.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Jornadas</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Cursos que las usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Jornada}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Cantidad}</Text></DataTable.Cell>
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
    //botonones plataforma
    BotonesPlataforma:{
        minWidth: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    textTitle:{
        color: colors.azulPrimario,
        fontWeight: 'bold',
        fontSize: 16
    },
    title1:{
        minWidth: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    infoTitle: {
        minWidth: '90%',
        paddingVertical: 10,
        backgroundColor: colors.azulPrimario,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textTitle2:{
        color: 'white',
    },
    infoTotal: {
        minWidth: '90%',
        paddingVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 2,
        borderColor: colors.azulPrimario
    },
    contenedorTabla:{
        width: '90%',
        marginTop: 10,
        borderTopWidth: 2,
        borderTopColor: colors.azulPrimario
    },
    contenedorTabla1:{
        width: '90%',
    },
    contenedorTabla1:{
        width: '90%',
    },
    container: {
        paddingVertical: 10,
        backgroundColor: colors.fondo,
    },
    /* Esto no se usara
    searchInput: {
        borderWidth: 1,
        borderColor: colors.azulSecundario,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    */
    infoRegistros: {
        marginBottom: 5,
        fontSize: 14,
        color: '#333',
    },
// Estilos de la tabla
    // Estilos th
    tablaHead: {
        justifyContent: 'center', 
        minWidth: 110, 
        backgroundColor: colors.azulPrimario,
    },
    // Estilos td
    tablaBody: {
        justifyContent: 'center', 
        width: 150, 
        borderBottomWidth: 2,
        borderColor: colors.azulPrimario,
        backgroundColor: 'white',
    },
    tablaHead1: {
        justifyContent: 'center', 
        minWidth: 70, 
        backgroundColor: colors.azulPrimario,
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

    botonEliminar: {
        alignItems: 'center',
        backgroundColor: '#dc3545',
        width: 25,
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    // Fin tabla
    //comentario
    ingresoComentario: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosComentar:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingLeft: 20,
        width: 70,
        height: 30,
    },
    botonComentar: {
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoCrearAula: {
        color: 'white',
    }
}); 