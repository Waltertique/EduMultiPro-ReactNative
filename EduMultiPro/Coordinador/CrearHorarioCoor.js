import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Platform, PermissionsAndroid, Alert 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';
import { useState, useEffect } from "react";
import { launchImageLibrary } from 'react-native-image-picker';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import DesplegableCoor from './DesplegableCoor.js';

import { apiFetch } from "../api"; // 👈 importa tu helper


export default function CrearHorarioCoor({ navigation }) {
    const [formulario, setFormulario] = useState({
        titulo: "",
        descripcion: "",
        imagen: null,
        profesor_id: "",
        curso_id: ""
    });

    const [profesores, setProfesores] = useState([]);
    const [cursos, setCursos] = useState([]);

    // 👉 Cargar datos
    useEffect(() => {
        apiFetch("/Profesores")
        .then(res => res.json())
        .then(data => setProfesores(data))
        .catch(err => console.error("Error cargando profesores:", err));

        apiFetch("/Cursos-jornada")
        .then(res => res.json())
        .then(data => setCursos(data))
        .catch(err => console.error("Error cargando cursos:", err));
    }, []);

    // 👉 Pedir permisos
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
        try {
            let permiso = Platform.Version >= 33 
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permiso, {
            title: "Permiso de almacenamiento",
            message: "La app necesita acceder a tus fotos para poder subir el horario.",
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

        const res = await apiFetch("/Horarios", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            return Alert.alert("Error", data.error || "Error al guardar horario");
        }

        Alert.alert("Éxito", data.mensaje || "Horario creado correctamente");
        navigation.navigate("HorarioCoor");

        } catch (error) {
        console.error("Error al crear horario:", error);
        Alert.alert("Error", "Hubo un problema al guardar el horario");
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
                    <Text style={styles.titleUsuario}>Subir Horario</Text>
                    
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

                    {/* Subir archivo */}
                    <TouchableOpacity style={styles.input2} onPress={seleccionarImagen}>
                        <Text style={{ color: "gray" }}>
                            {formulario.imagen ? "Imagen seleccionada ✅" : "Subir archivo"}
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
                        <Text style={styles.textoCrearUsuario}> Guardar Horario</Text>
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
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 10,
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