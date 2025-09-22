import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { DataTable } from "react-native-paper";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import NavAulaAlumno from "./NavAulaAlumno";
import colors from "../colors";
import { apiFetch } from "../api";

export default function PersonasAlumno() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [integrantes, setIntegrantes] = useState([]);
  const [loading, setLoading] = useState(true);

  // estados de búsqueda y paginación
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");

  const cargarIntegrantes = async () => {
    try {
      const res = await apiFetch(`/Cursos/${id}/integrantes`);
      const data = await res.json();
      setIntegrantes(data);
    } catch (error) {
      console.error("Error al cargar integrantes:", error);
      Alert.alert("❌ Error", "No se pudieron cargar los integrantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIntegrantes();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.azulPrimario} />
        <Text style={{ marginTop: 10 }}>Cargando compañeros...</Text>
      </View>
    );
  }

  // 🔍 Filtrado por búsqueda
  const filteredData = integrantes.filter(
    (item) =>
      item.ID.toString().includes(search) ||
      item.Primer_Nombre?.toLowerCase().includes(search.toLowerCase()) ||
      item.Segundo_Nombre?.toLowerCase().includes(search.toLowerCase()) ||
      item.Primer_Apellido?.toLowerCase().includes(search.toLowerCase()) ||
      item.Segundo_Apellido?.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Paginación
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

  return (
    <View style={styles.container}>
      <Encabezado />
      <NavAulaAlumno navigation={navigation} id={id} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>👥 Compañeros de Curso</Text>
          <Text style={styles.bannerSubtitle}>
            {integrantes.length}{" "}
            {integrantes.length === 1 ? "compañero" : "compañeros"} en total
          </Text>
        </View>

        <View style={styles.contenedorTabla}>
          {/* Barra de búsqueda */}
          <TextInput
            style={styles.searchInput}
            placeholder="🔎 Buscar compañero..."
            placeholderTextColor={colors.gris}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setPage(0);
            }}
          />

          <Text style={styles.infoRegistros}>
            Mostrando {from + 1}-{to} de {filteredData.length} registros
          </Text>

          {/* Scroll horizontal para tabla */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DataTable>
              <DataTable.Header style={styles.headerRow}>
                <DataTable.Title style={styles.tablaHead}>ID</DataTable.Title>
                <DataTable.Title style={styles.tablaHead}>
                  P Nombre
                </DataTable.Title>
                <DataTable.Title style={styles.tablaHead}>
                  S Nombre
                </DataTable.Title>
                <DataTable.Title style={styles.tablaHead}>
                  P Apellido
                </DataTable.Title>
                <DataTable.Title style={styles.tablaHead}>
                  S Apellido
                </DataTable.Title>
              </DataTable.Header>

              {filteredData.slice(from, to).map((usuario, index) => (
                <DataTable.Row
                  key={index}
                  style={[
                    styles.fila,
                    index % 2 === 0 ? styles.filaPar : styles.filaImpar,
                  ]}
                >
                  <DataTable.Cell style={styles.tablaBody}>
                    <Text style={styles.textCell}>{usuario.ID}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tablaBody}>
                    <Text style={styles.textCell}>{usuario.Primer_Nombre}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tablaBody}>
                    <Text style={styles.textCell}>{usuario.Segundo_Nombre}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tablaBody}>
                    <Text style={styles.textCell}>{usuario.Primer_Apellido}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tablaBody}>
                    <Text style={styles.textCell}>{usuario.Segundo_Apellido}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              {/* Paginación */}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
                onPageChange={(p) => setPage(p)}
                label={`${from + 1}-${to} de ${filteredData.length}`}
                numberOfItemsPerPage={itemsPerPage}
                showFastPagination
              />
            </DataTable>
          </ScrollView>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  banner: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: colors.blanco2,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    width: "90%",
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.grisOscuro,
    marginTop: 5,
  },

  contenedorTabla: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    marginVertical: 20,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.azulSecundario,
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
  },
  infoRegistros: {
    marginBottom: 8,
    fontSize: 14,
    color: colors.grisOscuro,
  },

  headerRow: {
    backgroundColor: colors.azulPrimario,
  },
  tablaHead: {
    justifyContent: "center",
    minWidth: 90,
  },
  fila: {
    borderRadius: 8,
  },
  filaPar: { backgroundColor: "#f5faff" },
  filaImpar: { backgroundColor: "#fff" },

  tablaBody: {
    justifyContent: "center",
    width: 100,
    paddingVertical: 5,
  },
  textCell: {
    fontSize: 14,
    color: colors.grisOscuro,
  },
});
