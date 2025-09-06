import { View, Text, Button, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker"; //sirve para hacer los select

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function VerUsuario({ navigation }) {

    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <Desplegable />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
            <View style={styles.centroUsuario}>
    
                <View style={styles.tituloUsuario}>
                    <Text style={styles.titleUsuario}>Informacion del Usuario</Text>
                    
                    <View style={styles.contenedorBoton}>
                        <TouchableOpacity style={styles.botonCrearUsuario} onPress={() => navigation.navigate('Usuario')}>
                            <FontAwesome name="user" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Salir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonCrearUsuario}>
                            <FontAwesome name="edit" size={16} color="#fff" />
                            <Text style={styles.textoCrearUsuario}> Modificar</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.contenedorInfo}>
                    
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> N.O Indentificacion:</Text>
                        <Text style={styles.textoInfo}> 1234567890</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Documento:</Text>
                        <Text style={styles.textoInfo}> Cedula</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Primer Nombre:</Text>
                        <Text style={styles.textoInfo}> Johan</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Segundo Nombre:</Text>
                        <Text style={styles.textoInfo}> Sneider</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Primer Apellido:</Text>
                        <Text style={styles.textoInfo}> Madrigal</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Segundo Apellido:</Text>
                        <Text style={styles.textoInfo}> Tique</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Correo1:</Text>
                        <Text style={styles.textoInfo}> juan01@gmail.com</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Correo2:</Text>
                        <Text style={styles.textoInfo}> juanperez012@gmail.com</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Contacto1:</Text>
                        <Text style={styles.textoInfo}> 1234567890</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Contacto2:</Text>
                        <Text style={styles.textoInfo}> 1234567890</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Fecha de Nacimiento:</Text>
                        <Text style={styles.textoInfo}> 12/23/3421</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Rol:</Text>
                        <Text style={styles.textoInfo}> Alumno</Text>
                    </View>
                    <View style={styles.contenedorInfo2}>
                        <Text style={styles.textoInfoTitle}> Foto:</Text>
                        <Image 
                          source={require('../assets/foto.jpg')} 
                          style={styles.fotoAlumno} 
                          resizeMode="contain"
                        />
                    </View>

                </View>

                <View style={styles.contenedorFormulario}>
                    <Text style={styles.titleUsuario}>Modificar Usuario</Text>
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
                    <TouchableOpacity style={styles.input}>
                        <Text style={{ color: "gray" }}>Subir archivo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botonModificar}>
                        <FontAwesome name="edit" size={16} color="#fff" />
                        <Text style={styles.textoCrearUsuario}> Modificar</Text>
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
        minWidth: '90%',
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.azulPrimario,
        paddingBottom: 10,
    },
    contenedorBoton: {
        flexDirection: 'row',
        marginTop: 15,
        minWidth: '60%',
        justifyContent: 'space-around',
    },
    botonCrearUsuario: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    botonModificar: {
        flexDirection: 'row',
        backgroundColor: '#007bbd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 15,
    },
    textoCrearUsuario: {
        color: 'white',
    },
    titleUsuario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bbd',
    },
    contenedorInfo: {
        minWidth: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginVertical: 20,
    },
    contenedorInfo2: {
        minWidth: '90%',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    textoInfoTitle:{
        fontWeight: 'bold',
        marginRight: 10,
    },
    fotoAlumno: {
        width: 120,
        height: 120,
        marginHorizontal: 'auto',
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
    }
    
});