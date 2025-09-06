import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as React from 'react';
import { DataTable } from 'react-native-paper';

import Encabezado from '../Encabezado';
import Footer from '../footer';
import colors from '../colors'; // 👈 archivo donde guardamos las variables
import DesplegableCoor from './DesplegableCoor.js';


export default function PrincipalCoordinador() {
    return (
        <View style={styles.contenedor}>
    
            <Encabezado />
    
            <DesplegableCoor />
    
            {/* 👉 Scroll vertical */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
          
                <View style={styles.centroCoordinador}>
                    <Text style={styles.textoCoordinador}> Hola Coordinador</Text>
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
    
    centroCoordinador: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    textoCoordinador:{
        color: 'red',
    }
})