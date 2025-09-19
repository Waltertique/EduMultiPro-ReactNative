import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import DesplegableCoor from './DesplegableCoor.js';

import { apiFetch } from "../api"; // 👈 importa tu helper


export default function ReporteCoor({ navigation }) {
    const [totales, setTotales] = React.useState({
    totalUsuarios: 0,
    totalCoordinadores: 0,
    totalProfesores: 0,
    totalAlumnos: 0,
    });

    React.useEffect(() => {
    apiFetch("/reportes/usuarios-totales")
        .then((res) => res.json())
        .then((data) => setTotales(data))
        .catch((err) => console.error("❌ Error al cargar totales:", err));
    }, []);

    const [cursosData, setCursosData] = React.useState([]);

    // useEffect: guardamos el array tal cual
    React.useEffect(() => {
    apiFetch("/reportes/cursos")
        .then((res) => res.json())
        .then((data) => {
        setCursosData(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("❌ Error al cargar cursos:", err));
    }, []);

    // Estado para estructura
    const [estructura, setEstructura] = React.useState({
    total_materias: 0,
    total_grados: 0,
    total_jornadas: 0,
    });

    React.useEffect(() => {
    apiFetch("/reportes/estructura")
        .then((res) => res.json())
        .then((data) => setEstructura(data))
        .catch((err) => console.error("❌ Error al cargar estructura:", err));
    }, []);

    const [materiasAulas, setMateriasAulas] = React.useState([]);
    const [gradosCursos, setGradosCursos] = React.useState([]);
    const [jornadasCursos, setJornadasCursos] = React.useState([]);

    React.useEffect(() => {
    apiFetch("/reportes/materias-aulas")
        .then((res) => res.json())
        .then(setMateriasAulas);

    apiFetch("/reportes/grados-cursos")
        .then((res) => res.json())
        .then(setGradosCursos);

    apiFetch("/reportes/jornadas-cursos")
        .then((res) => res.json())
        .then(setJornadasCursos);
    }, []);

    const [idBusqueda, setIdBusqueda] = React.useState("");
    const [usuarioEncontrado, setUsuarioEncontrado] = React.useState(null);

    const buscarUsuario = () => {
    if (!idBusqueda) return;

    apiFetch(`/buscar-usuario/${idBusqueda}`)
        .then((res) => {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
        })
        .then(setUsuarioEncontrado)
        .catch((err) => {
        console.error(err);
        setUsuarioEncontrado(null);
        Alert.alert("Error", "Usuario no encontrado");
        });
    };

    const cerrarTabla = () => {
    setUsuarioEncontrado(null);
    setIdBusqueda("");
    };

  return (
    <View style={styles.contenedor}>

        <Encabezado />

        <DesplegableCoor />

        {/* 👉 Scroll vertical */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      
        <View style={styles.centroUsuario}>

            {/* Botones de plataforma, clase y Agenda */}

            <View style={styles.BotonesPlataforma}>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('ReporteCoor')}>
                    <FontAwesome5 name="book" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Plataforma</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('ReporteClaseCoor')}>
                    <FontAwesome5 name="temperature-low" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Clase</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonPlataforma} onPress={() => navigation.navigate('ReporteAgendaCoor')}>
                    <FontAwesome5 name="clock" size={16} color={colors.azulPrimario} />
                    <Text style={styles.textobotonPlataforma}> Agenda</Text>
                </TouchableOpacity>

            </View>
            
            {/* Informacion del total de informacion de usuarios */}

            <View style={styles.title1}>
                <Text style={styles.textTitle}>Usuarios</Text>

                <View style={styles.ingresoComentario}>
                    <TextInput
                    style={styles.datosComentar}
                    placeholder="ID"
                    value={idBusqueda}
                    onChangeText={setIdBusqueda}
                    />
                    <TouchableOpacity style={styles.botonComentar} onPress={buscarUsuario}>
                        <Text style={styles.textoCrearAula}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {usuarioEncontrado && usuarioEncontrado.ID && (
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
                                <DataTable.Title style={styles.tablaHead1}><Text style={styles.textTitle2}>Cerrar</Text></DataTable.Title>
                            </DataTable.Header>

                                <DataTable.Row key={usuarioEncontrado.ID}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuarioEncontrado.ID}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuarioEncontrado.Primer_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuarioEncontrado.Primer_Apellido}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuarioEncontrado.Curso_Jornada}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{usuarioEncontrado.Rol}</Text></DataTable.Cell>

                                <DataTable.Cell style={styles.tablaBody}>
                                    <TouchableOpacity style={styles.botonEliminar} onPress={cerrarTabla}>
                                        <FontAwesome name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </DataTable.Cell>
                                </DataTable.Row>

                            </DataTable>
                        </ScrollView>
                    </View>
                </View>
            )}

            <View style={styles.infoTitle}>
                <Text style={styles.textTitle2}>Total Usuarios</Text>
                <Text style={styles.textTitle2}>Total Coordinadores</Text>
            </View>
            <View style={styles.infoTotal}>
                <Text>{totales.totalUsuarios}</Text>
                <Text>{totales.totalCoordinadores}</Text>
            </View>

            <View style={styles.infoTitle}>
                <Text style={styles.textTitle2}>Total Profesores</Text>
                <Text style={styles.textTitle2}>Total Alumnos</Text>
            </View>
            <View style={styles.infoTotal}>
                <Text>{totales.totalProfesores}</Text>
                <Text>{totales.totalAlumnos}</Text>
            </View>
            
            {/* Informacion del total de informacion de cursos */}

            <View style={styles.title1}>
                <Text style={styles.textTitle}>Curso</Text>
            </View>

                <View style={styles.contenedorTabla1}>
                    
                    <View style={styles.container}>
                        <ScrollView horizontal>
                        <DataTable>
                            {/* Header dinámico: una columna por cada item */}
                            <DataTable.Header>
                            {cursosData.length === 0 ? (
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Cargando...</Text></DataTable.Title>
                            ) : (
                                cursosData.map((item, idx) => {
                                const name = item.Jornada ?? item.Jornada_Nombre ?? "Jornada";
                                return (
                                    <DataTable.Title key={idx} style={styles.tablaHead}>
                                    <Text style={styles.textTitle2}>
                                        {name === "Total Cursos" ? "Total Cursos" : `En Jornada ${name}`}
                                    </Text>
                                    </DataTable.Title>
                                );
                                })
                            )}
                            </DataTable.Header>

                            {/* Fila con los totales (una celda por item) */}
                            {cursosData.length > 0 && (
                            <DataTable.Row>
                                {cursosData.map((item, idx) => {
                                const total = item.Total ?? item.total ?? 0;
                                return (
                                    <DataTable.Cell key={idx} style={styles.tablaBody}>
                                    <Text numberOfLines={1} ellipsizeMode="tail">{String(total)}</Text>
                                    </DataTable.Cell>
                                );
                                })}
                            </DataTable.Row>
                            )}

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
                <Text>{estructura.total_materias}</Text>
                <Text>{estructura.total_grados}</Text>
                <Text>{estructura.total_jornadas}</Text>
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
                             Mostrando {materiasAulas.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Materias</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Aulas que las usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {materiasAulas.map((m, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{m.Materia_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{m.total_aulas}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        
                        
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
                             Mostrando {gradosCursos.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Grados</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Cursos que los usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {gradosCursos.map((g, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{g.Grado_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{g.total_cursos}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        
                        
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
                            Mostrando {jornadasCursos.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Jornadas</Text></DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}><Text style={styles.textTitle2}>Cursos que las usan</Text></DataTable.Title>
                            </DataTable.Header>
                        
                            {jornadasCursos.map((j, index) => (
                                <DataTable.Row key={index}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{j.Jornada_Nombre}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{j.total_cursos}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
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