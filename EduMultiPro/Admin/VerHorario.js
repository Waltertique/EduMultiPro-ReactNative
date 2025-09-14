import { 
  View, Text, Image, TouchableOpacity, 
  StyleSheet, ScrollView, Alert 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors';

import { apiFetch } from "../api"; // 👈 importa tu helper
import { STATIC_URL } from "../api"; // 👈 importa aquí

export default function VerHorario({ navigation }) {

    const route = useRoute();
    const { id } = route.params; // 👈 ID que se pasa al navegar
    const [horario, setHorario] = useState(null);

    // 👉 Cargar datos del horario
    useEffect(() => {
        const obtenerHorario = async () => {
        try {
            const res = await apiFetch(`/Horarios/${id}`);
            const data = await res.json();

            if (res.ok) {
            setHorario(data);
            } else {
            Alert.alert("Error", data.error || "No se pudo obtener el horario");
            }
        } catch (error) {
            console.error("Error al obtener el horario:", error);
            Alert.alert("Error", "Hubo un problema al obtener el horario");
        }
        };

        obtenerHorario();
    }, [id]);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>

            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Informacion Horario</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Horario')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
                </View>

                {horario ? (
                <View style={styles.contenedorHoraio}>
                    <Text style={styles.titleHorario}>{horario.Titulo_Horario || "Horario sin título"}</Text>
                    
                    {horario.Imagen_Horario ? (
                        <Image
                        source={{ uri: `${STATIC_URL}/imagenes/${horario.Imagen_Horario}` }}
                        style={styles.fotoHorario}
                        resizeMode="contain"
                        />
                    ) : (
                        <Text>No se ha subido una imagen para este horario.</Text>
                    )}

                    <View style={styles.contenedorDesc}>
                        <Text style={styles.textTitleDesc}>Descripcion:</Text>
                        <Text style={styles.textDesc}>{horario.Descripcion_Horario || "Sin descripción"}</Text>
                    </View>
                </View>
                ) : (
                    <Text>Cargando horario...</Text>
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
    contenedorHoraio:{
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
});