import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Alert, Platform, 
  PermissionsAndroid 
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import { apiFetch } from "../api";

export default function ActualizarTrabajoProfesor({ navigation }) {

    const route = useRoute();
    const { id } = route.params || {}; // 👈 ID del trabajo

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [archivosActuales, setArchivosActuales] = useState([]); // BD
    const [archivosNuevos, setArchivosNuevos] = useState([]);     // subidos
    const [archivosEliminar, setArchivosEliminar] = useState([]); // ids a eliminar
    const [aulaId, setAulaId] = useState(null);

    // 🔹 Cargar datos del trabajo
    useEffect(() => {
        apiFetch(`/Trabajo/${id}`)
        .then(res => res.json())
        .then(data => {
            setTitulo(data.trabajo.Titulo_Trabajo);
            setDescripcion(data.trabajo.Descripcion_Trabajo);
            setFecha(data.trabajo.Fecha_Trabajo.split("T")[0]);
            setArchivosActuales(data.archivos);
            setAulaId(data.trabajo.aula_id);
        })
        .catch(err => {
            console.error("Error cargando trabajo:", err);
            Alert.alert("Error", "No se pudo cargar el trabajo");
        });
    }, [id]);

    // 🔹 Pedir permisos
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
            message: "La app necesita acceder a tus archivos.",
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
        return true;
    };

    // 🔹 Seleccionar archivos nuevos
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
            setArchivosNuevos((prev) => [...prev, ...nuevos]);
        }
        });
    };

    // 🔹 Actualizar trabajo
    const handleActualizarTrabajo = async () => {
        if (!titulo || !fecha) {
        Alert.alert("Error", "Debes ingresar título y fecha");
        return;
        }

        const formData = new FormData();
        formData.append("trabajo_id", id);
        formData.append("titulo", titulo);
        formData.append("descripcion", descripcion);
        formData.append("fecha", fecha);
        formData.append("aula_id", aulaId);

        archivosNuevos.forEach((archivo) => {
        formData.append("archivos", {
            uri: archivo.uri,
            name: archivo.name,
            type: archivo.type,
        });
        });

        archivosEliminar.forEach((archivoId) => {
        formData.append("eliminar_archivos", archivoId);
        });

        try {
        const res = await apiFetch("/ActualizarTrabajo", {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

        const data = await res.json();
        Alert.alert("Respuesta", data.mensaje);

        if (res.ok) {
            navigation.navigate("TrabajoProfesor", { id: aulaId });
        }
        } catch (error) {
        console.error("❌ Error actualizando trabajo:", error);
        Alert.alert("Error", "No se pudo actualizar el trabajo");
        }
    };

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>

                    <View style={styles.tituloUsuario}>
                        <Text style={styles.titleUsuario}>Modificar Trabajo</Text>
                        
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate("TrabajoProfesor", { id: aulaId })}>
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

                        {/* Fecha */}
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
                                const f = selectedDate.toISOString().split("T")[0];
                                setFecha(f);
                            }
                            }}
                        />
                        )}

                        {/* Archivos actuales */}
                        <Text>Archivos actuales:</Text>
                        {archivosActuales.length > 0 ? (
                        archivosActuales.map((archivo) => (
                            <TouchableOpacity
                            key={archivo.ID}
                            style={styles.input2}
                            onPress={() => {
                                if (archivosEliminar.includes(archivo.ID)) {
                                setArchivosEliminar((prev) => prev.filter((id) => id !== archivo.ID));
                                } else {
                                setArchivosEliminar((prev) => [...prev, archivo.ID]);
                                }
                            }}
                            >
                            <Text style={{ color: archivosEliminar.includes(archivo.ID) ? "red" : "black" }}>
                                {archivo.nombre_original} {archivosEliminar.includes(archivo.ID) ? "(Eliminar)" : ""}
                            </Text>
                            </TouchableOpacity>
                        ))
                        ) : (
                        <Text>No hay archivos</Text>
                        )}

                        {/* Subir archivos nuevos */}
                        <TouchableOpacity style={styles.input2} onPress={seleccionarArchivos}>
                        <Text style={{ color: "gray" }}>
                            {archivosNuevos.length > 0
                            ? `${archivosNuevos.length} archivo(s) nuevo(s) ✅`
                            : "Seleccionar archivos nuevos"}
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={handleActualizarTrabajo}>
                        <Text style={styles.textoCrearUsuario}> Actualizar Trabajo</Text>
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
    
    centroProfeso: {
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
})