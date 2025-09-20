import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

import * as React from 'react';
import { useState, useEffect } from 'react';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors';

import { apiFetch, STATIC_URL } from "../api"; // 👈 usamos el helper

const { width } = Dimensions.get("window"); 
const carruselWidth = width * 0.9; 

export default function PrincipalAlumno({ navigation }) {

    const [noticias, setNoticias] = useState({
        noticia1: null,
        noticia2: null,
        noticia3: null,
    });

    // 🔹 Cargar noticias al montar
    useEffect(() => {
        const fetchNoticias = async () => {
        try {
            const res = await apiFetch("/NoticiasPrincipales");
            const data = await res.json();
            setNoticias(data);
        } catch (error) {
            console.error("❌ Error al cargar noticias:", error);
        }
        };
        fetchNoticias();
    }, []);

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>
                    
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        <Image
                        source={require("../assets/f1.png")}
                        style={styles.img1}
                        resizeMode="cover"
                        />
                        <Image
                        source={require("../assets/f2.png")}
                        style={styles.img1}
                        resizeMode="cover"
                        />
                        <Image
                        source={require("../assets/f3.png")}
                        style={styles.img1}
                        resizeMode="cover"
                        />
                    </ScrollView>
                    
                    <LinearGradient
                        colors={[colors.azulSecundario2, colors.azulSecundario3]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.contenedorNoticia}
                    >
                        <Text style={styles.titleNoticia}>Noticias</Text>

                        {[noticias.noticia1, noticias.noticia2, noticias.noticia3].map((noticia, index) => (
                        <View key={index} style={styles.noticia}>
                            {noticia && noticia.Imagen1 ? (
                            <TouchableOpacity
                            onPress={() => navigation.navigate("VerNoticiaAlumno", { id: noticia.ID })}
                            >
                            <Image
                                source={{ uri: `${STATIC_URL}/imagenes/${noticia.Imagen1}` }}
                                style={styles.img2}
                                resizeMode="stretch"
                            />
                            </TouchableOpacity>
                            ) : (
                            <Image
                                source={require("../assets/error.png")}
                                style={styles.img2}
                                resizeMode="stretch"
                            />
                            )}
                            <Text style={styles.noticiaTitulo}>
                            {noticia ? noticia.Titulo_Noticia : "Sin noticia"}
                            </Text>
                            <Text style={styles.noticiaDescripcion}>
                            {noticia ? noticia.Encabezado : "No hay encabezado disponible."}
                            </Text>
                        </View>
                        ))}
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
        paddingTop: 20,
        alignItems: 'center',
    },
    img1: {
        width: carruselWidth,
        height: 100,
        marginHorizontal: (width - carruselWidth) / 2, // 👈 deja margen a los lados para que quede centrado
    },
    contenedorNoticia: {
        minWidth: '100%',
        padding: 20,
        marginTop: 20,
        minHeight: 230,
        borderWidth: 2,
        borderColor: colors.azulSecundario,
        alignItems: 'center'
    },
    titleNoticia: {
        fontWeight: 'bold',
        fontSize: 22,
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
    }
})