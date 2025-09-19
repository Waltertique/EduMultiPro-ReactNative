import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";

import colors from "../colors";

import { apiFetch } from "../api";
import { STATIC_URL } from "../api"; // 👈 importa aquí

const { width } = Dimensions.get("window");

const localImages = [
  require("../assets/f1.png"),
  require("../assets/f2.png"),
  require("../assets/f3.png"),
];


export default function PrincipalProfesor() {
  const [noticias, setNoticias] = useState({
    noticia1: null,
    noticia2: null,
    noticia3: null,
  });

  const navigation = useNavigation();

  // Carrusel autoplay
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    apiFetch("NoticiasPrincipales")
      .then((res) => res.json())
      .then((data) => setNoticias(data))
      .catch((error) => console.error("Error al cargar noticias:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % localImages.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.contenedor}>
      <Encabezado />

      <DesplegableProfesor />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Carrusel con autoplay */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={flatListRef}
            data={localImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
            onScrollToIndexFailed={() => {}}
          />

          {/* Indicadores del carrusel */}
          <View style={styles.indicadores}>
            {localImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicador,
                  index === currentIndex && styles.indicadorActivo,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Noticias */}
        <View style={styles.noticiasProfesor}>
          <Text style={styles.titulo}>Noticias</Text>
          <View style={styles.filaNoticias}>
            {[noticias.noticia1, noticias.noticia2, noticias.noticia3].map(
              (noticia, index) => (
                <View key={index} style={styles.cardNoticia}>
                  <TouchableOpacity
                    disabled={!noticia}
                    onPress={() =>
                      navigation.navigate("VerNoticiaProfesor", {
                        id: noticia?.ID,
                      })
                    }
                  >
                    <Image
                      source={
                        noticia && noticia.Imagen1
                          ? {uri: `${STATIC_URL}/imagenes/${noticia.Imagen1}` }
                          : require("../assets/error.png")
                      }
                      style={styles.imagenNoticia}
                    />
                  </TouchableOpacity>

                  <View style={styles.encabezado}>
                    {noticia ? (
                      <>
                        <Text style={styles.tituloNoticia}>
                          {noticia.Titulo_Noticia}
                        </Text>
                        <Text
                          style={styles.encabezadoNoticia}
                          numberOfLines={2}
                        >
                          {noticia.Encabezado}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.noNoticia}>No hay Noticia</Text>
                    )}
                  </View>
                </View>
              )
            )}
          </View>
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
  // Carrusel
  carouselWrapper: {
    position: "relative",
    marginBottom: 20,
    height: 220,
  },
  carouselImage: {
    width: width,
    height: 220,
    resizeMode: "cover",
  },
  indicadores: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grisClaro,
    marginHorizontal: 4,
  },
  indicadorActivo: {
    backgroundColor: colors.azulPrimario,
    width: 10,
    height: 10,
  },
  // Noticias
  noticiasProfesor: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 15,
    textAlign: "center",
  },
  filaNoticias: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardNoticia: {
    width: "100%",
    backgroundColor: colors.blanco2,
    borderRadius: 12,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imagenNoticia: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  encabezado: {
    padding: 12,
  },
  tituloNoticia: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 4,
  },
  encabezadoNoticia: {
    fontSize: 14,
    color: colors.grisOscuro,
  },
  noNoticia: {
    fontSize: 14,
    color: colors.grisOscuro,
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
});