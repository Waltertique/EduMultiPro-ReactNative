// Alumno/ClaseAlumno.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import colors from "../colors";

export default function ClaseAlumno({ navigation }) {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const usuarioLocal = await AsyncStorage.getItem("usuario");
        if (!usuarioLocal) return;

        const { id } = JSON.parse(usuarioLocal);

        const res = await fetch(
          `http://192.168.1.53:3000/api/edumultipro/Aulas/usuario/${id}`
        );
        const data = await res.json();

        setAulas(data);
      } catch (err) {
        console.error("❌ Error cargando aulas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAulas();
  }, []);

  const renderAula = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.texto}>
        <Text style={styles.label}>Nombre Aula: </Text>
        {item.Aula_Nombre}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Materia: </Text>
        {item.Materia_Nombre}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Curso: </Text>
        {item.Curso_Nombre}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Profesor: </Text>
        {item.Profesor}
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate("VerAulaAlumno", { id: item.ID })}
      >
        <Text style={styles.botonTexto}>Ver Aula</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableAlumno navigation={navigation} />

      <View style={styles.centroAlumno}>
        <Text style={styles.titulo}>Mis Aulas</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.azulPrimario} />
        ) : aulas.length === 0 ? (
          <Text style={styles.noDatos}>No tienes aulas asignadas.</Text>
        ) : (
          <FlatList
            data={aulas}
            keyExtractor={(item) => item.ID.toString()}
            renderItem={renderAula}
            contentContainerStyle={styles.lista}
          />
        )}
      </View>

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
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
    textAlign: "center",
    marginBottom: 15,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  texto: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  boton: {
    marginTop: 10,
    backgroundColor: colors.azulPrimario,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDatos: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
