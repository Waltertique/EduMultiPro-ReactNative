import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

import { apiFetch } from "../api"; // 👈 importa tu helper

export default function ClaseProfesor() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerAulas = async () => {
      try {
        const usuarioString = await AsyncStorage.getItem("usuario");
        if (!usuarioString) {
          setLoading(false);
          return;
        }

        const usuario = JSON.parse(usuarioString);
        if (!usuario?.id) {
          setLoading(false);
          return;
        }

        const res = await apiFetch(`/Aulas/usuario/${usuario.id}`);
        const data = await res.json();
        setAulas(data);
      } catch (error) {
        console.error("❌ Error al obtener aulas del profesor:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerAulas();
  }, []);

  const renderAulaItem = ({ item }) => (
    <View style={styles.aulaItem}>
      <View style={styles.aulaInfo}>
        <Text style={styles.aulaNombre}>{item.Aula_Nombre}</Text>
        <Text style={styles.aulaDetalle}>Materia: {item.Materia_Nombre}</Text>
        <Text style={styles.aulaDetalle}>Curso: {item.Curso_Nombre}</Text>
        <Text style={styles.aulaDetalle}>Profesor: {item.Profesor}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.verAulaButton}
        onPress={() => navigation.navigate("VerAulaProfesor", { id: item.ID })}
      >
        <Icon name="circle-info" size={20} color={colors.blanco2} />
        <Text style={styles.verAulaText}>Ver Aula</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.azulPrimario} />
        <Text style={styles.loadingText}>Cargando aulas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Mis Aulas</Text>
        </View>

        {aulas.length === 0 ? (
          <View style={styles.sinAulasContainer}>
            <Icon name="chalkboard" size={50} color={colors.grisMedio} />
            <Text style={styles.sinAulasText}>No tienes aulas asignadas</Text>
          </View>
        ) : (
          <FlatList
            data={aulas}
            renderItem={renderAulaItem}
            keyExtractor={(item) => item.ID.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.grisOscuro,
  },
  tituloContainer: {
    padding: 16,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  listContainer: {
    padding: 16,
  },
  aulaItem: {
    backgroundColor: colors.blanco2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aulaInfo: {
    flex: 1,
    marginRight: 12,
  },
  aulaNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.azul,
    marginBottom: 8,
  },
  aulaDetalle: {
    fontSize: 14,
    color: colors.grisOscuro,
    marginBottom: 2,
  },
  verAulaButton: {
    backgroundColor: colors.azulPrimario,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  verAulaText: {
    color: colors.blanco2,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  sinAulasContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sinAulasText: {
    fontSize: 16,
    color: colors.grisOscuro,
    marginTop: 16,
    textAlign: "center",
  },
});