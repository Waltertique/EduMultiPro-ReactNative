import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import Encabezado from "../Encabezado";
import Footer from "../footer";
import DesplegableProfesor from "./DesplegableProfesor";
import colors from "../colors";

export default function PersonasProfesor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/edumultipro/Aulas/${id}/integrantes`);
        const data = await res.json();
        setUsuarios(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener compañeros del aula:", error);
        Alert.alert("Error", "No se pudieron cargar los compañeros del aula");
        setLoading(false);
      }
    };

    if (id) {
      obtenerUsuarios();
    }
  }, [id]);

  const navegarAPrincipal = () => {
    navigation.navigate("VerAulaProfesor", { id });
  };

  const navegarATrabajos = () => {
    navigation.navigate("TrabajoProfesor", { id });
  };

  const navegarANotas = () => {
    navigation.navigate("VerTrabajoProfesor", { id });
  };

  const renderUsuarioItem = ({ item }) => (
    <View style={styles.usuarioItem}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioId}>{item.ID}</Text>
        <View style={styles.usuarioNombres}>
          <Text style={styles.usuarioNombre}>
            {item.Primer_Nombre} {item.Segundo_Nombre || ''}
          </Text>
          <Text style={styles.usuarioApellido}>
            {item.Primer_Apellido} {item.Segundo_Apellido || ''}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando compañeros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado />
      <DesplegableProfesor />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contenido}>
          {/* Navegación dentro del aula */}
          <View style={styles.navAula}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarAPrincipal}
            >
              <Text style={styles.navButtonText}>Principal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarATrabajos}
            >
              <Text style={styles.navButtonText}>Trabajos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={navegarANotas}
            >
              <Text style={styles.navButtonText}>Notas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButtonActive}
              onPress={() => {}} // Ya estamos en Personas
            >
              <Text style={styles.navButtonTextActive}>Personas</Text>
            </TouchableOpacity>
          </View>

          {/* Título */}
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Compañeros de curso</Text>
          </View>

          {/* Lista de usuarios */}
          {usuarios.length === 0 ? (
            <View style={styles.sinUsuarios}>
              <Text style={styles.sinUsuariosTexto}>No hay compañeros en este aula</Text>
            </View>
          ) : (
            <FlatList
              data={usuarios}
              keyExtractor={(item) => item.ID.toString()}
              scrollEnabled={false}
              renderItem={renderUsuarioItem}
              ListHeaderComponent={
                <View style={styles.tablaHeader}>
                  <Text style={styles.headerText}>ID</Text>
                  <Text style={[styles.headerText, styles.headerNombre]}>Nombre Completo</Text>
                </View>
              }
            />
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
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  contenido: {
    padding: 16,
  },
  navAula: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: colors.blanco2,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
  },
  navButtonActive: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.azulPrimario,
  },
  navButtonText: {
    color: colors.grisOscuro,
    fontWeight: "bold",
  },
  navButtonTextActive: {
    color: colors.blanco2,
    fontWeight: "bold",
  },
  tituloContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.azulPrimario,
  },
  sinUsuarios: {
    padding: 40,
    backgroundColor: colors.grisClaro,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sinUsuariosTexto: {
    fontSize: 16,
    color: colors.grisOscuro,
    textAlign: "center",
  },
  tablaHeader: {
    flexDirection: "row",
    backgroundColor: colors.azulPrimario,
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: colors.blanco2,
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  headerNombre: {
    flex: 2,
    marginLeft: 15,
  },
  usuarioItem: {
    flexDirection: "row",
    backgroundColor: colors.blanco2,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grisMedio,
  },
  usuarioInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  usuarioId: {
    fontWeight: "bold",
    color: colors.azul,
    width: 60,
  },
  usuarioNombres: {
    flex: 1,
    marginLeft: 15,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.grisOscuro,
    marginBottom: 2,
  },
  usuarioApellido: {
    fontSize: 14,
    color: colors.grisOscuro,
  },
});