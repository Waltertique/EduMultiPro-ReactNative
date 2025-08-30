import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Para guardar token/usuario

import Encabezado from './Encabezado';
import Footer from './footer';
import colors from './colors'; 
import AdminStack from './Admin/AdminStack';
import PrincipalCoordinador from './Coordinador/PrincipalCoordinador';
import PrincipalProfesor from './Profesor/PrincipalProfesor';
import PrincipalAlumno from './Alumno/PrincipalAlumno';

import * as React from 'react';

const Stack = createNativeStackNavigator();

// 👉 Pantalla de Login
function LoginScreen({ navigation }) {
  const [correo, setCorreo] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.3:3000/api/edumultipro/login", {
        // 🔹 Si usas emulador Android -> 10.0.2.2
        // 🔹 Si pruebas en celular físico -> http://IP_DE_TU_PC:3000
        // 🔹 Si usas iOS simulator -> http://localhost:3000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
      });

      if (response.ok) {
        const data = await response.json();

        // Guardar token y usuario en AsyncStorage
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));

        const { rol } = data.usuario;

        // Navegar según el rol (igual que en tu web)
        switch (rol) {
          case "R004":
            navigation.replace("AdminStack");
            break;
          case "R003":
            navigation.replace("PrincipalCoordinador");
            break;
          case "R002":
            navigation.replace("PrincipalProfesor");
            break;
          case "R001":
            navigation.replace("PrincipalAlumno");
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

        {/* Admin Stack */}
        <Stack.Screen 
          name="AdminStack" 
          component={AdminStack} 
          options={{ headerShown: false }} 
        />

        {/* Otros roles */}
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
