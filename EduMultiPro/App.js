import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import Encabezado from './Encabezado';
import Footer from './footer';
import colors from './colors'; 
import AdminStack from './Admin/AdminStack';
import CoordinadorStack from './Coordinador/CoordinadorStack';
import RutasProfesor from './Profesor/RutasProfesor';   // 👈 Usamos el stack
import RutasAlumno from './Alumno/RutasAlumno';         // 👈 Usamos el stack

import { apiFetch } from "./api"; // helper axios/fetch

const Stack = createNativeStackNavigator();

// 👉 Pantalla de Login
function LoginScreen({ navigation }) {
  const [correo, setCorreo] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await apiFetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
      });

      if (response.ok) {
        const data = await response.json();

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));

        const { rol } = data.usuario;

        // Navegar según rol
        switch (rol) {
          case "R004":
            navigation.replace("AdminStack");
            break;
          case "R003":
            navigation.replace("CoordinadorStack");
            break;
          case "R002":
            navigation.replace("RutasProfesor");   // 👈 Ahora rutas del profesor
            break;
          case "R001":
            navigation.replace("RutasAlumno");     // 👈 Ahora rutas del alumno
            break;
          default:
            Alert.alert("Error", "Rol no reconocido");
        }
      } else {
        const err = await response.json();
        Alert.alert("Error", err.mensaje);
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
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

// 👉 App principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* Admin */}
        <Stack.Screen 
          name="AdminStack" 
          component={AdminStack} 
          options={{ headerShown: false }} 
        />

        {/* Coordinador */}
        <Stack.Screen 
          name="CoordinadorStack" 
          component={CoordinadorStack} 
          options={{ headerShown: false }} 
        />

        {/* Profesor */}
        <Stack.Screen 
          name="RutasProfesor" 
          component={RutasProfesor} 
          options={{ headerShown: false }} 
        />

        {/* Alumno */}
        <Stack.Screen 
          name="RutasAlumno" 
          component={RutasAlumno} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.fondo,
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
