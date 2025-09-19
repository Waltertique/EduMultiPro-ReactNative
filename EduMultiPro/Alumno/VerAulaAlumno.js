import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import NavAulaAlumno from "./NavAulaAlumno";
import colors from "../colors";

export default function VerAulaAlumno() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // id del aula

  const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
  const usuarioId = usuario?.id;
  const rol = usuario?.rol;

  const [aula, setAula] = useState(null);
  const [anuncios, setAnuncios] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [mostrarFormularioAnuncio, setMostrarFormularioAnuncio] = useState(false);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: "", descripcion: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAula = await fetch(`http://localhost:3000/api/edumultipro/Aulas/${id}`);
        setAula(await resAula.json());

        const resAnuncios = await fetch(`http://localhost:3000/api/edumultipro/Anuncios/Aula/${id}`);
        const anunciosData = await resAnuncios.json();
        setAnuncios(anunciosData);

        // comentarios
        const comentariosPorAnuncio = {};
        for (const anuncio of anunciosData) {
          const resC = await fetch(
            `http://localhost:3000/api/edumultipro/Comentarios/Anuncio/${anuncio.ID}`
          );
          comentariosPorAnuncio[anuncio.ID] = await resC.json();
        }
        setComentarios(comentariosPorAnuncio);
      } catch (err) {
        console.error("Error cargando aula:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleComentarioAnuncio = async (descripcion, anuncioID) => {
    if (!descripcion.trim()) return;

    const fecha = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch("http://localhost:3000/api/edumultipro/Comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion,
          anuncio_id: anuncioID,
          usuario_id: usuarioId,
          fecha,
        }),
      });

      const data = await res.json();
      Alert.alert("Mensaje", data.mensaje);

      const resC = await fetch(
        `http://localhost:3000/api/edumultipro/Comentarios/Anuncio/${anuncioID}`
      );
      const nuevosComentarios = await resC.json();
      setComentarios((prev) => ({ ...prev, [anuncioID]: nuevosComentarios }));
    } catch (err) {
      console.error("Error guardando comentario:", err);
    }
  };

  if (!aula) {
    return (
      <View style={styles.loading}>
        <Text>Cargando aula...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Encabezado />

      {/* menú superior del aula */}
      <NavAulaAlumno navigation={navigation} id={id} />

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {/* Banner Aula */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{aula.Aula_Nombre}</Text>
          <Text style={styles.bannerSubtitle}>Profesor: {aula.Profesor}</Text>
        </View>

        {/* Sección Novedades */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Novedades</Text>
          {rol === "R002" && (
            <TouchableOpacity
              style={styles.crearButton}
              onPress={() => setMostrarFormularioAnuncio(!mostrarFormularioAnuncio)}
            >
              <Text style={styles.crearButtonText}>+ Crear Anuncio</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Formulario nuevo anuncio */}
        {mostrarFormularioAnuncio && (
          <View style={styles.formulario}>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={nuevoAnuncio.titulo}
              onChangeText={(text) => setNuevoAnuncio({ ...nuevoAnuncio, titulo: text })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descripción"
              multiline
              value={nuevoAnuncio.descripcion}
              onChangeText={(text) => setNuevoAnuncio({ ...nuevoAnuncio, descripcion: text })}
            />
            <TouchableOpacity style={styles.crearButton}>
              <Text style={styles.crearButtonText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de anuncios */}
        {anuncios.map((anuncio) => (
          <View key={anuncio.ID} style={styles.anuncio}>
            <View style={styles.anuncioHeader}>
              <Image
                source={{
                  uri: `http://localhost:3000/imagenes/${anuncio.RutaFoto || "usuario.png"}`,
                }}
                style={styles.avatar}
              />
              <Text style={styles.autor}>{anuncio.Profesor}</Text>
              <Text style={styles.fecha}>
                {new Date(anuncio.Fecha_Anuncio).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.tituloAnuncio}>{anuncio.Titulo_Anuncio}</Text>
            <Text style={styles.descripcionAnuncio}>{anuncio.Descripcion_Anuncio}</Text>

            {/* Archivos adjuntos */}
            {anuncio.Enlace_Anuncio?.split(";").map((link, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => Alert.alert("Archivo", `Abrir archivo ${i + 1}`)}
              >
                <Text style={styles.archivo}>📎 Ver archivo {i + 1}</Text>
              </TouchableOpacity>
            ))}

            {/* Comentarios */}
            <View style={styles.comentarios}>
              <FlatList
                data={comentarios[anuncio.ID] || []}
                keyExtractor={(c) => c.ID.toString()}
                renderItem={({ item }) => (
                  <View style={styles.comentario}>
                    <Image
                      source={{
                        uri: `http://localhost:3000/imagenes/${item.RutaFoto || "usuario.png"}`,
                      }}
                      style={styles.comentarioAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.comentarioAutor}>{item.Nombre_Usuario}</Text>
                      <Text>{item.Descripcion}</Text>
                    </View>
                  </View>
                )}
              />
              <TextInput
                style={styles.input}
                placeholder="Escribe un comentario"
                onSubmitEditing={(e) =>
                  handleComentarioAnuncio(e.nativeEvent.text, anuncio.ID)
                }
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { marginBottom: 20, alignItems: "center" },
  bannerTitle: { fontSize: 22, fontWeight: "bold", color: colors.azulPrimario },
  bannerSubtitle: { fontSize: 16, color: colors.grisOscuro },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: colors.azul },
  crearButton: {
    backgroundColor: colors.azulPrimario,
    padding: 8,
    borderRadius: 5,
  },
  crearButtonText: { color: colors.blanco2, fontWeight: "bold" },
  formulario: {
    backgroundColor: colors.blanco2,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grisClaro,
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.blanco2,
  },
  anuncio: {
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    elevation: 3,
  },
  anuncioHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  avatar: { width: 35, height: 35, borderRadius: 20, marginRight: 8 },
  autor: { fontWeight: "bold", color: colors.azul, flex: 1 },
  fecha: { fontSize: 12, color: colors.grisOscuro },
  tituloAnuncio: { fontSize: 16, fontWeight: "bold", marginVertical: 5 },
  descripcionAnuncio: { fontSize: 14, marginBottom: 5 },
  archivo: { color: colors.azulPrimario, marginBottom: 5 },
  comentarios: { marginTop: 10 },
  comentario: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  comentarioAvatar: { width: 25, height: 25, borderRadius: 15, marginRight: 5 },
  comentarioAutor: { fontWeight: "bold", fontSize: 12 },
});
