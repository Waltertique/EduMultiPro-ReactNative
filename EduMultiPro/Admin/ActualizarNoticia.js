import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Platform, 
  PermissionsAndroid, Alert, Image 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import * as React from 'react';
import { useState, useEffect } from "react";
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from '@react-navigation/native';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

export default function ActualizarNoticia({ navigation }) {

    const route = useRoute();
    const { id } = route.params; // 👈 pasamos el id desde la lista de noticias

    const [formulario, setFormulario] = useState({
        titulo: "",
        encabezado: "",
        descripcion1: "",
        descripcion2: "",
        descripcion3: "",
        fecha: "",
        tipo_noticia_id: ""
    });

    const [imagenesActuales, setImagenesActuales] = useState({});
    const [nuevasImagenes, setNuevasImagenes] = useState({});
    const [tipos, setTipos] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // cargar noticia + tipos
    useEffect(() => {
        const cargar = async () => {
        try {
            const [notaRes, tiposRes] = await Promise.all([
            fetch(`http://192.168.0.3:3000/api/edumultipro/Noticias/${id}`).then(r => r.json()),
            fetch("http://192.168.0.3:3000/api/edumultipro/TiposNoticia").then(r => r.json())
            ]);

            setFormulario({
            titulo: notaRes.Titulo_Noticia,
            encabezado: notaRes.Encabezado,
            descripcion1: notaRes.Descripcion1,
            descripcion2: notaRes.Descripcion2 || "",
            descripcion3: notaRes.Descripcion3 || "",
            fecha: notaRes.Fecha_Notica?.split("T")[0],
            tipo_noticia_id: notaRes.tipo_noticia_id.toString()
            });
            setImagenesActuales({
            imagen1: notaRes.Imagen1,
            imagen2: notaRes.Imagen2,
            imagen3: notaRes.Imagen3
            });
            setTipos(tiposRes);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo cargar la noticia");
        }
        };
        cargar();
    }, [id]);

    // pedir permisos
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
        try {
            let permiso = Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permiso, {
            title: "Permiso de almacenamiento",
            message: "La app necesita acceder a tus fotos para poder subir imágenes.",
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

    // seleccionar imagen
    const seleccionarImagen = async (campo) => {
        const permiso = await requestStoragePermission();
        if (!permiso) {
        Alert.alert("Permiso denegado", "No se puede acceder a la galería.");
        return;
        }

        launchImageLibrary({ mediaType: "photo" }, (response) => {
        if (response.didCancel) {
            console.log("Usuario canceló selección");
        } else if (response.errorCode) {
            console.log("Error en image picker:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
            const foto = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
            };
            setNuevasImagenes(prev => ({ ...prev, [campo]: foto }));
        }
        });
    };

    // actualizar noticia
    const handleSubmit = async () => {
        if (!formulario.titulo || !formulario.encabezado || !formulario.descripcion1 || !formulario.fecha || !formulario.tipo_noticia_id) {
        Alert.alert("Error", "Por favor complete los campos obligatorios");
        return;
        }

        try {
        const datos = new FormData();
        for (let campo in formulario) {
            if (formulario[campo]) datos.append(campo, formulario[campo]);
        }

        for (let key in nuevasImagenes) {
            if (nuevasImagenes[key]) {
            datos.append(key, {
                uri: nuevasImagenes[key].uri,
                type: nuevasImagenes[key].type,
                name: nuevasImagenes[key].name
            });
            }
        }

        const res = await fetch(`http://192.168.0.3:3000/api/edumultipro/Noticias/${id}`, {
            method: "PUT",
            body: datos,
        });

        const resultado = await res.json();
        if (res.ok) {
            Alert.alert("Éxito", "Noticia actualizada correctamente");
            navigation.navigate("Noticia");
        } else {
            Alert.alert("Error", resultado.error || "No se pudo actualizar la noticia");
        }
        } catch (error) {
        console.error("Error al actualizar noticia:", error);
        Alert.alert("Error", "Ocurrió un error al actualizar la noticia");
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
                    <Text style={styles.titleUsuario}>Actualizar Noticia</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Noticia')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedorFormulario}>
                    <TextInput style={styles.datosFormulario} placeholder='Título de la Noticia'
                    value={formulario.titulo}
                    onChangeText={(text) => setFormulario({ ...formulario, titulo: text })}
                    />
                    <TextInput style={styles.datosDescipcion} placeholder='Encabezado' multiline numberOfLines={4}
                    value={formulario.encabezado}
                    onChangeText={(text) => setFormulario({ ...formulario, encabezado: text })}
                    />
                    <TextInput style={styles.datosDescipcion} placeholder='Descripción 1' multiline numberOfLines={5}
                    value={formulario.descripcion1}
                    onChangeText={(text) => setFormulario({ ...formulario, descripcion1: text })}
                    />
                    <TextInput style={styles.datosDescipcion} placeholder='Descripción 2 (opcional)' multiline numberOfLines={5}
                    value={formulario.descripcion2}
                    onChangeText={(text) => setFormulario({ ...formulario, descripcion2: text })}
                    />
                    <TextInput style={styles.datosDescipcion} placeholder='Descripción 3 (opcional)' multiline numberOfLines={5}
                    value={formulario.descripcion3}
                    onChangeText={(text) => setFormulario({ ...formulario, descripcion3: text })}
                    />
                    
                    {/* fecha */}
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: formulario.fecha ? "black" : "gray" }}>
                        {formulario.fecha || "Seleccionar fecha"}
                    </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                    <DateTimePicker
                        value={formulario.fecha ? new Date(formulario.fecha) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            const fecha = selectedDate.toISOString().split("T")[0];
                            setFormulario({ ...formulario, fecha });
                        }
                        }}
                    />
                    )}

                    {/* imágenes */}
                    {["imagen1", "imagen2", "imagen3"].map((campo, idx) => (
                    <View key={campo}>
                        <Text>Imagen {idx + 1}</Text>
                        {imagenesActuales[campo] ? (
                        <Image
                            source={{ uri: `http://192.168.0.3:3000/imagenes/${imagenesActuales[campo]}` }}
                            style={{ width: 150, height: 100, marginBottom: 5 }}
                        />
                        ) : (
                        <Text style={{ color: "gray" }}>No hay imagen actual</Text>
                        )}
                        <TouchableOpacity style={styles.input2} onPress={() => seleccionarImagen(campo)}>
                        <Text style={{ color: "gray" }}>
                            {nuevasImagenes[campo] ? "Imagen nueva seleccionada ✅" : "Subir nueva imagen"}
                        </Text>
                        </TouchableOpacity>
                    </View>
                    ))}


                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '85%', marginTop: 10, marginBottom: 20}}>
                        <Picker
                            selectedValue={formulario.tipo_noticia_id}
                            onValueChange={(value) => setFormulario({ ...formulario, tipo_noticia_id: value })}
                        >
                            <Picker.Item label="Seleccione tipo de noticia" value="" />
                            {tipos.map((tipo) => (
                            <Picker.Item key={tipo.ID} label={tipo.Tipo} value={tipo.ID} />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={handleSubmit}>
                        <Text style={styles.textoCrearUsuario}> Actualizar Noticia</Text>
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
    contenedorFormulario: {
        marginTop: 20,
        minWidth: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
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
    },
    input: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
        marginBottom: 20,
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
    }

});