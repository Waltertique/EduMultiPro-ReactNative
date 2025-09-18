import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert, Platform, 
  PermissionsAndroid 
} from "react-native";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import Desplegable from "../Desplegable";
import colors from "../colors";
import { apiFetch } from "../api";

export default function CrearTrabajo({ navigation }) {

    const route = useRoute();
    const { id } = route.params || {}; // 👈 Aula ID

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [archivos, setArchivos] = useState([]); // 👈 varios archivos

    // 🔹 Pedir permisos (solo Android)
    const requestStoragePermission = async () => {
        if (Platform.OS === "android") {
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
            buttonPositive: "Aceptar",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
        }
        return true; // iOS no necesita
    };

    // 🔹 Seleccionar múltiples archivos
    const seleccionarArchivos = async () => {
        const permiso = await requestStoragePermission();
        if (!permiso) {
        Alert.alert("Permiso denegado", "No se puede acceder a los archivos.");
        return;
        }

        launchImageLibrary({ mediaType: "mixed", selectionLimit: 0 }, (response) => {
        if (response.didCancel) {
            console.log("Usuario canceló selección");
        } else if (response.errorCode) {
            console.log("Error en image picker:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
            const nuevos = response.assets.map((a) => ({
            uri: a.uri,
            type: a.type,
            name: a.fileName,
            }));
            setArchivos((prev) => [...prev, ...nuevos]);
        }
        });
    };

    // 🔹 Guardar trabajo
    const handleCrearTrabajo = async () => {
        if (!titulo || !fecha) {
        Alert.alert("Error", "Debes ingresar título y fecha");
        return;
        }

        const usuarioLogueado = JSON.parse(await AsyncStorage.getItem("usuario"));
        const formData = new FormData();

        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        formData.append("fecha", fecha);
        formData.append("aula_id", id);
        formData.append("usuario_id", usuarioLogueado?.id);

        archivos.forEach((archivo) => {
        formData.append("archivos", {
            uri: archivo.uri,
            name: archivo.name,
            type: archivo.type,
        });
        });

        try {
        const res = await apiFetch("/CrearTrabajo", {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

        const data = await res.json();
        Alert.alert("Respuesta", data.mensaje);

        if (res.ok) {
            navigation.navigate("Trabajo", { id }); // volver a trabajos
        }
        } catch (error) {
        console.error("❌ Error creando trabajo:", error);
        Alert.alert("Error", "No se pudo crear el trabajo");
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
                    <Text style={styles.titleUsuario}>Crear Trabajo</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate("Trabajo", { id })}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedorFormulario}>

                    <TextInput
                    style={styles.datosFormulario}
                    placeholder="Título"
                    value={titulo}
                    onChangeText={setTitulo}
                    />

                    <TextInput
                    style={styles.datosDescipcion}
                    placeholder="Descripción"
                    multiline
                    numberOfLines={5}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    />

                    {/* Fecha con DateTimePicker */}
                    <TouchableOpacity style={styles.input2} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: fecha ? "black" : "gray" }}>
                        {fecha || "Seleccionar fecha de entrega"}
                    </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                    <DateTimePicker
                        value={fecha ? new Date(fecha) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            const f = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
                            setFecha(f);
                        }
                        }}
                    />
                    )}

                    <TouchableOpacity style={styles.input2} onPress={seleccionarArchivos}>
                    <Text style={{ color: "gray" }}>
                        {archivos.length > 0
                        ? `${archivos.length} archivo(s) seleccionado(s) ✅`
                        : "Seleccionar archivos"}
                    </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={handleCrearTrabajo}>
                        <Text style={styles.textoCrearUsuario}> Guardar Trabajo</Text>
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
    datosDescipcion: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        minWidth: '80%',
        maxWidth: '85%',
        height: 120,
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
    }

});