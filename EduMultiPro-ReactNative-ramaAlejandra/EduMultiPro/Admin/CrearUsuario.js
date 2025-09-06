import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function CrearUsuario({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Crear Usuarios</Text>
                    
                    <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Usuario')}>
                        <FontAwesome name="user" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Salir</Text>
                    </TouchableOpacity>
    
                </View>

                <View style={styles.contenedorFormulario}>
                    <Text style={styles.titleUsuario}>Datos del Usuario</Text>
                    <TextInput style={styles.datosFormulario} placeholder='N.O Identificacion' keyboardType='numeric'></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Primer Nombre' ></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Segundo Nombre' ></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Primer Apellido' ></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Segundo Apellido' ></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Correo' keyboardType="email-address" autoCapitalize="none"></TextInput>
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10}}>
                        <Picker selectedValue="Rol" onValueChange={() => {}}>
                            <Picker.Item label="Admin" value="op1" />
                            <Picker.Item label="Profesor" value="op2" />
                            <Picker.Item label="Alumno" value="op3" />
                        </Picker>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: colors.azulPrimario, borderRadius: 20, minWidth: '80%', marginTop: 10, marginBottom: 20}}>
                        <Picker selectedValue="Tipo Documento" onValueChange={() => {}}>
                            <Picker.Item label="Cedula" value="op1" />
                            <Picker.Item label="Targeta de identidad" value="op2" />
                            <Picker.Item label="Cedula de Extrangeria" value="op3" />
                        </Picker>
                    </View>

                    <Text style={styles.titleUsuario}>Otros Datos</Text>

                    <TextInput style={styles.datosFormulario} placeholder='Correo Alternativo' keyboardType="email-address" autoCapitalize="none"></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Contacto Principal' keyboardType='numeric'></TextInput>
                    <TextInput style={styles.datosFormulario} placeholder='Contacto Secundario' keyboardType='numeric'></TextInput>
                    <TouchableOpacity style={styles.input}>
                        <Text style={{ color: "gray" }}>Seleccionar fecha</Text>
                    </TouchableOpacity>

                    {/* Simulación archivo */}
                    <TouchableOpacity style={styles.input2}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonCrearUsuario}>
                        <Text style={styles.textoCrearUsuario}> Guardar Usuario</Text>
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
        paddingBottom: 10,
        borderColor: colors.azulPrimario,
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
    contenedorFormulario:{
        backgroundColor: 'white',
        minWidth: '90%',
        padding: 20,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    datosFormulario:{
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingVertical: 10,
        paddingLeft: 20,
        minWidth: '80%',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '80%',
        paddingVertical: 10
    },
    input2: {
        borderWidth: 1,
        borderColor: colors.azulPrimario,
        borderRadius: 20,
        paddingLeft: 20,
        marginTop: 10,
        minWidth: '80%',
        paddingVertical: 10,
        marginBottom: 15,
    }
});