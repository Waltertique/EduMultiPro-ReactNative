import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import DesplegableProfesor from './DesplegableProfesor.js';
import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function PrincipalProfesor() {
    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableProfesor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroProfeso}>
                    <Text style={styles.textoProfesor}> Hola Profesor</Text>
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
    
    centroProfeso: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },

    textoProfesor:{
        color: 'red',
    }
})