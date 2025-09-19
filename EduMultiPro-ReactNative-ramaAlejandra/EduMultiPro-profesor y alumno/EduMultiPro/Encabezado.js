import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from './colors'; // 👈 importamos el archivo con tus colores

export default function Encabezado() {
  return (
    <LinearGradient
      colors={[colors.azulPrimario, colors.azulSecundario]} // 👈 usando variables
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.navegador}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.img1} 
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <View style={styles.titleContainer}>
        <Text style={styles.primerTitulo}>EduMultiPro</Text>
      </View>

      {/* Subtítulo */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitulo}>Tu Aliado En El Camino Educativo</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  navegador: {
    flexDirection: 'column',
    alignItems: 'center',
    height: 'auto',
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: colors.azulSecundario, // 👈 usando colors
  },

  logoContainer: {
    alignItems: 'center',
    width: 100,
    height: 'auto',
    marginTop: 30,
  },

  img1: {
    width: 70,
    height: 70,
  },

  titleContainer: {
    justifyContent: 'center',
    height: 'auto',
  },

  primerTitulo: {
    fontSize: 35,
    color: colors.blanco2, // 👈 color blanco de tu paleta
    fontWeight: 'bold',
  },

  subtitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitulo: {
    fontSize: 18,
    color: 'aqua', // 👈 este lo puedes cambiar si lo quieres en tu paleta
  },
});