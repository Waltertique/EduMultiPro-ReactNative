// Alumno/HorarioAlumno.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import colors from "../colors";

export default function HorarioAlumno({ navigation }) {
  const [horario, setHorario] = useState(null);

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const usuarioJSON = await AsyncStorage.getItem("usuario");
        if (usuarioJSON) {
          const usuario = JSON.parse(usuarioJSON);

          const res = await fetch(
            `http://192.168.1.53:3000/api/edumultipro/HorarioUsuario/${usuario.id}`
          );
          const data = await res.json();

          if (!data.mensaje) {
            setHorario(data);
          } else {
            setHorario(null);
          }
        }
      } catch (err) {
        console.error("❌ Error al cargar el horario:", err);
      }
    };

    fetchHorario();
  }, []);

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableAlumno navigation={navigation} />

      <ScrollView contentContainerStyle={styles.centroAlumno}>
        <View style={styles.horarioAlumno}>
          {horario ? (
            <>
              <Text style={styles.titulo}>{horario.Titulo_Horario}</Text>

              {horario.Imagen_Horario ? (
                <Image
                  source={{
                    uri: `http://192.168.1.53:3000/imagenes/${horario.Imagen_Horario}`,
                  }}
                  style={styles.imagen}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.noImagen}>🖼 Sin imagen disponible</Text>
              )}

              <Text style={styles.subtitulo}>Descripción:</Text>
              <Text style={styles.descripcion}>
                {horario.Descripcion_Horario}
              </Text>
            </>
          ) : (
            <View style={styles.noHorario}>
              <Text style={styles.noHorarioTexto}>
                No hay horarios creados para ti aún.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  centroAlumno: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  horarioAlumno: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 15,
  },
  imagen: {
    width: "90%",
    height: 250,
    marginBottom: 15,
    borderRadius: 12,
  },
  noImagen: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: colors.azulSecundario,
  },
  descripcion: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  noHorario: {
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffe0e0",
    borderRadius: 10,
  },
  noHorarioTexto: {
    fontSize: 16,
    color: "#b00020",
    fontWeight: "bold",
    textAlign: "center",
  },
});
