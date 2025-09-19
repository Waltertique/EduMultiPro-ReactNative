// Alumno/TrabajoAlumno.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableAlumno from "./DesplegableAlumno";
import NavAulaAlumno from "./NavAulaAlumno"; // Importamos el Nav
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
        style={[styles.cell, styles.btnInformacion]}
        onPress={() =>
          navigation.navigate("VerTrabajoAlumno", { trabajoId: item.ID, aulaId: id })
        }
      >
        <Text style={styles.btnText}>ℹ️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableAlumno navigation={navigation} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.centroAlumno}>
          {/* 🔹 NavAulaAlumno */}
          <NavAulaAlumno navigation={navigation} id={id} />

          <View style={styles.tituloTrabajoAlumno}>
            <Text style={styles.titulo}>Trabajos</Text>
          </View>

          <View style={styles.tablaContainer}>
            {loading ? (
              <Text style={{ textAlign: "center" }}>Cargando...</Text>
            ) : (
              <FlatList
                data={trabajos}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={renderItem}
                ListHeaderComponent={
                  <View style={styles.rowHeader}>
                    <Text style={[styles.cell, styles.headerCell]}>Título</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Fecha Entrega</Text>
                    <Text style={[styles.cell, styles.headerCell]}>Info</Text>
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
    marginVertical: 10,
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bbd",
  },
  tablaContainer: {
    width: "95%",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnInformacion: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
