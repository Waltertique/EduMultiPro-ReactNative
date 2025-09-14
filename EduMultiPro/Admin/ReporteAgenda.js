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

export default function ReporteAgenda({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    // Datos estáticos de ejemplo
    const data1 = [
        { id: '1', Total: '11'},
    ];
    const filteredData1 = data1.filter(
        (item) =>
        item.id.includes(search) ||
        item.Total.toLowerCase().includes(search.toLowerCase()) 
    );

    // Datos estáticos de ejemplo
    const data = [
        { id: '1', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
        { id: '2', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
        { id: '3', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
        { id: '4', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
        { id: '5', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
        { id: '6', CursoConHorario: '203', CursoSinHorario: '402', ProfesorConHorario: 'juan', ProfesorSinHorario: 'pedro' },
    ];

    // Filtrado por búsqueda
    const filteredData = data.filter(
        (item) =>
        item.id.includes(search) ||
        item.CursoConHorario.toLowerCase().includes(search.toLowerCase()) ||
        item.CursoSinHorario.toLowerCase().includes(search.toLowerCase()) ||
        item.ProfesorConHorario.toLowerCase().includes(search.toLowerCase()) ||
        item.ProfesorSinHorario.toLowerCase().includes(search.toLowerCase()) 
        
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

                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Horarios</Text>
                </View>

                <View style={styles.contenedorTabla1}>
                    
                    <View style={styles.container}>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Total Horarios</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Cursos con Horario</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Cursos sin Horario</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Profesores con Horario</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Profesores sin Horario</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData1.slice(from, to).map((tabla, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{tabla.Total}</Text></DataTable.Cell>
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

                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Horarios Asignados</Text>
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
                                <DataTable.Title style={styles.tablaHead}>Cursos con Horario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Cursos sin Horario</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((curso, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.CursoConHorario}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{curso.CursoSinHorario}</Text></DataTable.Cell>
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
                                <DataTable.Title style={styles.tablaHead}>Profesores con Horario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Profesores Sin Horario</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredData.slice(from, to).map((profesor, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{profesor.ProfesorConHorario}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{profesor.ProfesorSinHorario}</Text></DataTable.Cell>
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

                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Noticias Totales: 6</Text>
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
        minWidth: '90%',
        height: 'auto',
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
    contenedorTabla1:{
        width: '90%',
    },
    textTitle2:{
        color: 'white',
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
    tablaHead1: {
        justifyContent: 'center', 
        minWidth: 130, 
        backgroundColor: colors.azulPrimario
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