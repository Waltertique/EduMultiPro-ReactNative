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

export default function NoticiaAlumno({ navigation }) {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.53:3000/api/edumultipro/NoticiasDatos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNoticias(data);
      } else {
        console.error("⚠️ Error al cargar noticias");
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
    }
  };

  return (
    <View style={styles.contenedor}>
      {/* ✅ Encabezado */}
      <Encabezado />

      {/* ✅ Menú desplegable lateral */}
      <DesplegableAlumno navigation={navigation} />

      {/* ✅ Contenido principal */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.centroAlumno}>
          <Text style={styles.titulo}>Noticias</Text>

          {noticias.length === 0 ? (
            <View style={styles.alerta}>
              <Text style={styles.alertaTexto}>No hay noticias disponibles.</Text>
            </View>
          ) : (
            noticias.map((noticia) => (
              <View key={noticia.ID} style={styles.noticiaCard}>
                {/* Imagen */}
                <View style={styles.imagenContainer}>
                  {noticia.Imagen1 ? (
                    <Image
                      source={{
                        uri: `http://192.168.1.53:3000/imagenes/${noticia.Imagen1}`,
                      }}
                      style={styles.noticiaImagen}
                      defaultSource={ErrorImg}
                      onError={() => console.log("⚠️ Error cargando imagen")}
                    />
                  ) : (
                    <Image source={ErrorImg} style={styles.noticiaImagen} />
                  )}
                </View>

                {/* Título y Encabezado */}
                <View style={styles.textoContainer}>
                  <Text style={styles.noticiaTitulo}>
                    {noticia.Titulo_Noticia}
                  </Text>
                  <Text style={styles.noticiaEncabezado}>
                    {noticia.Encabezado}
                  </Text>
                </View>

                {/* Botón Ver Más */}
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() =>
                    navigation.navigate("VerNoticiaAlumno", { id: noticia.ID })
                  }
                >
                  <Text style={styles.botonTexto}>Ver Más</Text>
                </TouchableOpacity>
              </View>
            ))
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
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 20,
  },
  alerta: {
    padding: 15,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  alertaTexto: {
    color: "#856404",
    fontSize: 14,
  },
  noticiaCard: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
  },
  imagenContainer: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  noticiaImagen: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  textoContainer: {
    marginBottom: 10,
  },
  noticiaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 5,
  },
  noticiaEncabezado: {
    fontSize: 14,
    color: "#666",
  },
  boton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
