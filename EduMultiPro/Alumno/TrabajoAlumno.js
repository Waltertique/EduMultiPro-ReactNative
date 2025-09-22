// Alumno/TrabajoAlumno.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import NavAulaAlumno from "./NavAulaAlumno"; // 🔹 Nav
import colors from "../colors";

export default function TrabajoAlumno({ navigation, route }) {
  const { id } = route.params; // ID del aula
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(
          `http://192.168.1.53:3000/api/edumultipro/Trabajos/Aula/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setTrabajos(data);
        } else {
          console.error("⚠️ Error al obtener trabajos");
        }
      } catch (error) {
        console.error("❌ Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, [id]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.titulo]}>{item.Titulo_Trabajo}</Text>
      <Text style={styles.cell}>
        {new Date(item.Fecha_Trabajo).toLocaleDateString("es-ES")}
      </Text>
      <TouchableOpacity
        style={styles.btnInformacion}
        onPress={() =>
          navigation.navigate("VerTrabajoAlumno", { trabajoId: item.ID, aulaId: id })
        }
      >
        <Text style={styles.btnText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Encabezado />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.centroAlumno}>
          {/* 🔹 Nav de Aula */}
          <NavAulaAlumno navigation={navigation} id={id} />

          <View style={styles.tituloTrabajoAlumno}>
            <Text style={styles.titulo}>📂 Trabajos</Text>
          </View>

          <View style={styles.tablaContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : trabajos.length === 0 ? (
              <Text style={styles.noData}>No hay trabajos disponibles.</Text>
            ) : (
              <FlatList
                data={trabajos}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                ListHeaderComponent={
                  <View style={styles.rowHeader}>
                    <Text style={[styles.cell, styles.headerCell]}>Título</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Fecha Entrega</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Acción</Text>
                  </View>
                }
              />
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
    width: "100%",
  },
  centroAlumno: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    zIndex: 1,
  },
  tituloTrabajoAlumno: {
    marginVertical: 15,
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bbd",
  },
  tablaContainer: {
    width: "95%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 5,
  },
  tituloTrabajoAlumnoText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  btnInformacion: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#555",
  },
});
