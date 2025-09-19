import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import NavAulaAlumno from "./NavAulaAlumno";
import colors from "../colors";

export default function PersonaAlumno({ navigation }) {
  const route = useRoute();
  const { id } = route.params; // ✅ ID del curso/aula que viene de la navegación

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/edumultipro/Curso/Usuario/${id}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            // ⚠️ Backend devuelve 404 si no hay usuarios
            setUsuarios([]);
            return;
          } else {
            throw new Error("Error en la petición");
          }
        }

        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener compañeros del curso:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      obtenerUsuarios();
    }
  }, [id]);

  return (
    <View style={styles.contenedor}>
      <Encabezado />

      <NavAulaAlumno navigation={navigation} id={id} />

      <View style={styles.content}>
        <Text style={styles.titulo}>👨‍🎓 Compañeros de curso</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.azulPrimario} />
        ) : usuarios.length === 0 ? (
          <Text style={styles.noData}>No hay compañeros en este curso</Text>
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.ID.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.nombre}>
                  {item.Primer_Nombre} {item.Segundo_Nombre || ""}{" "}
                  {item.Primer_Apellido} {item.Segundo_Apellido || ""}
                </Text>
              </View>
            )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrimario,
    marginBottom: 12,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: colors.grisOscuro,
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.blanco2,
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  nombre: {
    fontSize: 16,
    color: colors.gris,
    fontWeight: "600",
  },
});
