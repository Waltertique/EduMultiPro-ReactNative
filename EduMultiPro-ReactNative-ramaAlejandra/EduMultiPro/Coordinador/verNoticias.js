import { View, Text, Button, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from './DesplegableCoor';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function VerNoticia({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Ver Noticia</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('noticias')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedor1}>
                    <View style={styles.contenedor2}>
                        <Text style={styles.tituloNoticia}>Nueva tecnológia</Text>
                        <Text style={styles.parrafoNoticia}>Apple ha presentado oficialmente su nuevo iPhone con capacidades avanzadas de inteligencia artificial, en un evento que ha generado gran expectativa en el mundo tecnológico. El dispositivo incluye un procesador mejorado, sensores más precisos y nuevas funciones que aprenden del comportamiento del usuario para ofrecer una experiencia más personalizada.</Text>

                        <Image 
                          source={require('../assets/f1.png')} 
                          style={styles.imagenNoticia} 
                          resizeMode="contain"
                        />

                        <Text style={styles.parrafoNoticia}>Una de las novedades más destacadas es el asistente inteligente renovado, que no solo responde preguntas sino que también anticipa necesidades, como sugerir rutas menos congestionadas, ajustar automáticamente configuraciones según la hora del día y hasta redactar mensajes con base en el estilo de escritura del usuario. Todo esto se ejecuta localmente, preservando la privacidad del usuario.</Text>

                        <Image 
                          source={require('../assets/1.png')} 
                          style={styles.imagenNoticia} 
                          resizeMode="contain"
                        />

                        <Text style={styles.parrafoNoticia}>Los analistas prevén que esta evolución podría marcar una nueva etapa en la interacción con los smartphones. El lanzamiento estará disponible a nivel mundial a partir del próximo mes, y se espera que motive a otras marcas a acelerar su incorporación de tecnologías basadas en IA.</Text>
                        
                    </View>
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