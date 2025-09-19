import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from 'react-native-image-picker';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

import { apiFetch } from "../api"; // 👈 importa tu helper
import { STATIC_URL } from "../api"; // 👈 importa aquí

export default function VerUsuario({ route, navigation }) {

    const { id } = route.params;

    const [usuario, setUsuario] = useState(null);
    const [roles, setRoles] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // 👉 Cargar usuario + roles + documentos
    useEffect(() => {
        apiFetch(`/verUsuario/${id}`)
        .then(res => res.json())
        .then(data => {
            setUsuario({
            ...data.usuario,
            fecha_nacimiento: data.usuario.Fecha_Nacimiento,
            foto: null // Para nueva imagen
            });
            setRoles(data.roles);
            setDocumentos(data.documentos);
        })
        .catch(err => console.error("Error cargando usuario:", err));
    }, [id]);

    if (!usuario) {
        return <Text style={{ marginTop: 50, textAlign: "center" }}>Cargando usuario...</Text>;
    }

    // 👉 Manejar cambios de inputs
    const handleChange = (field, value) => {
        setUsuario(prev => ({ ...prev, [field]: value }));
    };

    // 👉 Función para pedir permisos y seleccionar foto
    const seleccionarFoto = async () => {
        if (Platform.OS === 'android') {
        const permiso = Platform.Version >= 33 
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permiso);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permiso denegado", "No se puede acceder a la galería.");
            return;
        }
        }

        launchImageLibrary({ mediaType: "photo" }, response => {
        if (response.assets && response.assets.length > 0) {
            const foto = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
            };
            setUsuario(prev => ({ ...prev, foto }));
        }
        });
    };

    // 👉 Enviar actualización
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("usuario_id", usuario.ID);
            formData.append("documento_id", usuario.documento_id || "");
            formData.append("Primer_Nombre", usuario.Primer_Nombre || "");
            formData.append("Segundo_Nombre", usuario.Segundo_Nombre || "");
            formData.append("Primer_Apellido", usuario.Primer_Apellido || "");
            formData.append("Segundo_Apellido", usuario.Segundo_Apellido || "");
            formData.append("Correo1", usuario.Correo1 || "");
            formData.append("Correo2", usuario.Correo2 || "");
            formData.append("Contacto1", usuario.Contacto1 || "");
            formData.append("Contacto2", usuario.Contacto2 || "");
            formData.append("Fecha_Nacimiento", usuario.fecha_nacimiento || "");
            formData.append("rol_id", usuario.rol_id || "");

            // 👉 Contraseña (opcional)
            if (usuario.contrasena && usuario.contrasena.trim() !== "") {
                formData.append("contrasena", usuario.contrasena);
            }

            if (usuario.foto) {
                formData.append("RutaFoto", {
                    uri: usuario.foto.uri,
                    type: usuario.foto.type,
                    name: usuario.foto.name
                });
            }

            const res = await apiFetch("/actualizarUsuario", {
                method: "POST",
                body: formData
            });

            const result = await res.json();

            if (res.ok) {
                Alert.alert("✅ Éxito", "Usuario actualizado correctamente");
                setMostrarFormulario(false);

                // 🔄 Recargar usuario actualizado
                const updatedUserRes = await apiFetch(`/verUsuario/${id}`);
                const updatedData = await updatedUserRes.json();
                setUsuario({
                    ...updatedData.usuario,
                    fecha_nacimiento: updatedData.usuario.Fecha_Nacimiento,
                    foto: usuario.foto || null
                });

            } else {
                Alert.alert("❌ Error", result.mensaje || "No se pudo actualizar");
            }

        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            Alert.alert("❌ Error", "Error al enviar datos");
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
                    <Text style={styles.titleUsuario}>Informacion del Usuario</Text>
                    
                    <View style={styles.contenedorBoton}>
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Usuario')}>
                            <FontAwesome name="user" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Salir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => setMostrarFormulario(true)}>
                            <FontAwesome name="edit" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Modificar</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.contenedorInfo}>
                    
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> N.O Indentificacion:</Text>
                        <Text style={styles.textoInfo}>{usuario.ID}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Documento:</Text>
                        <Text style={styles.textoInfo}>{usuario.Documento}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Primer Nombre:</Text>
                        <Text style={styles.textoInfo}>{usuario.Primer_Nombre}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Segundo Nombre:</Text>
                        <Text style={styles.textoInfo}>{usuario.Segundo_Nombre}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Primer Apellido:</Text>
                        <Text style={styles.textoInfo}>{usuario.Primer_Apellido}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Segundo Apellido:</Text>
                        <Text style={styles.textoInfo}>{usuario.Segundo_Apellido}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Correo1:</Text>
                        <Text style={styles.textoInfo}>{usuario.Correo1}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Correo2:</Text>
                        <Text style={styles.textoInfo}> {usuario.Correo2}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Contacto1:</Text>
                        <Text style={styles.textoInfo}>{usuario.Contacto1}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Contacto2:</Text>
                        <Text style={styles.textoInfo}> {usuario.Contacto2}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Fecha de Nacimiento:</Text>
                        <Text style={styles.textoInfo}> {usuario.Fecha_Nacimiento}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Rol:</Text>
                        <Text style={styles.textoInfo}>{usuario.Rol}</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Foto:</Text>
                        {usuario.RutaFoto && (
                        <Image
                            source={{ uri: `${STATIC_URL}/imagenes/${usuario.RutaFoto}` }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                        )}
                    </View>

                </View>
                
                {/* Formulario de modificación */}
                {mostrarFormulario && (
                <View style={styles.contenedorFormulario}>
                    <Text style={styles.titleUsuario}>Modificar Usuario</Text>
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="N.O Identificación"
                        keyboardType="numeric"
                        value={usuario.ID}
                        onChangeText={text => handleChange("ID", text)}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Primer Nombre"
                        value={usuario.Primer_Nombre}
                        onChangeText={text => handleChange("Primer_Nombre", text)}
                    />

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Segundo Nombre"
                        value={usuario.Segundo_Nombre}
                        onChangeText={text => handleChange("Segundo_Nombre", text)}
                    />

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Primer Apellido"
                        value={usuario.Primer_Apellido}
                        onChangeText={text => handleChange("Primer_Apellido", text)}
                    />

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Segundo Apellido"
                        value={usuario.Segundo_Apellido}
                        onChangeText={text => handleChange("Segundo_Apellido", text)}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Correo1"
                        value={usuario.Correo1}
                        onChangeText={text => handleChange("Correo1", text)}
                    />
                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Nueva Contraseña (opcional)"
                        secureTextEntry={true}
                        value={usuario.contrasena || ""}
                        onChangeText={text => handleChange("contrasena", text)}
                    />
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                        <Picker
                            selectedValue={usuario.rol_id}
                            onValueChange={value => handleChange("rol_id", value)}
                        >
                            <Picker.Item label="Selecciona un rol" value="" />
                            {roles.map(rol => <Picker.Item key={rol.ID} label={rol.Nombre_Rol} value={rol.ID} />)}
                        </Picker>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                        <Picker
                            selectedValue={usuario.documento_id}
                            onValueChange={value => handleChange("documento_id", value)}
                        >
                            <Picker.Item label="Tipo de documento" value="" />
                            {documentos.map(doc => <Picker.Item key={doc.ID} label={doc.Tipo_Documento} value={doc.ID} />)}
                        </Picker>
                    </View>

                    <Text style={styles.titleUsuario}>Otros Datos</Text>

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Correo2"
                        value={usuario.Correo2}
                        onChangeText={text => handleChange("Correo2", text)}
                    />

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Contacto1"
                        value={usuario.Contacto1}
                        onChangeText={text => handleChange("Contacto1", text)}
                    />

                    <TextInput
                        style={styles.datosFormulario}
                        placeholder="Contacto2"
                        value={usuario.Contacto2}
                        onChangeText={text => handleChange("Contacto2", text)}
                    />
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={{ color: usuario.fecha_nacimiento ? "black" : "gray" }}>
                        {usuario.fecha_nacimiento || "Seleccionar fecha"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                        value={usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                            const fecha = selectedDate.toISOString().split("T")[0];
                            handleChange("fecha_nacimiento", fecha);
                            }
                        }}
                        />
                    )}

                    {/* Simulación archivo */}
                    <TouchableOpacity style={styles.input2} onPress={seleccionarFoto}>
                        <Text style={{ color: "gray" }}>
                        {usuario.foto ? "Foto seleccionada ✅" : "Subir archivo"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonModificar} onPress={handleSubmit}>
                        <FontAwesome name="edit" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Modificar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonModificar} onPress={() => setMostrarFormulario(false)}>
                        <FontAwesome name="sign-out" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Cancelar</Text>
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

    tituloUsuario: {
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 10,
    },
    contenedorBoton: {
        flexDirection: 'row',
        marginTop: 15,
        minWidth: '60%',
        justifyContent: 'space-around',
    },
    botonCrearUsuario: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    botonModificar: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 15,
    },
    textoCrearUsuario: {
        color: 'white',
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },
    contenedorInfo: {
        minWidth: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginVertical: 20,
    },
    contenedorInfo2: {
        minWidth: '90%',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    textoInfoTitle:{
        fontWeight: 'bold',
        marginRight: 10,
    },
    fotoAlumno: {
        width: 120,
        height: 120,
        marginHorizontal: 'auto',
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