import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';
import { apiFetch } from "../api";

export default function ReporteAgenda({ navigation }) {

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    // Estados que vienen del backend
    const [totales, setTotales] = React.useState({});
    const [totalNoticias, setTotalNoticias] = React.useState(0);
    const [cursosConHorario, setCursosConHorario] = React.useState([]);
    const [cursosSinHorario, setCursosSinHorario] = React.useState([]);
    const [profesConHorario, setProfesConHorario] = React.useState([]);
    const [profesSinHorario, setProfesSinHorario] = React.useState([]);

    React.useEffect(() => {
        apiFetch("/reportes/horarios-totales")
        .then(res => res.json())
        .then(setTotales)
        .catch(err => console.error("❌ Error totales:", err));

        apiFetch("/reportes/noticias-totales")
        .then(res => res.json())
        .then(data => setTotalNoticias(data.total_noticias))
        .catch(err => console.error("❌ Error noticias:", err));

        apiFetch("/reportes/cursos-horarios")
        .then(res => res.json())
        .then(data => {
            setCursosConHorario(data.conHorario || []);
            setCursosSinHorario(data.sinHorario || []);
        })
        .catch(err => console.error("❌ Error cursos:", err));

        apiFetch("/reportes/profesores-horarios")
        .then(res => res.json())
        .then(data => {
            setProfesConHorario(data.conHorario || []);
            setProfesSinHorario(data.sinHorario || []);
        })
        .catch(err => console.error("❌ Error profes:", err));
    }, []);

    // Emparejar arrays por índice para renderizar filas (columna izquierda = con, derecha = sin)
    const pairedCursos = React.useMemo(() => {
        const max = Math.max(cursosConHorario.length, cursosSinHorario.length);
        const arr = [];
        for (let i = 0; i < max; i++) {
        arr.push({
            con: cursosConHorario[i] || null,
            sin: cursosSinHorario[i] || null,
        });
        }
        return arr;
    }, [cursosConHorario, cursosSinHorario]);

    const pairedProfes = React.useMemo(() => {
        const max = Math.max(profesConHorario.length, profesSinHorario.length);
        const arr = [];
        for (let i = 0; i < max; i++) {
        arr.push({
            con: profesConHorario[i] || null,
            sin: profesSinHorario[i] || null,
        });
        }
        return arr;
    }, [profesConHorario, profesSinHorario]);

    // Filtrado (buscar en ambas columnas)
    const filteredPairedCursos = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return pairedCursos;
        return pairedCursos.filter(({ con, sin }) => {
        const matchCon =
            con &&
            ((con.curso || '').toLowerCase().includes(q) ||
            (con.jornada || '').toLowerCase().includes(q));
        const matchSin =
            sin &&
            ((sin.curso || '').toLowerCase().includes(q) ||
            (sin.jornada || '').toLowerCase().includes(q));
        return matchCon || matchSin;
        });
    }, [pairedCursos, search]);

    const filteredPairedProfes = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return pairedProfes;
        return pairedProfes.filter(({ con, sin }) => {
        const matchCon =
            con &&
            (((con.nombre || '') + ' ' + (con.apellido || '')).toLowerCase().includes(q));
        const matchSin =
            sin &&
            (((sin.nombre || '') + ' ' + (sin.apellido || '')).toLowerCase().includes(q));
        return matchCon || matchSin;
        });
    }, [pairedProfes, search]);

    // Paginación por filas emparejadas (cursos)
    const totalRowsCursos = filteredPairedCursos.length;
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, totalRowsCursos);
    const numberOfPages = Math.max(1, Math.ceil(totalRowsCursos / itemsPerPage));

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
                        
                                <DataTable.Row>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{totales.total_horarios ?? '-'}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{totales.cursos_con_horario ?? '-'}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{totales.cursos_sin_horario ?? '-'}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{totales.profesores_con_horario ?? '-'}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{totales.profesores_sin_horario ?? '-'}</Text></DataTable.Cell>
                                </DataTable.Row>
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
                            Mostrando {totalRowsCursos ? (from + 1) : 0}-{to} de {totalRowsCursos} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}>Cursos con Horario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Cursos sin Horario</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredPairedCursos.slice(from, to).map((row, i) => (
                                <DataTable.Row key={i}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{row.con ? `${row.con.curso} ${row.con.jornada ? `- ${row.con.jornada}` : ''}` : ''}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{row.sin ? `${row.sin.curso} ${row.sin.jornada ? `- ${row.sin.jornada}` : ''}` : ''}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        
                        
                            {/* Paginación */}
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={numberOfPages}
                                onPageChange={setPage}
                                label={ totalRowsCursos ? `${from + 1}-${to} de ${totalRowsCursos}` : '0-0 de 0' }
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
                            Mostrando {filteredPairedProfes.length} registros
                        </Text>

                        {/* Scroll horizontal para columnas grandes */}
                        <ScrollView horizontal>
                            <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.tablaHead}>Profesores con Horario</DataTable.Title>
                                <DataTable.Title style={styles.tablaHead}>Profesores Sin Horario</DataTable.Title>
                            </DataTable.Header>
                        
                            {filteredPairedProfes.map((row, i) => (
                                <DataTable.Row key={i}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{row.con ? `${row.con.nombre} ${row.con.apellido}` : ''}</Text></DataTable.Cell>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{row.sin ? `${row.sin.nombre} ${row.sin.apellido}` : ''}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        
                        
                            {/* Paginación */}
                            <DataTable.Pagination
                                page={page}
                                numberOfPages={numberOfPages}
                                onPageChange={setPage}
                                label={ filteredPairedProfes ? `${from + 1}-${to} de ${filteredPairedProfes}` : '0-0 de 0' }
                                numberOfItemsPerPage={itemsPerPage}
                                showFastPagination
                            />
                            </DataTable>
                        </ScrollView>
                    </View>

                </View>

                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Noticias Totales: {totalNoticias}</Text>
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
    }
    // Fin tabla

});