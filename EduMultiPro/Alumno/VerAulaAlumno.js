import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, Alert, 
  Platform, PermissionsAndroid 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from 'react-native-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { useRoute } from '@react-navigation/native'; // 👈 Importar

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí
import { Linking } from "react-native";

export default function VerAulaAlumno({ navigation }) {

    const route = useRoute();
    const { id } = route.params || {};  
    const [nuevoComentario, setNuevoComentario] = React.useState("");
    const [usuarioLogueado, setUsuarioLogueado] = React.useState(null);

    React.useEffect(() => {
    AsyncStorage.getItem("usuario").then((u) => {
        setUsuarioLogueado(JSON.parse(u));
    });
    }, []);
    
    const [aula, setAula] = React.useState(null);
    const [anuncios, setAnuncios] = React.useState([]);
    const [comentarios, setComentarios] = React.useState({});
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    const [nuevoAnuncio, setNuevoAnuncio] = React.useState({
        titulo: "",
        descripcion: "",
        archivos: null,
    });

    // Estado para editar anuncio
    const [editandoAnuncioId, setEditandoAnuncioId] = React.useState(null);
    const [anuncioEditado, setAnuncioEditado] = React.useState({
    titulo: "",
    descripcion: "",
    archivos: null,
    });

    // 🔹 Cargar datos del aula
    React.useEffect(() => {
        if (!id) return; 
        const fetchData = async () => {
        try {
            // Aula
            const resAula = await apiFetch(`/Aulas/${id}`);
            const dataAula = await resAula.json();
            setAula(dataAula);

            // Anuncios
            const resAnuncios = await apiFetch(`/Anuncios/Aula/${id}`);
            const dataAnuncios = await resAnuncios.json();
            setAnuncios(dataAnuncios);

            // Comentarios de cada anuncio
            const comentariosPorAnuncio = {};
            for (const anuncio of dataAnuncios) {
            const resComentarios = await apiFetch(`/ComentariosAlum/Anuncio/${anuncio.ID}`);
            const dataComentarios = await resComentarios.json();
            comentariosPorAnuncio[anuncio.ID] = dataComentarios;
            }
            setComentarios(comentariosPorAnuncio);

        } catch (error) {
            console.error("❌ Error cargando datos:", error);
            Alert.alert("Error", "No se pudo cargar la información del aula");
        }
        };

        fetchData();
    }, [id]); 

    // 🔹 Crear comentario
    const handleCrearComentario = async (anuncioId, descripcion) => {
    const usuarioLogueado = JSON.parse(await AsyncStorage.getItem("usuario"));

    try {
        const res = await apiFetch("/Comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            descripcion,
            anuncio_id: anuncioId,
            usuario_id: usuarioLogueado?.id,
        }),
        });

        const data = await res.json();
        alert(data.mensaje);

        // recargar comentarios
        const resComentarios = await apiFetch(`/ComentariosAlum/Anuncio/${anuncioId}`);
        const nuevosComentarios = await resComentarios.json();
        setComentarios((prev) => ({ ...prev, [anuncioId]: nuevosComentarios }));
    } catch (error) {
        console.error("❌ Error comentario:", error);
    }
    };

    // 🔹 Eliminar comentario
    const handleEliminarComentario = async (comentarioId, anuncioId) => {
    const usuarioLogueado = JSON.parse(await AsyncStorage.getItem("usuario"));

    try {
        const res = await apiFetch(`/ComentariosAlumAnuncio/${comentarioId}?usuario_id=${usuarioLogueado.id}`, {
        method: "DELETE"
        });
        const data = await res.json();
        alert(data.mensaje);

        // refrescar comentarios del anuncio
        const resComentarios = await apiFetch(`/ComentariosAlum/Anuncio/${anuncioId}`);
        const nuevosComentarios = await resComentarios.json();
        setComentarios((prev) => ({ ...prev, [anuncioId]: nuevosComentarios }));

    } catch (error) {
        console.error("❌ Error eliminando comentario:", error);
        Alert.alert("Error", "No se pudo eliminar el comentario");
    }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>

                    {/* Navegardor de fucniones del Aula */}
                    <View style={styles.tituloUsuario}>
                        
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerAulaAlumno', { id: route.params.id })}>
                            <Text style={styles.textoControlAula}> Inicio</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('TrabajoAlumno', { id: route.params.id })}>
                            <Text style={styles.textoControlAula}> Trabajos</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate("PersonaAlumno", { id: route.params.id })}>
                            <Text style={styles.textoControlAula}> Personas</Text>
                        </TouchableOpacity>
                        
                    </View>
    
                    {/* Informacion Principal del Aula */}
                    {aula && (
                    <LinearGradient
                          colors={[colors.azulPrimario, colors.azulSecundario]} // 👈 usando variables
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.InformacionAula}
                        >
                        <Text style={styles.titleAula}>{aula.Aula_Nombre}</Text>
                        <Text style={styles.titleAulaProfe}>Profesor: {aula.Profesor}</Text>
                    </LinearGradient>
                    )}
    
                    {/* Botón para mostrar/ocultar formulario */}
                    <View style={styles.tituloCrearAnuncio}>
                        <Text style={styles.novedad}>Novedades</Text>
                    </View>
    
                    {/* Conteneder del Anuncio y sus funciones */}
                    {anuncios.map((anuncio) => (
                    <View key={anuncio.ID} style={styles.verAnuncio}>
    
                        {/* Informacion del Anuncio */}
                        <View style={styles.verAnuncioFoto}>
                            <View style={styles.info1}>
                                <Image
                                    source={{ uri: `${STATIC_URL}/imagenes/${anuncio.RutaFoto}` }}
                                    style={styles.img1}
                                    resizeMode="contain"
                                />
                                <Text style={styles.nombreUsuario}>{anuncio.Profesor}</Text>
                            </View>
                            <Text style={styles.fechaAnuncio}>{new Date(anuncio.Fecha_Anuncio).toLocaleDateString()}</Text>
                        </View>
    
                        <Text style={styles.textoTitulo}>{anuncio.Titulo_Anuncio}</Text>
                        <Text style={styles.textoDescripcion}>
                            {anuncio.Descripcion_Anuncio}
                            </Text>
                        {anuncio.Enlace_Anuncio && anuncio.Enlace_Anuncio.split(";").map((archivo, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => Linking.openURL(`${STATIC_URL}/imagenes/${archivo.trim()}`)}
                            >
                                <Text style={styles.textoArchivo}>Ver Archivo {index + 1}</Text>
                            </TouchableOpacity>
                        ))}
    
                        {/* Formulario Para crear un comentario */}
                        <View style={styles.ingresoComentario}>
                            <TextInput
                                style={styles.datosComentar}
                                placeholder="Comentar"
                                value={nuevoComentario}
                                onChangeText={setNuevoComentario}
                                onSubmitEditing={() => {
                                    handleCrearComentario(anuncio.ID, nuevoComentario);
                                    setNuevoComentario(""); // limpiar después
                                }}
                                />
                                <TouchableOpacity
                                style={styles.botonComentar}
                                onPress={() => {
                                    handleCrearComentario(anuncio.ID, nuevoComentario);
                                    setNuevoComentario(""); // limpiar después
                                }}
                                >
                                <Text style={styles.textoCrearAula}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                        
    
                        {/* Informacion del Comentario */}
                        {comentarios[anuncio.ID]?.map((c) => (
                            <View key={c.ID} style={styles.verComentario}>
                                <View style={styles.verAnuncioFoto}>
                                <View style={styles.info1}>
                                    <Image
                                    source={{ uri: `${STATIC_URL}/imagenes/${c.RutaFoto}` }}
                                    style={styles.img1}
                                    resizeMode="contain"
                                    />
                                    <Text style={styles.nombreUsuario}>{c.Nombre_Usuario}</Text>
                                </View>
                                <Text style={styles.fechaAnuncio}>
                                    {new Date(c.Fecha).toLocaleDateString()}
                                </Text>
                                </View>
    
                                <Text style={styles.textoAnuncio}>{c.Descripcion}</Text>
                                
                                {usuarioLogueado && c.usuario_id === usuarioLogueado.id && (
                                <TouchableOpacity 
                                    style={styles.botonEliminar} 
                                    onPress={() => 
                                    Alert.alert( "Confirmar eliminación", "¿Estás seguro de eliminar este comentario?", 
                                    [ { text: "Cancelar", style: "cancel" }, { text: "Eliminar", style: "destructive", 
                                    onPress: () => handleEliminarComentario(c.ID, anuncio.ID) 
                                    } ] ) } > 
                                    <Text style={styles.textoCrearAula}> Eliminar</Text> 
                                </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                    ))}

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
    
    centroAlumno: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    tituloUsuario: {
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 5,
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
    InformacionAula: {
        minWidth: '90%',
        height: 'auto',
        padding: 20,
        borderRadius: 15,
        marginTop: 20
    },
    titleAula: {
        width: 285,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flexWrap: "wrap",
        paddingBottom: 0,
    },
    titleAulaProfe: {
        width: 285,
        fontSize: 14,
        color: 'white',
        flexWrap: "wrap",
        marginTop: 10,
    },
    tituloCrearAnuncio: {
        minWidth: '90%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginTop: 10
    },
    botonCrearAula: {
        flexDirection: 'row',
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    textoCrearAula: {
        color: 'white',
    },
    novedad: {
        fontWeight: 'bold',
        fontSize: 18
    },
    crearAnuncio:{
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10,
        alignItems: 'center'
    },
    verAnuncio: {
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '85%',
        marginTop: 10
    },
    datosDescipcion: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        minWidth: '85%',
        maxWidth: '90%',
        height: 120,
        marginTop: 10,
        paddingLeft: 20,
    },
    titleAnuncio: {
        fontSize: 20,
        marginBottom: 10
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
        marginBottom: 15,
    },
    BotonesCrear: {
        minWidth: '85%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    verAnuncioFoto:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    info1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img1:{
        height: 30,
        width: 30,
        borderRadius: 10,
    },
    nombreUsuario: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
        color: colors.azulPrimario
    },
    textoTitulo: {
        width: 275,
        flexWrap: "wrap",
        marginTop: 15,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    textoDescripcion: {
        width: 275,
        flexWrap: "wrap",
    },
    textoArchivo: {
        flexWrap: "wrap",
        marginTop: 10,
        color: colors.azulPrimario,
        textDecorationLine: 'underline'
    },
    ingresoComentario: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosComentar:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        width: 200,
        marginTop: 15
    },
    botonComentar: {
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

    //Modificar Anuncio

    ModificarAnuncio:{
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        alignItems: 'center'
    },
    datosDescipcionModificar: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 230,
        height: 120,
        marginTop: 10,
        paddingLeft: 20,
    },
    input2Modificar: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        width: 230,
        paddingVertical: 10,
        marginBottom: 15,
    },
    verComentario: {
        width: 286,
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
    },
    textoAnuncio: {
        width: 250,
        flexWrap: "wrap",
        marginTop: 10
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
        alignItems: 'center'
    },  
    ControlAnuncio: {
        minWidth: '85%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    botonAula: {
        marginRight: 15,
        marginBottom: 8
    },
    textoBotonAula:{
        textDecorationLine: 'underline'
    }
})