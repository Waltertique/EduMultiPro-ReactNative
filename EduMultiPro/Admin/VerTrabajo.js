import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function VerTrabajo({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                {/* Navegardor de fucniones del trabajo */}
                <View style={styles.tituloTrabajo}>
                    
                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajo')}>
                        <Text style={styles.textoControlAula}> Trabajo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerTrabajoEntregado')}>
                        <Text style={styles.textoControlAula}> Entregas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Trabajo')}>
                        <Text style={styles.textoControlAula}> Salir</Text>
                    </TouchableOpacity>
                    
                </View>

                <View style={styles.titleTrabajo}>
                    <Image 
                      source={require('../assets/f9.png')} 
                      style={styles.img1} 
                      resizeMode="contain"
                    />
                    <Text style={styles.trabajoTitle}>Titulo del Trabajo </Text>
                </View> 
                <View style={styles.titleFecha}>
                    <Text>Fecha de Entrega: 40/34/4543 </Text>
                </View> 
                <View style={styles.descripcionTrabajo}>
                    <Text style={styles.descipcionTitle}>Descripcion: </Text>
                    <Text style={styles.trabajoDescipcion}>Apple ha presentado oficialmente su nuevo iPhone con capacidades avanzadas 
                        de inteligencia artificial, en un evento que ha generado gran expectativa en el 
                        mundo tecnológico. El dispositivo incluye un procesador mejorado, sensores más precisos 
                        y nuevas funciones que aprenden del comportamiento del usuario para ofrecer una experiencia más personalizada.</Text>
                    <Text style={styles.archivo}>Ver Archivo</Text>
                </View>
                
                <Text style={styles.titleComentario}>Agregar comentario</Text>

                {/* Formulario Para crear un comentario */}
                    <View style={styles.ingresoComentario}>
                        <TextInput style={styles.datosComentar} placeholder='Comentar'/>
                        <TouchableOpacity style={styles.botonComentar}>
                            <Text style={styles.textoCrearAula}>Enviar</Text>
                        </TouchableOpacity>
                    </View>

                {/* Informacion del Comentario */}
                    <View style={styles.verComentario}>
                        <View style={styles.verAnuncioFoto}>
                            <View style={styles.info1}>
                                <Image source={require('../assets/foto.jpg')} style={styles.img2} resizeMode="contain"/>
                                <Text style={styles.nombreUsuario}>Nombre Usuario</Text>
                            </View>
                            <Text style={styles.fechaAnuncio}>22/23/3423</Text>
                        </View>

                        <Text style={styles.textoAnuncio}>Apple ha presentado oficialmente su nuevo iPhone con capacidades avanzadas 
                            de inteligencia artificial, en un evento que ha generado gran expectativa en el mundo tecnológico. 
                        </Text>

                        <TouchableOpacity style={styles.botonEliminar}>
                            <Text style={styles.textoCrearAula}> Eliminar</Text>
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
    tituloTrabajo: {
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 5,
        marginBottom: 20
    },
    botonControlAula: {
        flexDirection: 'row',
        backgroundColor: colors.azulClaro,
        width: 80,
        justifyContent: 'center'
    },
    textoControlAula: {
        color: 'Black',
        fontSize: 16
    },
    titleTrabajo: {
        minWidth: '90%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    img1:{
        width: 35,
        height: 35
    },
    trabajoTitle: {
        marginLeft: 10, 
        fontWeight: 'bold',               
        fontSize: 16,
        flexWrap: "wrap",
        width: 265,
    },
    titleFecha: {
        minWidth: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2
    },
    descripcionTrabajo: {
        minWidth: '90%',
        flexDirection: 'column',
        marginTop: 10,
    },
    descipcionTitle:{
        fontWeight: 'bold',               
        fontSize: 16,
        minWidth: '90%',
    },
    trabajoDescipcion: {
        minWidth: '88%',
        maxWidth: '90%'
    },
    archivo: {
        color: colors.azulPrimario,
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    comentario: {
        minWidth: '90%',
        flexDirection: 'column',
        borderWidth: 1,
        marginTop: 10,
    },
    //comentario
    ingresoComentario: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datosComentar:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        width: 230,
        marginTop: 15
    },
    botonComentar: {
        marginTop: 15,
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        width: 80,
        height: 41,
        justifyContent: 'center',
        alignItems: 'center'
    },

    verComentario: {
        width: 310,
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
    },
    verAnuncioFoto:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    info1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img2:{
        height: 30,
        width: 30,
        borderRadius: 10,
    },
    nombreUsuario: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
        color: colors.azulPrimario
    },
    textoAnuncio: {
        width: 270,
        flexWrap: "wrap",
        marginTop: 10
    },
    botonEliminar: {
        marginTop: 15,
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        borderRadius: 20,
        width: 70,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    textoCrearAula: {
        color: 'white',
    },
    titleComentario:{
        borderTopWidth: 2,
        minWidth: '90%',
        fontWeight: 'bold',
        marginTop: 10,
        paddingTop: 10
    } 
});