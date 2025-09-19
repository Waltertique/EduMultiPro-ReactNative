// Alumno/VerTrabajoAlumno.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import colors from "../colors";

const ImgTrabajo = require("../assets/f9.png");

export default function VerTrabajoAlumno({ route, navigation }) {
  const { trabajoId, aulaId } = route.params;

  const [trabajo, setTrabajo] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [resTrabajo, resComentarios] = await Promise.all([
          fetch(`http://192.168.1.53:3000/api/edumultipro/Trabajo/${trabajoId}`),
          fetch(
            `http://192.168.1.53:3000/api/edumultipro/Comentarios/Trabajo/${trabajoId}`
          ),
        ]);

        const dataTrabajo = await resTrabajo.json();
        const dataComentarios = await resComentarios.json();

        setTrabajo(dataTrabajo.trabajo || {});
        setArchivos(dataTrabajo.archivos || []);
        setComentarios(dataComentarios || []);
      } catch (error) {
        console.error("❌ Error al cargar los datos:", error);
      }
    };

    obtenerDatos();
  }, [trabajoId]);

  const handleComentar = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      const usuario = JSON.parse(usuarioJSON);
      const usuarioId = usuario?.id;

      if (!usuarioId) {
        Alert.alert("Error", "Debes iniciar sesión para comentar");
        return;
      }

      const fecha = new Date().toISOString().split("T")[0];

      const res = await fetch("http://192.168.1.53:3000/api/edumultipro/Comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevoComentario,
          trabajo_id: trabajoId,
          usuario_id: usuarioId,
          fecha,
        }),
      });

      const data = await res.json();
      Alert.alert("Info", data.mensaje);
      setNuevoComentario("");

      const resComentarios = await fetch(
        `http://192.168.1.53:3000/api/edumultipro/Comentarios/Trabajo/${trabajoId}`
      );
      setComentarios(await resComentarios.json());
    } catch (error) {
      console.error("❌ Error al comentar:", error);
      Alert.alert("Error", "No se pudo enviar el comentario");
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    Alert.alert("Confirmar", "¿Eliminar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `http://192.168.1.53:3000/api/edumultipro/Comentarios/${comentarioId}`,
              { method: "DELETE" }
            );
            const data = await res.json();
            Alert.alert("Info", data.mensaje);

            const resComentarios = await fetch(
              `http://192.168.1.53:3000/api/edumultipro/Comentarios/Trabajo/${trabajoId}`
            );
            setComentarios(await resComentarios.json());
          } catch (error) {
            console.error("❌ Error al eliminar comentario:", error);
            Alert.alert("Error", "No se pudo eliminar el comentario");
          }
        },
      },
    ]);
  };

  if (!trabajo) {
    return (
      <View style={styles.loading}>
        <Text>Cargando trabajo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableAlumno navigation={navigation} />

      <ScrollView contentContainerStyle={styles.centroAlumno}>
        {/* Botones de navegación */}
        <View style={styles.botones}>
          <TouchableOpacity
            style={styles.boton}
            onPress={() =>
              navigation.navigate("VerTrabajoAlumnoEntregado", {
                trabajoId,
                aulaId,
              })
            }
          >
            <Text style={styles.botonTexto}>Ver Subidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonCerrar]}
            onPress={() => navigation.navigate("TrabajoAlumno", { id: aulaId })}
          >
            <Text style={styles.botonTexto}>✖</Text>
          </TouchableOpacity>
        </View>

        {/* Título y descripción */}
        <View style={styles.tituloContainer}>
          <Image source={ImgTrabajo} style={styles.imgTrabajo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo}>{trabajo.Titulo_Trabajo || ""}</Text>
            <Text style={styles.fecha}>
              Fecha de entrega:{" "}
              {trabajo.Fecha_Trabajo
                ? new Date(trabajo.Fecha_Trabajo).toLocaleDateString()
                : ""}
            </Text>
          </View>
        </View>

        <View style={styles.descripcion}>
          <Text style={styles.subtitulo}>Descripción:</Text>
          <Text>{trabajo.Descripcion_Trabajo || ""}</Text>

          {archivos.map((archivo) => (
            <TouchableOpacity
              key={archivo.ID}
              onPress={() =>
                Alert.alert(
                  "Abrir archivo",
                  `Abrir: http://192.168.1.53:3000/imagenes/${archivo.ruta_archivo}`
                )
              }
            >
              <Text style={styles.enlace}>{archivo.nombre_original}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comentarios */}
        <View style={styles.comentarios}>
          <Text style={styles.subtitulo}>Agregar comentarios</Text>

          <View style={styles.comentarioForm}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu comentario"
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
            />
            <TouchableOpacity style={styles.boton} onPress={handleComentar}>
              <Text style={styles.botonTexto}>Comentar</Text>
            </TouchableOpacity>
          </View>

          {comentarios.map((comentario) => (
            <View key={comentario.ID} style={styles.comentario}>
              <View style={styles.comentarioHeader}>
                <Image
                  source={{
                    uri: `http://192.168.1.53:3000/imagenes/${
                      comentario.RutaFoto || "usuario.png"
                    }`,
                  }}
                  style={styles.foto}
                />
                <Text style={styles.nombre}>{comentario.Nombre_Usuario || ""}</Text>
                <Text style={styles.fecha}>
                  {comentario.Fecha
                    ? new Date(comentario.Fecha).toLocaleDateString()
                    : ""}
                </Text>
              </View>
              <Text>{comentario.Descripcion || ""}</Text>

              <TouchableOpacity
                style={styles.eliminarBtn}
                onPress={() => handleEliminarComentario(comentario.ID)}
              >
                <Text style={styles.eliminarTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.fondo },
  centroAlumno: { flexGrow: 1, padding: 20 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  botones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  boton: {
    backgroundColor: colors.azulPrimario,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  botonCerrar: { backgroundColor: "#b00020" },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  tituloContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  imgTrabajo: { width: 40, height: 40, marginRight: 10 },
  titulo: { fontSize: 20, fontWeight: "bold", color: colors.azulPrimario },
  fecha: { fontSize: 14, color: "#666" },
  descripcion: { marginBottom: 20 },
  subtitulo: { fontWeight: "bold", fontSize: 16, marginVertical: 10 },
  enlace: { color: colors.azulPrimario, textDecorationLine: "underline" },
  comentarios: { marginTop: 20 },
  comentarioForm: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  comentario: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  comentarioHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  foto: { width: 35, height: 35, borderRadius: 18, marginRight: 8 },
  nombre: { fontWeight: "bold", marginRight: 8 },
  eliminarBtn: { marginTop: 5, alignSelf: "flex-end" },
  eliminarTexto: { color: "#b00020", fontSize: 12 },
});
