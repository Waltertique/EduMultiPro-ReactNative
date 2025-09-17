import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Platform, PermissionsAndroid, Alert, Image 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';
import { useState, useEffect } from "react";
import { launchImageLibrary } from 'react-native-image-picker';
import { useRoute } from '@react-navigation/native';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import DesplegableCoor from './DesplegableCoor.js';

import { apiFetch } from "../api"; // 👈 importa tu helper
import { STATIC_URL } from "../api"; // 👈 importa aquí

export default function ActualizarHorarioCoor({ navigation }) {

const route = useRoute();
    const { id } = route.params; // 👈 El id del horario que viene desde la lista

    const [formulario, setFormulario] = useState({
        titulo: "",
        descripcion: "",
        imagen: null,
        profesor_id: "",
        curso_id: "",
        imagenActual: ""
    });

    const [profesores, setProfesores] = useState([]);
    const [cursos, setCursos] = useState([]);

    // 👉 Cargar datos del horario + listas
    useEffect(() => {
        const cargarDatos = async () => {
        try {
            const [hp, hs, cps] = await Promise.all([
            apiFetch(`/Horarios/${id}`).then(r => r.json()),
            apiFetch("/Profesores").then(r => r.json()),
            apiFetch("/Cursos-jornada").then(r => r.json()),
            ]);

            setFormulario({
            titulo: hp.Titulo_Horario,
            descripcion: hp.Descripcion_Horario,
            imagen: null,
            profesor_id: hp.profesor_id || "",
            curso_id: hp.curso_id || "",
            imagenActual: hp.Imagen_Horario || ""
            });
            setProfesores(hs);
            setCursos(cps);
        } catch (err) {
            console.error("Error cargando datos:", err);
        }
        };
        cargarDatos();
    }, [id]);

    // 👉 Pedir permisos
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
        try {
            let permiso = Platform.Version >= 33 
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permiso, {
            title: "Permiso de almacenamiento",
            message: "La app necesita acceder a tus fotos para actualizar el horario.",
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
        return true; 
    };

    // 👉 Abrir galería
    const seleccionarImagen = async () => {
        const permiso = await requestStoragePermission();
        if (!permiso) {
        Alert.alert("Permiso denegado", "No se puede acceder a la galería.");
        return;
        }

        launchImageLibrary({ mediaType: "photo" }, (response) => {
        if (response.didCancel) {
            console.log("Usuario canceló la selección de imagen");
        } else if (response.errorCode) {
            console.log("Error en image picker:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
            const imagen = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
            };
            setFormulario({ ...formulario, imagen });
        }
        });
    };

    // 👉 Submit
    const handleSubmit = async () => {
        const { titulo, descripcion, profesor_id, curso_id, imagen } = formulario;

        // Validación
        if ((profesor_id && curso_id) || (!profesor_id && !curso_id)) {
        return Alert.alert("Error", "Debes seleccionar SOLO un profesor o SOLO un curso.");
        }

        try {
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        if (imagen) {
            formData.append("imagen", {
            uri: imagen.uri,
            type: imagen.type,
            name: imagen.name
            });
        }
        formData.append("profesor_id", profesor_id);
        formData.append("curso_id", curso_id);

        const res = await apiFetch(`/Horarios/${id}`, {
            method: "PUT",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            return Alert.alert("Error", data.error || "Error al actualizar horario");
        }

        Alert.alert("Éxito", data.mensaje || "Horario actualizado correctamente");
        navigation.navigate("HorarioCoor");

        } catch (error) {
        console.error("Error al actualizar horario:", error);
        Alert.alert("Error", "Hubo un problema al actualizar el horario");
        }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableCoor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Modificar Horario</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('HorarioCoor')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedorFormulario}>

                    <TextInput 
                        style={styles.datosFormulario} 
                        placeholder='Titulo'
                        value={formulario.titulo}
                        onChangeText={(text) => setFormulario({ ...formulario, titulo: text })}
                    />
                        <TextInput 
                        style={styles.datosFormulario} 
                        placeholder='Descripcion'
                        value={formulario.descripcion}
                        onChangeText={(text) => setFormulario({ ...formulario, descripcion: text })}
                    />

                    {/* Mostrar imagen actual */}
                    {formulario.imagenActual ? (
                    <View style={{ alignItems: "center", marginVertical: 10 }}>
                        <Text>Horario actual:</Text>
                        <Image 
                        source={{ uri: `${STATIC_URL}/imagenes/${formulario.imagenActual}` }} 
                        style={{ width: 200, height: 150, marginTop: 5, borderRadius: 10 }} 
                        resizeMode="contain"
                        />
                    </View>
                    ) : null}

                    {/* Subir archivo */}
                    <TouchableOpacity style={styles.input2} onPress={seleccionarImagen}>
                        <Text style={{ color: "gray" }}>
                            {formulario.imagen ? "Imagen seleccionada ✅" : "Subir nueva imagen"}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                        <Picker
                            selectedValue={formulario.profesor_id}
                            onValueChange={(value) => setFormulario({ ...formulario, profesor_id: value, curso_id: "" })}
                        >
                            <Picker.Item label="Selecciona un profesor (opcional)" value="" />
                            {profesores.map((prof) => (
                            <Picker.Item key={prof.ID} label={prof.Nombre_Completo} value={prof.ID} />
                            ))}
                        </Picker>
                    </View>

                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                        <Picker
                            selectedValue={formulario.curso_id}
                            onValueChange={(value) => setFormulario({ ...formulario, curso_id: value, profesor_id: "" })}
                        >
                            <Picker.Item label="Selecciona un curso (opcional)" value="" />
                            {cursos.map((curso) => (
                            <Picker.Item key={curso.ID} label={curso.Curso_Con_Jornada} value={curso.ID} />
                            ))}
                        </Picker>
                    </View>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={handleSubmit}>
                        <Text style={styles.textoCrearUsuario}> Guardar cambios</Text>
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

    tituloUsuario: {
        width: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario
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
    contenedorFormulario:{
        backgroundColor: 'white',
        minWidth: '90%',
        padding: 20,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        maxWidth: '81%',
        marginTop: 10,
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '80%',
        paddingVertical: 10,
        marginBottom: 15,
    }

});