import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

import { apiFetch, STATIC_URL } from '../api'; 
import ErrorImg from '../assets/error.png';

export default function NoticiaAlumno() {

    const [noticias, setNoticias] = useState([]);
    const navigation = useNavigation();

    // 🔹 cargar noticias desde API
    useEffect(() => {
        apiFetch("/NoticiasDatos")
        .then(res => res.json())
        .then(data => setNoticias(data))
        .catch(err => console.error("Error al cargar noticias:", err));
    }, []);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>
                    
                    <LinearGradient
                      colors={[colors.azulSecundario2, colors.azulSecundario3]} // 👈 usando variables
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.contenedorNoticia}
                    >
                        <Text style={styles.titleNoticia}>Noticias</Text>

                        {noticias.length === 0 ? (
                            <Text style={{ color: "white", textAlign: "center" }}>
                                No hay noticias disponibles.
                            </Text>
                            ) : (
                            noticias.map(noticia => (
                                <View key={noticia.ID} style={styles.noticia}>
                                <Image
                                    source={
                                    noticia.Imagen1
                                        ? { uri: `${STATIC_URL}/imagenes/${noticia.Imagen1}` }
                                        : ErrorImg
                                    }
                                    style={styles.img2}
                                    resizeMode="stretch"
                                />
                                <Text style={styles.noticiaTitulo}>{noticia.Titulo_Noticia}</Text>
                                <Text style={styles.noticiaDescripcion}>{noticia.Encabezado}</Text>
                                
                                {/* 👇 Botón Ver más */}
                                <TouchableOpacity
                                    style={styles.botonCrearNoticia}
                                    onPress={() => navigation.navigate("VerNoticiaAlumno", { id: noticia.ID })}
                                >
                                    <Text style={styles.textoCrearNoticia}> Ver más</Text>
                                </TouchableOpacity>
                                </View>
                            ))
                        )}

                    </LinearGradient>

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
    
    centroAlumno: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    contenedorNoticia: {
        width: 320,
        paddingVertical: 15,
        borderWidth: 2,
        borderColor: colors.azulSecundario,
        alignItems: 'center'
    },
    titleNoticia: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white'
    },
    noticia: {
        width: 280,
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: 10,
        borderRadius: 20,
    },
    img2: {
        borderWidth: 1,
        borderColor: 'white',
        width: 280,
        height: 165,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    noticiaTitulo:{
        width: 250,
        textAlign: 'center',
        color: colors.azulPrimario,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    noticiaDescripcion: {
        marginTop: 5,
        width: 250,
        textAlign: 'justify'
    },
    botonCrearNoticia: {
        backgroundColor: colors.azulSecundario,
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 10,
        marginTop: 15
    },
    textoCrearNoticia: {
        color: 'white',
    },
})