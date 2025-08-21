import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from '../colors'; // 👈 archivo donde guardamos las variables

export default function DesplegableCoor() {
  const [abierto, setAbierto] = useState(false);

  const toggleMenu = () => {
    setAbierto(!abierto);
  };

  return (
    <View style={styles.contenedor}>
      {/* Botón principal */}
      <TouchableOpacity style={styles.boton} onPress={toggleMenu}>
        <Text style={styles.textoBoton}>Opciones </Text>
        <FontAwesome name={abierto ? "angle-up" : "angle-down"} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Opciones desplegables */}
      {abierto && (
        <View style={styles.menu}>

          <TouchableOpacity style={styles.opcion}>
            <FontAwesome5 name="layer-group" size={16} color="#fff" />
            <Text style={styles.textoOpcion}> Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcion}>
            <FontAwesome name="calendar" size={16} color="#fff" />
            <Text style={styles.textoOpcion}> Horarios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcion}>
            <FontAwesome name="newspaper-o" size={16} color="#fff" />
            <Text style={styles.textoOpcion}> Noticias</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcion}>
            <FontAwesome name="user" size={16} color="#fff" />
            <Text style={styles.textoOpcion}> Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.opcion}>
            <FontAwesome name="sign-out" size={16} color="#fff" />
            <Text style={styles.textoOpcion}> Salir</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
  },
  boton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.azulPrimario,
    borderWidth: 2,
    borderColor: colors.azulSecundario,
    paddingHorizontal: 15,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menu: {
    backgroundColor: colors.azulPrimario,
    borderWidth: 2,
    borderColor: colors.azulSecundario,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.azulSecundario,
  },
  textoOpcion: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 15,
  },
});