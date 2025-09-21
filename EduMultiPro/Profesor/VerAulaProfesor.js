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
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí
import { Linking } from "react-native";

export default function VerAulaProfesor({ navigation }) {

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

    // 🔹 Pedir permisos
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
        try {
            let permiso = null;
            if (Platform.Version >= 33) {
            permiso = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
            } else {
            permiso = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            }
            const granted = await PermissionsAndroid.request(permiso, {
            title: "Permiso de almacenamiento",
            message: "La app necesita acceder a tus archivos para poder subirlos.",
            buttonNeutral: "Preguntar después",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
        }
        return true; // iOS no necesita
    };

    // 🔹 Seleccionar archivo
    const seleccionarArchivo = async () => {
        const permiso = await requestStoragePermission();
        if (!permiso) {
        Alert.alert("Permiso denegado", "No se puede acceder a los archivos.");
        return;
        }

        launchImageLibrary({ mediaType: "mixed" }, (response) => {
        if (response.didCancel) {
            console.log("Usuario canceló selección");
        } else if (response.errorCode) {
            console.log("Error en image picker:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
            const archivo = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
            };
            setNuevoAnuncio(prev => ({ ...prev, archivos: archivo }));
        }
        });
    };

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

    // 🔹 Crear anuncio
    const handleCrearAnuncio = async () => {
    const usuarioLogueado = JSON.parse(await AsyncStorage.getItem("usuario"));

    const formData = new FormData();
    formData.append("titulo", nuevoAnuncio.titulo);
    formData.append("descripcion", nuevoAnuncio.descripcion);
    formData.append("aula_id", aula.ID);
    formData.append("usuario_id", usuarioLogueado?.id);

    if (nuevoAnuncio.archivos) {
        formData.append("archivo", {
        uri: nuevoAnuncio.archivos.uri,
        name: nuevoAnuncio.archivos.name,
        type: nuevoAnuncio.archivos.type,
        });
    }

    try {
        const res = await apiFetch("/Anuncios", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
        });
        const data = await res.json();
        alert(data.mensaje);

        // refrescar anuncios
        const resAnuncios = await apiFetch(`/Anuncios/Aula/${aula.ID}`);
        const dataAnuncios = await resAnuncios.json();
        setAnuncios(dataAnuncios);

        setMostrarFormulario(false);
        setNuevoAnuncio({ titulo: "", descripcion: "", archivos: null });
    } catch (error) {
        console.error("❌ Error creando anuncio:", error);
    }
    };

    //modificar anuncio
    const handleModificarAnuncio = async (id) => {
    const formData = new FormData();
    formData.append("titulo", anuncioEditado.titulo);
    formData.append("descripcion", anuncioEditado.descripcion);

    if (anuncioEditado.archivos) {
        formData.append("archivo", {
        uri: anuncioEditado.archivos.uri,
        name: anuncioEditado.archivos.name,
        type: anuncioEditado.archivos.type,
        });
    }

    try {
        const res = await apiFetch(`/Anuncios/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        const data = await res.json();
        alert(data.mensaje);

        // refrescar anuncios
        const resAnuncios = await apiFetch(`/Anuncios/Aula/${aula.ID}`);
        const dataAnuncios = await resAnuncios.json();
        setAnuncios(dataAnuncios);

        // cerrar formulario
        setEditandoAnuncioId(null);
        setAnuncioEditado({ titulo: "", descripcion: "", archivos: null });

    } catch (error) {
        console.error("❌ Error modificando anuncio:", error);
        Alert.alert("Error", "No se pudo modificar el anuncio");
    }
    };

    // 🔹 Eliminar anuncio
    const handleEliminarAnuncio = async (id) => {
        try {
        const res = await apiFetch(`/Anuncios/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.mensaje);

        setAnuncios(anuncios.filter(a => a.ID !== id));
        } catch (error) {
        console.error("❌ Error eliminando:", error);
        }
    };

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
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>

                    {/* Navegardor de fucniones del Aula */}
                    <View style={styles.tituloUsuario}>
                        
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerAulaProfesor')}>
                            <Text style={styles.textoControlAula}> Inicio</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('TrabajoProfesor', { id: route.params.id })}>
                            <Text style={styles.textoControlAula}> Trabajos</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('NotaProfesor', { id: route.params.id })}>
                            <Text style={styles.textoControlAula}> Notas</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate("PersonaProfesor", { id: route.params.id })}>
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
                        <TouchableOpacity style={styles.botonCrearAula} onPress={() => setMostrarFormulario(!mostrarFormulario)}>
                            <Text style={styles.textoCrearAula}> Crear Anuncio</Text>
                        </TouchableOpacity>
                    </View>
    
                    {/* Formulario Para crear el Anuncio */}
                    {mostrarFormulario && (
                        <View style={styles.crearAnuncio}>
                        <Text style={styles.titleAnuncio}>Crear Anuncio</Text>
                        <TextInput
                            style={styles.datosFormulario}
                            placeholder="Título del Anuncio"
                            value={nuevoAnuncio.titulo}
                            onChangeText={(text) =>
                            setNuevoAnuncio({ ...nuevoAnuncio, titulo: text })
                            }
                        />
                        <TextInput
                            style={styles.datosDescipcion}
                            placeholder="Descripcion del anuncio"
                            multiline
                            numberOfLines={4}
                            value={nuevoAnuncio.descripcion}
                            onChangeText={(text) =>
                            setNuevoAnuncio({ ...nuevoAnuncio, descripcion: text })
                            }
                        />
    
                        {/* 👇 botón de seleccionar archivo */}
                        <TouchableOpacity
                            style={styles.input2}
                            onPress={seleccionarArchivo}
                        >
                            <Text style={{ color: "gray" }}>
                            {nuevoAnuncio.archivos ? "Archivo seleccionado ✅" : "Subir archivo"}
                            </Text>
                        </TouchableOpacity>
    
                        <View style={styles.BotonesCrear}>
                            <TouchableOpacity style={styles.botonCrearAula} onPress={handleCrearAnuncio}>
                            <Text style={styles.textoCrearAula}> Publicar Anuncio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCrearAula} onPress={() => setMostrarFormulario(false)}>
                            <Text style={styles.textoCrearAula}> Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    )}
    
                    {/* Conteneder del Anuncio y sus funciones */}
                    {anuncios.map((anuncio) => (
                    <View key={anuncio.ID} style={styles.verAnuncio}>
    
                        {/* Botones para eliminar y modificar el anuncio */}
                        <View style={styles.ControlAnuncio}>
                            <TouchableOpacity
                                style={styles.botonAula}
                                onPress={() => {
                                    setEditandoAnuncioId(anuncio.ID);
                                    setAnuncioEditado({
                                    titulo: anuncio.Titulo_Anuncio,
                                    descripcion: anuncio.Descripcion_Anuncio,
                                    archivos: null, // se cargará si selecciona uno nuevo
                                    });
                                }}
                                >
                                <Text style={styles.textoBotonAula}> Modificar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                    "Confirmar eliminación",
                                    "¿Estás seguro de que quieres eliminar este anuncio?",
                                    [
                                        { text: "Cancelar", style: "cancel" },
                                        { text: "Eliminar", style: "destructive", onPress: () => handleEliminarAnuncio(anuncio.ID) }
                                    ]
                                    )
                                }
                                >
                                <Text style={styles.textoBotonAula}> Eliminar</Text>
                            </TouchableOpacity>
                        </View>
    
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
                        
                        {/* Formulario Para modificar el Anuncio */}
                        {editandoAnuncioId === anuncio.ID && (
                            <View style={styles.ModificarAnuncio}>
                                <Text style={styles.titleAnuncio}>Modificar Anuncio</Text>
    
                                <TextInput
                                style={styles.datosFormulario}
                                placeholder="Título del Anuncio"
                                value={anuncioEditado.titulo}
                                onChangeText={(text) =>
                                    setAnuncioEditado({ ...anuncioEditado, titulo: text })
                                }
                                />
    
                                <TextInput
                                style={styles.datosDescipcionModificar}
                                placeholder="Descripcion del anuncio"
                                multiline
                                numberOfLines={4}
                                value={anuncioEditado.descripcion}
                                onChangeText={(text) =>
                                    setAnuncioEditado({ ...anuncioEditado, descripcion: text })
                                }
                                />
    
                                {/* Subir archivo */}
                                <TouchableOpacity
                                style={styles.input2Modificar}
                                onPress={seleccionarArchivo}
                                >
                                <Text style={{ color: "gray" }}>
                                    {anuncioEditado.archivos ? "Archivo seleccionado ✅" : "Subir archivo"}
                                </Text>
                                </TouchableOpacity>
    
                                <View style={styles.BotonesCrear}>
                                <TouchableOpacity
                                    style={styles.botonCrearAula}
                                    onPress={() => handleModificarAnuncio(anuncio.ID)}
                                >
                                    <Text style={styles.textoCrearAula}> Modificar</Text>
                                </TouchableOpacity>
    
                                <TouchableOpacity
                                    style={styles.botonCrearAula}
                                    onPress={() => setEditandoAnuncioId(null)}
                                >
                                    <Text style={styles.textoCrearAula}> Cancelar</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        )}
    
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
    
    centroProfeso: {
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