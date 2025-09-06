import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function CrearAula({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Crear Aula</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Aula')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>
            
            </View>

            <View style={styles.formularioModificar}>
                <TextInput style={styles.datosFormulario} placeholder='Nombre' ></TextInput>

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                    <Picker selectedValue="Materia" onValueChange={() => {}}>
                        <Picker.Item label="Español" value="op1" />
                        <Picker.Item label="Ingles" value="op2" />
                        <Picker.Item label="Sociales" value="op3" />
                    </Picker>
                </View>

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                    <Picker selectedValue="Curso" onValueChange={() => {}}>
                        <Picker.Item label="101" value="op1" />
                        <Picker.Item label="202" value="op2" />
                        <Picker.Item label="303" value="op3" />
                    </Picker>
                </View>

                <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                    <Picker selectedValue="Profesor" onValueChange={() => {}}>
                        <Picker.Item label="juan" value="op1" />
                        <Picker.Item label="pedro" value="op2" />
                        <Picker.Item label="miguel" value="op3" />
                    </Picker>
                </View>
                
                    <TouchableOpacity style={styles.botonCrearUsuario}>
                        <Text style={styles.textoCrearUsuario}> Guardar Aula</Text>
                    </TouchableOpacity>
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
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario
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
    formularioModificar:{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        minWidth: '90%',
        alignItems: 'center',
        marginBottom: 20,
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        marginTop: 10,
    }

});