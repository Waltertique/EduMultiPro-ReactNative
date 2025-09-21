import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Image, Alert 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Linking } from "react-native";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors';
import { apiFetch, STATIC_URL } from "../api";

export default function VerTrabajoProfesor({ navigation }) {

    const route = useRoute();
    const { id, aula_id } = route.params || {}; 
    const [usuarioLogueado, setUsuarioLogueado] = React.useState(null);

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const user = await AsyncStorage.getItem("usuario");
            if (user) setUsuarioLogueado(JSON.parse(user));
        };
        fetchUsuario();
    }, []);

    const [trabajo, setTrabajo] = React.useState(null);
    const [archivos, setArchivos] = React.useState([]);
    const [comentarios, setComentarios] = React.useState([]);
    const [nuevoComentario, setNuevoComentario] = React.useState("");

    // 🔹 Cargar trabajo y comentarios
    React.useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Trabajo + archivos
                const resTrabajo = await apiFetch(`/Trabajo/${id}`);
                const dataTrabajo = await resTrabajo.json();
                setTrabajo(dataTrabajo.trabajo);
                setArchivos(dataTrabajo.archivos);

                // Comentarios usando la API correcta
                const resComentarios = await apiFetch(`/ComentariosAlum/Trabajo/${id}`);
                const dataComentarios = await resComentarios.json();
                console.log("Comentarios cargados:", dataComentarios);
                setComentarios(dataComentarios);
            } catch (error) {
                console.error("❌ Error cargando trabajo:", error);
                Alert.alert("Error", "No se pudo cargar la información del trabajo");
            }
        };

        fetchData();
    }, [id]);

    // 🔹 Crear comentario
    const handleCrearComentario = async () => {
        if (!nuevoComentario.trim()) {
            Alert.alert("Error", "El comentario no puede estar vacío");
            return;
        }

        const usuario = JSON.parse(await AsyncStorage.getItem("usuario"));
        if (!usuario) {
            Alert.alert("Error", "Debes iniciar sesión");
            return;
        }

        try {
            const res = await apiFetch("/Comentarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    descripcion: nuevoComentario,
                    trabajo_id: id,
                    usuario_id: usuario.id,
                    fecha: new Date().toISOString().split("T")[0],
                }),
            });

            const data = await res.json();
            Alert.alert("Comentario", data.mensaje);
            setNuevoComentario("");

            // refrescar comentarios
            const resComentarios = await apiFetch(`/ComentariosAlum/Trabajo/${id}`);
            const dataComentarios = await resComentarios.json();
            setComentarios(dataComentarios);
        } catch (error) {
            console.error("❌ Error comentario:", error);
            Alert.alert("Error", "No se pudo enviar el comentario");
        }
    };

    // 🔹 Eliminar comentario
    const handleEliminarComentario = async (comentarioId) => {
        if (!usuarioLogueado) return;

        Alert.alert("Confirmar", "¿Eliminar este comentario?", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        const res = await apiFetch(`/ComentariosAlum/${comentarioId}?usuario_id=${usuarioLogueado.id}`, { method: "DELETE" });
                        const data = await res.json();
                        Alert.alert("Comentario", data.mensaje);

                        // refrescar comentarios
                        const resComentarios = await apiFetch(`/ComentariosAlum/Trabajo/${id}`);
                        const dataComentarios = await resComentarios.json();
                        setComentarios(dataComentarios);
                    } catch (error) {
                        console.error("❌ Error eliminando comentario:", error);
                        Alert.alert("Error", "No se pudo eliminar el comentario");
                    }
                }
            }
        ]);
    };

    if (!trabajo) {
        return <Text style={{ marginTop: 50, textAlign: "center" }}>Cargando trabajo...</Text>;
    }

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>

                    {/* Navegardor de fucniones del trabajo */}
                    <View style={styles.tituloTrabajo}>
                        
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajoProfesor')}>
                            <Text style={styles.textoControlAula}> Trabajo</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajoEntregadoPro', { id, aula_id })}>
                            <Text style={styles.textoControlAula}> Entregas</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('TrabajoProfesor', { id: aula_id })}>
                            <Text style={styles.textoControlAula}> Salir</Text>
                        </TouchableOpacity>
                        
                    </View>
    
                    <View style={styles.titleTrabajo}>
                        <Image 
                          source={require('../assets/f9.png')} 
                          style={styles.img1} 
                          resizeMode="contain"
                        />
                        <Text style={styles.trabajoTitle}>{trabajo.Titulo_Trabajo}</Text>
                    </View> 
                    <View style={styles.titleFecha}>
                        <Text>Fecha de Entrega: {new Date(trabajo.Fecha_Trabajo).toLocaleDateString()}</Text>
                    </View> 
                    <View style={styles.descripcionTrabajo}>
                        <Text style={styles.descipcionTitle}>Descripcion: </Text>
                        <Text style={styles.trabajoDescipcion}>{trabajo.Descripcion_Trabajo}</Text>
                        {archivos.map((archivo) => (
                            <TouchableOpacity key={archivo.ID} onPress={() => Linking.openURL(`${STATIC_URL}/${archivo.ruta_archivo}`)}>
                                <Text style={styles.archivo}>{archivo.nombre_original}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <Text style={styles.titleComentario}>Agregar comentario</Text>
    
                    {/* Formulario Para crear un comentario */}
                        <View style={styles.ingresoComentario}>
                            <TextInput
                            style={styles.datosComentar}
                            placeholder='Escribe tu comentario'
                            value={nuevoComentario}
                            onChangeText={setNuevoComentario}
                            />
                            <TouchableOpacity style={styles.botonComentar} onPress={handleCrearComentario}>
                            <Text style={styles.textoCrearAula}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
    
                    {/* Informacion del Comentario */}
                        {comentarios.map((comentario) => (
                            <View key={comentario.ID} style={styles.verComentario}>
                                <View style={styles.verAnuncioFoto}>
                                    <View style={styles.info1}>
                                        <Image 
                                            source={{ uri: `${STATIC_URL}/imagenes/${comentario.RutaFoto || 'usuario.png'}` }} 
                                            style={styles.img2} 
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.nombreUsuario}>{comentario.Nombre_Usuario}</Text>
                                    </View>
                                    <Text style={styles.fechaAnuncio}>{new Date(comentario.Fecha).toLocaleDateString()}</Text>
                                </View>

                                <Text style={styles.textoAnuncio}>{comentario.Descripcion}</Text>

                                {usuarioLogueado && comentario.usuario_id === usuarioLogueado.id && (
                                    <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminarComentario(comentario.ID)}>
                                        <Text style={styles.textoCrearAula}>Eliminar</Text>
                                    </TouchableOpacity>
                                )}
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
    titleTrabajo: {
        minWidth: '90%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    img1:{
        width: 35,
        height: 35
    },
    trabajoTitle: {
        marginLeft: 10, 
        fontWeight: 'bold',               
        fontSize: 16,
        flexWrap: "wrap",
        width: 265,
    },
    titleFecha: {
        minWidth: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2
    },
    descripcionTrabajo: {
        minWidth: '90%',
        flexDirection: 'column',
        marginTop: 10,
    },
    descipcionTitle:{
        fontWeight: 'bold',               
        fontSize: 16,
        minWidth: '90%',
    },
    trabajoDescipcion: {
        minWidth: '88%',
        maxWidth: '90%'
    },
    archivo: {
        color: colors.azulPrimario,
        marginTop: 10,
        textDecorationLine: 'underline',
        maxWidth: 300
    },
    comentario: {
        minWidth: '90%',
        flexDirection: 'column',
        borderWidth: 1,
        marginTop: 10,
    },
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
        paddingVertical: 10,
        paddingLeft: 20,
        width: 230,
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

    verComentario: {
        width: 310,
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
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
    img2:{
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
    textoAnuncio: {
        width: 270,
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
    textoCrearAula: {
        color: 'white',
    },
    titleComentario:{
        borderTopWidth: 2,
        minWidth: '90%',
        fontWeight: 'bold',
        marginTop: 10,
        paddingTop: 10
    }
})