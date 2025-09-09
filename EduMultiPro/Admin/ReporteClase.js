import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import Desplegable from '../Desplegable';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function ReporteClase() {

  return (
    <View style={styles.contenedor}>

        <Encabezado />

        <Desplegable />

        {/* 👉 Scroll vertical */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
      
        <View style={styles.centroUsuario}>

            <View style={styles.tituloUsuario}>
                <Text style={styles.titleUsuario}>Reportes</Text>

            </View>

            <View style={styles.contenedorTabla}>
                
                <View style={styles.container}>
                    
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

    contenedorTabla:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        marginVertical: 20,
    },
    container: {
        padding: 10,
        backgroundColor: colors.fondo,
    },

});