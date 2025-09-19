import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí


export default function NoticiaProfesor() {
  const [noticias, setNoticias] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        const res = await apiFetch('/NoticiasDatos');
        const data = await res.json();
        setNoticias(data);
      } catch (error) {
        console.error("Error al obtener noticias:", error);
        Alert.alert("Error", "No se pudieron cargar las noticias");
      }
    };

    obtenerNoticias();
  }, []);

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.contenedorNoticiaProfesor}>
          <Text style={styles.tituloPrincipal}>Noticias</Text>

          {noticias.length > 0 ? (
            noticias.map((noticia) => (
              <View key={noticia.ID} style={styles.noticiaItem}>
                <View style={styles.noticiaContent}>
                  {/* Imagen */}
                  <Image
                    style={styles.noticiaImagen}
                    source={
                      noticia.Imagen1
                        ? { uri: `${STATIC_URL}/imagenes/${noticia.Imagen1}` }
                        : require("../assets/error.png")
                    }
                    onError={(e) => {
                      console.log("Error loading image");
                    }}
                  />

                  {/* Título y encabezado */}
                  <View style={styles.noticiaInfo}>
                    <Text style={styles.noticiaTitulo}>{noticia.Titulo_Noticia}</Text>
                    <Text style={styles.noticiaEncabezado} numberOfLines={3}>
                      {noticia.Encabezado}
                    </Text>
                  </View>

                  {/* Botón Ver Más */}
                  <TouchableOpacity
                    style={styles.verMasButton}
                    onPress={() =>
                      navigation.navigate("VerNoticiaProfesor", {
                        id: noticia.ID,
                      })
                    }
                  >
                    <Text style={styles.verMasText}>Ver Más</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noNoticiasContainer}>
              <Text style={styles.noNoticiasText}>No hay noticias disponibles.</Text>
            </View>
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
  },
  contenedorNoticiaProfesor: {
    padding: 16,
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
    textAlign: "center",
    marginBottom: 20,
  },
  noticiaItem: {
    backgroundColor: colors.blanco2,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noticiaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  noticiaImagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  noticiaInfo: {
    flex: 1,
    marginRight: 12,
  },
  noticiaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 4,
  },
  noticiaEncabezado: {
    fontSize: 14,
    color: colors.grisOscuro,
    lineHeight: 18,
  },
  verMasButton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  verMasText: {
    color: colors.blanco2,
    fontWeight: "bold",
    fontSize: 14,
  },
  noNoticiasContainer: {
    padding: 20,
    backgroundColor: colors.grisClaro,
    borderRadius: 8,
    alignItems: "center",
  },
  noNoticiasText: {
    fontSize: 16,
    color: colors.grisOscuro,
    fontStyle: "italic",
  },
});