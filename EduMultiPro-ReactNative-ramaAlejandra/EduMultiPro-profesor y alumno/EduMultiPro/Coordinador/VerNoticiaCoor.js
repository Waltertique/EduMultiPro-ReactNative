import { View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import DesplegableCoor from './DesplegableCoor.js';

import { apiFetch } from "../api"; // 👈 importa tu helper
import { STATIC_URL } from "../api"; // 👈 importa aquí

export default function VerNoticiaCoor({ navigation }) {

const route = useRoute();
    const { id } = route.params; // 👈 el id viene de la navegación
    const [noticia, setNoticia] = useState(null);

    useEffect(() => {
        const cargarNoticia = async () => {
        try {
            const res = await apiFetch(`/Noticias/${id}`);
            const data = await res.json();
            if (res.ok) {
            setNoticia(data);
            } else {
            Alert.alert("Error", data.error || "No se pudo cargar la noticia");
            }
        } catch (error) {
            console.error("Error cargando noticia:", error);
            Alert.alert("Error", "Error de conexión con el servidor");
        }
        };
        cargarNoticia();
    }, [id]);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableCoor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Ver Noticia</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('NoticiaCoor')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                {noticia && (
                <View style={styles.contenedor1}>
                    <View style={styles.contenedor2}>
                        <Text style={styles.tituloNoticia}>{noticia.Titulo_Noticia}</Text>
                        <Text style={styles.parrafoNoticia}>{noticia.Descripcion1}</Text>

                        {/* Imagen 2 */}
                        {noticia.Imagen2 && (
                        <Image
                            source={{ uri: `${STATIC_URL}/imagenes/${noticia.Imagen2}` }}
                            style={styles.imagenNoticia}
                            resizeMode="contain"
                        />
                        )}

                        {/* Descripción 2 */}
                        {noticia.Descripcion2 && (
                            <Text style={styles.parrafoNoticia}>{noticia.Descripcion2}</Text>
                        )}

                        {/* Imagen 3 */}
                        {noticia.Imagen3 && (
                        <Image
                            source={{ uri: `${STATIC_URL}/imagenes/${noticia.Imagen3}` }}
                            style={styles.imagenNoticia}
                            resizeMode="contain"
                        />
                        )}

                        {/* Descripción 3 */}
                        {noticia.Descripcion3 && (
                            <Text style={styles.parrafoNoticia}>{noticia.Descripcion3}</Text>
                        )}

                        {/* Fecha */}
                        <Text style={styles.parrafoNoticia}>
                            <Text style={{ fontWeight: "bold" }}>Fecha:</Text>{" "}
                            {new Date(noticia.Fecha_Notica).toLocaleDateString()}
                        </Text>
                        
                    </View>
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
    contenedor1: {
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.azulPrimario,
        borderRadius: 20,
        minWidth: '90%',
    },
    contenedor2: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        minWidth: '90%',
    },
    tituloNoticia: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
        flexWrap: "wrap",
        textAlign: 'center',
        width: 276,
    },
    parrafoNoticia: {
        marginTop: 10,
        textAlign: 'justify',
        flexWrap: "wrap",
        width: 276,
    },
    imagenNoticia: {
        width: 276,
        height: 85,
        marginVertical: 10,
    }

});