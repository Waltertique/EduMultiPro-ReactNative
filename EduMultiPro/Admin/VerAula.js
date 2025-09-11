import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function VerAula({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>

                {/* Navegardor de fucniones del Aula */}
                <View style={styles.tituloUsuario}>
                    
                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('VerAula')}>
                        <Text style={styles.textoControlAula}> Inicio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Trabajo')}>
                        <Text style={styles.textoControlAula}> Trabajos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Nota')}>
                        <Text style={styles.textoControlAula}> Notas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonControlAula} onPress={() => navigation.navigate('Persona')}>
                        <Text style={styles.textoControlAula}> Personas</Text>
                    </TouchableOpacity>
                    
                </View>

                {/* Informacion Principal del Aula */}
                <LinearGradient
                      colors={[colors.azulPrimario, colors.azulSecundario]} // 👈 usando variables
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.InformacionAula}
                    >
                    <Text style={styles.titleAula}>Nombre del aula correspondiente</Text>
                    <Text style={styles.titleAulaProfe}>Profesor: Nombre del profesor</Text>
                </LinearGradient>

                <View style={styles.tituloCrearAnuncio}>
                    <Text style={styles.novedad}>Novedades</Text>
                    <TouchableOpacity style={styles.botonCrearAula}>
                        <Text style={styles.textoCrearAula}> Crear Anuncio</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulario Para crear el Anuncio */}
                <View style={styles.crearAnuncio}>
                    <Text style={styles.titleAnuncio}>Crear Anuncio</Text>
                    <TextInput style={styles.datosFormulario} placeholder='Título del Anuncio'/>
                    <TextInput style={styles.datosDescipcion} placeholder='Descripcion del anuncio' multiline numberOfLines={4}/>
                    <TouchableOpacity style={styles.input2}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>

                    <View style={styles.BotonesCrear}>
                        <TouchableOpacity style={styles.botonCrearAula}>
                            <Text style={styles.textoCrearAula}> Publicar Anuncio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonCrearAula}>
                            <Text style={styles.textoCrearAula}> Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Conteneder del Anuncio y sus funciones */}
                <View style={styles.verAnuncio}>

                    {/* Botones para eliminar y modificar el anuncio */}
                    <View style={styles.ControlAnuncio}>
                        <TouchableOpacity style={styles.botonAula}>
                            <Text style={styles.textoBotonAula}> Modificar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.textoBotonAula}> Eliminar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Informacion del Anuncio */}
                    <View style={styles.verAnuncioFoto}>
                        <View style={styles.info1}>
                            <Image source={require('../assets/foto.jpg')} style={styles.img1} resizeMode="contain"/>
                            <Text style={styles.nombreUsuario}>Nombre Usuario</Text>
                        </View>
                        <Text style={styles.fechaAnuncio}>22/23/3423</Text>
                    </View>

                    <Text style={styles.textoTitulo}>Titulo Anuncio</Text>
                    <Text style={styles.textoDescripcion}>Apple ha presentado oficialmente su nuevo iPhone con capacidades avanzadas 
                        de inteligencia artificial, en un evento que ha generado gran expectativa en el mundo tecnológico. 
                        </Text>
                    <Text style={styles.textoArchivo}>Ver Archivo</Text>

                    {/* Formulario Para crear un comentario */}
                    <View style={styles.ingresoComentario}>
                        <TextInput style={styles.datosComentar} placeholder='Comentar'/>
                        <TouchableOpacity style={styles.botonComentar}>
                            <Text style={styles.textoCrearAula}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Formulario Para modificar el Anuncio */}
                    <View style={styles.ModificarAnuncio}>
                        <Text style={styles.titleAnuncio}>Modificar Anuncio</Text>
                        <TextInput style={styles.datosFormulario} placeholder='Título del Anuncio'/>
                        <TextInput style={styles.datosDescipcionModificar} placeholder='Descripcion del anuncio' multiline numberOfLines={4}/>
                        <TouchableOpacity style={styles.input2Modificar}>
                            <Text style={{ color: "gray" }}>Subir archivo</Text>
                        </TouchableOpacity>

                        <View style={styles.BotonesCrear}>
                            <TouchableOpacity style={styles.botonCrearAula}>
                                <Text style={styles.textoCrearAula}> Modificar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botonCrearAula}>
                                <Text style={styles.textoCrearAula}> Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Informacion del Comentario */}
                    <View style={styles.verComentario}>
                        <View style={styles.verAnuncioFoto}>
                            <View style={styles.info1}>
                                <Image source={require('../assets/foto.jpg')} style={styles.img1} resizeMode="contain"/>
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
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 5,
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
    InformacionAula: {
        minWidth: '90%',
        height: 'auto',
        padding: 20,
        borderRadius: 15,
        marginTop: 20
    },
    titleAula: {
        width: 285,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flexWrap: "wrap",
        paddingBottom: 0,
    },
    titleAulaProfe: {
        width: 285,
        fontSize: 14,
        color: 'white',
        flexWrap: "wrap",
        marginTop: 10,
    },
    tituloCrearAnuncio: {
        minWidth: '90%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginTop: 10
    },
    botonCrearAula: {
        flexDirection: 'row',
        backgroundColor: colors.azulSecundario,
        borderColor: colors.azulPrimario,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    textoCrearAula: {
        color: 'white',
    },
    novedad: {
        fontWeight: 'bold',
        fontSize: 18
    },
    crearAnuncio:{
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10,
        alignItems: 'center'
    },
    verAnuncio: {
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
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
        paddingLeft: 20,
    },
    titleAnuncio: {
        fontSize: 20,
        marginBottom: 10
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
        marginBottom: 15,
    },
    BotonesCrear: {
        minWidth: '85%',
        flexDirection: 'row',
        justifyContent: 'space-around'
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
    img1:{
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
    textoTitulo: {
        width: 275,
        flexWrap: "wrap",
        marginTop: 15,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    textoDescripcion: {
        width: 275,
        flexWrap: "wrap",
    },
    textoArchivo: {
        flexWrap: "wrap",
        marginTop: 10,
        color: colors.azulPrimario,
        textDecorationLine: 'underline'
    },
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
        width: 200,
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

    //Modificar Anuncio

    ModificarAnuncio:{
        minWidth: '90%',
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        alignItems: 'center'
    },
    datosDescipcionModificar: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 230,
        height: 120,
        marginTop: 10,
        paddingLeft: 20,
    },
    input2Modificar: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        width: 230,
        paddingVertical: 10,
        marginBottom: 15,
    },
    verComentario: {
        width: 286,
        borderWidth: 1,
        padding: 20,
        borderRadius: 15,
        marginTop: 10
    },
    textoAnuncio: {
        width: 250,
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
    ControlAnuncio: {
        minWidth: '85%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    botonAula: {
        marginRight: 15,
        marginBottom: 8
    },
    textoBotonAula:{
        textDecorationLine: 'underline'
    }
});