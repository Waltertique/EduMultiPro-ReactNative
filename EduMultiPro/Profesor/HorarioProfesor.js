import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

export default function HorarioProfesor() {
  const [horario, setHorario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerHorario = async () => {
      try {
        const usuarioString = await AsyncStorage.getItem('usuario');
        if (!usuarioString) {
          setError("No hay usuario autenticado.");
          return;
        }

        const usuario = JSON.parse(usuarioString);
        if (!usuario?.id) {
          setError("No hay usuario autenticado.");
          return;
        }

        const res = await fetch(`http://localhost:3000/api/edumultipro/HorarioUsuario/${usuario.id}`);
        const data = await res.json();

        if (res.ok) {
          setHorario(data);
        } else {
          setError(data.mensaje || "No hay horario disponible.");
        }
      } catch (err) {
        console.error("Error al obtener horario:", err);
        setError("Error al obtener horario del servidor.");
      }
    };

    obtenerHorario();
  }, []);

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.horarioProfesor}>
          {error && (
            <View style={styles.noHorario}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {horario && (
            <>
              <View style={styles.tituloContainer}>
                <Text style={styles.titulo}>{horario.Titulo_Horario}</Text>
              </View>

              <View style={styles.imagenContainer}>
                {horario.Imagen_Horario ? (
                  <Image
                    style={styles.imagenHorario}
                    source={{ uri: `http://localhost:3000/imagenes/${horario.Imagen_Horario}` }}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.sinImagenText}>
                    No se ha subido una imagen para este horario.
                  </Text>
                )}
              </View>

              <View style={styles.descripcionContainer}>
                <Text style={styles.descripcionTitulo}>Descripción:</Text>
                <Text style={styles.descripcionTexto}>
                  {horario.Descripcion_Horario}
                </Text>
              </View>
            </>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  horarioProfesor: {
    padding: 16,
  },
  noHorario: {
    padding: 20,
    backgroundColor: colors.grisClaro,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.grisOscuro,
    textAlign: "center",
  },
  tituloContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
    textAlign: "center",
  },
  imagenContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.blanco2,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenHorario: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  sinImagenText: {
    fontSize: 16,
    color: colors.grisOscuro,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  descripcionContainer: {
    backgroundColor: colors.blanco2,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descripcionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 8,
  },
  descripcionTexto: {
    fontSize: 16,
    color: colors.grisOscuro,
    lineHeight: 22,
  },
});