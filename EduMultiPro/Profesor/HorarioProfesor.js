import { 
  View, Text, Image, StyleSheet, ScrollView, 
  ActivityIndicator, Alert 
} from 'react-native';
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import { apiFetch, STATIC_URL } from "../api";
import colors from '../colors'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function HorarioProfesor() {

    const [horario, setHorario] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const cargarHorario = async () => {
        try {
            const usuarioLocal = JSON.parse(await AsyncStorage.getItem("usuario"));
            if (!usuarioLocal?.id) {
            Alert.alert("Error", "No hay sesión activa");
            return;
            }

            // 🔹 Llamar a la API de horario
            const res = await apiFetch(`/HorarioUsuario/${usuarioLocal.id}`);
            const data = await res.json();

            if (res.ok && !data.mensaje) {
            setHorario(data);
            } else {
            setHorario(null);
            }
        } catch (error) {
            console.error("❌ Error al cargar horario:", error);
            Alert.alert("Error", "No se pudo cargar el horario");
        } finally {
            setLoading(false);
        }
        };

        cargarHorario();
    }, []);

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text>Cargando horario...</Text>
        </View>
        );
    }

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>
                    
                    <View style={styles.tituloUsuario}>
                        <Text style={styles.titleUsuario}>Informacion Horario</Text>
                    </View>
    
                    {horario ? (
                        <View style={styles.contenedorHorario}>
                        <Text style={styles.titleHorario}>{horario.Titulo_Horario}</Text>

                        {horario.Imagen_Horario ? (
                            <Image
                            source={{ uri: `${STATIC_URL}/imagenes/${horario.Imagen_Horario}` }}
                            style={styles.fotoHorario}
                            resizeMode="contain"
                            />
                        ) : (
                            <FontAwesome name="calendar" size={100} color="gray" />
                        )}

                        <View style={styles.contenedorDesc}>
                            <Text style={styles.textTitleDesc}>Descripción:</Text>
                            <Text style={styles.textDesc}>{horario.Descripcion_Horario}</Text>
                        </View>
                        </View>
                    ) : (
                        <View style={styles.noHorario}>
                        <Text style={{ fontSize: 18, color: "gray", textAlign: "center" }}>
                            No hay horarios creados para ti aún.
                        </Text>
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
    
    centroProfeso: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    tituloUsuario: {
        minWidth: '90%',
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
    contenedorHorario:{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        minWidth: '90%',
        marginTop: 20,
        alignItems: 'center',
    },
    fotoHorario:{
        width: 280,
        height: 200,
        marginTop: 10,
    },
    titleHorario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
        flexWrap: "wrap",
        width: 250,
        textAlign: 'center',
    },
    contenedorDesc:{
        width: 260,
        marginTop: 10,
    },
    textTitleDesc: {
        color: colors.azulPrimario
    },
    textDesc:{
        flexWrap: "wrap",
        textAlign: 'justify',
    }
})