import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import colors from "../colors";

const ErrorImg = require("../assets/error.png");

export default function VerNoticiaAlumno({ route, navigation }) {
  const { id } = route.params; // 👈 recibimos el ID desde la navegación
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(
          `http://192.168.1.53:3000/api/edumultipro/Noticias/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setNoticia(data);
      } catch (error) {
        console.error("❌ Error al cargar la noticia:", error);
      }
    };

    fetchNoticia();
  }, [id]);

  return (
    <View style={styles.contenedor}>
      {/* ✅ Encabezado */}
      <Encabezado />

      {/* ✅ Menú desplegable lateral */}
      <DesplegableAlumno navigation={navigation} />

      {/* ✅ Contenido principal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.centroAlumno}>
          {/* 🔙 Botón de volver */}
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.navigate("NoticiaAlumno")}
          >
            <Text style={styles.botonVolverTexto}>⬅ Volver</Text>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.titulo}>{noticia?.Titulo_Noticia}</Text>

          {/* Descripción 1 */}
          {noticia?.Descripcion1 && (
            <Text style={styles.texto}>{noticia.Descripcion1}</Text>
          )}

          {/* Imagen 2 */}
          {noticia?.Imagen2 && (
            <Image
              source={{
                uri: `http://192.168.1.53:3000/imagenes/${noticia.Imagen2}`,
              }}
              style={styles.imagen}
              defaultSource={ErrorImg}
              onError={() => console.log("⚠️ Error cargando imagen 2")}
            />
          )}

          {/* Descripción 2 */}
          {noticia?.Descripcion2 && (
            <Text style={styles.texto}>{noticia.Descripcion2}</Text>
          )}

          {/* Imagen 3 */}
          {noticia?.Imagen3 && (
            <Image
              source={{
                uri: `http://192.168.1.53:3000/imagenes/${noticia.Imagen3}`,
              }}
              style={styles.imagen}
              defaultSource={ErrorImg}
              onError={() => console.log("⚠️ Error cargando imagen 3")}
            />
          )}

          {/* Descripción 3 */}
          {noticia?.Descripcion3 && (
            <Text style={styles.texto}>{noticia.Descripcion3}</Text>
          )}

          {/* Fecha */}
          {noticia?.Fecha_Notica && (
            <Text style={styles.fecha}>
              <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
              {new Date(noticia.Fecha_Notica).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* ✅ Footer */}
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
  centroAlumno: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  botonVolver: {
    alignSelf: "flex-start",
    backgroundColor: colors.azulPrimario,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  botonVolverTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 15,
    textAlign: "center",
  },
  texto: {
    fontSize: 16,
    color: "#444",
    marginBottom: 15,
    textAlign: "justify",
  },
  imagen: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  fecha: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    alignSelf: "flex-start",
  },
});
