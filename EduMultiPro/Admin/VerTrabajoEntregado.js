import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import { apiFetch, STATIC_URL } from "../api"; // 👈 usamos tu api.js
import { useRoute } from '@react-navigation/native';
import { Linking } from "react-native";
import colors from '../colors';

export default function VerTrabajoEntregado({ navigation }) {

    const route = useRoute();
    const { id, aula_id } = route.params || {}; 

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 10;
    const [search, setSearch] = React.useState('');

    const [entregas, setEntregas] = React.useState([]);
    const [entregaSeleccionada, setEntregaSeleccionada] = React.useState(null);
    const [archivosEntrega, setArchivosEntrega] = React.useState([]);
    const [nuevaNota, setNuevaNota] = React.useState("");

    // 🔹 Cargar lista de entregas
    React.useEffect(() => {
        if (!id) return;

        const fetchEntregas = async () => {
        try {
            const res = await apiFetch(`/Trabajos/${id}/Entregados`);
            const data = await res.json();
            setEntregas(data);
        } catch (error) {
            console.error("❌ Error cargando entregas:", error);
            Alert.alert("Error", "No se pudo cargar la lista de entregas");
        }
        };

        fetchEntregas();
    }, [id]);

    // 🔹 Ver entrega seleccionada
    const handleMostrarEntrega = async (entrega) => {
        setEntregaSeleccionada(entrega);
        setNuevaNota(entrega.Nota ? String(entrega.Nota) : ""); // mostrar nota actual

        try {
        const res = await apiFetch(`/TrabajoEntregado/${entrega.trabajo_entregado_id}/Archivos`);
        const archivos = await res.json();
        setArchivosEntrega(archivos);
        } catch (error) {
        console.error("❌ Error al cargar archivos:", error);
        setArchivosEntrega([]);
        }
    };

    // 🔹 Asignar nota
    const handleAsignarNota = async () => {
        if (!nuevaNota.trim()) {
        Alert.alert("Error", "La nota no puede estar vacía");
        return;
        }

        try {
        const res = await apiFetch(`/Trabajos/Entregado/${entregaSeleccionada.trabajo_entregado_id}/Nota`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota: nuevaNota }),
        });

        const data = await res.json();
        Alert.alert("Nota", data.mensaje);

        // refrescar lista
        const res2 = await apiFetch(`/Trabajos/${id}/Entregados`);
        const data2 = await res2.json();
        setEntregas(data2);

        setEntregaSeleccionada(null); // cerrar pestaña
        } catch (error) {
        console.error("❌ Error al asignar nota:", error);
        Alert.alert("Error", "No se pudo asignar la nota");
        }
    };

    // 🔹 Filtrado búsqueda
    const filteredData = entregas.filter(
        (item) =>
        item.nombre_completo.toLowerCase().includes(search.toLowerCase())
    );

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
                    
                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajo', { id, aula_id })}>
                        <Text style={styles.textoControlAula}> Trabajo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajoEntregado')}>
                        <Text style={styles.textoControlAula}> Entregas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Trabajo', { id, aula_id })}>
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
                        
                            {filteredData.slice(from, to).map((entrega) => (
                                <DataTable.Row key={entrega.trabajo_entregado_id}>
                                <DataTable.Cell style={styles.tablaBody}><Text numberOfLines={1} ellipsizeMode="tail">{entrega.nombre_completo}</Text></DataTable.Cell>

                                <DataTable.Cell style={styles.tablaBody}>
                                    <TouchableOpacity
                                        style={styles.botonAccion}
                                        onPress={() => handleMostrarEntrega(entrega)}
                                    >
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
                            />
                            </DataTable>
                        </ScrollView>
                    </View>

                </View>

                {entregaSeleccionada && (
                    <View style={styles.contenedorNota}>
                    <Text style={styles.nombre}>{entregaSeleccionada.nombre_completo}</Text>
                    <Text style={styles.nota}>Nota actual: {entregaSeleccionada.Nota || "Sin nota"}</Text>

                    {archivosEntrega.map((archivo, index) => (
                        <TouchableOpacity key={index} onPress={() => Linking.openURL(`${STATIC_URL}/imagenes/${archivo.ruta_archivo}`)}>
                        <Text style={styles.archivo}>{archivo.nombre_original}</Text>
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.fecha}>Fecha de Entrega: {new Date(entregaSeleccionada.Fecha_Trabajo).toLocaleDateString()}</Text>

                    {/* Formulario para asignar nota */}
                    <View style={styles.ingresoNota}>
                        <TextInput
                        style={styles.datosNota}
                        placeholder="Nota"
                        value={nuevaNota}
                        onChangeText={setNuevaNota}
                        keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.botonNota} onPress={handleAsignarNota}>
                        <Text style={styles.textoCrearAula}>Enviar</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.botonEliminar} onPress={() => setEntregaSeleccionada(null)}>
                        <Text style={styles.textoCrearAula}>Cerrar</Text>
                    </TouchableOpacity>
                    </View>
                )}
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
        marginLeft: 20,
        color: colors.azulPrimario,
        textDecorationLine: 'underline'
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