import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Encabezado from './Encabezado';
import Footer from './footer';
import colors from './colors'; 
import Usuario from './Admin/Usuario'; // pantalla destino
import PrincipalCoordinador from './Coordinador/PrincipalCoordinador';
import PrincipalProfesor from './Profesor/PrincipalProfesor';
import PrincipalAlumno from './Alumno/PrincipalAlumno';

import * as React from 'react';

const Stack = createNativeStackNavigator();

// 👉 Pantalla de Login
function LoginScreen({ navigation }) {
  const [correo, setCorreo] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');

  const handleLogin = () => {
    if (contrasena === '12345') {
      switch (correo) {
        case 'admin@gmail.com':
          navigation.navigate('Usuario');
          break;
        case 'coordinador@gmail.com':
          navigation.navigate('PrincipalCoordinador');
          break;
        case 'profesor@gmail.com':
          navigation.navigate('PrincipalProfesor');
          break;
        case 'alumno@gmail.com':
          navigation.navigate('PrincipalAlumno');
          break;
        default:
          Alert.alert('Error', 'Usuario o contraseña incorrecto');
      }
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrecto');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      
      <View style={styles.centro}>
        <View style={styles.caja}>
          <View style={styles.cajalogin}>
            <Text style={styles.primerTitulo}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input1}
              placeholder="Correo"
              keyboardType="email-address"
              value={correo}
              onChangeText={setCorreo}
            />

            <TextInput
              style={styles.input1}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={contrasena}
              onChangeText={setContrasena}
            />

            <TouchableOpacity 
              style={styles.boton}
              onPress={handleLogin}
            >
              <Text style={styles.botonTexto}>Ingresar</Text>
            </TouchableOpacity>

            <Text style={styles.enlaceContraseña}>¿Olvidaste tu Contraseña?</Text>
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
}

// 👉 App envuelve el Stack de navegación
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Usuario" 
          component={Usuario} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PrincipalCoordinador" 
          component={PrincipalCoordinador} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PrincipalProfesor" 
          component={PrincipalProfesor} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PrincipalAlumno" 
          component={PrincipalAlumno} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
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

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 35,
  },

  caja:{
    backgroundColor: 'white',
    width: '85%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cajalogin: {
    backgroundColor: '#c4e2f7',
    width: '85%',
    height: '85%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primerTitulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#007bbd',
    marginBottom: 10,
  },

  input1: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#007bbd',
    backgroundColor: 'white',
    width: '80%',
    marginTop: 15,
    paddingHorizontal: 15,
  },

  boton: {
    backgroundColor: '#007bbd',
    width: '80%',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  enlaceContraseña: {
    color: '#007bbd',
    marginTop: 10,
  }
});
