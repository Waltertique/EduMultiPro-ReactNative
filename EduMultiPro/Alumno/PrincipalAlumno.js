import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableAlumno from './DesplegableAlumno.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function PrincipalAlumno() {
    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableAlumno />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroAlumno}>
                    <Text style={styles.textoAlumno}> Hola Alumno</Text>
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
    textoAlumno:{
        color: 'red',
    }
})