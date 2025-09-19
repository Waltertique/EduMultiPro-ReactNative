import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, PermissionsAndroid, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { useState } from "react";
import { DataTable } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function CrearUsuario({ navigation }) {

    const [formulario, setFormulario] = React.useState({
        id: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        correo1: '',
        contrasena: '',
        correo2: '',
        contacto1: '',
        contacto2: '',
        fecha_nacimiento: '',
        rol_id: '',
        documento_id: '',
        foto: null
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [roles, setRoles] = React.useState([]);
    const [documentos, setDocumentos] = React.useState([]);

    React.useEffect(() => {
    apiFetch("/roles")
        .then(res => res.json())
        .then(data => setRoles(data))
        .catch(err => console.error("Error cargando roles:", err));

    apiFetch("/documentos")
        .then(res => res.json())
        .then(data => setDocumentos(data))
        .catch(err => console.error("Error cargando documentos:", err));
    }, []);

    // 👉 Función para pedir permisos en Android
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
        try {
            let permiso = null;

            if (Platform.Version >= 33) { 
            // Android 13 o mayor
            permiso = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
            } else {
            // Android 12 o menor
            permiso = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            }

            const granted = await PermissionsAndroid.request(permiso, {
            title: "Permiso de almacenamiento",
            message: "La app necesita acceder a tus fotos para poder subir archivos.",
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
        return true; // en iOS no se pide permiso
    };

    // 📌 Función para abrir la galería
    const seleccionarFoto = async () => {
        const permiso = await requestStoragePermission();
        if (!permiso) {
        Alert.alert("Permiso denegado", "No se puede acceder a la galería.");
        return;
        }

        launchImageLibrary({ mediaType: "photo" }, (response) => {
        console.log("📌 Respuesta del picker:", response);
            if (response.didCancel) {
            console.log("Usuario canceló la selección de imagen");
            } else if (response.errorCode) {
            console.log("Error en image picker:", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
            const foto = {
                uri: response.assets[0].uri,
                type: response.assets[0].type,
                name: response.assets[0].fileName,
            };
            setFormulario({ ...formulario, foto });
            console.log("📷 Foto seleccionada:", foto);
            } else {
            console.log("⚠️ No se seleccionó ninguna imagen");
            }
        }
        );
    };

    // 👉 función submit
    const handleSubmit = async () => {
        try {
        const datos = new FormData();

        for (let campo in formulario) {
            if (formulario[campo]) {
            if (campo === "foto") {
                datos.append("foto", {
                uri: formulario.foto.uri,
                type: formulario.foto.type,
                name: formulario.foto.name
                });
            } else {
                datos.append(campo, formulario[campo]);
            }
            }
        }

        const res = await apiFetch("/crearUsuario", {
            method: "POST",
            body: datos,
        });

        const resultado = await res.json();
        if (res.ok) {
            alert("✅ Usuario creado correctamente");
            navigation.navigate("Usuario");
        } else {
            alert("❌ Error: " + resultado.mensaje);
        }
        } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("❌ Error al crear usuario");
        }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Crear Usuarios</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Usuario')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedorFormulario}>
                    <Text style={styles.titleUsuario}>Datos del Usuario</Text>
                    <TextInput style={styles.datosFormulario}
                        placeholder="N.O Identificacion"
                        keyboardType="numeric"
                        value={formulario.id}
                        onChangeText={(text) => setFormulario({ ...formulario, id: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Primer Nombre"
                        value={formulario.primer_nombre}
                        onChangeText={(text) => setFormulario({ ...formulario, primer_nombre: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Segundo Nombre"
                        value={formulario.segundo_nombre}
                        onChangeText={(text) => setFormulario({ ...formulario, segundo_nombre: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Primer Apellido"
                        value={formulario.primer_apellido}
                        onChangeText={(text) => setFormulario({ ...formulario, primer_apellido: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Segundo Apellido"
                        value={formulario.segundo_apellido}
                        onChangeText={(text) => setFormulario({ ...formulario, segundo_apellido: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Correo"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formulario.correo1}
                        onChangeText={(text) => setFormulario({ ...formulario, correo1: text })}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Contraseña"
                        secureTextEntry={true}   // 👈 oculta el texto como puntos
                        value={formulario.contrasena}
                        onChangeText={(text) => setFormulario({ ...formulario, contrasena: text })}
                    />
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                        <Picker
                            selectedValue={formulario.rol_id}
                            onValueChange={(value) => setFormulario({ ...formulario, rol_id: value })}
                            >
                            <Picker.Item label="Selecciona un Rol" value="" />
                            {roles.map((rol) => (
                                <Picker.Item key={rol.ID} label={rol.Nombre_Rol} value={rol.ID} />
                            ))}
                        </Picker>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                        <Picker
                            selectedValue={formulario.documento_id}
                            onValueChange={(value) => setFormulario({ ...formulario, documento_id: value })}
                            >
                            <Picker.Item label="Tipo de Documento" value="" />
                            {documentos.map((doc) => (
                                <Picker.Item key={doc.ID} label={doc.Tipo_Documento} value={doc.ID} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.titleUsuario}>Otros Datos</Text>

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Correo Alternativo"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formulario.correo2}
                        onChangeText={(text) => setFormulario({ ...formulario, correo2: text })}
                        />

                        <TextInput
                        style={styles.datosFormulario}
                        placeholder="Contacto Principal"
                        keyboardType="numeric"
                        value={formulario.contacto1}
                        onChangeText={(text) => setFormulario({ ...formulario, contacto1: text })}
                        />

                        <TextInput
                        style={styles.datosFormulario}
                        placeholder="Contacto Secundario"
                        keyboardType="numeric"
                        value={formulario.contacto2}
                        onChangeText={(text) => setFormulario({ ...formulario, contacto2: text })}
                        />

                        {/*selecionar fecha------------- */}
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}  // abrir date picker
                            >
                            <Text style={{ color: formulario.fecha_nacimiento ? "black" : "gray" }}>
                                {formulario.fecha_nacimiento || "Seleccionar fecha"}
                            </Text>
                        </TouchableOpacity>

                            {showDatePicker && (
                            <DateTimePicker
                                value={formulario.fecha_nacimiento ? new Date(formulario.fecha_nacimiento) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"} 
                                onChange={(event, selectedDate) => {
                                setShowDatePicker(false); // cerrar el picker
                                if (selectedDate) {
                                    // Guardar la fecha en formato YYYY-MM-DD
                                    const fecha = selectedDate.toISOString().split("T")[0];
                                    setFormulario({ ...formulario, fecha_nacimiento: fecha });
                                }
                                }}
                            />
                            )}
                        {/* fin selecionar fecha------------- */}

                    {/* seleccionar archivo */}
                    <TouchableOpacity style={styles.input2} onPress={seleccionarFoto}>
                        <Text style={{ color: "gray" }}>
                        {formulario.foto ? "Foto seleccionada ✅" : "Subir archivo"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={handleSubmit}>
                        <Text style={styles.textoCrearUsuario}> Guardar Usuario</Text>
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
        paddingBottom: 10,
        borderColor: colors.azulPrimario,
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
    input: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '80%',
        paddingVertical: 10
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