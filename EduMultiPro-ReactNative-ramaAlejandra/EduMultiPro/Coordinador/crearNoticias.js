import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from './DesplegableCoor';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function CrearNoticia({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Crear Noticia</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('noticias')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contenedorFormulario}>
                    <TextInput style={styles.datosFormulario} placeholder='Titulo de la Noticia' ></TextInput>
                    <TextInput style={styles.datosDescipcion} placeholder='Encabezado' multiline={true} numberOfLines={5}></TextInput>
                    <TextInput style={styles.datosDescipcion} placeholder='Descripcion1' multiline={true} numberOfLines={5}></TextInput>
                    <TextInput style={styles.datosDescipcion} placeholder='Descripcion2 (opcional)' multiline={true} numberOfLines={5}></TextInput>
                    <TextInput style={styles.datosDescipcion} placeholder='Descripcion3 (opcional)' multiline={true} numberOfLines={5}></TextInput>
                    <TouchableOpacity style={styles.input}>
                        <Text style={{ color: "gray" }}>Seleccionar fecha</Text>
                    </TouchableOpacity>
                    <Text> Imagen 1</Text>
                    <TouchableOpacity style={styles.input2}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>
                    <Text> Imagen 2</Text>
                    <TouchableOpacity style={styles.input2}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>
                    <Text> Imagen 3</Text>
                    <TouchableOpacity style={styles.input2}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '85%', marginTop: 10, marginBottom: 20}}>
                        <Picker selectedValue="Tipo de Noticia" onValueChange={() => {}}>
                            <Picker.Item label="principal" value="op1" />
                            <Picker.Item label="secundaria" value="op2" />
                            <Picker.Item label="terciaria" value="op3" />
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.botonCrearUsuario}>
                        <Text style={styles.textoCrearUsuario}> Guardar Noticia</Text>
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
    },
    textoCrearUsuario: {
        color: 'white',
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },

    contenedorFormulario: {
        marginTop: 20,
        minWidth: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
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
    },
    input: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
        marginBottom: 20,
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '85%',
        paddingVertical: 10,
    }
});